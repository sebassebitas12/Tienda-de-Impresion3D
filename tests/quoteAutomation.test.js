/** @jest-environment node */
import { describe, expect, test } from '@jest/globals';
import { calculateAutomaticDemoQuote, resolveDemoProfile, DEMO_PROFILES } from '../src/utils/quoteAutomation.js';
import { normalizeExchange, selectElectricity, createRatesProvider } from '../scripts/quote-rates.js';
import { prepareOrderTransition, prepareAutomaticRequest } from '../scripts/automation-operations.js';
import { sessionActor } from '../scripts/session-access.js';
import { executeAssistantTool, runAssistant, validateToolArguments } from '../scripts/assistant-runtime.js';
import { deliverQuote } from '../scripts/quote-email.js';

const now = '2026-10-02T12:00:00Z';
const request = { id: 'q1', userId: 'c1', status: 'IN_REVIEW', quantity: 2, description: 'Organizador para herramientas', material: 'PETG' };
const actor = { id: 'a1', name: 'Admin demo', role: 'admin', status: 'ACTIVE', email: 'taller@vertice.cr' };
const customer = { id: 'c1', role: 'customer', status: 'ACTIVE', email: 'cliente@vertice.cr' };
const data = { users: [actor, customer], customPrintRequests: [request], orders: [], products: [], activityLog: [] };
const rates = async () => ({});

describe('motor automático DEMO y procedencia', () => {
  test('incluye cada costo y conserva simulación incluso con tasas públicas', () => {
    const quote = calculateAutomaticDemoQuote(request, { usdToCrc: 460, exchangeSource: 'HACIENDA' }, now);
    expect(quote.mode).toBe('DEMO'); expect(quote.inputs.weightGrams).toBe(150);
    expect(quote.inputs.printHours).toBe(5.04); expect(quote.breakdown.amountCrc).toBeGreaterThan(0);
    expect(quote.provenance.exchange).toBe('HACIENDA'); expect(quote.provenance.slicing).toBe('DEMO_ANALOGUE');
    expect(quote.notes).toContain('No autoriza producción ni cobros reales');
    expect(quote.validUntil).toBe('2026-10-09');
  });
  test('escala cúbica, diseño una vez por pedido y cantidades enteras', () => {
    const single = calculateAutomaticDemoQuote({ ...request, quantity: 1, needsDesign: true }, {}, now);
    const double = calculateAutomaticDemoQuote({ ...request, quantity: 2, needsDesign: true, sizeScale: 2 }, {}, now);
    expect(double.inputs.weightGrams).toBe(single.inputs.weightGrams * 8);
    expect(double.breakdown.designCrc).toBe(single.breakdown.designCrc);
    expect(calculateAutomaticDemoQuote({ ...request, quantity: 1.5 })).toEqual({ error: 'INVALID_QUANTITY' });
    expect(calculateAutomaticDemoQuote({ ...request, material: 'RESIN' })).toEqual({ error: 'MATERIAL_UNSUPPORTED' });
  });
  test('no deduce mediciones ni admite usos críticos; no bloquea palabras como armar', () => {
    expect(resolveDemoProfile({ description: 'objeto desconocido' })).toBeNull();
    expect(calculateAutomaticDemoQuote({ ...request, description: 'férula ortopédica', profileId: 'soporte' }).error).toBe('WORKSHOP_EXCEPTION');
    expect(calculateAutomaticDemoQuote({ ...request, description: 'para armar mi organizador' }).error).toBeUndefined();
    expect(DEMO_PROFILES).toHaveLength(23);
  });
  test('actualiza versión solo en etapas admitidas', () => {
    const quote = calculateAutomaticDemoQuote(request, {}, now);
    expect(prepareAutomaticRequest(request, quote, actor.id, now)).toMatchObject({ status: 'QUOTED', quoteVersion: 1 });
    expect(prepareAutomaticRequest({ ...request, status: 'SUBMITTED' }, quote, actor.id, now).error).toBe('TRANSITION_FORBIDDEN');
  });
});

describe('tasas oficiales, sin confundir energía y demanda', () => {
  const selection = { company: 'ICE', tariff: 'T-GE', block: 'Energía por kWh' };
  const row = { empresa: 'ICE', tipoTarifa: 'T-GE', bloque: 'Energía por kWh', anho: 2026, id_Mes: 10, tarifaPromedio: 95 };
  test('rechaza tasa vencida, futura, fecha inválida y valor cero', () => {
    expect(normalizeExchange({ venta: { valor: 460, fecha: '2026-10-01' } }, now)?.usdToCrc).toBe(460);
    for (const fecha of ['2026-09-01', '2026-10-03', 'bad-date', '2026-02-30']) expect(normalizeExchange({ venta: { valor: 460, fecha } }, now)).toBeNull();
  });
  test('requiere bloque exacto, mes vigente y resultado único', () => {
    expect(selectElectricity({ value: [row, { ...row, id_Mes: 12 }] }, selection, now)?.electricityCrcPerKwh).toBe(95);
    expect(selectElectricity({ value: [row, row] }, selection, now)).toBeNull();
    expect(selectElectricity({ value: [{ ...row, bloque: 'Demanda por kW' }] }, { ...selection, block: 'Demanda por kW' }, now)).toBeNull();
    expect(selectElectricity({ value: [{ ...row, bloque: null }] }, selection, now)).toBeNull();
  });
  test('cachea respuestas y etiqueta el fallback', async () => {
    let calls = 0;
    const provider = createRatesProvider({ fetchImpl: async () => { calls++; throw new Error(); }, env: {}, now: () => now });
    expect((await provider()).exchangeSource).toBe('DEMO'); await provider(); expect(calls).toBe(1);
  });
});

describe('roles, herramientas y recorridos', () => {
  test('rechaza sesión expirada y vuelve a comprobar el rol en la base', () => {
    const token = payload => `Bearer sim.v1.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}`;
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: actor.id, role: 'admin', exp: 9999999999 }), data)?.id).toBe(actor.id);
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: customer.id, role: 'admin', exp: 9999999999 }), data)).toBeNull();
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: actor.id, role: 'admin', exp: 1 }), data)).toBeNull();
  });
  test('bloquea herramientas de otro rol y parámetros inesperados', async () => {
    expect(validateToolArguments('estimate_quote', { profileId: 'organizador', material: 'PETG', quantity: 2, writeDb: true })).toBe(false);
    expect(await executeAssistantTool('admin_overview', {}, { mode: 'general', data, getRates: rates })).toEqual({ error: 'TOOL_FORBIDDEN' });
    expect(await executeAssistantTool('request_details', { requestId: 'q1' }, { mode: 'quote', actor: { id: 'other' }, data, getRates: rates })).toEqual({ error: 'REQUEST_NOT_FOUND' });
  });
  test('ejecuta tools autorizadas y filtra enlaces externos', async () => {
    let calls = 0;
    const result = await runAssistant({ mode: 'admin', message: 'Resumen' }, { actor, data, getRates: rates }, { fetchImpl: async () => ({ ok: true, json: async () => (++calls === 1 ? { message: { role: 'assistant', tool_calls: [{ id: 'call1', function: { name: 'admin_overview', arguments: '{}' } }] } } : { message: { role: 'assistant', content: JSON.stringify({ reply: 'Resumen disponible.', links: [{ label: 'Resumen', path: '/admin' }, { label: 'Externo', path: 'https://bad.test' }] }) } }) }) });
    expect(result.source).toBe('DEEPSEEK'); expect(result.tools).toEqual([{ name: 'admin_overview', success: true }]); expect(result.links).toHaveLength(1);
  });
  test('no deja saltar etapas de pedidos y exige motivo al cancelar', () => {
    const order = { status: 'PENDING' };
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'READY' }, now).error).toBe('TRANSITION_FORBIDDEN');
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'CANCELLED' }, now).error).toBe('REASON_REQUIRED');
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, now).patch.status).toBe('CONFIRMED');
  });
});

describe('correo confirmado e idempotente', () => {
  const fixture = () => ({ ...structuredClone(data), customPrintRequests: [{ ...request, status: 'QUOTED', quotedPrice: 5000, currency: 'CRC', quoteNotes: 'DEMO', quoteVersion: 1, quoteValidUntil: '2099-10-10' }] });
  const env = { VERTICE_QUOTE_EMAIL_WEBHOOK_URL: 'http://localhost/mock', VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN: 'test-only' };
  test('solo registra enviado con messageId y clave confirmada, sin reenviar', async () => {
    let db = fixture(); let calls = 0; const persist = async value => { db = value; };
    const fetchImpl = async (_url, options) => { calls++; const payload = JSON.parse(options.body); return { ok: true, json: async () => ({ delivered: true, messageId: 'gmail-demo', deliveryKey: payload.deliveryKey }) }; };
    const first = await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, fetchImpl, env });
    expect(first.body.request.status).toBe('AWAITING_APPROVAL');
    const replay = await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, fetchImpl, env });
    expect(replay.body.replay).toBe(true); expect(calls).toBe(1);
  });
  test('un 200 vacío o timeout no equivale a correo enviado ni permite duplicarlo', async () => {
    let db = fixture(); const persist = async value => { db = value; };
    const result = await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, env, fetchImpl: async () => ({ ok: true, json: async () => ({}) }) });
    expect(result.body.code).toBe('QUOTE_EMAIL_DELIVERY_UNCERTAIN'); expect(db.customPrintRequests[0].status).toBe('QUOTED');
    expect(db.quoteDeliveries[0].status).toBe('UNKNOWN');
    expect((await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, env })).status).toBe(409);
  });
});
