import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { DEMO_PROFILES, calculateAutomaticDemoQuote } from '../src/utils/quoteAutomation.js';
import { sessionActor } from './session-access.js';
import { runAssistant } from './assistant-runtime.js';
import { createRatesProvider } from './quote-rates.js';
import { deliverQuote } from './quote-email.js';
import { prepareQuoteFulfillment } from './quote-fulfillment.js';

export const ORDER_NEXT = { PENDING: 'CONFIRMED', CONFIRMED: 'IN_PRODUCTION', IN_PRODUCTION: 'READY', READY: 'SHIPPED', SHIPPED: 'DELIVERED' };

export function prepareOrderTransition(order, payload, now) {
  if (!order || payload.expectedStatus !== order.status || (payload.expectedUpdatedAt || null) !== (order.updatedAt || null)) return { error: 'STATUS_CONFLICT' };
  const closure = ['CANCELLED', 'REJECTED'].includes(payload.nextStatus) && ['PENDING', 'CONFIRMED'].includes(order.status);
  if (ORDER_NEXT[order.status] !== payload.nextStatus && !closure) return { error: 'TRANSITION_FORBIDDEN' };
  if (closure && (typeof payload.reason !== 'string' || payload.reason.trim().length < 3 || payload.reason.length > 500)) return { error: 'REASON_REQUIRED' };
  return { patch: { status: payload.nextStatus, updatedAt: now, ...(closure ? { closureReason: payload.reason.trim() } : {}), ...(payload.nextStatus === 'DELIVERED' ? { deliveredAt: now } : {}) }, event: 'ORDER_STATUS_CHANGED' };
}

export function prepareAutomaticRequest(request, quote, actorId, now) {
  if (!['PENDING_QUOTE', 'IN_REVIEW', 'QUOTED'].includes(request.status)) return { error: 'TRANSITION_FORBIDDEN' };
  if (quote.error || quote.mode !== 'DEMO') return { error: quote.error || 'INVALID_QUOTE' };
  return { ...request, status: 'QUOTED', quotedPrice: quote.breakdown.amountCrc, currency: 'CRC', quotePricing: quote,
    quoteValidUntil: `${quote.validUntil}T23:59:59-06:00`, quoteNotes: quote.notes, quotedAt: now,
    quotedBy: actorId, quoteVersion: (request.quoteVersion || 0) + 1, updatedAt: now, automationSource: 'DEMO_ENGINE' };
}

export function installAutomationOperations({ registerAction, db, serialize, persist }) {
  const getRates = createRatesProvider();
  const attempts = new Map();
  const actorFor = req => sessionActor(req.headers.authorization, db.data);
  const eventFor = (request, actor, action, fromStatus, now) => ({ id: randomUUID(), entity: 'customPrintRequest', entityId: String(request.id),
    action, fromStatus, toStatus: request.status, actorId: String(actor.id), actorName: actor.name, occurredAt: now });
  const failure = (res, code, status = 400) => res.status(status).json({ code });

  registerAction('/quotes/profiles', (_req, res) => res.json({ profiles: DEMO_PROFILES, mode: 'DEMO' }));
  registerAction('/quotes/mine', (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    res.json({ requests: db.data.customPrintRequests.filter(request => String(request.userId) === String(actor.id)) });
  });
  registerAction('/quotes/preview', async (req, res) => {
    const quote = calculateAutomaticDemoQuote(req.body || {}, await getRates());
    return quote.error ? failure(res, quote.error) : res.json({ quote });
  });

  registerAction('/assistants/chat', async (req, res) => {
    const actor = actorFor(req);
    const key = actor?.id || req.socket?.remoteAddress || 'local';
    const now = Date.now();
    const limit = attempts.get(key);
    if (limit && limit.since > now - 60000 && limit.count >= 12) return failure(res, 'RATE_LIMIT', 429);
    attempts.set(key, { since: limit?.since > now - 60000 ? limit.since : now, count: limit?.since > now - 60000 ? limit.count + 1 : 1 });
    if (attempts.size > 1000) for (const [id, value] of attempts) if (value.since < now - 60000) attempts.delete(id);
    try {
      const result = await runAssistant(req.body || {}, { actor, data: db.data, getRates }, { env: process.env });
      if (result.error) return failure(res, result.error, result.error === 'ROLE_REQUIRED' ? 403 : 422);
      res.json(result);
    } catch { failure(res, 'ASSISTANT_UNAVAILABLE', 502); }
  });

  registerAction('/quotes/create', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const { profileId, material, quantity, sizeScale, needsDesign, description, idempotencyKey } = req.body || {};
    if (typeof description !== 'string' || description.trim().length < 3 || description.length > 2000 || typeof idempotencyKey !== 'string' || idempotencyKey.length > 80 || !idempotencyKey || (needsDesign !== undefined && typeof needsDesign !== 'boolean')) return failure(res, 'INVALID_REQUEST');
    const rates = await getRates();
    try {
      const result = await serialize(async () => {
        const duplicate = db.data.customPrintRequests.find(r => r.idempotencyKey === idempotencyKey && r.userId === actor.id);
        if (duplicate) return { request: duplicate, replay: true };
        const now = new Date().toISOString();
        const request = { id: `rq-${randomUUID()}`, userId: actor.id, status: 'PENDING_QUOTE', submittedAt: now,
          profileId, material, quantity: Number(quantity), sizeScale, needsDesign: Boolean(needsDesign), description: description.trim(),
          sourceType: needsDesign ? 'DESIGN_HELP' : 'PROFILE_REFERENCE', fileName: null, idempotencyKey };
        const quote = calculateAutomaticDemoQuote(request, rates, now);
        if (quote.error) return { error: quote.error };
        const quoted = prepareAutomaticRequest(request, quote, actor.id, now);
        const next = structuredClone(db.data);
        next.customPrintRequests.push(quoted);
        next.activityLog.push(eventFor(quoted, actor, 'REQUEST_AUTO_QUOTED', 'PENDING_QUOTE', now));
        await persist(next);
        if (req.body.sendEmail === true) {
          const operator = db.data.users.find(user => user.role === 'admin' && user.status === 'ACTIVE');
          if (!operator) return { request: quoted, email: { code: 'ADMIN_REQUIRED' } };
          const delivery = await deliverQuote({ data: db.data, requestId: quoted.id, actor: operator, expectedVersion: quoted.quoteVersion, persist });
          return { request: delivery.body.request || quoted, email: delivery.body.code ? { code: delivery.body.code } : { delivered: true } };
        }
        return { request: quoted };
      });
      return result.error ? failure(res, result.error) : res.status(result.replay ? 200 : 201).json(result);
    } catch { failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

  registerAction('/admin/actions/auto-quote', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'admin') return failure(res, 'ADMIN_REQUIRED', 403);
    const payload = req.body || {};
    const rates = await getRates();
    try {
      const result = await serialize(async () => {
        const index = db.data.customPrintRequests.findIndex(r => String(r.id) === payload.requestId);
        if (index < 0) return { error: 'REQUEST_NOT_FOUND' };
        const request = db.data.customPrintRequests[index];
        if (request.status !== payload.expectedStatus || (request.quoteVersion || 0) !== payload.expectedVersion) return { error: 'STATUS_CONFLICT' };
        const now = new Date().toISOString();
        const quote = calculateAutomaticDemoQuote({ ...request, ...(payload.profileId ? { profileId: payload.profileId } : {}) }, rates, now);
        const quoted = prepareAutomaticRequest(request, quote, actor.id, now);
        if (quoted.error) return quoted;
        const next = structuredClone(db.data);
        next.customPrintRequests[index] = quoted;
        next.activityLog.push(eventFor(quoted, actor, 'REQUEST_AUTO_QUOTED', request.status, now));
        await persist(next);
        return { request: quoted };
      });
      return result.error ? failure(res, result.error, result.error === 'STATUS_CONFLICT' ? 409 : 400) : res.json(result);
    } catch { failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

  registerAction('/quotes/approve', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    try {
      const result = await serialize(async () => {
        const index = db.data.customPrintRequests.findIndex(r => r.id === req.body?.requestId && r.userId === actor.id);
        if (index < 0) return { error: 'REQUEST_NOT_FOUND' };
        const request = db.data.customPrintRequests[index];
        if (!['QUOTED', 'AWAITING_APPROVAL'].includes(request.status) || (request.quoteVersion || 0) !== req.body.expectedVersion) return { error: 'STATUS_CONFLICT' };
        if (!(Date.parse(request.quoteValidUntil) > Date.now())) return { error: 'QUOTE_EXPIRED' };
        const now = new Date().toISOString();
        const updated = { ...request, status: 'APPROVED', approvedAt: now, approvedBy: actor.id, updatedAt: now };
        const next = structuredClone(db.data);
        next.customPrintRequests[index] = updated;
        next.activityLog.push(eventFor(updated, actor, 'REQUEST_CUSTOMER_APPROVED', request.status, now));
        await persist(next);
        return { request: updated };
      });
      return result.error ? failure(res, result.error, 409) : res.json(result);
    } catch { failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

  registerAction('/admin/actions/order-transition', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'admin') return failure(res, 'ADMIN_REQUIRED', 403);
    try {
      const result = await serialize(async () => {
        const index = db.data.orders?.findIndex(o => String(o.id) === req.body?.orderId);
        if (index === undefined || index < 0) return { error: 'ORDER_NOT_FOUND' };
        const order = db.data.orders[index];
        const now = new Date().toISOString();
        const action = prepareOrderTransition(order, req.body, now);
        if (action.error) return action;
        const next = structuredClone(db.data);
        next.orders[index] = { ...order, ...action.patch };
        next.activityLog.push({ id: randomUUID(), entity: 'order', entityId: String(order.id), action: action.event,
          fromStatus: order.status, toStatus: action.patch.status, actorId: actor.id, actorName: actor.name, occurredAt: now,
          ...(action.patch.closureReason ? { reason: action.patch.closureReason } : {}) });
        await persist(next);
        return { order: next.orders[index] };
      });
      return result.error ? failure(res, result.error, result.error === 'STATUS_CONFLICT' ? 409 : 400) : res.json(result);
    } catch { failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

  registerAction('/admin/actions/quote-fulfillment', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'admin') return failure(res, 'ADMIN_REQUIRED', 403);
    try {
      const result = await serialize(async () => {
        const request = db.data.customPrintRequests.find(row => row.id === req.body?.requestId);
        if (!request) return { error: 'REQUEST_NOT_FOUND' };
        const action = prepareQuoteFulfillment(db.data, request, req.body, actor, new Date().toISOString());
        if (action.error || action.replay) return action;
        await persist(action.next);
        return { request: action.request, order: action.order };
      });
      return result.error ? failure(res, result.error, 409) : res.json(result);
    } catch { failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

}
