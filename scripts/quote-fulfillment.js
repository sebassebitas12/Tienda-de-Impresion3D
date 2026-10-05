import { randomUUID } from 'node:crypto';

export function prepareQuoteFulfillment(data, request, payload, actor, now) {
  const existing = data.orders.find(order => order.customPrintRequestId === request.id);
  if (existing) return { replay: true, order: existing, request };
  if (request.status !== 'APPROVED' || request.quoteVersion !== payload.expectedVersion || !request.quotePricing || !Number.isSafeInteger(request.quotedPrice) || request.quotedPrice <= 0) return { error: 'QUOTE_NOT_READY' };
  const demo = request.quotePricing.mode === 'DEMO';
  if (payload.mode !== (demo ? 'DEMO' : 'MANUAL_VERIFIED')) return { error: 'PAYMENT_MODE_INVALID' };
  if (!demo && (payload.confirmed !== true || typeof payload.reference !== 'string' || payload.reference.trim().length < 4 || payload.reference.length > 200)) return { error: 'PAYMENT_EVIDENCE_REQUIRED' };
  const order = { id: `o-${randomUUID()}`, userId: request.userId, customPrintRequestId: request.id, status: 'CONFIRMED', paymentStatus: 'PAID', paidAt: now,
    subtotal: request.quotedPrice, total: request.quotedPrice, currency: 'CRC', createdAt: now, updatedAt: now,
    pricingMode: demo ? 'DEMO' : 'MANUAL', paymentEvidence: { mode: payload.mode, ...(demo ? { reference: 'SIMULATED-NO-REAL-PAYMENT' } : { reference: payload.reference.trim() }), recordedBy: actor.id, recordedAt: now },
    scopeSnapshot: { name: request.quotePricing.profile?.name || request.description || request.fileName, material: request.quotePricing.inputs.material, quantity: request.quantity, quoteVersion: request.quoteVersion, notes: request.quoteNotes },
  };
  const updated = { ...request, status: 'PAID', orderId: order.id, paidAt: now, paymentMode: payload.mode, updatedAt: now };
  const next = structuredClone(data);
  next.orders.push(order);
  next.customPrintRequests[next.customPrintRequests.findIndex(row => row.id === request.id)] = updated;
  // Custom jobs carry their immutable scope; they do not invent a catalog productId.
  next.activityLog.push({ id: randomUUID(), entity: 'customPrintRequest', entityId: request.id,
    action: demo ? 'REQUEST_DEMO_FULFILLED' : 'REQUEST_PAYMENT_RECORDED', fromStatus: request.status, toStatus: 'PAID', actorId: actor.id, actorName: actor.name, occurredAt: now });
  return { next, request: updated, order };
}
