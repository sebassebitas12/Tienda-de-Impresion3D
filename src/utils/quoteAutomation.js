import { calculateManualQuote, FDM_MATERIALS } from './quotePricing.js';

// Authorized academic simulation. These are analogues, not measurements from photos.
export const DEMO_COSTS = Object.freeze({
  version: 'demo-fdm-2026-10-v1', usdToCrc: 460.73, electricityCrcPerKwh: 95,
  laborCrcPerHour: 3000, designCrcPerHour: 6000, markupPercent: 55,
  materials: {
    PLA: { filamentUsdPerKg: 22, wearUsdPerKg: 2, printerPowerWatts: 100, timeFactor: 1 },
    PETG: { filamentUsdPerKg: 26, wearUsdPerKg: 3, printerPowerWatts: 120, timeFactor: 1.12 },
    ABS: { filamentUsdPerKg: 25, wearUsdPerKg: 4, printerPowerWatts: 150, timeFactor: 1.08 },
    ASA: { filamentUsdPerKg: 32, wearUsdPerKg: 5, printerPowerWatts: 160, timeFactor: 1.12 },
    TPU: { filamentUsdPerKg: 35, wearUsdPerKg: 4, printerPowerWatts: 100, timeFactor: 1.7 },
  },
});

export const DEMO_PROFILES = [
  ['organizador', 'Organizador modular', 'producto-organizador-cajones.jpg', 150, 4.5, 12, ['organizador', 'herramienta', 'cajon']],
  ['llavero', 'Llavero personalizado', 'producto-llavero-charm.jpg', 18, 0.65, 5, ['llavero', 'charm']],
  ['maceta', 'Maceta decorativa', 'producto-maceta-escultural.jpg', 140, 4, 10, ['maceta']],
  ['engranaje', 'Engranaje de prototipo', 'producto-engranaje.jpg', 65, 1.8, 8, ['engranaje']],
  ['celular', 'Soporte para celular', 'producto-soporte-celular.jpg', 80, 2.5, 8, ['celular']],
  ['laptop', 'Soporte para laptop', 'producto-soporte-laptop.jpg', 260, 7, 15, ['laptop']],
  ['control', 'Base para control', 'producto-base-control.jpg', 110, 3.5, 8, ['control']],
  ['brazo', 'Brazo articulado de mesa', 'producto-brazo-articulado.jpg', 220, 7.5, 20, ['brazo articulado']],
  ['carcasa', 'Carcasa electrónica', 'producto-carcasa-raspberry.jpg', 65, 2.2, 12, ['carcasa', 'raspberry']],
  ['clips', 'Clips de cables', 'producto-clips-cables.jpg', 15, 0.5, 4, ['clip', 'cable']],
  ['bolsas', 'Dispensador de bolsas', 'producto-dispensador-bolsas.jpg', 75, 2.5, 8, ['dispensador', 'bolsa']],
  ['cubiertos', 'Escurridor para cubiertos', 'producto-escurridor-cubiertos.jpg', 170, 5, 12, ['cubierto', 'escurridor']],
  ['llaves', 'Ganchos para llaves', 'producto-ganchos-llaves.jpg', 70, 2, 8, ['gancho', 'llaves']],
  ['letrero', 'Letrero de escritorio', 'producto-letrero-escritorio.jpg', 80, 2.8, 15, ['letrero']],
  ['patas', 'Patas niveladoras', 'producto-patas-niveladoras.jpg', 35, 1.1, 6, ['niveladora', 'pata']],
  ['regleta', 'Soporte para regleta', 'producto-soporte-regleta.jpg', 65, 2.2, 8, ['regleta']],
  ['dados', 'Torre para dados', 'producto-torre-dados.jpg', 200, 6, 15, ['dado', 'torre']],
  ['llanta', 'Neumático a escala', 'llanta_pirelli_editada.jpg', 90, 3.5, 12, ['llanta', 'neumatico']],
  ['mascara', 'Máscara decorativa', 'mascara_calavera_editada.jpg', 190, 6.5, 25, ['mascara', 'calavera']],
  ['oni', 'Soporte decorativo Oni', 'soporte_oni_editado.jpg', 150, 5, 18, ['oni']],
  ['dragon', 'Figura articulada', 'producto-dragon.jpg', 180, 5.5, 15, ['dragon', 'figura']],
  ['maqueta', 'Maqueta arquitectónica', 'producto-maqueta.jpg', 240, 9, 30, ['maqueta']],
  ['soporte', 'Soporte funcional pequeño', 'hero-soporte.jpg', 85, 2.8, 10, ['soporte', 'prototipo']],
].map(([id, name, image, weightGrams, printHours, postProcessMinutes, keywords]) => ({
  id, name, image: `/images/${image}`, weightGrams, printHours, postProcessMinutes, keywords, source: 'DEMO',
}));

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function resolveDemoProfile({ profileId, description, fileName } = {}) {
  if (profileId) return DEMO_PROFILES.find(profile => profile.id === profileId) || null;
  const text = normalize(`${description || ''} ${fileName || ''}`);
  return DEMO_PROFILES.find(profile => profile.keywords.some(keyword => text.includes(keyword))) || null;
}

export function calculateAutomaticDemoQuote(request, rates = {}, now = new Date().toISOString()) {
  if (!request || !Number.isSafeInteger(Number(request.quantity)) || Number(request.quantity) < 1 || Number(request.quantity) > 100) {
    return { error: 'INVALID_QUANTITY' };
  }
  const text = normalize(request.description);
  if (/\b(?:medic\w*|ortoped\w*|ferula\w*|implante\w*|alimento\w*|estructural\w*|frenos|armas?)\b/.test(text)) return { error: 'WORKSHOP_EXCEPTION' };
  const profile = resolveDemoProfile(request);
  if (!profile) return { error: 'PROFILE_REQUIRED' };
  const material = String(request.material || 'PLA').toUpperCase();
  if (!FDM_MATERIALS.includes(material)) return { error: 'MATERIAL_UNSUPPORTED' };
  const sizeScale = Number(request.sizeScale ?? 1);
  if (!Number.isFinite(sizeScale) || sizeScale < 0.5 || sizeScale > 2) return { error: 'INVALID_SCALE' };
  const costs = DEMO_COSTS.materials[material];
  const designHours = request.sourceType === 'DESIGN_HELP' || request.needsDesign === true ? 0.75 : 0;
  const inputs = {
    material,
    weightGrams: Math.round(profile.weightGrams * sizeScale ** 3 * 100) / 100,
    printHours: Math.round(profile.printHours * costs.timeFactor * sizeScale ** 3 * 100) / 100,
    ...costs,
    usdToCrc: Number(rates.usdToCrc) > 0 ? Number(rates.usdToCrc) : DEMO_COSTS.usdToCrc,
    electricityCrcPerKwh: Number(rates.electricityCrcPerKwh) > 0 ? Number(rates.electricityCrcPerKwh) : DEMO_COSTS.electricityCrcPerKwh,
    postProcessMinutesPerPiece: Math.round(profile.postProcessMinutes * sizeScale),
    laborCrcPerHour: DEMO_COSTS.laborCrcPerHour,
    designHours, designCrcPerHour: DEMO_COSTS.designCrcPerHour,
    otherCostsCrc: 0, markupPercent: DEMO_COSTS.markupPercent, ratesCheckedAt: now.slice(0, 10),
  };
  delete inputs.timeFactor;
  const quote = calculateManualQuote(inputs, Number(request.quantity));
  if (!quote) return { error: 'INVALID_QUOTE' };
  return {
    ...quote, rulesVersion: DEMO_COSTS.version, mode: 'DEMO', profileId: profile.id,
    provenance: {
      slicing: 'DEMO_ANALOGUE', costs: 'DEMO',
      exchange: rates.exchangeSource || 'DEMO', exchangeDate: rates.exchangeDate || null,
      electricity: rates.electricitySource || 'DEMO', electricityReference: rates.electricityReference || null,
    },
    profile: { id: profile.id, name: profile.name, image: profile.image },
    validUntil: new Date(Date.parse(now) + 7 * 86400000).toISOString().slice(0, 10),
    notes: `SIMULACIÓN DEMO. Perfil análogo: ${profile.name}; ${request.quantity} pieza(s) en ${material}. Peso, tiempo, desgaste y mano de obra simulados; no se midieron desde una imagen o STL. Diseño: ${designHours} h. No incluye envío, impuestos ni certificación de uso. No autoriza producción ni cobros reales.`,
  };
}
