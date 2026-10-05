import { describe, expect, it } from '@jest/globals';
import { calculateProductDemoPrice } from '../src/utils/productDemoPricing.js';

describe('sugerencia DEMO para precio de catálogo', () => {
  it('calcula desglose unitario solo a partir de material, gramos, horas y postprocesado explícitos', () => {
    const quote = calculateProductDemoPrice({ material: 'PETG', weightGrams: 45, printHours: 2, postProcessMinutes: 10 }, undefined, '2026-10-03T12:00:00.000Z');
    expect(quote.mode).toBe('DEMO');
    expect(quote.quantity).toBe(1);
    expect(quote.inputs.weightGrams).toBe(45);
    expect(quote.inputs.printHours).toBe(2);
    expect(quote.breakdown.amountCrc).toBeGreaterThan(quote.breakdown.costSubtotalCrc);
    expect(quote.breakdown.postProcessCrc).toBe(500);
    expect(quote.provenance).toBe('DEMO_INPUTS');
  });

  it('no intenta deducir peso/tiempo si faltan o son cero', () => {
    expect(calculateProductDemoPrice({ material: 'PETG', weightGrams: '', printHours: 2 })).toBeNull();
    expect(calculateProductDemoPrice({ material: 'TPU', weightGrams: 25, printHours: 0 })).toBeNull();
  });

  it('reutiliza el perfil base de PLA para la variante PLA Silk', () => {
    const quote = calculateProductDemoPrice({ material: 'PLA Silk', weightGrams: 100, printHours: 2 });
    expect(quote?.mode).toBe('DEMO');
    expect(quote?.inputs.material).toBe('PLA SILK');
  });
});
