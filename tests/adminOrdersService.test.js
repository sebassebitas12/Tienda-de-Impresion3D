import { describe, expect, it, jest } from '@jest/globals';
import { getAdminOrdersData } from '../src/services/adminOrdersService.js';

describe('getAdminOrdersData', () => {
  it('lee pedidos, líneas, productos y usuarios para construir el detalle', async () => {
    const data = { orders: [{ id: 'o1' }], orderItems: [{ id: 'oi1' }], products: [{ id: 'p1' }], users: [{ id: 'u1' }] };
    const fetchImpl = jest.fn(async url => ({ ok: true, json: async () => data[url.split('/').at(-1)] }));

    await expect(getAdminOrdersData({ fetchImpl, baseUrl: 'http://local' })).resolves.toEqual(data);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(fetchImpl.mock.calls.map(([url]) => url.split('/').at(-1)).sort()).toEqual(['orderItems', 'orders', 'products', 'users']);
  });

  it('no acepta una respuesta que no sea lista', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'bad' }) }));

    await expect(getAdminOrdersData({ fetchImpl })).rejects.toThrow('no es una lista válida');
  });
});
