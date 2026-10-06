import { randomUUID } from 'node:crypto';

export function prepareQuoteCheckout(data, request, actor, payload, now, idFactory = randomUUID) {
  if (actor?.role !== 'customer' || actor.status !== 'ACTIVE' || !request || String(request.userId) !== String(actor.id)) return { error: 'REQUEST_NOT_FOUND' };
  if (request.status !== 'APPROVED' || request.quotePricing?.mode !== 'DEMO'
    || !Number.isSafeInteger(request.quoteVersion) || request.quoteVersion !== payload?.expectedVersion
    || !Number.isSafeInteger(request.quotedPrice) || request.quotedPrice <= 0) {
    return { error: 'QUOTE_NOT_READY' };
  }
  if (!(Date.parse(request.quoteValidUntil || '') > Date.parse(now))) return { error: 'QUOTE_EXPIRED' };

  const existing = (data.orders || []).find(order => String(order.customPrintRequestId || order.sourceQuoteId) === String(request.id));
  if (existing) {
    if (existing.status === 'PENDING' && existing.paymentStatus !== 'PAID'
      && existing.scopeSnapshot?.quoteVersion === request.quoteVersion) return { order: existing, replay: true };
    return { error: existing.paymentStatus === 'PAID' ? 'QUOTE_ALREADY_PAID' : 'STATUS_CONFLICT' };
  }

  const order = {
    id: `o-${idFactory()}`, userId: String(request.userId), customPrintRequestId: String(request.id), sourceQuoteId: String(request.id),
    status: 'PENDING', paymentStatus: 'UNPAID', subtotal: request.quotedPrice, total: request.quotedPrice,
    currency: 'CRC', createdAt: now, updatedAt: now, pricingMode: 'DEMO',
    scopeSnapshot: { name: request.quotePricing.profile?.name || request.description || request.fileName,
      fileName: request.fileName || null, material: request.quotePricing.inputs?.material || request.material || null,
      dimensions: request.dimensions || null, quantity: request.quantity, quoteVersion: request.quoteVersion,
      quoteValidUntil: request.quoteValidUntil, notes: request.quoteNotes },
  };
  const updatedRequest = { ...request, checkoutOrderId: order.id, updatedAt: now };
  const event = { id: `evt-${idFactory()}`, entity: 'customPrintRequest', entityId: String(request.id),
    action: 'REQUEST_CHECKOUT_CREATED', fromStatus: 'APPROVED', toStatus: 'APPROVED',
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    metadata: { orderId: order.id, quoteVersion: request.quoteVersion, paymentStatus: 'UNPAID' } };
  const next = structuredClone(data);
  const requestIndex = (next.customPrintRequests || []).findIndex(row => String(row.id) === String(request.id));
  if (requestIndex < 0) return { error: 'REQUEST_NOT_FOUND' };
  next.orders = [...(next.orders || []), order];
  next.customPrintRequests[requestIndex] = updatedRequest;
  next.activityLog = [...(next.activityLog || []), event];
  return { order, request: updatedRequest, event, next };
}
