// Pure academic transitions. Persistence and administrator validation belong to the server.
export function prepareRequestAction(request, payload, occurredAt) {
  if (payload.expectedStatus !== request.status) return { error: 'STATUS_CONFLICT' };
  if (payload.action === 'incorporate-request' && request.status === 'SUBMITTED') {
    return { patch: { status: 'PENDING_QUOTE', originalStatus: request.status }, event: 'REQUEST_INCORPORATED' };
  }
  if (payload.action === 'save-quote' && ['IN_REVIEW', 'QUOTED'].includes(request.status)) {
    if (payload.expectedVersion !== (request.quoteVersion || 0)) return { error: 'STATUS_CONFLICT' };
    const { amount, validUntil, notes } = payload;
    const parsedDate = Date.parse(`${validUntil}T00:00:00-06:00`);
    const validDate = typeof validUntil === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(validUntil)
      && Number.isFinite(parsedDate) && new Date(parsedDate).toISOString().slice(0, 10) === validUntil;
    if (!Number.isSafeInteger(amount) || amount <= 0 || !validDate
      || Date.parse(`${validUntil}T23:59:59-06:00`) <= Date.parse(occurredAt)
      || typeof notes !== 'string' || !notes.trim() || notes.length > 2000) return { error: 'INVALID_QUOTE' };
    return { patch: { status: 'QUOTED', quotedPrice: amount, currency: 'CRC', quoteValidUntil: `${validUntil}T23:59:59-06:00`,
      quoteNotes: notes.trim(), quotedAt: occurredAt, quotedBy: payload.actorId, quoteVersion: (request.quoteVersion || 0) + 1 }, event: 'REQUEST_QUOTE_SAVED' };
  }
  if (payload.action === 'publish-quote' && request.status === 'QUOTED') {
    if (payload.expectedVersion !== (request.quoteVersion || 0)) return { error: 'STATUS_CONFLICT' };
    if (!(request.quotedPrice > 0) || request.currency !== 'CRC' || !request.quoteNotes?.trim()
      || !(Date.parse(request.quoteValidUntil) > Date.parse(occurredAt))) return { error: 'INVALID_QUOTE' };
    return { patch: { status: 'AWAITING_APPROVAL' }, event: 'REQUEST_QUOTE_PUBLISHED' };
  }
  return { error: 'INVALID_ACTION' };
}
