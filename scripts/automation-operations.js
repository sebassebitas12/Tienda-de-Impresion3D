import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { DEMO_PROFILES, calculateAutomaticDemoQuote } from '../src/utils/quoteAutomation.js';
import { FDM_MATERIALS } from '../src/utils/quotePricing.js';
import { sessionActor } from './session-access.js';
import { executeAssistantToolCapability, runAssistant } from './assistant-runtime.js';
import { createRatesProvider } from './quote-rates.js';
import { prepareQuoteFulfillment } from './quote-fulfillment.js';
import { parseMultipartForm } from './multipart-form.js';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
  const attachmentRoot = resolve(process.cwd(), process.env.VERTICE_ATTACHMENT_DIR || '.local-data/quote-attachments');
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

  registerAction('/quotes/submit-intake', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const parsed = parseMultipartForm(req.body, req.headers['content-type']);
    if (parsed.error) return failure(res, parsed.error);
    let payload;
    try { payload = JSON.parse(parsed.fields.payload || ''); } catch { return failure(res, 'INVALID_REQUEST'); }
    const { description, intendedUse, dimensions, material, quantity, needsDesign, referenceUrl, idempotencyKey, sourceType } = payload || {};
    let safeUrl = !referenceUrl;
    if (referenceUrl && typeof referenceUrl === 'string' && referenceUrl.length <= 500 && !/\s/.test(referenceUrl)) {
      try { const parsedUrl = new URL(referenceUrl); safeUrl = parsedUrl.protocol === 'https:' && Boolean(parsedUrl.hostname) && !parsedUrl.username && !parsedUrl.password; } catch { safeUrl = false; }
    }
    if (typeof description !== 'string' || description.trim().length < 3 || description.length > 2000 ||
        (intendedUse !== '' && intendedUse !== null && (typeof intendedUse !== 'string' || intendedUse.length > 500)) ||
        (dimensions !== '' && dimensions !== null && (typeof dimensions !== 'string' || dimensions.length > 200)) ||
        (material && !FDM_MATERIALS.includes(String(material).toUpperCase())) ||
        !Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 100 ||
        (needsDesign !== undefined && typeof needsDesign !== 'boolean') || !safeUrl ||
        typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 80 ||
        !['DESIGN_HELP', 'FILE_REFERENCE', 'FILE_UPLOAD'].includes(sourceType) || parsed.files.length > 5 ||
        parsed.files.some(file => file.field !== 'attachments' || !file.filename || file.data.length === 0 || file.data.length > 5 * 1024 * 1024)) {
      return failure(res, parsed.files.length > 5 ? 'TOO_MANY_ATTACHMENTS' : 'INVALID_REQUEST');
    }
    const allowedExtensions = new Map([['png', 'image/png'], ['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['webp', 'image/webp'], ['gif', 'image/gif'], ['stl', 'model/stl'], ['obj', 'model/obj']]);
    const filesValid = parsed.files.every(file => {
      const extension = file.filename.split('.').pop()?.toLowerCase();
      const expectedType = allowedExtensions.get(extension);
      return expectedType && (expectedType.startsWith('model/') || file.contentType === expectedType || file.contentType === 'application/octet-stream');
    });
    if (!filesValid) return failure(res, 'ATTACHMENT_TYPE_UNSUPPORTED');
    try {
      const result = await serialize(async () => {
        const duplicate = db.data.customPrintRequests.find(request => request.userId === actor.id && request.idempotencyKey === idempotencyKey);
        if (duplicate) return { request: duplicate, replay: true };
        const now = new Date().toISOString();
        const id = `rq-${randomUUID()}`;
        const directory = resolve(attachmentRoot, id);
        const stored = [];
        try {
          if (parsed.files.length) await mkdir(directory, { recursive: true });
          for (const file of parsed.files) {
            const attachmentId = randomUUID();
            const extension = file.filename.split('.').pop().toLowerCase();
            const name = file.filename.replace(/[\\/]/g, '_').replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 120) || `archivo.${extension}`;
            await writeFile(resolve(directory, attachmentId), file.data, { flag: 'wx' });
            stored.push({ id: attachmentId, name, contentType: file.contentType, size: file.data.length });
          }
          const request = { id, userId: actor.id, status: 'PENDING_QUOTE', submittedAt: now, updatedAt: now,
            description: description.trim(), intendedUse: String(intendedUse || '').trim(), dimensions: String(dimensions || '').trim(),
            material: material ? String(material).toUpperCase() : null, quantity: Number(quantity), needsDesign: Boolean(needsDesign),
            referenceUrl: referenceUrl || null, sourceType, attachments: stored, fileName: stored[0]?.name || null, idempotencyKey };
          const next = structuredClone(db.data);
          next.customPrintRequests.push(request);
          next.activityLog.push({ id: randomUUID(), entity: 'customPrintRequest', entityId: id, action: 'REQUEST_SUBMITTED', fromStatus: null,
            toStatus: 'PENDING_QUOTE', actorId: String(actor.id), actorName: actor.name, occurredAt: now });
          await persist(next);
          return { request };
        } catch (error) {
          await Promise.all(stored.map(file => unlink(resolve(directory, file.id)).catch(() => undefined)));
          throw error;
        }
      });
      return res.status(result.replay ? 200 : 201).json(result);
    } catch { return failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });

  registerAction('/quotes/attachment/read', async (req, res) => {
    const actor = actorFor(req);
    if (!actor) return failure(res, 'AUTH_REQUIRED', 401);
    const request = db.data.customPrintRequests.find(item => String(item.id) === String(req.body?.requestId));
    if (!request || (actor.role !== 'admin' && String(request.userId) !== String(actor.id))) return failure(res, 'REQUEST_NOT_FOUND', 404);
    const attachment = request.attachments?.find(item => item.id === req.body?.attachmentId);
    if (!attachment || !/^[a-f0-9-]{36}$/i.test(attachment.id) || !/^rq-[a-f0-9-]{36}$/i.test(request.id)) return failure(res, 'ATTACHMENT_NOT_FOUND', 404);
    try {
      const data = await readFile(resolve(attachmentRoot, request.id, attachment.id));
      return res.json({ name: attachment.name, contentType: attachment.contentType, data: data.toString('base64') });
    } catch { return failure(res, 'ATTACHMENT_NOT_FOUND', 404); }
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
      if (result.error) {
        const status = { ROLE_REQUIRED: 403, ASSISTANT_UNAVAILABLE: 502, ASSISTANT_TIMEOUT: 504, ASSISTANT_INVALID_RESPONSE: 502 }[result.error] || 422;
        return failure(res, result.error, status);
      }
      res.json(result);
    } catch { failure(res, 'ASSISTANT_UNAVAILABLE', 502); }
  });

  registerAction('/assistants/tools', async (req, res) => {
    const { capability, mode, name, args } = req.body || {};
    if (typeof capability !== 'string' || capability.length < 40 || capability.length > 100 ||
        !['general', 'admin', 'quote'].includes(mode) || typeof name !== 'string') {
      return failure(res, 'INVALID_TOOL_CALL');
    }
    try {
      const result = await executeAssistantToolCapability(capability, { mode, name, args });
      if (result.error) return failure(res, result.error, result.error === 'TOOL_FORBIDDEN' ? 403 : 422);
      return res.json(result);
    } catch { return failure(res, 'ASSISTANT_TOOL_FAILED', 500); }
  });

  registerAction('/quotes/create', async (req, res) => {
    const actor = actorFor(req);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    return failure(res, 'ENDPOINT_RETIRED_USE_SUBMIT_INTAKE', 410);
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
