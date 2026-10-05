import { randomUUID } from 'node:crypto';
import { sessionActor } from './session-access.js';

export function prepareOrderPayment(data, actor, payload, now, verification = false, idFactory = randomUUID) {
  const role = verification ? 'admin' : 'customer';
  if (actor?.role !== role || actor.status !== 'ACTIVE') return { error: verification ? 'ADMIN_REQUIRED' : 'CUSTOMER_REQUIRED', status: 403 };
  const index = (data.orders || []).findIndex(order => typeof payload?.orderId === 'string'
    && String(order.id) === payload.orderId && (verification || String(order.userId) === String(actor.id)));
  if (index < 0) return { error: 'ORDER_NOT_FOUND', status: 404 };
  const order = data.orders[index];
  if (order.status !== 'PENDING' || (verification && order.paymentProof?.status !== 'SUBMITTED')) return { error: 'STATUS_CONFLICT', status: 409 };
  let patch; let action; let reason; let metadata;
  if (!verification) {
    const { referenceNumber, sinpePhone, proofNotes } = payload;
    if (typeof referenceNumber !== 'string' || referenceNumber.trim().length < 4 || referenceNumber.trim().length > 100) return { error: 'INVALID_REFERENCE', status: 400 };
    if (typeof sinpePhone !== 'string' || sinpePhone.trim().length < 8 || sinpePhone.trim().length > 25) return { error: 'INVALID_PHONE', status: 400 };
    if (proofNotes !== undefined && (typeof proofNotes !== 'string' || proofNotes.length > 500)) return { error: 'INVALID_NOTES', status: 400 };
    patch = { paymentProof: { referenceNumber: referenceNumber.trim(), sinpePhone: sinpePhone.trim(), proofNotes: proofNotes?.trim() || '', submittedAt: now, status: 'SUBMITTED' } };
    action = 'ORDER_PAYMENT_PROOF_SUBMITTED';
    metadata = { referenceNumber: patch.paymentProof.referenceNumber, sinpePhone: patch.paymentProof.sinpePhone };
  } else {
    if (payload?.expectedProofSubmittedAt && payload.expectedProofSubmittedAt !== order.paymentProof?.submittedAt) {
      return { error: 'PAYMENT_PROOF_OUTDATED', status: 409 };
    }
    if (!['CONFIRM', 'REJECT'].includes(payload.decision)) return { error: 'INVALID_DECISION', status: 400 };
    if (payload.decision === 'REJECT' && (typeof payload.notes !== 'string' || payload.notes.trim().length < 3 || payload.notes.length > 500)) return { error: 'REASON_REQUIRED', status: 400 };
    if (payload.decision === 'CONFIRM' && payload.notes !== undefined && (typeof payload.notes !== 'string' || payload.notes.length > 500)) return { error: 'INVALID_NOTES', status: 400 };
    const confirmed = payload.decision === 'CONFIRM';
    reason = confirmed ? undefined : payload.notes.trim();
    patch = { ...(confirmed ? { status: 'CONFIRMED', paymentStatus: 'PAID', paidAt: now } : {}),
      paymentProof: { ...order.paymentProof, status: confirmed ? 'CONFIRMED' : 'REJECTED', verifiedAt: now, verifiedBy: String(actor.id),
        ...(reason ? { rejectionReason: reason } : {}) } };
    action = confirmed ? 'ORDER_PAYMENT_CONFIRMED' : 'ORDER_PAYMENT_PROOF_REJECTED';
  }
  const updated = { ...order, ...patch, updatedAt: now };
  const event = { id: `evt-${idFactory()}`, entity: 'order', entityId: order.id, action,
    fromStatus: 'PENDING', toStatus: updated.status, actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    ...(metadata ? { metadata } : {}), ...(reason ? { reason } : {}) };
  const nextData = structuredClone(data);
  nextData.orders[index] = updated;
  nextData.activityLog = [...(nextData.activityLog || []), event];
  return { order: updated, nextData };
}

export function installOrderPaymentOperation({ registerAction, db, serialize, persist }, verification = false) {
  registerAction(verification ? '/admin/actions/verify-payment' : '/orders/submit-payment-proof', async (req, res) => {
    try {
      const result = await serialize(async () => {
        const actor = sessionActor(req.headers.authorization, db.data);
        const prepared = prepareOrderPayment(db.data, actor, req.body || {}, new Date().toISOString(), verification);
        if (!prepared.error) await persist(prepared.nextData);
        return prepared;
      });
      return result.error ? res.status(result.status).json({ code: result.error }) : res.json({ order: result.order });
    } catch { return res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' }); }
  });
}
