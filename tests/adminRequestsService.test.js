import { describe, expect, it, jest } from '@jest/globals';
import { getAdminRequestsData } from '../src/services/adminOverviewService.js';

describe('getAdminRequestsData', () => {
  it('lee solicitudes y usuarios sin cargar pedidos', async () => {
    const fetchImpl = jest.fn(async url => ({ ok: true, json: async () => url.endsWith('/users') ? [{ id: 'u1' }] : [{ id: 'r1' }] }));

    const data = await getAdminRequestsData({ fetchImpl, baseUrl: 'http://local' });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls.map(([url]) => url).sort()).toEqual(['http://local/customPrintRequests', 'http://local/users']);
    expect(data).toEqual({ customPrintRequests: [{ id: 'r1' }], users: [{ id: 'u1' }] });
  });

  it('rechaza colecciones que no sean listas', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ invalid: true }) }));

    await expect(getAdminRequestsData({ fetchImpl, baseUrl: 'http://local' })).rejects.toThrow('no es una lista válida');
  });
});
