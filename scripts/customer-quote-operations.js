import { randomUUID } from 'node:crypto';
import { sessionActor } from './session-access.js';

const CUSTOMER_DECISIONS = new Set(['APPROVED', 'CHANGES_REQUESTED', 'REJECTED']);

export function prepareCustomerQuoteDecision(request, actor, payload, now) {
  if (actor?.role !== 'customer') return { error: 'CUSTOMER_REQUIRED' };
  if (!request || String(request.userId) !== String(actor.id)) return { error: 'REQUEST_NOT_FOUND' };
  if (request.status !== 'AWAITING_APPROVAL' || !Number.isSafeInteger(payload?.expectedVersion)
    || (request.quoteVersion || 0) !== payload.expectedVersion) return { error: 'STATUS_CONFLICT' };

  const decision = payload?.decision;
  if (!CUSTOMER_DECISIONS.has(decision)) return { error: 'INVALID_DECISION' };
  const reason = typeof payload.reason === 'string' ? payload.reason.trim() : '';
  if (decision !== 'APPROVED' && (reason.length < 3 || reason.length > 500)) return { error: 'REASON_REQUIRED' };
  if (decision === 'APPROVED' && !(Date.parse(request.quoteValidUntil || '') > Date.parse(now))) return { error: 'QUOTE_EXPIRED' };

  const updated = {
    ...request,
    status: decision,
    customerResponse: decision,
    customerRespondedAt: now,
    updatedAt: now,
    ...(decision === 'APPROVED'
      ? { approvedAt: now, approvedBy: String(actor.id) }
      : { customerDecisionReason: reason }),
  };
  const event = {
    id: randomUUID(), entity: 'customPrintRequest', entityId: String(request.id),
    action: `REQUEST_CUSTOMER_${decision}`, fromStatus: request.status, toStatus: decision,
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    ...(decision !== 'APPROVED' ? { reason } : {}),
  };
  return { request: updated, event };
}

export function installCustomerQuoteOperations({ registerAction, db, serialize, persist }) {
  const failure = (res, code, status = 400) => res.status(status).json({ code });
  const respond = decisionFromPath => async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const payload = req.body || {};
    if (typeof payload.requestId !== 'string' || !payload.requestId || !Number.isSafeInteger(payload.expectedVersion)) {
      return failure(res, 'INVALID_ACTION');
    }
    const decision = decisionFromPath || payload.decision;
    const allowed = decisionFromPath ? decision === decisionFromPath && decision === 'APPROVED'
      : ['CHANGES_REQUESTED', 'REJECTED'].includes(decision);
    if (!allowed || (decisionFromPath && payload.decision !== undefined && payload.decision !== decision)) {
      return failure(res, 'INVALID_DECISION');
    }

    try {
      const result = await serialize(async () => {
        const index = db.data.customPrintRequests.findIndex(row => String(row.id) === payload.requestId);
        const request = index < 0 ? null : db.data.customPrintRequests[index];
        const now = new Date().toISOString();
        const action = prepareCustomerQuoteDecision(request, actor, { ...payload, decision }, now);
        if (action.error) return action;
        const next = structuredClone(db.data);
        next.customPrintRequests[index] = action.request;
        next.activityLog.push(action.event);
        await persist(next);
        return { request: action.request, event: action.event };
      });
      if (result.error) {
        const status = result.error === 'CUSTOMER_REQUIRED' ? 403
          : result.error === 'REQUEST_NOT_FOUND' ? 404
            : result.error === 'STATUS_CONFLICT' || result.error === 'QUOTE_EXPIRED' ? 409 : 400;
        return failure(res, result.error, status);
      }
      return res.json(result);
    } catch { return failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  };

  registerAction('/quotes/respond', respond(null));
}
