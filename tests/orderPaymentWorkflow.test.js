/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { installCatalogOrderOperations } from '../scripts/catalog-order-operations.js';
import { installAutomationOperations } from '../scripts/automation-operations.js';
import { prepareQuoteCheckout } from '../scripts/quote-fulfillment.js';

const customer = { id: 'c1', name: 'Cliente', role: 'customer', status: 'ACTIVE' };
const other = { ...customer, id: 'c2' };
const admin = { id: 'a1', name: 'Taller', role: 'admin', status: 'ACTIVE' };
const now = '2026-10-04T12:00:00.000Z';
const token = user => 'Bearer sim.v1.' + btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: user.id, role: user.role, exp: 9999999999 }));

function fixture({ order = { id: 'o1', userId: 'c1', status: 'PENDING', total: 5000 }, request = null } = {}) {
  const db = { data: { users: [customer, other, admin], orders: [order], customPrintRequests: request ? [request] : [], activityLog: [] } };
  const handlers = new Map();
  const persist = jest.fn(async next => { db.data = next; });
  let serializationQueue = Promise.resolve();
  const serialize = jest.fn(task => {
    const result = serializationQueue.then(task);
    serializationQueue = result.catch(() => undefined);
    return result;
  });
  const options = { registerAction: (path, handler) => handlers.set(path, handler), db, serialize, persist };
  installCatalogOrderOperations(options);
  installAutomationOperations(options);
  return { db, handlers, persist, serialize, async invoke(path, payload, actor = customer) {
    let body; let status = 200;
    const res = { status(value) { status = value; return this; }, json(value) { body = value; return this; } };
    await handlers.get(path)({ headers: { authorization: actor ? token(actor) : '' }, body: payload }, res);
    return { status, body };
  } };
}

describe('rutas de pago y cotización', () => {
  it('bloquea el antiguo pago directo para obligar a pasar por el carrito', async () => {
    const { persist, invoke } = fixture();
    for (const actor of [customer, other, admin, null]) {
      expect(await invoke('/orders/pay-demo', { orderId: 'o1' }, actor)).toEqual({ status: 409, body: { code: 'PAYMENT_MUST_START_IN_CART' } });
    }
    expect(persist).not.toHaveBeenCalled();
  });

  it('expone comprobante SINPE y verificación manual Admin', async () => {
    const { handlers } = fixture();
    expect(handlers.has('/orders/submit-payment-proof')).toBe(true);
    expect(handlers.has('/admin/actions/verify-payment')).toBe(true);
  });

  it('impide que el Admin cree un pedido de cotización antes del pago del cliente', async () => {
    const { db, persist, invoke } = fixture();
    const request = { id: 'rq-1', userId: 'c1', status: 'APPROVED', quoteVersion: 1, quotedPrice: 15000, quoteValidUntil: '2026-10-10T23:59:59-06:00', quotePricing: { mode: 'DEMO' } };
    db.data.customPrintRequests.push(request);
    expect(await invoke('/admin/actions/quote-fulfillment', { requestId: 'rq-1', expectedVersion: 1, mode: 'DEMO' }, admin)).toEqual({ status: 409, body: { code: 'CUSTOMER_PAYMENT_REQUIRED' } });
    expect(db.data.orders).toHaveLength(1);
    expect(persist).not.toHaveBeenCalled();
  });

  it('cliente aprobado crea un encargo pendiente conservando el alcance fuera del catálogo', () => {
    const request = { id: 'rq-1', userId: 'c1', status: 'APPROVED', quoteVersion: 2, quotedPrice: 15000,
      quoteValidUntil: '2026-10-10T23:59:59-06:00', description: 'Soporte a medida', fileName: 'soporte.stl', dimensions: '12 x 8 cm', material: 'PETG', quantity: 2,
      quoteNotes: 'Sin envío.', quotePricing: { mode: 'DEMO' } };
    const result = prepareQuoteCheckout({ orders: [], customPrintRequests: [request], activityLog: [] }, request,
      customer, { expectedVersion: 2 }, now, () => 'fixed');
    expect(result.order).toMatchObject({ status: 'PENDING', paymentStatus: 'UNPAID', total: 15000,
      scopeSnapshot: { name: 'Soporte a medida', fileName: 'soporte.stl', dimensions: '12 x 8 cm', material: 'PETG', quantity: 2, quoteVersion: 2, notes: 'Sin envío.' } });
    expect(result.request).toMatchObject({ status: 'APPROVED', checkoutOrderId: result.order.id });
    expect(result.next.activityLog[0]).toMatchObject({ action: 'REQUEST_CHECKOUT_CREATED', fromStatus: 'APPROVED', toStatus: 'APPROVED' });
    expect(prepareQuoteCheckout({ orders: [], customPrintRequests: [request], activityLog: [] }, request,
      admin, { expectedVersion: 2 }, now).error).toBe('REQUEST_NOT_FOUND');
  });

  it.each(['PENDING_QUOTE', 'IN_REVIEW', 'QUOTED', 'AWAITING_APPROVAL', 'CHANGES_REQUESTED', 'REJECTED'])('bloquea pago de cotización en %s antes de aprobación', status => {
    const request = { id: 'rq-1', userId: 'c1', status, quoteVersion: 2, quotedPrice: 15000,
      quoteValidUntil: '2026-10-10T23:59:59-06:00', quotePricing: { mode: 'DEMO' } };
    const data = { orders: [], customPrintRequests: [request], activityLog: [] };
    expect(prepareQuoteCheckout(data, request, customer, { expectedVersion: 2 }, now)).toEqual({ error: 'QUOTE_NOT_READY' });
    expect(data.orders).toHaveLength(0);
    expect(data.activityLog).toHaveLength(0);
  });
});

describe('verificación Admin de comprobantes SINPE', () => {
  it('bloquea la aprobación de evidencia reemplazada desde que Admin la abrió', async () => {
    const { invoke, persist } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING',
      paymentProof: { status: 'SUBMITTED', submittedAt: now } } });
    const result = await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM',
      expectedProofSubmittedAt: '2026-10-03T12:00:00.000Z' }, admin);
    expect(result).toEqual({ status: 409, body: { code: 'PAYMENT_PROOF_OUTDATED' } });
    expect(persist).not.toHaveBeenCalled();
  });
  const proof = { referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888', proofNotes: '', submittedAt: now, status: 'SUBMITTED' };

  it('confirma un comprobante reportado, audita al Admin y hace replay sin duplicar actividad', async () => {
    const { db, persist, serialize, invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof } });

    const result = await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin);
    expect(result).toMatchObject({ status: 200, body: { order: {
      id: 'o1', status: 'CONFIRMED', paymentStatus: 'PAID', paidAt: expect.any(String), updatedAt: expect.any(String),
      paymentProof: { ...proof, status: 'CONFIRMED' },
    } } });
    expect(result.body.order.paidAt).toBe(result.body.order.updatedAt);
    expect(db.data.activityLog).toHaveLength(1);
    expect(db.data.activityLog[0]).toMatchObject({
      entity: 'order', entityId: 'o1', action: 'ORDER_PAYMENT_CONFIRMED', fromStatus: 'PENDING', toStatus: 'CONFIRMED',
      actorId: 'a1', actorName: 'Taller', occurredAt: result.body.order.updatedAt,
      metadata: { referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888', decision: 'CONFIRM' },
    });
    expect(serialize).toHaveBeenCalledTimes(1);
    expect(persist).toHaveBeenCalledTimes(1);

    const replay = await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin);
    expect(replay).toMatchObject({ status: 200, body: { replay: true, order: { status: 'CONFIRMED', paymentStatus: 'PAID' } } });
    expect(db.data.activityLog).toHaveLength(1);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('serializa confirmaciones concurrentes para evitar dobles eventos y persistencias', async () => {
    const { db, persist, invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof } });
    const results = await Promise.all([
      invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin),
      invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin),
    ]);

    expect(results.map(result => result.status)).toEqual([200, 200]);
    expect(results.filter(result => result.body.replay)).toHaveLength(1);
    expect(persist).toHaveBeenCalledTimes(1);
    expect(db.data.activityLog).toHaveLength(1);
  });

  it('rechaza con motivo, deja la orden pendiente y permite revisar un comprobante reenviado', async () => {
    const { db, persist, invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof } });
    expect(await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'REJECT', notes: '  no  ' }, admin))
      .toEqual({ status: 400, body: { code: 'REASON_REQUIRED' } });

    const rejected = await invoke('/admin/actions/verify-payment', {
      orderId: 'o1', decision: 'REJECT', notes: '  El monto no coincide  ',
    }, admin);
    expect(rejected).toMatchObject({ status: 200, body: { order: {
      status: 'PENDING', paymentProof: { status: 'REJECTED', rejectionReason: 'El monto no coincide' },
    } } });
    expect(db.data.activityLog[0]).toMatchObject({
      action: 'ORDER_PAYMENT_PROOF_REJECTED', fromStatus: 'PENDING', toStatus: 'PENDING', actorId: 'a1',
      metadata: { referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888', decision: 'REJECT', reason: 'El monto no coincide' },
      occurredAt: expect.any(String),
    });

    const replay = await invoke('/admin/actions/verify-payment', {
      orderId: 'o1', decision: 'REJECT', notes: 'El monto no coincide',
    }, admin);
    expect(replay.body.replay).toBe(true);
    expect(db.data.activityLog).toHaveLength(1);

    db.data.orders[0].paymentProof = { ...db.data.orders[0].paymentProof, status: 'SUBMITTED', referenceNumber: 'SINPE-5678' };
    const confirmedAfterResubmission = await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin);
    expect(confirmedAfterResubmission).toMatchObject({ status: 200, body: { order: {
      status: 'CONFIRMED', paymentStatus: 'PAID', paymentProof: { status: 'CONFIRMED', referenceNumber: 'SINPE-5678' },
    } } });
    expect(db.data.activityLog).toHaveLength(2);
    expect(persist).toHaveBeenCalledTimes(2);
  });

  it('no publica la mutación ni actividad cuando falla la persistencia', async () => {
    const { db, persist, invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof } });
    persist.mockRejectedValueOnce(new Error('disk unavailable'));

    expect(await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 500, body: { code: 'ACTION_PERSISTENCE_FAILED' } });
    expect(db.data.orders[0]).toMatchObject({ status: 'PENDING', paymentProof: { status: 'SUBMITTED' } });
    expect(db.data.activityLog).toHaveLength(0);
  });

  it('requiere Admin ACTIVE, orden existente, decisión válida y estado pendiente revisable', async () => {
    const { db, persist, invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof } });
    const inactiveAdmin = { id: 'a2', name: 'Admin inactivo', role: 'admin', status: 'INACTIVE' };
    db.data.users.push(inactiveAdmin);

    expect((await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, customer)).status).toBe(403);
    expect(await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, inactiveAdmin))
      .toEqual({ status: 403, body: { code: 'ADMIN_REQUIRED' } });
    expect(await invoke('/admin/actions/verify-payment', { orderId: 'missing', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 404, body: { code: 'ORDER_NOT_FOUND' } });
    expect(await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'APPROVE' }, admin))
      .toEqual({ status: 400, body: { code: 'INVALID_DECISION' } });

    const notPending = fixture({ order: { id: 'o1', userId: 'c1', status: 'IN_PRODUCTION', paymentProof: proof } });
    expect(await notPending.invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    const noProof = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING' } });
    expect(await noProof.invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    const invalidProof = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: { ...proof, status: 'CONFIRMED' } } });
    expect(await invalidProof.invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    expect(persist).not.toHaveBeenCalled();
  });

  it('al confirmar SINPE de una cotización aprobada también actualiza la cotización a PAID', async () => {
    const request = { id: 'rq-1', userId: 'c1', status: 'APPROVED', quoteVersion: 2,
      quotePricing: { mode: 'DEMO' }, quoteValidUntil: '2026-10-10T23:59:59-06:00' };
    const order = { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: proof,
      sourceQuoteId: 'rq-1', scopeSnapshot: { quoteVersion: 2 } };
    const { db, invoke } = fixture({ order, request });
    const result = await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin);
    expect(result.status).toBe(200);
    expect(db.data.customPrintRequests[0]).toMatchObject({ status: 'PAID', orderId: 'o1', paymentMode: 'SINPE_MANUAL' });
    expect(db.data.orders[0]).toMatchObject({ status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'SINPE_MANUAL' });
    expect(db.data.activityLog.map(event => event.action)).toContain('REQUEST_SINPE_PAYMENT_CONFIRMED');
  });

  it('no confirma una solicitud de comprobante ya rechazada sin recibir una nueva prueba', async () => {
    const rejectedProof = { ...proof, status: 'REJECTED', rejectionReason: 'Referencia no coincide' };
    const { invoke, persist } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: rejectedProof } });
    expect(await invoke('/admin/actions/verify-payment', { orderId: 'o1', decision: 'CONFIRM' }, admin))
      .toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    expect(persist).not.toHaveBeenCalled();
  });
});

describe('envío de comprobante SINPE por el cliente', () => {
  const proofImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aDEAAAAASUVORK5CYII=';
  const payload = { orderId: 'o1', referenceNumber: '  SINPE-1234  ', sinpePhone: ' 8888-8888 ', proofNotes: ' transferencia', proofFileName: 'comprobante.png', proofImageDataUrl };

  it('adjunta la imagen y registra los datos de referencia para revisión', async () => {
    const { db, invoke, persist } = fixture();
    const result = await invoke('/orders/submit-payment-proof', payload);
    expect(result.status).toBe(200);
    expect(result.body.order.paymentProof).toMatchObject({ status: 'SUBMITTED', referenceNumber: 'SINPE-1234',
      sinpePhone: '8888-8888', proofNotes: 'transferencia', proofFileName: 'comprobante.png', imageDataUrl: proofImageDataUrl });
    expect(db.data.activityLog[0]).toMatchObject({ action: 'ORDER_PAYMENT_PROOF_SUBMITTED', fromStatus: 'PENDING', toStatus: 'PENDING' });
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('oculta órdenes ajenas, bloquea roles incorrectos y exige evidencia de imagen válida', async () => {
    const { invoke } = fixture();
    expect((await invoke('/orders/submit-payment-proof', payload, other)).status).toBe(404);
    expect((await invoke('/orders/submit-payment-proof', payload, admin)).status).toBe(403);
    expect(await invoke('/orders/submit-payment-proof', { ...payload, proofImageDataUrl: '' }))
      .toEqual({ status: 400, body: { code: 'INVALID_PROOF_IMAGE' } });
  });

  it('no permite duplicar un comprobante mientras espera revisión', async () => {
    const { invoke } = fixture({ order: { id: 'o1', userId: 'c1', status: 'PENDING', paymentProof: { status: 'SUBMITTED' } } });
    expect(await invoke('/orders/submit-payment-proof', payload)).toEqual({ status: 409, body: { code: 'PROOF_ALREADY_SUBMITTED' } });
  });
});
