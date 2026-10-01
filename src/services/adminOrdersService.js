const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

export class AdminOrdersError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminOrdersError';
    this.cause = cause;
  }
}

async function readCollection(name, { signal, fetchImpl, baseUrl }) {
  const response = await fetchImpl(`${baseUrl}/${name}`, { signal });
  if (!response.ok) throw new AdminOrdersError(`JSON Server respondió ${response.status} al consultar ${name}.`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new AdminOrdersError(`La respuesta de ${name} no es una lista válida.`);
  return data;
}

export async function getAdminOrdersData({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminOrdersError('No hay una conexión disponible con JSON Server.');
  try {
    const [orders, orderItems, products, users] = await Promise.all([
      readCollection('orders', { signal, fetchImpl, baseUrl }),
      readCollection('orderItems', { signal, fetchImpl, baseUrl }),
      readCollection('products', { signal, fetchImpl, baseUrl }),
      readCollection('users', { signal, fetchImpl, baseUrl }),
    ]);
    return { orders, orderItems, products, users };
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof AdminOrdersError) throw error;
    throw new AdminOrdersError('No pudimos leer los pedidos de Admin.', error);
  }
}
