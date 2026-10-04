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

function quoteMaterialGuidance(message, language) {
  const text = String(message || '');
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const mentioned = [...new Set([...text.matchAll(/\b(PLA|PETG|ASA|ABS|TPU)\b/gi)].map(match => match[1].toUpperCase()))];
  const asksGuidance = /\b(?:compar\w*|diferenc\w*|convien\w*|recomend\w*|suger\w*|eleg\w*|mejor)\b/.test(normalized)
    || (/\bmaterial(?:es)?\b/.test(normalized) && /[¿?]/.test(text));
  const comparesNamedMaterials = mentioned.length > 1 && (/[¿?]/.test(text) || /\b(?:vs|versus|y|o)\b/.test(normalized));
  if (!asksGuidance && !comparesNamedMaterials) return null;

  if (!mentioned.length) {
    return language === 'en'
      ? 'The workshop guide does not rank materials or provide safety, temperature, or price specifications. Tell me what the part will be used for and whether it should be rigid or flexible; you can also leave material undecided in your request.'
      : 'La guía del taller no establece un material ganador ni incluye especificaciones de seguridad, temperatura o precio. Contame para qué se usará la pieza y si debe ser rígida o flexible; también podés dejar el material sin definir en la solicitud.';
  }

  const guidance = mentioned.map(material => `${material}: ${GUIDE[material]}`);
  const lead = language === 'en' ? 'Workshop material guide (orientation only):' : 'Guía de materiales del taller (orientativa):';
  const boundary = language === 'en'
    ? 'The guide does not provide temperature ranges, price comparisons, or safety certifications. You can record a preference or leave the material undecided.'
    : 'La guía no da rangos de temperatura, comparaciones de precio ni certificaciones de seguridad. Podés registrar una preferencia o dejar el material sin definir.';
  return `${lead}\n${guidance.map(item => `• ${item}`).join('\n')}\n\n${boundary}`;
}

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
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const query = normalize(args.query);
    if (!query) return [];
    const categories = new Map((data.categories || []).map(category => [String(category.id), category]));
    return (data.products || []).filter(product => {
      if (product.status !== 'ACTIVE' || !FDM_MATERIALS.includes(product.material)) return false;
      const category = categories.get(String(product.categoryId));
      const searchable = [product.name, product.slug, product.material, product.description, category?.name, category?.slug]
        .map(normalize).filter(Boolean).join(' ');
      return searchable.includes(query);
    }).slice(0, 12).map(({ id, name: label, material, price, currency, categoryId }) => ({
      id, name: label, material, price, currency, category: categories.get(String(categoryId))?.name || null,
      madeToOrder: true, path: `/producto/${id}`,
    }));
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
  const allowed = mode === 'admin' ? /^\/admin(?:\/(?:pedidos|solicitudes|catalogo|clientes|actividad|asistente)(?:\/[a-zA-Z0-9_-]+){0,2})?$/ : /^\/(?:catalogo|solicitud(?:\/(?:archivo|ayuda-diseno))?|cuenta|producto\/[a-zA-Z0-9_-]+)$/;
  return links.filter(link => link && typeof link.label === 'string' && allowed.test(link.path)).slice(0, 4).map(link => ({ label: link.label.slice(0, 80), path: link.path }));
}

export async function runAssistant({ mode, message, history = [], language = 'es' }, context, { fetchImpl = globalThis.fetch, env = {} } = {}) {
  if (!ROLE_TOOLS[mode] || typeof message !== 'string' || !message.trim() || message.length > 2000 || !Array.isArray(history) || history.length > 12) return { error: 'INVALID_CHAT' };
  if (mode === 'admin' && context.actor?.role !== 'admin') return { error: 'ROLE_REQUIRED' };
  if (mode === 'quote') {
    const guidance = quoteMaterialGuidance(message, language);
    if (guidance) return { reply: guidance, links: [], requestDraft: null, source: 'WORKSHOP_GUIDE' };
  }
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
    if (!response.ok) return { error: 'ASSISTANT_UNAVAILABLE' };
    let body;
    try { body = await response.json(); } catch { return { error: 'ASSISTANT_INVALID_RESPONSE' }; }
    const result = Array.isArray(body) ? body[0] : body;
    let output;
    try {
      const agentOutput = result?.output;
      output = typeof agentOutput === 'string' ? JSON.parse(agentOutput) : agentOutput;
    } catch { return { error: 'ASSISTANT_INVALID_RESPONSE' }; }
    const iterationLimit = output?.error === 'ASSISTANT_ITERATION_LIMIT'
      || (typeof output?.reply === 'string' && /^agent stopped due to max iterations\.?$/i.test(output.reply.trim()));
    if (iterationLimit) return { error: 'ASSISTANT_ITERATION_LIMIT' };
    if (result?.error || !output || typeof output.reply !== 'string' || !output.reply.trim() || output.reply.length > 5000) {
      return { error: 'ASSISTANT_INVALID_RESPONSE' };
    }
    return { reply: output.reply, links: safeLinks(output.links, mode), ...(mode === 'quote' ? { requestDraft: safeRequestDraft(output.requestDraft) } : {}), source: 'N8N' };
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return { error: 'ASSISTANT_TIMEOUT' };
    return { error: 'ASSISTANT_UNAVAILABLE' };
  } finally {
    revokeAssistantToolCapability(capability);
  }
}

function safeRequestDraft(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const field = (key, limit) => typeof value[key] === 'string' ? value[key].trim().slice(0, limit) : '';
  const quantity = Number.isSafeInteger(value.quantity) && value.quantity >= 1 && value.quantity <= 100 ? value.quantity : null;
  const material = FDM_MATERIALS.includes(String(value.material || '').toUpperCase()) ? String(value.material).toUpperCase() : null;
  const needsDesign = typeof value.needsDesign === 'boolean' ? value.needsDesign : null;
  const draft = { description: field('description', 2000), intendedUse: field('intendedUse', 500), dimensions: field('dimensions', 200), material, quantity, needsDesign, referenceUrl: field('referenceUrl', 500) };
  return Object.values(draft).some(Boolean) ? draft : null;
}
