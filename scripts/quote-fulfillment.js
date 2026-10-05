import { randomUUID } from 'node:crypto';

export function prepareQuoteFulfillment(data, request, payload, actor, now) {
  if (actor?.role !== 'customer' || actor.status !== 'ACTIVE' || !request || String(request.userId) !== String(actor.id)) return { error: 'REQUEST_NOT_FOUND' };
  const existing = data.orders.find(order => order.customPrintRequestId === request.id);
  if (existing) return existing.paymentMode === 'DEMO' && request.status === 'PAID'
    ? { replay: true, order: existing, request }
    : { error: 'QUOTE_NOT_READY' };
  if (payload.mode !== 'DEMO') return { error: 'PAYMENT_MODE_INVALID' };
  if (request.status !== 'APPROVED' || request.quoteVersion !== payload.expectedVersion || request.quotePricing?.mode !== 'DEMO' || !Number.isSafeInteger(request.quotedPrice) || request.quotedPrice <= 0) return { error: 'QUOTE_NOT_READY' };
  if (!(Date.parse(request.quoteValidUntil || '') > Date.parse(now))) return { error: 'QUOTE_EXPIRED' };
  const order = { id: `o-${randomUUID()}`, userId: request.userId, customPrintRequestId: request.id, sourceQuoteId: request.id, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO', paidAt: now,
    subtotal: request.quotedPrice, total: request.quotedPrice, currency: 'CRC', createdAt: now, updatedAt: now,
    pricingMode: 'DEMO', paymentEvidence: { mode: 'DEMO', reference: 'SIMULATED-NO-REAL-PAYMENT', recordedBy: String(actor.id), recordedAt: now },
    scopeSnapshot: { name: request.quotePricing.profile?.name || request.description || request.fileName, fileName: request.fileName || null,
      material: request.quotePricing.inputs?.material || request.material || null, dimensions: request.dimensions || null,
      quantity: request.quantity, quoteVersion: request.quoteVersion, notes: request.quoteNotes },
  };
  const updated = { ...request, status: 'PAID', orderId: order.id, paidAt: now, paymentMode: payload.mode, updatedAt: now };
  const next = structuredClone(data);
  next.orders.push(order);
  next.customPrintRequests[next.customPrintRequests.findIndex(row => row.id === request.id)] = updated;
  // Custom jobs carry their immutable scope; they do not invent a catalog productId.
  next.activityLog.push({ id: randomUUID(), entity: 'customPrintRequest', entityId: request.id,
    action: 'REQUEST_DEMO_PAYMENT_RECORDED', fromStatus: request.status, toStatus: 'PAID', actorId: actor.id, actorName: actor.name, occurredAt: now,
    metadata: { mode: 'DEMO', reference: 'SIMULATED-NO-REAL-PAYMENT' } });
  return { next, request: updated, order };
}
