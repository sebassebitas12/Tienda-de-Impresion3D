import { describe, expect, it } from '@jest/globals';
import { prepareRequestAction } from '../scripts/request-actions.js';

const time = '2026-10-01T15:00:00Z';
const payload = { action: 'save-quote', actorId: 'u1', expectedStatus: 'IN_REVIEW', expectedVersion: 0, amount: 25000, validUntil: '2026-10-10', notes: 'Cuatro piezas en PETG, entrega por coordinar.' };
describe('transiciones administrativas de cotización', () => {
  it('prepara monto total y autor sin multiplicarlo por la cantidad', () => {
    const result = prepareRequestAction({ status: 'IN_REVIEW', quantity: 4 }, payload, time);
    expect(result.patch).toMatchObject({ status: 'QUOTED', quotedPrice: 25000, quotedBy: 'u1', quoteVersion: 1 });
    expect(result.event).toBe('REQUEST_QUOTE_SAVED');
    expect(prepareRequestAction(result.patch, { action: 'publish-quote', expectedStatus: 'QUOTED', expectedVersion: 1 }, time).patch.status).toBe('AWAITING_APPROVAL');
  });
  it('rechaza duplicados, versiones atrasadas, fechas imposibles/vencidas y notas vacías', () => {
    expect(prepareRequestAction({ status: 'QUOTED' }, payload, time).error).toBe('STATUS_CONFLICT');
    expect(prepareRequestAction({ status: 'IN_REVIEW', quoteVersion: 1 }, payload, time).error).toBe('STATUS_CONFLICT');
    ['2026-02-30', '2026-99-99', '2026-09-01', ''].forEach(validUntil => expect(prepareRequestAction({ status: 'IN_REVIEW' }, { ...payload, validUntil }, time).error).toBe('INVALID_QUOTE'));
    expect(prepareRequestAction({ status: 'IN_REVIEW' }, { ...payload, notes: ' ' }, time).error).toBe('INVALID_QUOTE');
  });
  it('incorpora únicamente SUBMITTED y conserva su estado original', () => {
    const result = prepareRequestAction({ status: 'SUBMITTED' }, { action: 'incorporate-request', expectedStatus: 'SUBMITTED' }, time);
    expect(result.patch).toEqual({ status: 'PENDING_QUOTE', originalStatus: 'SUBMITTED' });
    expect(prepareRequestAction({ status: 'UNKNOWN' }, { action: 'incorporate-request', expectedStatus: 'UNKNOWN' }, time).error).toBe('INVALID_ACTION');
  });
});
