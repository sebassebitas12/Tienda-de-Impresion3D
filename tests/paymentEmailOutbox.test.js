/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import {
  buildPaymentEmailPayload,
  createPaymentEmailIntent,
  updatePaymentEmail,
} from '../scripts/payment-email-outbox.js';

const now = '2026-10-05T15:30:00.000Z';
const paidAt = '2026-10-05T15:00:00.000Z';
const customer = { id: 'customer-1', email: 'sebasfores992@gmail.com' };
const workshopEmail = 'sebasseb2109@gmail.com';

function paidOrder(overrides = {}) {
  return {
    id: 'ord-8b02',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMode: 'PAYPAL_SANDBOX',
    currency: 'CRC',
    total: 8500,
    paidAt,
    orderItems: [{ productName: 'Soporte de prueba', quantity: 2 }],
    ...overrides,
  };
}

describe('payment email outbox', () => {
  it.each(['DEMO', 'UNKNOWN', 'SINPE', 'PAYPAL'])('no habilita pagos con modo %s', paymentMode => {
    const order = paidOrder({ paymentMode });
    expect(createPaymentEmailIntent(order, now)).toEqual({ error: 'PAYMENT_NOT_ELIGIBLE' });
    expect(buildPaymentEmailPayload({ order, customer, workshopEmail })).toEqual({ error: 'PAYMENT_NOT_ELIGIBLE' });
  });

  it.each([
    [{ status: 'PENDING' }, 'PAYMENT_NOT_ELIGIBLE'],
    [{ paymentStatus: 'UNPAID' }, 'PAYMENT_NOT_ELIGIBLE'],
    [{ paidAt: '' }, 'INVALID_PAID_AT'],
    [{ id: 'bad\r\nBcc:attacker@example.org' }, 'INVALID_ORDER_ID'],
  ])('rechaza orden no elegible o identidad incompleta %#', (overrides, error) => {
    expect(createPaymentEmailIntent(paidOrder(overrides), now)).toEqual({ error });
  });

  it('construye payload de destinatarios fijos, monto CRC y líneas de catálogo seguras', () => {
    const order = paidOrder({ orderItems: [
      { productName: '  <img src=x onerror=alert(1)> Soporte\nPETG  ', quantity: 2 },
      { productName: 'Base compacta', quantity: 1 },
    ] });
    const payload = buildPaymentEmailPayload({ order, customer, workshopEmail });

    expect(payload).toEqual({
      to: customer.email,
      bcc: workshopEmail,
      orderId: 'ord-8b02',
      totalCrc: 8500,
      currency: 'CRC',
      paidAt,
      paymentMode: 'PAYPAL_SANDBOX',
      deliveryKey: `payment-email:ord-8b02:${encodeURIComponent(paidAt)}`,
      lines: [
        { description: 'Soporte PETG', quantity: 2 },
        { description: 'Base compacta', quantity: 1 },
      ],
      summary: '2 líneas de pedido',
    });
    expect(payload.to).not.toBe(order.customerEmail);
  });

  it('acepta SINPE manual confirmado y resume una cotización sin inventar cantidad', () => {
    const order = paidOrder({
      paymentMode: 'SINPE_MANUAL',
      orderItems: undefined,
      scopeSnapshot: { name: 'Brazo robótico <b>DEMOSTRACIÓN</b>' },
    });
    const payload = buildPaymentEmailPayload({ order, customer, workshopEmail });
    expect(payload).toMatchObject({
      paymentMode: 'SINPE_MANUAL',
      lines: [{ description: 'Brazo robótico DEMOSTRACIÓN', quantity: null }],
      summary: 'Brazo robótico DEMOSTRACIÓN',
    });
  });

  it.each([
    [{ customer: null }, 'INVALID_CUSTOMER_EMAIL'],
    [{ customer: { email: 'cliente@example.com' } }, 'INVALID_CUSTOMER_EMAIL'],
    [{ customer: { email: 'cliente@dominio' } }, 'INVALID_CUSTOMER_EMAIL'],
    [{ workshopEmail: 'taller@correo.test' }, 'INVALID_WORKSHOP_EMAIL'],
    [{ workshopEmail: 'no-es-correo' }, 'INVALID_WORKSHOP_EMAIL'],
    [{ order: { total: -1 } }, 'INVALID_TOTAL_CRC'],
    [{ order: { total: 1.25 } }, 'INVALID_TOTAL_CRC'],
    [{ order: { total: Number.MAX_SAFE_INTEGER + 1 } }, 'INVALID_TOTAL_CRC'],
    [{ order: { currency: 'USD' } }, 'INVALID_CURRENCY'],
    [{ order: { orderItems: [{ productName: 'Pieza', quantity: 0 }] } }, 'INVALID_ORDER_LINES'],
    [{ order: { orderItems: [] } }, 'INVALID_ORDER_LINES'],
  ])('devuelve error ante campos faltantes o inválidos %#', (overrides, error) => {
    const order = overrides.order ? paidOrder(overrides.order) : paidOrder();
    expect(buildPaymentEmailPayload({
      order,
      customer: Object.prototype.hasOwnProperty.call(overrides, 'customer') ? overrides.customer : customer,
      workshopEmail: Object.prototype.hasOwnProperty.call(overrides, 'workshopEmail') ? overrides.workshopEmail : workshopEmail,
    })).toEqual({ error });
  });

  it('genera una clave determinista por orderId + paidAt y no muta la orden', () => {
    const order = paidOrder();
    const first = createPaymentEmailIntent(order, now);
    const samePayment = createPaymentEmailIntent(paidOrder({ paymentEmail: undefined }), now);
    const anotherPayment = createPaymentEmailIntent(paidOrder({ paidAt: '2026-10-05T15:01:00Z' }), now);
    const anotherOrder = createPaymentEmailIntent(paidOrder({ id: 'ord-8b03' }), now);

    expect(first.paymentEmail).toMatchObject({
      status: 'PENDING',
      deliveryKey: `payment-email:ord-8b02:${encodeURIComponent(paidAt)}`,
      orderId: 'ord-8b02',
      paidAt,
      paymentMode: 'PAYPAL_SANDBOX',
      createdAt: now,
    });
    expect(samePayment.paymentEmail.deliveryKey).toBe(first.paymentEmail.deliveryKey);
    expect(anotherPayment.paymentEmail.deliveryKey).not.toBe(first.paymentEmail.deliveryKey);
    expect(anotherOrder.paymentEmail.deliveryKey).not.toBe(first.paymentEmail.deliveryKey);
    expect(order).not.toHaveProperty('paymentEmail');
  });

  it('impide crear un segundo intent sobre la misma orden ya preparada', () => {
    const order = createPaymentEmailIntent(paidOrder(), now);
    expect(createPaymentEmailIntent(order, now)).toEqual({ error: 'PAYMENT_EMAIL_ALREADY_EXISTS' });
  });

  it('transiciona PENDING → SENDING → SENT sin mutar la versión anterior', () => {
    const pending = createPaymentEmailIntent(paidOrder(), now);
    const sending = updatePaymentEmail(pending, 'SENDING', { attemptId: 'try-1' });
    const sent = updatePaymentEmail(sending, 'SENT', { messageId: 'provider-1' });

    expect(pending.paymentEmail).toMatchObject({ status: 'PENDING' });
    expect(sending.paymentEmail).toMatchObject({ status: 'SENDING', metadata: { attemptId: 'try-1' } });
    expect(sent.paymentEmail).toMatchObject({ status: 'SENT', metadata: { attemptId: 'try-1', messageId: 'provider-1' } });
  });

  it.each(['FAILED', 'UNKNOWN'])('permite el resultado terminal %s y lo conserva', status => {
    const pending = createPaymentEmailIntent(paidOrder(), now);
    const sending = updatePaymentEmail(pending, 'SENDING');
    const result = updatePaymentEmail(sending, status, { reason: 'provider-result' });
    expect(result.paymentEmail).toMatchObject({ status, metadata: { reason: 'provider-result' } });
  });

  it.each([
    ['PENDING', 'SENT'],
    ['PENDING', 'PENDING'],
    ['SENDING', 'SENDING'],
    ['SENT', 'SENDING'],
    ['FAILED', 'SENT'],
    ['UNKNOWN', 'SENDING'],
    ['SENDING', 'RETRY'],
  ])('rechaza transición repetida/no permitida %s → %s', (from, to) => {
    const order = paidOrder({ paymentEmail: { status: from, deliveryKey: 'key-1' } });
    expect(updatePaymentEmail(order, to)).toEqual({ error: 'INVALID_PAYMENT_EMAIL_TRANSITION' });
  });

  it('exige intent y metadata tipo objeto; un fallo no modifica la entrada', () => {
    expect(updatePaymentEmail(paidOrder(), 'SENDING')).toEqual({ error: 'PAYMENT_EMAIL_INTENT_REQUIRED' });
    const order = paidOrder({ paymentEmail: { status: 'PENDING', deliveryKey: 'key-1' } });
    expect(updatePaymentEmail(order, 'SENDING', ['invalid'])).toEqual({ error: 'INVALID_PAYMENT_EMAIL_DETAILS' });
    expect(order.paymentEmail.status).toBe('PENDING');
  });
});
