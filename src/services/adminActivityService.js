const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

export class AdminActivityError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminActivityError';
    this.cause = cause;
  }
}

export async function getAdminActivity({ signal, requestId, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminActivityError('No hay una conexión disponible con JSON Server.');
  try {
    const response = await fetchImpl(`${baseUrl}/activityLog`, { signal });
    if (!response.ok) throw new AdminActivityError(`JSON Server respondió ${response.status} al consultar activityLog.`);
    const events = await response.json();
    if (!Array.isArray(events)) throw new AdminActivityError('La respuesta de activityLog no es una lista válida.');
    return events
      .filter(event => !requestId || (event.entity === 'customPrintRequest' && String(event.entityId) === String(requestId)))
      .sort((a, b) => Date.parse(b.occurredAt || '') - Date.parse(a.occurredAt || ''));
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof AdminActivityError) throw error;
    throw new AdminActivityError('No pudimos leer el historial de Admin.', error);
  }
}
