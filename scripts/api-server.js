import { watch } from 'node:fs';
import { readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createApp } from 'json-server/lib/app.js';
import { prepareRequestAction } from './request-actions.js';
import { installAutomationOperations } from './automation-operations.js';
import { deliverQuote } from './quote-email.js';
import { sessionActor } from './session-access.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const databasePath = resolve(root, process.env.VERTICE_DB_FILE || 'db.json');
const db = { data: null };
let persistQueue = Promise.resolve();

db.read = async () => {
  await persistQueue;
  db.data = JSON.parse(await readFile(databasePath, 'utf8'));
};

db.write = () => {
  const snapshot = JSON.stringify(db.data, null, 2) + '\n';
  const write = persistQueue.then(async () => {
    const temporaryPath = `${databasePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporaryPath, snapshot, { flag: 'wx' });
      for (let attempt = 0; ; attempt += 1) {
        try {
          await rename(temporaryPath, databasePath);
          break;
        } catch (error) {
          if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 5) throw error;
          await new Promise(resolve => setTimeout(resolve, 20 * (attempt + 1)));
        }
      }
    } catch (error) {
      await unlink(temporaryPath).catch(() => undefined);
      throw error;
    }
  });
  persistQueue = write.catch(() => undefined);
  return write;
};

await db.read();

if (!db.data.customPrintRequests || !db.data.activityLog) {
  throw new Error('db.json debe incluir customPrintRequests y activityLog.');
}

const app = createApp(db);
let reviewQueue = Promise.resolve();

function serializeReviewAction(action) {
  const result = reviewQueue.then(action);
  reviewQueue = result.catch(() => undefined);
  return result;
}

function registerAction(path, handler) {
  app.post(path, handler);
  const route = app.middleware.pop();
  const fallbackIndex = app.middleware.findIndex(middleware => middleware.type === 'mw' && middleware.path === '/:name');
  if (!route || fallbackIndex < 0) throw new Error('No se pudo instalar la operación administrativa.');
  app.middleware.splice(fallbackIndex, 0, route);
}

registerAction('/admin/actions/start-review', async (req, res) => {
  const { requestId, actorId, expectedStatus } = req.body || {};

  if (typeof requestId !== 'string' || !requestId || typeof actorId !== 'string' || expectedStatus !== 'PENDING_QUOTE') {
    res.status(400).json({ code: 'INVALID_ACTION' });
    return;
  }

  try {
    const result = await serializeReviewAction(async () => {
      const actor = sessionActor(req.headers.authorization, db.data);
      if (actor?.role !== 'admin' || String(actor.id) !== actorId) return { status: 403, body: { code: 'ADMIN_REQUIRED' } };

      const index = db.data.customPrintRequests.findIndex(request => String(request.id) === requestId);
      if (index < 0) return { status: 404, body: { code: 'REQUEST_NOT_FOUND' } };

      const request = db.data.customPrintRequests[index];
      if (request.status !== expectedStatus) {
        return { status: 409, body: { code: 'STATUS_CONFLICT', currentStatus: request.status } };
      }

      const occurredAt = new Date().toISOString();
      const event = {
        id: randomUUID(),
        entity: 'customPrintRequest',
        entityId: String(request.id),
        action: 'REQUEST_REVIEW_STARTED',
        fromStatus: 'PENDING_QUOTE',
        toStatus: 'IN_REVIEW',
        actorId: String(actor.id),
        actorName: actor.name,
        occurredAt,
      };

      const previousData = db.data;
      const nextData = structuredClone(previousData);
      nextData.customPrintRequests[index] = {
        ...request,
        status: 'IN_REVIEW',
        reviewStartedAt: occurredAt,
        reviewStartedBy: String(actor.id),
        updatedAt: occurredAt,
      };
      nextData.activityLog.push(event);
      db.data = nextData;

      try {
        await db.write();
      } catch (error) {
        db.data = previousData;
        throw error;
      }

      return { status: 200, body: { request: nextData.customPrintRequests[index], event } };
    });

    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' });
  }
});

// json-server ends with a `/:name` middleware that would otherwise match the
// first segment of this nested path and return 404 before the custom route.
registerAction('/admin/actions/request-transition', async (req, res) => {
  const payload = req.body || {};
  if (typeof payload.requestId !== 'string' || typeof payload.actorId !== 'string') return res.status(400).json({ code: 'INVALID_ACTION' });
  if (payload.action === 'email-quote-sent' || payload.action === 'publish-quote') return res.status(400).json({ code: 'INVALID_ACTION' });
  try {
    const result = await serializeReviewAction(async () => {
      const actor = sessionActor(req.headers.authorization, db.data);
      if (actor?.role !== 'admin' || String(actor.id) !== payload.actorId) return { status: 403, body: { code: 'ADMIN_REQUIRED' } };
      const index = db.data.customPrintRequests.findIndex(request => String(request.id) === payload.requestId);
      if (index < 0) return { status: 404, body: { code: 'REQUEST_NOT_FOUND' } };
      const request = db.data.customPrintRequests[index];
      const occurredAt = new Date().toISOString();
      const action = prepareRequestAction(request, payload, occurredAt);
      if (action.error) return { status: action.error === 'STATUS_CONFLICT' ? 409 : 400, body: { code: action.error } };
      const previousData = db.data;
      const nextData = structuredClone(previousData);
      nextData.customPrintRequests[index] = { ...request, ...action.patch, updatedAt: occurredAt };
      const event = { id: randomUUID(), entity: 'customPrintRequest', entityId: String(request.id), action: action.event,
        fromStatus: request.status, toStatus: action.patch.status, actorId: String(actor.id), actorName: actor.name, occurredAt };
      nextData.activityLog.push(event);
      db.data = nextData;
      try { await db.write(); } catch (error) { db.data = previousData; throw error; }
      return { status: 200, body: { request: nextData.customPrintRequests[index], event } };
    });
    res.status(result.status).json(result.body);
  } catch { res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' }); }
});

registerAction('/admin/actions/send-quote-email', async (req, res) => {
  const payload = req.body || {};
  const actor = sessionActor(req.headers.authorization, db.data);
  if (actor?.role !== 'admin') return res.status(403).json({ code: 'ADMIN_REQUIRED' });
  if (typeof payload.requestId !== 'string' || payload.expectedStatus !== 'QUOTED' || !Number.isSafeInteger(payload.expectedVersion)) return res.status(400).json({ code: 'INVALID_ACTION' });
  try {
    const result = await serializeReviewAction(() => deliverQuote({
      data: db.data, requestId: payload.requestId, actor, expectedVersion: payload.expectedVersion,
      testRecipient: payload.testRecipient, persist: persistData,
    }));
    return res.status(result.status).json(result.body);
  } catch { return res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' }); }
});

async function persistData(nextData) {
  const previous = db.data;
  db.data = nextData;
  try { await db.write(); } catch (error) { db.data = previous; throw error; }
}

const port = Number(process.env.PORT || 3000);
installAutomationOperations({ registerAction, db, serialize: serializeReviewAction,
  persist: persistData,
});
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`JSON Server + operaciones Vértice en http://${host}:${port}`);
});

watch(dirname(databasePath), (event, filename) => {
  if (filename && String(filename) === basename(databasePath)) {
    db.read().catch(error => console.error('No se pudo recargar db.json:', error));
  }
});
