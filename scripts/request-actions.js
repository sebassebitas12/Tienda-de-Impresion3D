import { calculateManualQuote } from '../src/utils/quotePricing.js';

// Pure academic transitions. Persistence and administrator validation belong to the server.
export function prepareRequestAction(request, payload, occurredAt) {
  if (payload.expectedStatus !== request.status) return { error: 'STATUS_CONFLICT' };
  if (payload.action === 'incorporate-request' && request.status === 'SUBMITTED') {
    return { patch: { status: 'PENDING_QUOTE', originalStatus: request.status }, event: 'REQUEST_INCORPORATED' };
  }
  if (payload.action === 'save-quote' && ['IN_REVIEW', 'QUOTED'].includes(request.status)) {
    if (payload.expectedVersion !== (request.quoteVersion || 0)) return { error: 'STATUS_CONFLICT' };
    const { validUntil, notes, pricingInputs } = payload;
    const quoteCalculation = calculateManualQuote(pricingInputs, Number(request.quantity));
    const parsedDate = Date.parse(`${validUntil}T00:00:00-06:00`);
    const validDate = typeof validUntil === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(validUntil)
      && Number.isFinite(parsedDate) && new Date(parsedDate).toISOString().slice(0, 10) === validUntil;
    if (!quoteCalculation || !validDate
      || Date.parse(`${validUntil}T23:59:59-06:00`) <= Date.parse(occurredAt)
      || typeof notes !== 'string' || !notes.trim() || notes.length > 2000) return { error: 'INVALID_QUOTE' };
    return { patch: { status: 'QUOTED', quotedPrice: quoteCalculation.breakdown.amountCrc, currency: 'CRC', quoteValidUntil: `${validUntil}T23:59:59-06:00`,
      quoteNotes: notes.trim(), quotePricing: quoteCalculation, quotedAt: occurredAt, quotedBy: payload.actorId, quoteVersion: (request.quoteVersion || 0) + 1 }, event: 'REQUEST_QUOTE_SAVED' };
  }
  if (payload.action === 'email-quote-sent' && request.status === 'QUOTED') {
    if (payload.expectedVersion !== (request.quoteVersion || 0)) return { error: 'STATUS_CONFLICT' };
    if (!(request.quotedPrice > 0) || request.currency !== 'CRC' || !request.quoteNotes?.trim()
      || !(Date.parse(request.quoteValidUntil) > Date.parse(occurredAt))) return { error: 'INVALID_QUOTE' };
    return { patch: { status: 'AWAITING_APPROVAL', quoteEmailSentAt: occurredAt }, event: 'REQUEST_QUOTE_EMAIL_SENT' };
  }
  return { error: 'INVALID_ACTION' };
}
