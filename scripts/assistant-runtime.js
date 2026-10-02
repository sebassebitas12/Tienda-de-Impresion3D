import { randomBytes } from 'node:crypto';
import { ASSISTANT_COMMON_PROMPT, ASSISTANT_PROMPTS, ASSISTANT_TOOLS, ROLE_TOOLS, ADMIN_GUIDE } from '../src/utils/assistantPolicies.js';
import { calculateAutomaticDemoQuote, DEMO_PROFILES } from '../src/utils/quoteAutomation.js';
import { FDM_MATERIALS } from '../src/utils/quotePricing.js';

const GUIDE = {
  PLA: 'Piezas decorativas y prototipos de interior; evitar calor elevado.',
  PETG: 'Soportes y piezas funcionales de uso general. Compatibilidad final depende del diseño.',
  ASA: 'Prototipos para exterior; requiere perfil y ventilación adecuados.',
  ABS: 'Prototipos que necesitan tolerar más temperatura; requiere control del proceso.',
  TPU: 'Piezas flexibles. La dureza y geometría determinan el comportamiento.',
};
const toolCapabilities = new Map();
const PROCESS = { path: '/solicitud', steps: ['Definir pieza, material y cantidad', 'Calcular simulación demo y guardar solicitud', 'Enviar oferta al cliente', 'Cliente aprueba', 'Pago verificado antes de fabricación'], mode: 'DEMO', stock: 'Fabricación bajo pedido' };

export function issueAssistantToolCapability(context, now = Date.now()) {
  for (const [key, value] of toolCapabilities) if (value.expiresAt <= now) toolCapabilities.delete(key);
  const capability = randomBytes(32).toString('base64url');
  toolCapabilities.set(capability, { ...context, expiresAt: now + 90_000, calls: 0 });
  return capability;
}

export function revokeAssistantToolCapability(capability) {
  toolCapabilities.delete(capability);
}

export async function executeAssistantToolCapability(capability, { mode, name, args }, now = Date.now()) {
  const context = toolCapabilities.get(capability);
  if (!context || context.expiresAt <= now || context.mode !== mode || context.calls >= 3) {
    toolCapabilities.delete(capability);
    return { error: 'TOOL_CAPABILITY_INVALID' };
  }
  context.calls += 1;
  const result = await executeAssistantTool(name, args, context);
  if (result.error) return { error: result.error };
  return { result };
}

export function validateToolArguments(name, args) {
  const schema = ASSISTANT_TOOLS[name]?.function.parameters;
  if (!schema || !args || Array.isArray(args) || typeof args !== 'object') return false;
  if (Object.keys(args).some(key => !(key in schema.properties)) || schema.required.some(key => !(key in args))) return false;
  return Object.entries(args).every(([key, value]) => {
    const rule = schema.properties[key];
    if (rule.type === 'string') return typeof value === 'string' && value.length <= (rule.maxLength || 160) && (!rule.enum || rule.enum.includes(value));
    if (rule.type === 'boolean') return typeof value === 'boolean';
    return Number.isFinite(value) && (rule.type !== 'integer' || Number.isSafeInteger(value)) && value >= rule.minimum && value <= rule.maximum;
  });
}

export async function executeAssistantTool(name, args, { mode, actor, data, getRates }) {
  if (!ROLE_TOOLS[mode]?.includes(name) || (mode === 'admin' && actor?.role !== 'admin') || (name === 'request_details' && !actor)) return { error: 'TOOL_FORBIDDEN' };
  if (!validateToolArguments(name, args)) return { error: 'TOOL_ARGUMENTS_INVALID' };
  if (name === 'search_catalog') {
    const query = String(args.query || '').toLowerCase();
    return (data.products || []).filter(p => p.status === 'ACTIVE' && FDM_MATERIALS.includes(p.material)
      && `${p.name} ${p.material} ${p.description}`.toLowerCase().includes(query)).slice(0, 12)
      .map(({ id, name: label, material, price, currency }) => ({ id, name: label, material, price, currency, madeToOrder: true, path: `/producto/${id}` }));
  }
  if (name === 'material_guide') return Object.entries(GUIDE).filter(([key]) => !args.material || key === args.material).map(([material, guidance]) => ({ material, guidance }));
  if (name === 'explain_process') return PROCESS;
  if (name === 'navigation_guide') return ADMIN_GUIDE.filter(row => !args.section || `${row.section} ${row.label}`.toLowerCase().includes(args.section.toLowerCase()));
  if (name === 'quote_profiles') return DEMO_PROFILES.map(({ id, name: label }) => ({ profileId: id, name: label, source: 'DEMO' }));
  if (name === 'estimate_quote') return calculateAutomaticDemoQuote(args, await getRates());
  if (name === 'admin_overview') return { activeOrders: (data.orders || []).filter(o => ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED'].includes(o.status)).length,
    workshopRequests: (data.customPrintRequests || []).filter(r => ['PENDING_QUOTE', 'IN_REVIEW'].includes(r.status)).length,
    drafts: (data.products || []).filter(p => p.status === 'DRAFT').length, collectedSales: null, reason: 'No existe evidencia de cobros', path: '/admin' };
  if (name === 'list_requests') return (data.customPrintRequests || []).filter(r => !args.status || r.status === args.status).slice(0, 12).map(({ id, status, quantity, material, description }) => ({ id, status, quantity, material, description, path: `/admin/solicitudes/${id}` }));
  if (name === 'list_orders') return (data.orders || []).filter(o => !args.status || o.status === args.status).slice(0, 12).map(({ id, status, total }) => ({ id, status, totalRecorded: total, path: `/admin/pedidos/${id}` }));
  if (name === 'catalog_quality') return (data.products || []).filter(p => p.status === 'DRAFT' || !FDM_MATERIALS.includes(p.material) || !Number.isFinite(p.price)).map(({ id, name: label, status, material, price }) => ({ id, name: label, status, missing: [!material && 'material', !Number.isFinite(price) && 'price'].filter(Boolean), unsupportedMaterial: Boolean(material && !FDM_MATERIALS.includes(material)), path: `/admin/catalogo/${id}/editar` }));
  if (name === 'request_details') {
    if (!actor) return { error: 'TOOL_FORBIDDEN' };
    const request = data.customPrintRequests?.find(r => String(r.id) === args.requestId && (actor?.role === 'admin' || String(r.userId) === String(actor?.id)));
    if (!request) return { error: 'REQUEST_NOT_FOUND' };
    const { id, status, description, material, quantity, quotedPrice, quoteValidUntil, quoteNotes, quotePricing } = request;
    return { id, status, description, material, quantity, quotedPrice, quoteValidUntil, quoteNotes, mode: quotePricing?.mode || 'MANUAL' };
  }
  return { error: 'TOOL_FORBIDDEN' };
}

function safeLinks(links, mode) {
  if (!Array.isArray(links)) return [];
  const allowed = mode === 'admin' ? /^\/admin(?:\/(?:pedidos|solicitudes|catalogo|clientes|actividad)(?:\/[a-zA-Z0-9_-]+){0,2})?$/ : /^\/(?:catalogo|solicitud|cuenta|producto\/[a-zA-Z0-9_-]+)$/;
  return links.filter(link => link && typeof link.label === 'string' && allowed.test(link.path)).slice(0, 4).map(link => ({ label: link.label.slice(0, 80), path: link.path }));
}

export async function runAssistant({ mode, message, history = [], language = 'es' }, context, { fetchImpl = globalThis.fetch, env = {} } = {}) {
  if (!ROLE_TOOLS[mode] || typeof message !== 'string' || !message.trim() || message.length > 2000 || !Array.isArray(history) || history.length > 12) return { error: 'INVALID_CHAT' };
  if (mode === 'admin' && context.actor?.role !== 'admin') return { error: 'ROLE_REQUIRED' };
  const messages = [
    { role: 'system', content: `${ASSISTANT_PROMPTS[mode]}\n${ASSISTANT_COMMON_PROMPT}\nIdioma: ${language === 'en' ? 'English' : 'español'}.` },
    ...history.filter(item => ['user', 'assistant'].includes(item?.role) && typeof item.content === 'string').slice(-10).map(({ role, content }) => ({ role, content: content.slice(0, 3000) })),
    { role: 'user', content: message.trim() },
  ];
  const capability = issueAssistantToolCapability({ mode, actor: context.actor, data: context.data, getRates: context.getRates });
  try {
    const webhook = env[`VERTICE_ASSISTANT_${mode.toUpperCase()}_URL`] || `http://localhost:5678/webhook/vertice-assistant-${mode}`;
    const toolEndpointUrl = env.VERTICE_ASSISTANT_TOOLS_URL || 'http://localhost:3000/assistants/tools';
    const response = await fetchImpl(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Vertice-Webhook-Token': env.VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN || '' },
      body: JSON.stringify({ mode, language, messages, toolCapability: capability, toolEndpointUrl }), signal: AbortSignal.timeout(90000) });
    if (!response.ok) throw new Error('provider');
    const body = await response.json();
    const result = Array.isArray(body) ? body[0] : body;
    const agentOutput = result.output;
    const output = typeof agentOutput === 'string' ? JSON.parse(agentOutput) : agentOutput;
    if (result.error || !output || typeof output.reply !== 'string' || !output.reply.trim() || output.reply.length > 5000) throw new Error('provider');
    return { reply: output.reply, links: safeLinks(output.links, mode), source: 'DEEPSEEK' };
  } catch {
    // Useful local, explicitly labeled rule-based fallback before provider credentials are configured.
    if (mode === 'admin') {
      const overview = await executeAssistantTool('admin_overview', {}, { ...context, mode });
      return { source: 'DEMO_RULES', reply: language === 'en' ? `There are ${overview.activeOrders} active orders and ${overview.workshopRequests} requests to review. Open Requests to calculate a demo quote. Catalog manages published models and drafts. Choose a section below.` : `Hay ${overview.activeOrders} pedidos activos y ${overview.workshopRequests} solicitudes por revisar. Abrí Solicitudes para calcular una cotización demo; Catálogo organiza publicación y borradores. Elegí una sección abajo para recorrerla.`, links: ADMIN_GUIDE.map(({ label, path }) => ({ label, path })) };
    }
    if (mode === 'quote') return { source: 'DEMO_RULES', reply: language === 'en' ? 'I can help clarify the intended use, approximate dimensions, material and quantity. This local guide cannot measure a file, save a request or issue an official price; the workshop must review and confirm the quote.' : 'Puedo ayudarte a definir el uso, las dimensiones aproximadas, el material y la cantidad. Esta guía local no mide archivos, no guarda solicitudes ni emite un precio oficial; el taller debe revisar y confirmar la cotización.', links: [{ label: language === 'en' ? 'Quote options' : 'Ver opciones de cotización', path: '/solicitud' }] };
    const rows = await executeAssistantTool('search_catalog', { query: message.length < 80 ? message : '' }, { ...context, mode });
    return { source: 'DEMO_RULES', reply: language === 'en' ? (rows.length ? `I found ${rows.length} published model(s). They are made to order. You can calculate a demo estimate for a custom piece.` : 'We offer made-to-order FDM with PLA, PETG, ASA, ABS and TPU. Compare materials or use the quote page to try an analogue profile and see its demo breakdown.') : (rows.length ? `Encontré ${rows.length} modelo(s) publicados que coinciden. Se fabrican bajo pedido. Para un encargo propio podés calcular una simulación en Cotizar.` : 'Trabajamos FDM bajo pedido con PLA, PETG, ASA, ABS y TPU. Para decoración interior suele servir PLA; para un soporte general podés comparar PETG. En Cotizar podés probar un perfil de pieza y ver su cálculo demo.'), links: rows.slice(0, 3).map(({ name, path }) => ({ label: name, path })).concat({ label: language === 'en' ? 'Get a quote' : 'Cotizar', path: '/solicitud' }) };
  } finally {
    revokeAssistantToolCapability(capability);
  }
}
