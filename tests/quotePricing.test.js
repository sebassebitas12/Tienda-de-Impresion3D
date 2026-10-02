import { describe, expect, it } from '@jest/globals';
import { calculateManualQuote } from '../src/utils/quotePricing.js';

const inputs = {
  material: 'PLA', weightGrams: 100, printHours: 2, filamentUsdPerKg: 20, wearUsdPerKg: 3,
  usdToCrc: 500, printerPowerWatts: 200, electricityCrcPerKwh: 100,
  postProcessMinutesPerPiece: 30, laborCrcPerHour: 3000, designHours: 1,
  designCrcPerHour: 5000, otherCostsCrc: 250, markupPercent: 10, ratesCheckedAt: '2026-09-30',
};

describe('cotizador manual FDM', () => {
  it('desglosa costos unitarios por cantidad y suma el diseño una vez por pedido', () => {
    const result = calculateManualQuote(inputs, 2);
    expect(result.breakdown).toEqual({
      materialCrc: 2000, wearCrc: 300, electricityCrc: 80, postProcessCrc: 3000,
      designCrc: 5000, otherCostsCrc: 250, costSubtotalCrc: 10630, markupPercent: 10, amountCrc: 11693,
    });
    expect(result.rulesVersion).toBe('manual-fdm-v1');
  });

  it('no calcula si faltan datos, la fecha no es válida o el material está fuera de FDM confirmado', () => {
    expect(calculateManualQuote({ ...inputs, filamentUsdPerKg: '' }, 1)).toBeNull();
    expect(calculateManualQuote({ ...inputs, ratesCheckedAt: '2026-02-30' }, 1)).toBeNull();
    expect(calculateManualQuote({ ...inputs, material: 'Resina' }, 1)).toBeNull();
    expect(calculateManualQuote({ ...inputs, designHours: 2, designCrcPerHour: 0 }, 1)).toBeNull();
    expect(calculateManualQuote(inputs, 0)).toBeNull();
  });

  it('solo exige mano de obra/diseño cuando esos trabajos tienen duración', () => {
    const noWork = { ...inputs, postProcessMinutesPerPiece: 0, laborCrcPerHour: '', designHours: 0, designCrcPerHour: '' };
    const result = calculateManualQuote(noWork, 1);
    expect(result.breakdown.postProcessCrc).toBe(0);
    expect(result.breakdown.designCrc).toBe(0);
    expect(calculateManualQuote({ ...noWork, printHours: 4 }, 1).breakdown.electricityCrc).toBe(80);
  });
});
