/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { prepareCustomerQuoteDecision } from '../scripts/customer-quote-operations.js';
import { installAutomationOperations } from '../scripts/automation-operations.js';

const now = '2026-10-04T12:00:00.000Z';
const customer = { id: 'u-customer', name: 'Cliente', role: 'customer' };
const waitingQuote = {
  id: 'r-1', userId: customer.id, status: 'AWAITING_APPROVAL', quoteVersion: 3,
  quoteValidUntil: '2026-10-10T23:59:59-06:00', quotedPrice: 9000,
};

function setupActions(status = 'PENDING_QUOTE') {
  const active = { ...customer, status: 'ACTIVE' };
  const admin = { id: 'admin', role: 'admin', status: 'ACTIVE' };
  const inactive = { id: 'inactive', role: 'customer', status: 'INACTIVE' };
  const db = { data: { users: [active, admin, inactive], customPrintRequests: [
    { ...waitingQuote, status }, { ...waitingQuote, id: 'other', userId: 'another-user', status },
  ], activityLog: [], orders: [] } };
  const handlers = new Map();
  const persist = jest.fn(async next => { db.data = next; });
  installAutomationOperations({ registerAction: (path, handler) => handlers.set(path, handler), db, serialize: action => action(), persist });
  const token = (user = active, exp = 9999999999) => `Bearer sim.v1.${btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: user.id, role: user.role, exp }))}`;
  return { db, persist, token, admin, inactive, async invoke(path, body = { requestId: 'r-1' }, authorization = token()) {
    let response; let statusCode = 200;
    const res = { status(value) { statusCode = value; return this; }, json(value) { response = value; return this; } };
    await handlers.get(path)({ body, headers: { authorization } }, res);
    return { status: statusCode, body: response };
  } };
}

describe('cancelación y descarte mediante endpoints del cliente', () => {
  it('cancela una solicitud propia y persiste el evento sin borrar la solicitud', async () => {
    const { db, persist, invoke } = setupActions();
    const result = await invoke('/quotes/cancel', { requestId: 'r-1', reason: 'Ya no necesito la pieza' });
    expect(result.status).toBe(200);
    expect(result.body.request).toMatchObject({ id: 'r-1', status: 'CANCELLED', customerDecisionReason: 'Ya no necesito la pieza' });
    expect(db.data.customPrintRequests).toHaveLength(2);
    expect(db.data.customPrintRequests[1].status).toBe('PENDING_QUOTE');
    expect(db.data.activityLog).toEqual([expect.objectContaining({ entityId: 'r-1', actorId: customer.id, action: 'REQUEST_CUSTOMER_CANCELLED', fromStatus: 'PENDING_QUOTE', toStatus: 'CANCELLED' })]);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('descarta solo la solicitud propia y conserva la ajena', async () => {
    const { db, persist, invoke } = setupActions('CANCELLED');
    expect(await invoke('/quotes/delete')).toEqual({ status: 200, body: { success: true, deletedId: 'r-1' } });
    expect(db.data.customPrintRequests.map(request => request.id)).toEqual(['other']);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it.each(['/quotes/cancel', '/quotes/delete'])('%s no modifica solicitudes ajenas ni inexistentes', async path => {
    const { db, persist, invoke } = setupActions();
    const before = structuredClone(db.data);
    for (const requestId of ['other', 'missing']) {
      expect(await invoke(path, { requestId, userId: customer.id })).toEqual({ status: 404, body: { code: 'REQUEST_NOT_FOUND' } });
    }
    expect(db.data).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });

  it.each(['APPROVED', 'PAID'])('bloquea descarte y cancelación de %s con 409', async status => {
    const { db, persist, invoke } = setupActions(status);
    const before = structuredClone(db.data);
    for (const path of ['/quotes/delete', '/quotes/cancel']) {
      expect(await invoke(path)).toEqual({ status: 409, body: { code: 'STATUS_CONFLICT' } });
    }
    expect(db.data).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });

  it.each(['/quotes/cancel', '/quotes/delete'])('%s exige cliente activo y un requestId', async path => {
    const { persist, invoke, token, admin, inactive } = setupActions();
    for (const authorization of ['', 'Bearer inválido', token(admin), token(inactive), token(customer, 1)]) {
      expect(await invoke(path, { requestId: 'r-1' }, authorization)).toEqual({ status: 403, body: { code: 'CUSTOMER_REQUIRED' } });
    }
    expect(await invoke(path, {})).toEqual({ status: 400, body: { code: 'INVALID_REQUEST' } });
    expect(persist).not.toHaveBeenCalled();
  });
});

describe('decisiones de cotización del cliente', () => {
  it('aprueba únicamente la versión vigente y registra actor y transición', () => {
    const result = prepareCustomerQuoteDecision(waitingQuote, customer, { expectedVersion: 3, decision: 'APPROVED' }, now);
    expect(result.request).toMatchObject({ status: 'APPROVED', approvedBy: customer.id, approvedAt: now, customerRespondedAt: now });
    expect(result.event).toMatchObject({ action: 'REQUEST_CUSTOMER_APPROVED', fromStatus: 'AWAITING_APPROVAL', toStatus: 'APPROVED', actorId: customer.id });
  });

  it('registra motivo requerido al pedir cambios o rechazar', () => {
    for (const decision of ['CHANGES_REQUESTED', 'REJECTED']) {
      const result = prepareCustomerQuoteDecision(waitingQuote, customer, { expectedVersion: 3, decision, reason: 'Cambiar el acabado' }, now);
      expect(result.request).toMatchObject({ status: decision, customerDecisionReason: 'Cambiar el acabado' });
      expect(result.event).toMatchObject({ action: `REQUEST_CUSTOMER_${decision}`, reason: 'Cambiar el acabado', toStatus: decision });
    }
    expect(prepareCustomerQuoteDecision(waitingQuote, customer, { expectedVersion: 3, decision: 'REJECTED', reason: '  ' }, now).error).toBe('REASON_REQUIRED');
  });

  it('bloquea roles, solicitudes ajenas, estados/versiones obsoletos y aprobación vencida', () => {
    expect(prepareCustomerQuoteDecision(waitingQuote, { ...customer, role: 'admin' }, { expectedVersion: 3, decision: 'APPROVED' }, now).error).toBe('CUSTOMER_REQUIRED');
    expect(prepareCustomerQuoteDecision({ ...waitingQuote, userId: 'another-user' }, customer, { expectedVersion: 3, decision: 'APPROVED' }, now).error).toBe('REQUEST_NOT_FOUND');
    expect(prepareCustomerQuoteDecision(waitingQuote, customer, { expectedVersion: 2, decision: 'APPROVED' }, now).error).toBe('STATUS_CONFLICT');
    expect(prepareCustomerQuoteDecision({ ...waitingQuote, status: 'QUOTED' }, customer, { expectedVersion: 3, decision: 'APPROVED' }, now).error).toBe('STATUS_CONFLICT');
    expect(prepareCustomerQuoteDecision({ ...waitingQuote, quoteValidUntil: '2026-10-03T23:59:59Z' }, customer, { expectedVersion: 3, decision: 'APPROVED' }, now).error).toBe('QUOTE_EXPIRED');
  });
});
