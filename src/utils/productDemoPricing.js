import { DEMO_COSTS } from './quoteAutomation.js';
import { calculateManualQuote, FDM_MATERIALS } from './quotePricing.js';

export function calculateProductDemoPrice({ material, weightGrams, printHours, postProcessMinutes = 0 }, rates = DEMO_COSTS, now = new Date().toISOString()) {
  const normalized = String(material || '').toUpperCase();
  if (!FDM_MATERIALS.includes(normalized) || !Number.isFinite(Number(weightGrams)) || Number(weightGrams) <= 0
    || !Number.isFinite(Number(printHours)) || Number(printHours) <= 0
    || !Number.isFinite(Number(postProcessMinutes)) || Number(postProcessMinutes) < 0) return null;
  const costProfile = normalized === 'PLA SILK' ? 'PLA' : normalized;
  const costs = DEMO_COSTS.materials[costProfile];
  const quote = calculateManualQuote({
    material: normalized, weightGrams: Number(weightGrams), printHours: Number(printHours), ...costs,
    usdToCrc: rates.usdToCrc, electricityCrcPerKwh: rates.electricityCrcPerKwh,
    postProcessMinutesPerPiece: Number(postProcessMinutes), laborCrcPerHour: DEMO_COSTS.laborCrcPerHour,
    designHours: 0, designCrcPerHour: DEMO_COSTS.designCrcPerHour, otherCostsCrc: 0,
    markupPercent: DEMO_COSTS.markupPercent, ratesCheckedAt: now.slice(0, 10),
  }, 1);
  return quote ? { ...quote, mode: 'DEMO', provenance: 'DEMO_INPUTS', assumptions: { usdToCrc: rates.usdToCrc, electricityCrcPerKwh: rates.electricityCrcPerKwh, rulesVersion: DEMO_COSTS.version } } : null;
}
