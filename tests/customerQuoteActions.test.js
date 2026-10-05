/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { prepareCustomerQuoteDecision } from '../scripts/customer-quote-operations.js';

const now = '2026-10-04T12:00:00.000Z';
const customer = { id: 'u-customer', name: 'Cliente', role: 'customer' };
const waitingQuote = {
  id: 'r-1', userId: customer.id, status: 'AWAITING_APPROVAL', quoteVersion: 3,
  quoteValidUntil: '2026-10-10T23:59:59-06:00', quotedPrice: 9000,
};

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
