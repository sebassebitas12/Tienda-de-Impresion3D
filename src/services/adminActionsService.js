const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

export class AdminActionError extends Error {
  constructor(code, status) {
    super(code);
    this.name = 'AdminActionError';
    this.code = code;
    this.status = status;
  }
}

async function postAction(path, payload, { fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminActionError('CONNECTION_UNAVAILABLE');

  let response;
  try {
    response = await fetchImpl(`${baseUrl}/admin/actions/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AdminActionError('CONNECTION_UNAVAILABLE');
  }

  let body = {};
  try { body = await response.json(); } catch { /* The API may return an empty failure response. */ }
  if (!response.ok) throw new AdminActionError(body.code || 'ACTION_FAILED', response.status);
  return body;
}

export function startRequestReview({ requestId, actorId, ...options }) {
  return postAction('start-review', { requestId: String(requestId), actorId: String(actorId), expectedStatus: 'PENDING_QUOTE' }, options);
}

export function transitionRequest({ requestId, actorId, ...payload }, options) {
  return postAction('request-transition', { ...payload, requestId: String(requestId), actorId: String(actorId) }, options);
}
