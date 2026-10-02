import process from 'node:process';
import { DEMO_COSTS } from '../src/utils/quoteAutomation.js';

export const RATE_SOURCES = {
  exchange: 'https://api.hacienda.go.cr/indicadores/tc/dolar',
  electricity: 'https://datos.aresep.go.cr/ws.datosabiertos/Services/IE/TarifasElectricidad.svc/ObtenerTarifasElectricidadDistribucion/0',
};

export function normalizeExchange(data, now = new Date().toISOString()) {
  const value = Number(data?.venta?.valor);
  const date = data?.venta?.fecha;
  const age = Date.parse(now.slice(0, 10)) - Date.parse(date);
  if (!Number.isFinite(value) || value <= 0 || value > 5000 || !/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !Number.isFinite(age) || new Date(date).toISOString().slice(0, 10) !== date || age < 0 || age > 7 * 86400000) return null;
  return { usdToCrc: value, exchangeDate: date, exchangeSource: RATE_SOURCES.exchange };
}

export function selectElectricity(data, selection, now = new Date().toISOString()) {
  if (!selection?.company || !selection?.tariff || !selection?.block || !Array.isArray(data?.value)) return null;
  const matches = data.value.filter(row => row && row.empresa === selection.company && row.tipoTarifa === selection.tariff && String(row.bloque || '').trim() === selection.block.trim()
    && Number(row.anho) === Number(now.slice(0, 4)) && Number(row.id_Mes) === Number(now.slice(5, 7))
    && /kWh/i.test(row.bloque) && !/cargo fijo|\bkW\b/i.test(row.bloque) && Number(row.tarifaPromedio) > 0 && Number(row.tarifaPromedio) < 2000);
  if (matches.length !== 1) return null;
  const row = matches[0];
  return { electricityCrcPerKwh: Number(row.tarifaPromedio), electricitySource: RATE_SOURCES.electricity,
    electricityReference: { company: row.empresa, tariff: row.tipoTarifa, block: row.bloque, resolution: row.numeroResolucion, year: row.anho, month: row.id_Mes } };
}

export function createRatesProvider({ fetchImpl = globalThis.fetch, env = process.env, now = () => new Date().toISOString() } = {}) {
  let cached;
  let pending;
  return async function getRates({ force = false } = {}) {
    if (!force && cached && Date.parse(now()) - cached.fetchedAt < 3600000) return cached.value;
    if (pending) return pending;
    pending = (async () => {
      const value = { usdToCrc: DEMO_COSTS.usdToCrc, electricityCrcPerKwh: DEMO_COSTS.electricityCrcPerKwh,
        exchangeSource: 'DEMO', electricitySource: 'DEMO', warnings: [] };
      const selection = { company: env.VERTICE_ELECTRICITY_COMPANY, tariff: env.VERTICE_ELECTRICITY_TARIFF, block: env.VERTICE_ELECTRICITY_BLOCK };
      try {
        const response = await fetchImpl(env.VERTICE_RATES_WEBHOOK_URL || 'http://localhost:5678/webhook/vertice-rates', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Vertice-Webhook-Token': env.VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN || '' },
          body: JSON.stringify({ selection, date: now().slice(0, 10) }), signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new Error('rates');
        const body = await response.json();
        const data = Array.isArray(body) ? body[0] : body;
        const exchange = normalizeExchange(data.exchange, now());
        if (exchange) Object.assign(value, exchange);
        const electricity = selectElectricity(data.electricity, selection, now());
        if (electricity) Object.assign(value, electricity);
      } catch { value.warnings.push('RATE_WORKFLOW_UNAVAILABLE'); }
      if (value.exchangeSource === 'DEMO') value.warnings.push('DEMO_EXCHANGE');
      if (value.electricitySource === 'DEMO') value.warnings.push('DEMO_ELECTRICITY');
      cached = { fetchedAt: Date.parse(now()), value };
      return value;
    })();
    try { return await pending; } finally { pending = null; }
  };
}
