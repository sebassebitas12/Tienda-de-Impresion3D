import { describe, expect, it, jest } from '@jest/globals';
import { getAdminActivity } from '../src/services/adminActivityService.js';

const events = [
  { id: 'e1', entity: 'customPrintRequest', entityId: 'r1', action: 'REQUEST_REVIEW_STARTED', occurredAt: '2026-09-01T10:00:00Z' },
  { id: 'e2', entity: 'customPrintRequest', entityId: 'r2', action: 'REQUEST_REVIEW_STARTED', occurredAt: '2026-09-03T10:00:00Z' },
];

describe('getAdminActivity', () => {
  it('lee activityLog y ordena lo más reciente primero', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => events }));

    await expect(getAdminActivity({ fetchImpl, baseUrl: 'http://local' })).resolves.toEqual([events[1], events[0]]);
    expect(fetchImpl).toHaveBeenCalledWith('http://local/activityLog', { signal: undefined });
  });

  it('permite limitar el historial al entityId de una solicitud', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => events }));

    await expect(getAdminActivity({ requestId: 'r1', fetchImpl, baseUrl: 'http://local' })).resolves.toEqual([events[0]]);
  });

  it('falla si activityLog no es una colección', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'e1' }) }));

    await expect(getAdminActivity({ fetchImpl })).rejects.toThrow('no es una lista válida');
  });
});
