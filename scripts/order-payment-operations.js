import { randomUUID } from 'node:crypto';
import { sessionActor } from './session-access.js';

export function prepareDemoOrderPayment(data, actor, payload, now, idFactory = randomUUID) {
  if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return { error: 'CUSTOMER_REQUIRED', status: 403 };
  const index = (data.orders || []).findIndex(order => typeof payload?.orderId === 'string'
    && String(order.id) === payload.orderId && String(order.userId) === String(actor.id));
  if (index < 0) return { error: 'ORDER_NOT_FOUND', status: 404 };
  const order = data.orders[index];
  if (order.paymentStatus === 'PAID' && order.paymentMode === 'DEMO') return { order, replay: true };
  if (order.customPrintRequestId || order.status !== 'PENDING') return { error: 'STATUS_CONFLICT', status: 409 };

  const updated = {
    ...order,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMode: 'DEMO',
    paidAt: now,
    updatedAt: now,
    paymentEvidence: {
      mode: 'DEMO',
      reference: 'SIMULATED-NO-REAL-PAYMENT',
      recordedBy: String(actor.id),
      recordedAt: now,
    },
  };
  const event = {
    id: `evt-${idFactory()}`, entity: 'order', entityId: String(order.id),
    action: 'ORDER_DEMO_PAYMENT_RECORDED', fromStatus: 'PENDING', toStatus: 'CONFIRMED',
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    metadata: { mode: 'DEMO', reference: 'SIMULATED-NO-REAL-PAYMENT' },
  };
  const nextData = structuredClone(data);
  nextData.orders[index] = updated;
  nextData.activityLog = [...(nextData.activityLog || []), event];
  return { order: updated, event, nextData };
}

export function installDemoOrderPaymentOperation({ registerAction, db, serialize, persist }) {
  registerAction('/orders/pay-demo', async (req, res) => {
    try {
      const result = await serialize(async () => {
        const actor = sessionActor(req.headers.authorization, db.data);
        const prepared = prepareDemoOrderPayment(db.data, actor, req.body || {}, new Date().toISOString());
        if (!prepared.error && !prepared.replay) await persist(prepared.nextData);
        return prepared;
      });
      return result.error ? res.status(result.status).json({ code: result.error })
        : res.json({ order: result.order, replay: Boolean(result.replay) });
    } catch { return res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' }); }
  });
}
