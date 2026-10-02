const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

export class AdminCustomersError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminCustomersError';
    this.cause = cause;
  }
}

async function readCollection(name, { signal, fetchImpl, baseUrl }) {
  const response = await fetchImpl(`${baseUrl}/${name}`, { signal });
  if (!response.ok) throw new AdminCustomersError(`JSON Server respondió ${response.status} al consultar ${name}.`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new AdminCustomersError(`La respuesta de ${name} no es una lista válida.`);
  return data;
}

export async function getAdminCustomersData({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminCustomersError('No hay una conexión disponible con JSON Server.');
  try {
    const [users, orders, customPrintRequests] = await Promise.all([
      readCollection('users', { signal, fetchImpl, baseUrl }),
      readCollection('orders', { signal, fetchImpl, baseUrl }),
      readCollection('customPrintRequests', { signal, fetchImpl, baseUrl }),
    ]);
    return { users, orders, customPrintRequests };
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof AdminCustomersError) throw error;
    throw new AdminCustomersError('No pudimos leer los clientes de Admin.', error);
  }
}
