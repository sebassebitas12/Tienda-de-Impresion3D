const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  return globalThis.__VERTICE_JSON_SERVER_URL__ || DEFAULT_BASE_URL;
}

export class AdminCatalogError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminCatalogError';
    this.cause = cause;
  }
}

async function readCollection(name, { signal, fetchImpl, baseUrl }) {
  const response = await fetchImpl(`${baseUrl}/${name}`, { signal });
  if (!response.ok) throw new AdminCatalogError(`JSON Server respondió ${response.status} al consultar ${name}.`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new AdminCatalogError(`La respuesta de ${name} no es una lista válida.`);
  return data;
}

export async function getAdminCatalogData({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminCatalogError('No hay una conexión disponible con JSON Server.');
  try {
    const [products, categories] = await Promise.all([
      readCollection('products', { signal, fetchImpl, baseUrl }),
      readCollection('categories', { signal, fetchImpl, baseUrl }),
    ]);
    return { products, categories };
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof AdminCatalogError) throw error;
    throw new AdminCatalogError('No pudimos leer el catálogo de Admin.', error);
  }
}

export class AdminCatalogMutationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AdminCatalogMutationError';
    this.cause = cause;
  }
}

async function mutateCollection(collection, id, method, payload, { fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  if (typeof fetchImpl !== 'function') throw new AdminCatalogMutationError('No hay conexión con JSON Server.');
  const url = `${baseUrl}/${collection}${id == null ? '' : `/${encodeURIComponent(id)}`}`;
  try {
    const response = await fetchImpl(url, {
      method,
      headers: payload ? { 'Content-Type': 'application/json' } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!response.ok) throw new AdminCatalogMutationError(`JSON Server respondió ${response.status} al guardar ${collection}.`);
    if (method === 'DELETE') return null;
    return response.json();
  } catch (error) {
    if (error instanceof AdminCatalogMutationError) throw error;
    throw new AdminCatalogMutationError('No pudimos guardar los cambios del catálogo.', error);
  }
}

export const createAdminProduct = (product, options) => mutateCollection('products', null, 'POST', product, options);
export const updateAdminProduct = (id, product, options) => mutateCollection('products', id, 'PATCH', product, options);
export const deleteAdminProduct = (id, options) => mutateCollection('products', id, 'DELETE', null, options);
export const createAdminCategory = (category, options) => mutateCollection('categories', null, 'POST', category, options);
export const updateAdminCategory = (id, category, options) => mutateCollection('categories', id, 'PATCH', category, options);
export const deleteAdminCategory = (id, options) => mutateCollection('categories', id, 'DELETE', null, options);

export async function getAdminCatalogReferences({ signal, fetchImpl = globalThis.fetch, baseUrl = getBaseUrl() } = {}) {
  return readCollection('orderItems', { signal, fetchImpl, baseUrl });
}
