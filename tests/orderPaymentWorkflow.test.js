/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { installCatalogOrderOperations } from '../scripts/catalog-order-operations.js';
import { installAutomationOperations } from '../scripts/automation-operations.js';
import { prepareQuoteFulfillment } from '../scripts/quote-fulfillment.js';

const customer = { id: 'c1', name: 'Cliente', role: 'customer', status: 'ACTIVE' };
const other = { ...customer, id: 'c2' };
const admin = { id: 'a1', name: 'Taller', role: 'admin', status: 'ACTIVE' };
const now = '2026-10-04T12:00:00.000Z';
const token = user => 'Bearer sim.v1.' + btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: user.id, role: user.role, exp: 9999999999 }));

function fixture({ order = { id: 'o1', userId: 'c1', status: 'PENDING', total: 5000 }, request = null } = {}) {
  const db = { data: { users: [customer, other, admin], orders: [order], customPrintRequests: request ? [request] : [], activityLog: [] } };
  const handlers = new Map();
  const persist = jest.fn(async next => { db.data = next; });
  const options = { registerAction: (path, handler) => handlers.set(path, handler), db, serialize: task => task(), persist };
  installCatalogOrderOperations(options);
  installAutomationOperations(options);
  return { db, handlers, persist, async invoke(path, payload, actor = customer) {
    let body; let status = 200;
    const res = { status(value) { status = value; return this; }, json(value) { body = value; return this; } };
    await handlers.get(path)({ headers: { authorization: actor ? token(actor) : '' }, body: payload }, res);
    return { status, body };
  } };
}

describe('pago simulado de pedidos de catálogo', () => {
  it('convierte el pendiente propio en confirmado y pago DEMO en una operación idempotente', async () => {
    const { db, persist, invoke } = fixture();
    const first = await invoke('/orders/pay-demo', { orderId: 'o1' });
    expect(first.status).toBe(200);
    expect(first.body.order).toMatchObject({ id: 'o1', status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO', paidAt: expect.any(String), paymentEvidence: { mode: 'DEMO', reference: 'SIMULATED-NO-REAL-PAYMENT', recordedBy: 'c1' } });
    expect(db.data.activityLog[0]).toMatchObject({ action: 'ORDER_DEMO_PAYMENT_RECORDED', fromStatus: 'PENDING', toStatus: 'CONFIRMED', actorId: 'c1' });
    const replay = await invoke('/orders/pay-demo', { orderId: 'o1' });
    expect(replay.body.replay).toBe(true);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('limita pago al cliente activo propietario y a pedidos de catálogo pendientes', async () => {
    const { persist, invoke } = fixture();
    expect((await invoke('/orders/pay-demo', { orderId: 'o1' }, other)).status).toBe(404);
    expect((await invoke('/orders/pay-demo', { orderId: 'o1' }, admin)).status).toBe(403);
    expect((await invoke('/orders/pay-demo', { orderId: 'o1' }, null)).status).toBe(403);
    expect((await invoke('/orders/pay-demo', { orderId: 'missing' })).status).toBe(404);
    expect(persist).not.toHaveBeenCalled();
  });

  it('rechaza pedido no pendiente o ligado a cotización, y no instala rutas de comprobante bancario', async () => {
    const settled = fixture({ order: { id: 'o1', userId: 'c1', status: 'CONFIRMED', paymentStatus: 'UNPAID' } });
    expect((await settled.invoke('/orders/pay-demo', { orderId: 'o1' })).status).toBe(409);
    const quoteOrder = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', customPrintRequestId: 'rq-1' } });
    expect((await quoteOrder.invoke('/orders/pay-demo', { orderId: 'o1' })).status).toBe(409);
    expect(settled.handlers.has('/orders/submit-payment-proof')).toBe(false);
    expect(settled.handlers.has('/admin/actions/verify-payment')).toBe(false);
  });

  it('impide que el Admin cree un pedido de cotización antes del pago del cliente', async () => {
    const { db, persist, invoke } = fixture();
    const request = { id: 'rq-1', userId: 'c1', status: 'APPROVED', quoteVersion: 1, quotedPrice: 15000, quoteValidUntil: '2026-10-10T23:59:59-06:00', quotePricing: { mode: 'DEMO' } };
    db.data.customPrintRequests.push(request);
    expect(await invoke('/admin/actions/quote-fulfillment', { requestId: 'rq-1', expectedVersion: 1, mode: 'DEMO' }, admin)).toEqual({ status: 409, body: { code: 'CUSTOMER_PAYMENT_REQUIRED' } });
    expect(db.data.orders).toHaveLength(1);
    expect(persist).not.toHaveBeenCalled();
  });

  it('cliente paga cotización aprobada y el recibo conserva el alcance personalizado fuera del catálogo', () => {
    const request = { id: 'rq-1', userId: 'c1', status: 'APPROVED', quoteVersion: 2, quotedPrice: 15000,
      quoteValidUntil: '2026-10-10T23:59:59-06:00', description: 'Soporte a medida', fileName: 'soporte.stl', dimensions: '12 x 8 cm', material: 'PETG', quantity: 2,
      quoteNotes: 'Sin envío.', quotePricing: { mode: 'DEMO' } };
    const result = prepareQuoteFulfillment({ orders: [], customPrintRequests: [request], activityLog: [] }, request,
      { mode: 'DEMO', expectedVersion: 2 }, customer, now);
    expect(result.order).toMatchObject({ status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO', total: 15000,
      scopeSnapshot: { name: 'Soporte a medida', fileName: 'soporte.stl', dimensions: '12 x 8 cm', material: 'PETG', quantity: 2, quoteVersion: 2, notes: 'Sin envío.' } });
    expect(result.request).toMatchObject({ status: 'PAID', orderId: result.order.id, paymentMode: 'DEMO' });
    expect(result.next.activityLog[0]).toMatchObject({ action: 'REQUEST_DEMO_PAYMENT_RECORDED', fromStatus: 'APPROVED', toStatus: 'PAID' });
    expect(prepareQuoteFulfillment({ orders: [], customPrintRequests: [request], activityLog: [] }, request,
      { mode: 'DEMO', expectedVersion: 2 }, admin, now).error).toBe('REQUEST_NOT_FOUND');
  });
});
