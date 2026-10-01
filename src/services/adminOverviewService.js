const DEFAULT_BASE_URL = 'http://localhost:3000';

export class AdminOverviewError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminOverviewError';
    this.cause = cause;
  }
}

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

async function readCollection(name, { signal, fetchImpl, baseUrl }) {
  const response = await fetchImpl(`${baseUrl}/${name}`, { signal });
  if (!response.ok) throw new AdminOverviewError(`JSON Server respondió ${response.status} al consultar ${name}.`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new AdminOverviewError(`La respuesta de ${name} no es una lista válida.`);
  return data;
}

export async function getAdminOverviewData({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminOverviewError('No hay una conexión disponible con JSON Server.');
  try {
    const [orders, customPrintRequests, users] = await Promise.all([
      readCollection('orders', { signal, fetchImpl, baseUrl }),
      readCollection('customPrintRequests', { signal, fetchImpl, baseUrl }),
      readCollection('users', { signal, fetchImpl, baseUrl }),
    ]);
    return { orders, customPrintRequests, users };
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    if (error instanceof AdminOverviewError) throw error;
    throw new AdminOverviewError('No pudimos leer los datos académicos de Admin.', error);
  }
}

export async function getAdminRequestsData({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminOverviewError('No hay una conexión disponible con JSON Server.');
  try {
    const [customPrintRequests, users] = await Promise.all([
      readCollection('customPrintRequests', { signal, fetchImpl, baseUrl }),
      readCollection('users', { signal, fetchImpl, baseUrl }),
    ]);
    return { customPrintRequests, users };
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    if (error instanceof AdminOverviewError) throw error;
    throw new AdminOverviewError('No pudimos leer las solicitudes de Admin.', error);
  }
}
