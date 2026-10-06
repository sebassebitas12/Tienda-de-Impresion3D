/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { dispatchPaymentEmail, queuePaymentEmail } from '../scripts/payment-email-delivery.js';

const now = '2026-10-05T15:30:00.000Z';
const paidAt = '2026-10-05T15:00:00.000Z';
const orderId = 'ord-8b02';
const env = {
  VERTICE_PAYMENT_EMAIL_WEBHOOK_URL: 'https://n8n.example.org/webhook/vertice-payment-email',
  VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN: 'test-only-token',
  VERTICE_WORKSHOP_EMAIL: 'taller@verticecr.org',
};

function paidOrder(overrides = {}) {
  return {
    id: orderId,
    userId: 'customer-1',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMode: 'PAYPAL_SANDBOX',
    currency: 'CRC',
    total: 8500,
    paidAt,
    paymentEvidence: { captureId: 'capture-sandbox-1' },
    orderItems: [{ productName: 'Soporte de demostración', quantity: 2 }],
    ...overrides,
  };
}

function fixture({ order = paidOrder(), users, envOverrides = {}, persistImpl } = {}) {
  const queued = order.paymentEmail ? order : queuePaymentEmail(order, now);
  const db = {
    data: {
      orders: [queued],
      users: users || [{ id: 'customer-1', role: 'customer', email: 'cliente@verticecr.org' }],
    },
  };
  const persist = jest.fn(async nextData => {
    if (persistImpl) await persistImpl(nextData, db);
    db.data = nextData;
  });
  let queue = Promise.resolve();
  const serialize = jest.fn(action => {
    const result = queue.then(action);
    queue = result.catch(() => undefined);
    return result;
  });
  const fetchImpl = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      delivered: true,
      orderId,
      deliveryKey: queued.paymentEmail.deliveryKey,
      messageId: 'gmail-message-123',
    }),
  }));
  const dispatch = (options = {}) => dispatchPaymentEmail({
    orderId,
    db,
    serialize,
    persist,
    fetchImpl,
    env: { ...env, ...envOverrides },
    clock: () => new Date(now),
    ...options,
  });
  return { db, persist, serialize, fetchImpl, dispatch };
}

describe('despacho aislado del correo de pago', () => {
  it('queuePaymentEmail crea una intención del outbox y no muta la orden', () => {
    const order = paidOrder();
    const queued = queuePaymentEmail(order, now);

    expect(queued.paymentEmail).toMatchObject({
      status: 'PENDING', orderId, paidAt, paymentMode: 'PAYPAL_SANDBOX', createdAt: now,
    });
    expect(queued.paymentEmail.deliveryKey).toContain(orderId);
    expect(order).not.toHaveProperty('paymentEmail');
    expect(queuePaymentEmail(queued, now)).toEqual({ error: 'PAYMENT_EMAIL_ALREADY_EXISTS' });
  });

  it('persiste SENDING antes del webhook y SENT solo con confirmación coincidente', async () => {
    const { db, persist, fetchImpl, dispatch } = fixture();
    const result = await dispatch();

    expect(result).toEqual({ status: 'SENT', messageId: 'gmail-message-123' });
    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist.mock.calls[0][0].orders[0].paymentEmail.status).toBe('SENDING');
    expect(persist.mock.calls[1][0].orders[0].paymentEmail).toMatchObject({
      status: 'SENT', metadata: { messageId: 'gmail-message-123', sentAt: now },
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, request] = fetchImpl.mock.calls[0];
    expect(url).toBe(env.VERTICE_PAYMENT_EMAIL_WEBHOOK_URL);
    expect(request).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Vertice-Webhook-Token': env.VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN },
    });
    expect(request.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(request.body)).toMatchObject({
      orderId,
      customerEmail: 'cliente@verticecr.org',
      workshopEmail: env.VERTICE_WORKSHOP_EMAIL,
      amountCrc: 8500,
      currency: 'CRC',
      deliveryKey: db.data.orders[0].paymentEmail.deliveryKey,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentReference: 'capture-sandbox-1',
      orderLines: [{ description: 'Soporte de demostración', quantity: 2 }],
    });
    expect(JSON.stringify(result)).not.toContain(env.VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN);
    expect(JSON.stringify(result)).not.toContain('cliente@verticecr.org');
  });

  it('guarda FAILED sin hacer red si falta configuración', async () => {
    const { db, persist, fetchImpl, dispatch } = fixture({ envOverrides: {
      VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN: '',
    } });
    const result = await dispatch();

    expect(result).toEqual({ status: 'FAILED', reason: 'WEBHOOK_TOKEN_MISSING' });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist.mock.calls[0][0].orders[0].paymentEmail.status).toBe('SENDING');
    expect(db.data.orders[0].paymentEmail).toMatchObject({
      status: 'FAILED', metadata: { reason: 'WEBHOOK_TOKEN_MISSING' },
    });
    expect(await dispatch()).toEqual({ status: 'FAILED', reason: 'WEBHOOK_TOKEN_MISSING' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('marca UNKNOWN si el acuse JSON no corresponde a la orden/entrega', async () => {
    const { db, fetchImpl, dispatch } = fixture();
    fetchImpl.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ delivered: true, orderId: 'another-order', deliveryKey: 'wrong-key', messageId: 'msg-1' }),
    });

    expect(await dispatch()).toEqual({ status: 'UNKNOWN', reason: 'INVALID_CONFIRMATION' });
    expect(db.data.orders[0].paymentEmail).toMatchObject({
      status: 'UNKNOWN', metadata: { reason: 'INVALID_CONFIRMATION' },
    });
    expect(await dispatch()).toEqual({ status: 'UNKNOWN', reason: 'INVALID_CONFIRMATION' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('impide un segundo envío concurrente y no reenvía estados SENDING o terminales', async () => {
    const { db, fetchImpl, dispatch } = fixture();
    let releaseFetch;
    let fetchStarted;
    const started = new Promise(resolve => { fetchStarted = resolve; });
    const waitForFetch = new Promise(resolve => { releaseFetch = resolve; });
    fetchImpl.mockImplementationOnce(async () => {
      fetchStarted();
      await waitForFetch;
      return {
        ok: true,
        json: async () => ({
          delivered: true,
          orderId,
          deliveryKey: db.data.orders[0].paymentEmail.deliveryKey,
          messageId: 'gmail-message-123',
        }),
      };
    });

    const firstDispatch = dispatch();
    await started;
    expect(await dispatch()).toEqual({ status: 'SENDING' });
    releaseFetch();
    expect(await firstDispatch).toEqual({ status: 'SENT', messageId: 'gmail-message-123' });
    expect(await dispatch()).toEqual({ status: 'SENT', messageId: 'gmail-message-123' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('si no puede persistir SENDING no llama al webhook', async () => {
    const { db, fetchImpl, dispatch } = fixture({
      persistImpl: async () => { throw new Error('disk unavailable'); },
    });

    expect(await dispatch()).toEqual({ status: 'PENDING', reason: 'PERSISTENCE_FAILED' });
    expect(db.data.orders[0].paymentEmail.status).toBe('PENDING');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('si falla persistir el resultado tras la red conserva SENDING y no reintenta', async () => {
    let calls = 0;
    const { db, fetchImpl, dispatch } = fixture({
      persistImpl: async () => {
        calls += 1;
        if (calls === 2) throw new Error('disk unavailable after delivery');
      },
    });

    expect(await dispatch()).toEqual({ status: 'UNKNOWN', reason: 'PERSISTENCE_FAILED' });
    expect(db.data.orders[0].paymentEmail.status).toBe('SENDING');
    expect(await dispatch()).toEqual({ status: 'SENDING' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
