/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { installCatalogOrderOperations } from '../scripts/catalog-order-operations.js';
import { installAutomationOperations } from '../scripts/automation-operations.js';

function fixture(status = 'PENDING') {
  const customer = { id: 'c1', name: 'Cliente', role: 'customer', status: 'ACTIVE' };
  const other = { ...customer, id: 'c2' };
  const admin = { id: 'a1', name: 'Taller', role: 'admin', status: 'ACTIVE' };
  const db = { data: { users: [customer, other, admin], orders: [{ id: 'o1', userId: 'c1', status }], activityLog: [] } };
  const handlers = new Map();
  const persist = jest.fn(async next => { db.data = next; });
  const options = { registerAction: (path, handler) => handlers.set(path, handler), db, serialize: task => task(), persist };
  installCatalogOrderOperations(options); installAutomationOperations(options);
  return { db, persist, customer, other, admin, async invoke(path, payload, actor = customer) {
    const authorization = actor ? `Bearer sim.v1.${btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: actor.id, role: actor.role, exp: 9999999999 }))}` : '';
    let body; let code = 200;
    const res = { status(value) { code = value; return this; }, json(value) { body = value; return this; } };
    await handlers.get(path)({ body: payload, headers: { authorization } }, res);
    return { status: code, body };
  } };
}
const submit = '/orders/submit-payment-proof';
const verify = '/admin/actions/verify-payment';
const proof = { orderId: 'o1', referenceNumber: ' 12345678 ', sinpePhone: ' 8888-8888 ', proofNotes: ' Depósito realizado ' };

describe('comprobante SINPE y verificación del taller', () => {
  it('reporta sin confirmar pago y luego Admin confirma con auditoría', async () => {
    const { db, persist, invoke, admin } = fixture();
    const result = await invoke(submit, proof);
    expect(result.status).toBe(200);
    expect(result.body.order).toMatchObject({ status: 'PENDING', paymentProof: { referenceNumber: '12345678', sinpePhone: '8888-8888', proofNotes: 'Depósito realizado', status: 'SUBMITTED', submittedAt: expect.any(String) } });
    expect(db.data.activityLog[0]).toMatchObject({ action: 'ORDER_PAYMENT_PROOF_SUBMITTED', actorId: 'c1', fromStatus: 'PENDING', toStatus: 'PENDING', metadata: { referenceNumber: '12345678', sinpePhone: '8888-8888' } });
    const confirmed = await invoke(verify, { orderId: 'o1', decision: 'CONFIRM' }, admin);
    expect(confirmed.body.order).toMatchObject({ status: 'CONFIRMED', paymentStatus: 'PAID', paidAt: expect.any(String), paymentProof: { status: 'CONFIRMED' } });
    expect(db.data.activityLog[1]).toMatchObject({ action: 'ORDER_PAYMENT_CONFIRMED', actorId: 'a1', toStatus: 'CONFIRMED' });
    expect(persist).toHaveBeenCalledTimes(2);
    expect((await invoke(verify, { orderId: 'o1', decision: 'CONFIRM' }, admin)).status).toBe(409);
  });
  it('rechaza con motivo, permite corregir y elimina el rechazo anterior al reportar otra vez', async () => {
    const { db, invoke, admin } = fixture();
    await invoke(submit, proof);
    expect((await invoke(verify, { orderId: 'o1', decision: 'REJECT', notes: 'No coincide con depósito' }, admin)).body.order).toMatchObject({ status: 'PENDING', paymentProof: { status: 'REJECTED', rejectionReason: 'No coincide con depósito' } });
    expect(db.data.activityLog[1]).toMatchObject({ action: 'ORDER_PAYMENT_PROOF_REJECTED', reason: 'No coincide con depósito' });
    expect((await invoke(verify, { orderId: 'o1', decision: 'CONFIRM' }, admin)).status).toBe(409);
    const corrected = await invoke(submit, { ...proof, referenceNumber: '87654321' });
    expect(corrected.body.order.paymentProof.status).toBe('SUBMITTED');
    expect(corrected.body.order.paymentProof.rejectionReason).toBeUndefined();
  });
  it('bloquea propiedad, roles y pedidos inexistentes sin persistir', async () => {
    const { invoke, persist, other, admin } = fixture();
    expect((await invoke(submit, proof, other)).status).toBe(404);
    expect((await invoke(submit, proof, admin)).status).toBe(403);
    expect((await invoke(submit, proof, null)).status).toBe(403);
    expect((await invoke(verify, { orderId: 'o1', decision: 'CONFIRM' })).status).toBe(403);
    expect((await invoke(verify, { orderId: 'missing', decision: 'CONFIRM' }, admin)).status).toBe(404);
    expect((await invoke(verify, { orderId: 'o1', decision: 'CONFIRM' }, admin)).status).toBe(409);
    expect(persist).not.toHaveBeenCalled();
  });
  it.each(['CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REJECTED'])('no reporta en %s', async status => {
    const { invoke, persist } = fixture(status);
    expect(await invoke(submit, proof)).toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    expect(persist).not.toHaveBeenCalled();
  });
  it('valida referencia, teléfono, notas y decisión', async () => {
    const { invoke, admin, persist } = fixture();
    for (const referenceNumber of ['', '123', 'x'.repeat(101), 1234]) expect((await invoke(submit, { ...proof, referenceNumber })).body.code).toBe('INVALID_REFERENCE');
    for (const sinpePhone of ['', '1234567', 'x'.repeat(26), 88888888]) expect((await invoke(submit, { ...proof, sinpePhone })).body.code).toBe('INVALID_PHONE');
    expect((await invoke(submit, { ...proof, proofNotes: 'x'.repeat(501) })).body.code).toBe('INVALID_NOTES');
    expect(persist).not.toHaveBeenCalled();
    await invoke(submit, proof);
    expect((await invoke(verify, { orderId: 'o1', decision: 'REJECT', notes: ' ' }, admin)).body.code).toBe('REASON_REQUIRED');
    expect((await invoke(verify, { orderId: 'o1', decision: 'OTHER' }, admin)).body.code).toBe('INVALID_DECISION');
    expect(persist).toHaveBeenCalledTimes(1);
  });
  it('no registra éxito si falla persistencia', async () => {
    const { invoke, persist, db } = fixture();
    persist.mockRejectedValueOnce(new Error('disk'));
    expect((await invoke(submit, proof)).status).toBe(500);
    expect(db.data.orders[0].paymentProof).toBeUndefined();
    expect(db.data.activityLog).toEqual([]);
  });
  it('E03: pedido originado desde cotización aprobada nace CONFIRMED con paymentStatus PAID', async () => {
    const { prepareQuoteFulfillment } = await import('../scripts/quote-fulfillment.js');
    const now = '2026-10-04T12:00:00.000Z';
    const request = {
      id: 'rq-1',
      userId: 'c1',
      status: 'APPROVED',
      quoteVersion: 1,
      quotedPrice: 15000,
      quantity: 1,
      quotePricing: { mode: 'DEMO', inputs: { material: 'PLA' } },
    };
    const initialData = { orders: [], customPrintRequests: [request], activityLog: [] };
    const actor = { id: 'a1', name: 'Taller', role: 'admin' };
    const result = prepareQuoteFulfillment(initialData, request, { mode: 'DEMO', expectedVersion: 1 }, actor, now);
    expect(result.order).toMatchObject({
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paidAt: now,
      subtotal: 15000,
      total: 15000,
    });
  });
  it('E04: bloquea transición genérica a CONFIRMED si el pago no está verificado', async () => {
    const { invoke, admin } = fixture();
    const transition = await invoke('/admin/actions/order-transition', {
      orderId: 'o1',
      expectedStatus: 'PENDING',
      nextStatus: 'CONFIRMED',
    }, admin);
    expect(transition.status).toBe(409);
    expect(transition.body.code).toBe('PAYMENT_VERIFICATION_REQUIRED');
  });
  it('E05: rechaza verificación si el comprobante fue reemplazado por el cliente con timestamp más reciente', async () => {
    const { invoke, admin } = fixture();
    await invoke(submit, proof);
    const staleSubmittedAt = '2026-10-04T10:00:00.000Z';
    const res = await invoke(verify, {
      orderId: 'o1',
      decision: 'CONFIRM',
      expectedProofSubmittedAt: staleSubmittedAt,
    }, admin);

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('PAYMENT_PROOF_OUTDATED');
  });
});
