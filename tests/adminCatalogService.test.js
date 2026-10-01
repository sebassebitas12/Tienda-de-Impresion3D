import { describe, expect, it, jest } from '@jest/globals';
import { createAdminProduct, deleteAdminCategory, getAdminCatalogData, getAdminCatalogReferences, updateAdminCategory, updateAdminProduct } from '../src/services/adminCatalogService.js';

describe('getAdminCatalogData', () => {
  it('lee modelos y categorías desde JSON Server', async () => {
    const data = { products: [{ id: 'p1' }], categories: [{ id: 'c1' }] };
    const fetchImpl = jest.fn(async url => ({ ok: true, json: async () => data[url.split('/').at(-1)] }));
    await expect(getAdminCatalogData({ fetchImpl, baseUrl: 'http://local' })).resolves.toEqual(data);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('rechaza una colección mal formada', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'bad' }) }));
    await expect(getAdminCatalogData({ fetchImpl })).rejects.toThrow('no es una lista válida');
  });
});

describe('mutaciones Admin del catálogo', () => {
  it('crea y actualiza productos/categorías usando el contrato REST de JSON Server', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'new' }) }));
    await createAdminProduct({ name: 'Prueba' }, { fetchImpl, baseUrl: 'http://local' });
    await updateAdminProduct('p1', { name: 'Editado' }, { fetchImpl, baseUrl: 'http://local' });
    await updateAdminCategory('c1', { name: 'Nueva' }, { fetchImpl, baseUrl: 'http://local' });
    expect(fetchImpl.mock.calls.map(([url, options]) => [url, options.method])).toEqual([
      ['http://local/products', 'POST'], ['http://local/products/p1', 'PATCH'], ['http://local/categories/c1', 'PATCH'],
    ]);
  });

  it('consulta referencias históricas y elimina categoría/modelo solo mediante sus recursos', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => [] }));
    await expect(getAdminCatalogReferences({ fetchImpl, baseUrl: 'http://local' })).resolves.toEqual([]);
    await deleteAdminCategory('c1', { fetchImpl, baseUrl: 'http://local' });
    expect(fetchImpl.mock.calls.map(([url, options]) => [url, options.method || 'GET'])).toEqual([
      ['http://local/orderItems', 'GET'], ['http://local/categories/c1', 'DELETE'],
    ]);
  });
});
