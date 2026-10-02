import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { AdminActionError, sendQuoteEmail } from '../src/services/adminActionsService.js';

describe('envío de cotizaciones desde Admin', () => {
  afterEach(() => jest.restoreAllMocks());

  it('manda al API solo la referencia, actor y versión de la cotización', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ request: { status: 'AWAITING_APPROVAL' } }) });
    await sendQuoteEmail({ requestId: 'r2', actorId: 'u1', expectedVersion: 3 }, { fetchImpl, baseUrl: 'http://localhost:3000' });
    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:3000/admin/actions/send-quote-email', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ requestId: 'r2', actorId: 'u1', expectedStatus: 'QUOTED', expectedVersion: 3 }),
    }));
  });

  it('preserva el código explícito del API cuando no se pudo configurar el correo', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ code: 'QUOTE_EMAIL_NOT_CONFIGURED' }) });
    await expect(sendQuoteEmail({ requestId: 'r2', actorId: 'u1', expectedVersion: 3 }, { fetchImpl, baseUrl: 'http://localhost:3000' }))
      .rejects.toMatchObject(new AdminActionError('QUOTE_EMAIL_NOT_CONFIGURED', 503));
  });
});
