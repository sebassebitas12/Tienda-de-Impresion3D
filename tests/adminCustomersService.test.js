import { describe, expect, it, jest } from '@jest/globals';
import { getAdminCustomersData } from '../src/services/adminCustomersService.js';

describe('getAdminCustomersData', () => {
  it('lee cuentas, pedidos y solicitudes para la vista de clientes', async () => {
    const data = { users: [{ id: 'u1' }], orders: [{ id: 'o1' }], customPrintRequests: [{ id: 'r1' }] };
    const fetchImpl = jest.fn(async url => ({ ok: true, json: async () => data[url.split('/').at(-1)] }));
    await expect(getAdminCustomersData({ fetchImpl, baseUrl: 'http://local' })).resolves.toEqual(data);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('rechaza respuestas de colección inválidas', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'u1' }) }));
    await expect(getAdminCustomersData({ fetchImpl })).rejects.toThrow('no es una lista válida');
  });
});
