/** @jest-environment node */
import { describe, expect, jest, test } from '@jest/globals';
import { calculateAutomaticDemoQuote, resolveDemoProfile, DEMO_PROFILES } from '../src/utils/quoteAutomation.js';
import { normalizeExchange, selectElectricity, createRatesProvider } from '../scripts/quote-rates.js';
import { prepareOrderTransition, prepareAutomaticRequest } from '../scripts/automation-operations.js';
import { sessionActor } from '../scripts/session-access.js';
import { executeAssistantTool, executeAssistantToolCapability, issueAssistantToolCapability, revokeAssistantToolCapability, runAssistant, validateToolArguments } from '../scripts/assistant-runtime.js';
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
    expect(quote.notes).toContain('Alcance y material sujetos a revisión final del taller');
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
    expect(resolveDemoProfile({ description: 'objeto desconocido' }, { fallback: true })?.id).toBe('soporte');
    expect(resolveDemoProfile({ description: 'Cotizar solo el brazo robótico de una banda transportadora' })?.id).toBe('brazo');
    expect(resolveDemoProfile({ attachments: [{ name: 'engranaje_motor.stl' }] })?.id).toBe('engranaje');
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
  test('conserva las dos rutas de cotización y rechaza rutas no autorizadas', async () => {
    const links = ['/solicitud/archivo', '/solicitud/ayuda-diseno', '/solicitud/desconocida', '/admin'].map(path => ({ label: path, path }));
    const result = await runAssistant({ mode: 'quote', message: 'Opciones' }, { actor: null, data, getRates: rates }, {
      fetchImpl: async () => ({ ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Elegí tu camino.', links }) }) }),
    });
    expect(result.links.map(link => link.path)).toEqual(['/solicitud/archivo', '/solicitud/ayuda-diseno']);
  });
  test('el asistente de cotización devuelve solo campos explícitos del resumen, sin repetir preguntas ni calcular precio', async () => {
    const result = await runAssistant({ mode: 'quote', message: 'Largo 15 y ancho 3' }, { actor: customer, data, getRates: rates }, {
      fetchImpl: async (_url, options) => {
        const payload = JSON.parse(options.body);
        expect(payload.messages[0].content).toContain('No repitas preguntas ya contestadas');
        return { ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Listo, revisá el resumen y enviá la solicitud.', requestDraft: {
          description: 'Pieza flexible', intendedUse: 'Juguete personal', dimensions: 'largo 15 cm, ancho 3 cm', material: 'TPU', quantity: 1,
          needsDesign: true, quotedPrice: 999999, internalNote: 'discard me',
        } }) }) };
      },
    });
    expect(result.requestDraft).toEqual({ description: 'Pieza flexible', intendedUse: 'Juguete personal', dimensions: 'largo 15 cm, ancho 3 cm', material: 'TPU', quantity: 1, needsDesign: true, referenceUrl: '' });
    expect(result.requestDraft).not.toHaveProperty('quotedPrice');
    expect(result.requestDraft).not.toHaveProperty('internalNote');
  });
  test('responde comparaciones de materiales desde la guía exacta, no desde las afirmaciones del modelo', async () => {
    const fetchImpl = jest.fn();
    const result = await runAssistant({ mode: 'quote', message: 'Compará PETG y PLA para una base rígida de teléfono que usaré en interiores.' }, { actor: customer, data, getRates: rates }, { fetchImpl });
    expect(result.source).toBe('WORKSHOP_GUIDE');
    expect(result.reply).toContain('PLA: Piezas decorativas y prototipos de interior; evitar calor elevado.');
    expect(result.reply).toContain('PETG: Soportes y piezas funcionales de uso general. Compatibilidad final depende del diseño.');
    expect(result.reply).toMatch(/no da rangos de temperatura/i);
    expect(result.reply).not.toMatch(/55|60|75|80/);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  test('una preferencia flexible sigue al flujo de organización, no se confunde con una consulta de materiales', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Anoto tu preferencia.', requestDraft: { description: 'Pieza', material: 'TPU' } }) }) }));
    const result = await runAssistant({ mode: 'quote', message: 'Una unidad, material flexible y tamaño promedio.' }, { actor: customer, data, getRates: rates }, { fetchImpl });
    expect(result.source).toBe('N8N');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  test('autocompleta ficha por Agent general solo con rol Admin y valida el JSON de producto', async () => {
    const productDraft = { description: 'Soporte compacto para mantener el teléfono elevado sobre el escritorio.', material: 'PETG', colors: ['Negro', 'Gris'], weightGrams: 45, estimatedProductionHours: 2.5, estimateBasis: 'Estimación gruesa para una pieza compacta; confirmar con el laminador.' };
    const result = await runAssistant({ mode: 'general', task: 'catalog_product_draft', message: 'Soporte de teléfono' }, { actor, data, getRates: rates }, {
      fetchImpl: async (_url, options) => {
        const payload = JSON.parse(options.body);
        expect(payload.task).toBe('catalog_product_draft');
        expect(payload.mode).toBe('general');
        expect(payload.messages[0].content).toContain('estimación numérica MUY básica');
        expect(payload.messages.at(-1).content).toBe('Soporte de teléfono');
        expect(await executeAssistantToolCapability(payload.toolCapability, { mode: 'general', name: 'search_catalog', args: { query: 'teléfono' } })).toEqual({ error: 'TOOL_FORBIDDEN' });
        return { ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Propuesta básica lista para revisar.', links: [], requestDraft: null, productDraft }) }) };
      },
    });
    expect(result).toEqual({ reply: 'Propuesta básica lista para revisar.', productDraft, source: 'N8N' });
  });
  test('rechaza tarea de catálogo sin Admin o con respuesta estructurada inválida', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Propuesta.', links: [], productDraft: { description: 'Pieza', material: 'RESIN', colors: [], weightGrams: -1, estimatedProductionHours: 'muchas', estimateBasis: '' } }) }) }));
    await expect(runAssistant({ mode: 'general', task: 'catalog_product_draft', message: 'Soporte' }, { actor: null, data, getRates: rates }, { fetchImpl })).resolves.toEqual({ error: 'ROLE_REQUIRED' });
    expect(fetchImpl).not.toHaveBeenCalled();
    await expect(runAssistant({ mode: 'general', task: 'catalog_product_draft', message: 'Soporte' }, { actor, data, getRates: rates }, { fetchImpl })).resolves.toEqual({ error: 'ASSISTANT_INVALID_RESPONSE' });
  });
  test('rechaza sesión expirada y vuelve a comprobar el rol en la base', () => {
    const token = payload => `Bearer sim.v1.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}`;
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: actor.id, role: 'admin', exp: 9999999999 }), data)?.id).toBe(actor.id);
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: customer.id, role: 'admin', exp: 9999999999 }), data)).toBeNull();
    expect(sessionActor(token({ kind: 'SIMULATED_JWT', sub: actor.id, role: 'admin', exp: 1 }), data)).toBeNull();
  });
  test('bloquea herramientas de otro rol y parámetros inesperados', async () => {
    expect(validateToolArguments('estimate_quote', { profileId: 'organizador', material: 'PETG', quantity: 2, writeDb: true })).toBe(false);
    expect(await executeAssistantTool('admin_overview', {}, { mode: 'general', data, getRates: rates })).toEqual({ error: 'TOOL_FORBIDDEN' });
    expect(await executeAssistantTool('request_details', { requestId: 'q1' }, { mode: 'quote', actor: { id: 'other' }, data, getRates: rates })).toEqual({ error: 'TOOL_FORBIDDEN' });
  });
  test('busca por categoría publicada y devuelve solo coincidencias con su categoría real', async () => {
    const catalog = {
      categories: [
        { id: 'cat3', name: 'Juguetes', slug: 'juguetes', status: 'ACTIVE' },
        { id: 'cat4', name: 'Decoración', slug: 'decoracion', status: 'ACTIVE' },
        { id: 'cat5', name: 'Gadgets', slug: 'gadgets', status: 'ACTIVE' },
      ],
      products: [
        { id: 'p6', name: 'Llavero personalizado base', slug: 'llavero-base', categoryId: 'cat3', status: 'ACTIVE', material: 'PLA', price: 2500, currency: 'CRC' },
        { id: 'p8', name: 'Figura decorativa PLA Silk', slug: 'figura-pla-silk', categoryId: 'cat3', status: 'ACTIVE', material: 'PLA Silk', price: 12000, currency: 'CRC' },
        { id: 'p7', name: 'Organizador modular de escritorio', slug: 'organizador-modular-escritorio', categoryId: 'cat5', status: 'ACTIVE', material: 'PETG', price: 8000, currency: 'CRC' },
        { id: 'p4', name: 'Maceta geométrica', slug: 'maceta-geometrica', categoryId: 'cat4', status: 'ACTIVE', material: 'PETG', price: 7500, currency: 'CRC' },
        { id: 'p-draft', name: 'Juguete de prueba', categoryId: 'cat3', status: 'DRAFT', material: 'PLA' },
      ],
    };
    const matching = await executeAssistantTool('search_catalog', { query: 'juguetes' }, { mode: 'general', data: catalog, getRates: rates });
    expect(matching).toEqual([
      { id: 'p6', name: 'Llavero personalizado base', material: 'PLA', price: 2500, currency: 'CRC', category: 'Juguetes', madeToOrder: true, path: '/producto/p6' },
      { id: 'p8', name: 'Figura decorativa PLA Silk', material: 'PLA Silk', price: 12000, currency: 'CRC', category: 'Juguetes', madeToOrder: true, path: '/producto/p8' },
    ]);
    expect(await executeAssistantTool('search_catalog', { query: 'organizador de escritorio' }, { mode: 'general', data: catalog, getRates: rates })).toMatchObject([{ id: 'p7', name: 'Organizador modular de escritorio' }]);
    expect(await executeAssistantTool('search_catalog', { query: 'decoracion' }, { mode: 'general', data: catalog, getRates: rates })).toMatchObject([{ name: 'Maceta geométrica', category: 'Decoración' }]);
    expect(await executeAssistantTool('search_catalog', { query: '' }, { mode: 'general', data: catalog, getRates: rates })).toEqual([]);
  });
  test('limita capacidades efímeras por rol y número de invocaciones', async () => {
    const capability = issueAssistantToolCapability({ mode: 'admin', actor, data, getRates: rates }, 1000);
    expect((await executeAssistantToolCapability(capability, { mode: 'admin', name: 'admin_overview', args: {} }, 1001)).result.activeOrders).toBe(0);
    expect(await executeAssistantToolCapability(capability, { mode: 'admin', name: 'admin_overview', args: {} }, 1002)).toMatchObject({ result: { activeOrders: 0 } });
    expect(await executeAssistantToolCapability(capability, { mode: 'admin', name: 'admin_overview', args: {} }, 1003)).toMatchObject({ result: { activeOrders: 0 } });
    expect(await executeAssistantToolCapability(capability, { mode: 'admin', name: 'admin_overview', args: {} }, 1004)).toEqual({ error: 'TOOL_CAPABILITY_INVALID' });
    const scoped = issueAssistantToolCapability({ mode: 'general', actor: null, data, getRates: rates }, 2000);
    expect(await executeAssistantToolCapability(scoped, { mode: 'general', name: 'admin_overview', args: {} }, 2001)).toEqual({ error: 'TOOL_FORBIDDEN' });
    expect(await executeAssistantToolCapability(scoped, { mode: 'general', name: 'search_catalog', args: { query: '' } }, 92001)).toEqual({ error: 'TOOL_CAPABILITY_INVALID' });
    revokeAssistantToolCapability(capability); revokeAssistantToolCapability(scoped);
  });
  test('consume salida del Agent y filtra enlaces externos', async () => {
    const result = await runAssistant({ mode: 'admin', message: 'Resumen' }, { actor, data, getRates: rates }, { fetchImpl: async (_url, options) => {
      const body = JSON.parse(options.body);
      expect(body.mode).toBe('admin'); expect(body.toolCapability).toHaveLength(43); expect(body.messages.at(-1).content).toBe('Resumen');
      return { ok: true, json: async () => ({ output: JSON.stringify({ reply: 'Resumen disponible.', links: [{ label: 'Resumen', path: '/admin' }, { label: 'Copiloto', path: '/admin/asistente' }, { label: 'Externo', path: 'https://bad.test' }] }) }) };
    } });
    expect(result.source).toBe('N8N'); expect(result.links).toEqual([{ label: 'Resumen', path: '/admin' }, { label: 'Copiloto', path: '/admin/asistente' }]);
  });
  test('no presenta el tope de iteraciones de n8n como si fuera una respuesta del asistente', async () => {
    const context = { actor: customer, data, getRates: rates };
    for (const output of [
      { error: 'ASSISTANT_ITERATION_LIMIT' },
      { reply: 'Agent stopped due to max iterations.' },
    ]) {
      const result = await runAssistant({ mode: 'quote', message: 'Ya está, prepará el pedido' }, context, {
        fetchImpl: async () => ({ ok: true, json: async () => ({ output: JSON.stringify(output) }) }),
      });
      expect(result).toEqual({ error: 'ASSISTANT_ITERATION_LIMIT' });
    }
  });
  test('envía cada panel al webhook del agente de su propio contexto', async () => {
    const cases = [
      ['general', null, 'http://n8n/webhook/vertice-assistant-general'],
      ['admin', actor, 'http://n8n/webhook/vertice-assistant-admin'],
      ['quote', customer, 'http://n8n/webhook/vertice-assistant-quote'],
    ];
    for (const [mode, currentActor, expectedUrl] of cases) {
      const result = await runAssistant({ mode, message: 'Prueba' }, { actor: currentActor, data, getRates: rates }, {
        env: { [`VERTICE_ASSISTANT_${mode.toUpperCase()}_URL`]: expectedUrl },
        fetchImpl: async (url, options) => {
          expect(url).toBe(expectedUrl);
          expect(JSON.parse(options.body).mode).toBe(mode);
          return { ok: true, json: async () => ({ output: JSON.stringify({ reply: `Agente ${mode}`, links: [] }) }) };
        },
      });
      expect(result.reply).toBe(`Agente ${mode}`);
    }
  });
  test('distingue n8n caído, timeout y respuesta inválida sin fingir una respuesta local', async () => {
    const context = { actor: null, data, getRates: rates };
    const cases = [
      ['caído', async () => { throw new Error('connection refused'); }, 'ASSISTANT_UNAVAILABLE'],
      ['HTTP no exitoso', async () => ({ ok: false, status: 503 }), 'ASSISTANT_UNAVAILABLE'],
      ['timeout', async () => { throw Object.assign(new Error('timed out'), { name: 'TimeoutError' }); }, 'ASSISTANT_TIMEOUT'],
      ['JSON inválido', async () => ({ ok: true, json: async () => { throw new SyntaxError('Unexpected token'); } }), 'ASSISTANT_INVALID_RESPONSE'],
      ['salida inválida', async () => ({ ok: true, json: async () => ({ output: 'no es JSON' }) }), 'ASSISTANT_INVALID_RESPONSE'],
    ];
    for (const [label, fetchImpl, code] of cases) {
      await expect(runAssistant({ mode: 'quote', message: `Prueba ${label}` }, context, { fetchImpl })).resolves.toEqual({ error: code });
    }
  });
  test('no deja saltar etapas de pedidos y exige motivo al cancelar', () => {
    const order = { status: 'PENDING' };
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'READY' }, now).error).toBe('TRANSITION_FORBIDDEN');
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'CANCELLED' }, now).error).toBe('REASON_REQUIRED');
    expect(prepareOrderTransition(order, { expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, now).error).toBe('PAYMENT_VERIFICATION_REQUIRED');
    expect(prepareOrderTransition({ ...order, paymentStatus: 'PAID' }, { expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, now).patch.status).toBe('CONFIRMED');
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
  test('rechaza el destinatario de prueba antes de contactar el proveedor', async () => {
    const db = fixture(); const fetchImpl = jest.fn();
    const result = await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist: async () => {}, env,
      testRecipient: 'attacker@example.com',
      fetchImpl,
    });
    expect(result).toEqual({ status: 400, body: { code: 'TEST_EMAIL_UNSUPPORTED' } });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  test('un 200 vacío o timeout no equivale a correo enviado ni permite duplicarlo', async () => {
    let db = fixture(); const persist = async value => { db = value; };
    const result = await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, env, fetchImpl: async () => ({ ok: true, json: async () => ({}) }) });
    expect(result.body.code).toBe('QUOTE_EMAIL_DELIVERY_UNCERTAIN'); expect(db.customPrintRequests[0].status).toBe('QUOTED');
    expect(db.quoteDeliveries[0].status).toBe('UNKNOWN');
    expect((await deliverQuote({ data: db, requestId: 'q1', expectedVersion: 1, actor, persist, env })).status).toBe(409);
  });
});
