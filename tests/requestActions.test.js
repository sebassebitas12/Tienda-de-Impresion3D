import { describe, expect, it } from '@jest/globals';
import { prepareRequestAction } from '../scripts/request-actions.js';

const time = '2026-10-01T15:00:00Z';
const pricingInputs = { material: 'PETG', weightGrams: 100, printHours: 1, filamentUsdPerKg: 20, wearUsdPerKg: 5,
  usdToCrc: 500, printerPowerWatts: 200, electricityCrcPerKwh: 100, postProcessMinutesPerPiece: 10,
  laborCrcPerHour: 3000, designHours: 2, designCrcPerHour: 5000, otherCostsCrc: 1000, markupPercent: 20, ratesCheckedAt: '2026-09-30' };
const payload = { action: 'save-quote', actorId: 'u1', expectedStatus: 'IN_REVIEW', expectedVersion: 0, pricingInputs, validUntil: '2026-10-10', notes: 'Cuatro piezas en PETG, entrega por coordinar.' };
describe('transiciones administrativas de cotización', () => {
  it('recalcula en el servidor, multiplica los valores unitarios por cantidad y guarda desglose', () => {
    const result = prepareRequestAction({ status: 'IN_REVIEW', quantity: 4 }, payload, time);
    expect(result.patch).toMatchObject({ status: 'QUOTED', quotedPrice: 21696, quotedBy: 'u1', quoteVersion: 1,
      quotePricing: { rulesVersion: 'manual-fdm-v1', breakdown: { materialCrc: 4000, wearCrc: 1000, electricityCrc: 80, postProcessCrc: 2000, designCrc: 10000, otherCostsCrc: 1000, costSubtotalCrc: 18080, amountCrc: 21696 } } });
    expect(result.event).toBe('REQUEST_QUOTE_SAVED');
    const sent = prepareRequestAction(result.patch, { action: 'email-quote-sent', expectedStatus: 'QUOTED', expectedVersion: 1 }, time);
    expect(sent.patch).toMatchObject({ status: 'AWAITING_APPROVAL', quoteEmailSentAt: time });
    expect(sent.event).toBe('REQUEST_QUOTE_EMAIL_SENT');
    expect(prepareRequestAction(result.patch, { action: 'publish-quote', expectedStatus: 'QUOTED', expectedVersion: 1 }, time).error).toBe('INVALID_ACTION');
  });
  it('rechaza duplicados, versiones atrasadas, fechas imposibles/vencidas y notas vacías', () => {
    expect(prepareRequestAction({ status: 'QUOTED' }, payload, time).error).toBe('STATUS_CONFLICT');
    expect(prepareRequestAction({ status: 'IN_REVIEW', quoteVersion: 1 }, payload, time).error).toBe('STATUS_CONFLICT');
    ['2026-02-30', '2026-99-99', '2026-09-01', ''].forEach(validUntil => expect(prepareRequestAction({ status: 'IN_REVIEW' }, { ...payload, validUntil }, time).error).toBe('INVALID_QUOTE'));
    expect(prepareRequestAction({ status: 'IN_REVIEW' }, { ...payload, notes: ' ' }, time).error).toBe('INVALID_QUOTE');
    expect(prepareRequestAction({ status: 'IN_REVIEW', quantity: 4 }, { ...payload, pricingInputs: { ...pricingInputs, usdToCrc: 0 } }, time).error).toBe('INVALID_QUOTE');
  });
  it('incorpora únicamente SUBMITTED y conserva su estado original', () => {
    const result = prepareRequestAction({ status: 'SUBMITTED' }, { action: 'incorporate-request', expectedStatus: 'SUBMITTED' }, time);
    expect(result.patch).toEqual({ status: 'PENDING_QUOTE', originalStatus: 'SUBMITTED' });
    expect(prepareRequestAction({ status: 'UNKNOWN' }, { action: 'incorporate-request', expectedStatus: 'UNKNOWN' }, time).error).toBe('INVALID_ACTION');
  });
});
