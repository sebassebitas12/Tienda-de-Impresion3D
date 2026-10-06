import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSISTANT_COMMON_PROMPT, ASSISTANT_PROMPTS, ASSISTANT_TOOLS, ROLE_TOOLS, CATALOG_PRODUCT_DRAFT_PROMPT, CATALOG_PRODUCT_DRAFT_TASK } from '../src/utils/assistantPolicies.js';
import { prepareQuoteEmail } from '../src/utils/quoteEmailTemplate.js';

const directory = fileURLToPath(new URL('../automation/n8n/', import.meta.url));
const load = async (file) => JSON.parse(await readFile(resolve(directory, file), 'utf8'));
const assistantModes = ['general', 'admin', 'quote'];
const assistants = await Promise.all(assistantModes.map((mode) => load(`vertice-assistant-${mode}.json`)));
const rates = await load('vertice-rates.json');
const email = await load('vertice-quote-email.json');
email.nodes.find(node => node.name === 'Validar y preparar correo').parameters.jsCode = `const prepareQuoteEmail = ${prepareQuoteEmail.toString().replace(/\r\n/g, '\n')};\nreturn [{ json: prepareQuoteEmail($input.first().json.body ?? $input.first().json) }];`;
const nodes = [];
const connections = {};
const add = (source, { name, id, position, parameters } = {}) => {
  const node = structuredClone(source);
  node.name = name || node.name;
  node.id = id || `unified-${node.id}`;
  if (position) node.position = position;
  if (parameters) node.parameters = { ...node.parameters, ...parameters };
  nodes.push(node);
  return node.name;
};
const connectMain = (from, to) => {
  connections[from] ||= { main: [] };
  connections[from].main[0] ||= [];
  connections[from].main[0].push({ node: to, type: 'main', index: 0 });
};
const connectAi = (from, type, to) => {
  connections[from] ||= {};
  connections[from][type] = [[{ node: to, type, index: 0 }]];
};

// Each product entry has its own fixed-role prompt, native Agent, and tool boundary.
const agentLabels = { general: 'público', admin: 'Admin', quote: 'cotización' };
const toolDescriptions = {
  general: `Herramienta del asistente público: ${ROLE_TOOLS.general.join(', ')}. Úsala solo para buscar modelos publicados o consultar una recomendación de material/proceso; no para definiciones generales, no repitas llamadas y no edita registros ni envía mensajes.`,
  admin: `Herramienta del asistente Admin: ${ROLE_TOOLS.admin.join(', ')}. Consulta y prepara propuestas CRUD mediante prepare_catalog_action. Guardado solo tras confirmación del Admin en la app. No envía mensajes.`,
  quote: 'Herramienta del asistente de cotización: material_guide, explain_process. Solo consulta la guía de materiales/proceso; no calcula precios, no consulta datos de Admin, no crea solicitudes ni envía mensajes.',
};
for (const [index, mode] of assistantModes.entries()) {
  const row = index;
  const y = 430 + row * 250;
  const trigger = assistants[index].nodes.find((node) => node.type.endsWith('.webhook'));
  const entryName = `Entrada — asistente ${mode}`;
  const prepareName = `Preparar contexto — ${mode}`;
  const agentName = `AI Agent — ${agentLabels[mode]}`;
  const toolName = `Herramientas autorizadas — ${mode}`;
  add(trigger, { name: entryName, id: `entry-assistant-${mode}`, position: [180, y] });
  nodes.push({
    name: prepareName, id: `prepare-ai-${mode}`, type: 'n8n-nodes-base.code', typeVersion: 2,
    position: [470, y], parameters: { mode: 'runOnceForAllItems', jsCode: `const body = $input.first().json.body || {};
const mode = ${JSON.stringify(mode)};
if (body.mode !== mode || !Array.isArray(body.messages) || body.messages.length > 12 || typeof body.toolCapability !== 'string' || body.toolCapability.length < 40 || typeof body.toolEndpointUrl !== 'string' || !/^https?:\\/\\//.test(body.toolEndpointUrl)) throw new Error('Contexto de asistente inválido');
const task = body.task || null;
if (task !== null && !(mode === 'general' && task === ${JSON.stringify(CATALOG_PRODUCT_DRAFT_TASK)})) throw new Error('Tarea de asistente inválida');
const turns = body.messages.filter(m => ['user','assistant'].includes(m?.role) && typeof m.content === 'string').slice(-11).map(m => ({role:m.role,content:m.content.slice(0,3000)}));
if (!turns.length || turns.at(-1).role !== 'user') throw new Error('Falta el mensaje actual');
const transcript = turns.map(m => (m.role === 'user' ? 'Cliente' : 'Asistente') + ': ' + m.content).join('\\n\\n');
const isCatalogDraft = task === ${JSON.stringify(CATALOG_PRODUCT_DRAFT_TASK)};
const systemPrompt = isCatalogDraft
  ? ${JSON.stringify(CATALOG_PRODUCT_DRAFT_PROMPT)} + '\\nIdioma: ' + (body.language === 'en' ? 'English' : 'español de Costa Rica') + '\\nHerramientas permitidas: ninguna. Categorías reales: ' + JSON.stringify(body.catalogCategories || []) + '. Puedes añadir categoryId de esta lista y dimensions solo con medidas explícitas.'
  : ${JSON.stringify(ASSISTANT_PROMPTS[mode] + '\n' + ASSISTANT_COMMON_PROMPT)} + '\\nIdioma: ' + (body.language === 'en' ? 'English' : 'español de Costa Rica') + '\\nHerramientas y argumentos: ' + ${JSON.stringify(JSON.stringify(ROLE_TOOLS[mode].map(name => ASSISTANT_TOOLS[name].function)))};
const agentInput = isCatalogDraft
  ? 'TAREA ADMIN: El producto a autocompletar se llama \"' + turns.at(-1).content + '\". No busques en la tienda ni uses herramientas. Genera exclusivamente el objeto JSON con reply breve, links:[], requestDraft:null y el objeto productDraft completo con description, material, colors, weightGrams, estimatedProductionHours y estimateBasis.'
  : transcript + '\\n\\nDevuelve exclusivamente el JSON solicitado por el sistema.';
return [{json:{mode,task,toolCapability:body.toolCapability,toolEndpointUrl:body.toolEndpointUrl,systemPrompt,agentInput}}];` },
  });
  connectMain(entryName, prepareName);
  nodes.push({
    name: agentName, id: `vertice-ai-agent-${mode}`, type: '@n8n/n8n-nodes-langchain.agent', typeVersion: 3.1,
    position: [790, y], parameters: {
      promptType: 'define', text: '={{ $json.agentInput }}',
      options: { systemMessage: '={{ $json.systemPrompt }}', maxIterations: mode === 'quote' ? 3 : 4, returnIntermediateSteps: false },
      hasOutputParser: false,
    },
  });
  connectMain(prepareName, agentName);
  nodes.push({
    name: toolName, id: `vertice-authorized-tools-${mode}`, type: '@n8n/n8n-nodes-langchain.toolHttpRequest', typeVersion: 1.1,
    position: [790, y + 150], parameters: {
      method: 'POST', url: `={{ $('${prepareName}').first().json.toolEndpointUrl }}`,
      sendHeaders: false,
      sendBody: true, specifyBody: 'json',
      jsonBody: `={{ JSON.stringify({ capability: $('${prepareName}').first().json.toolCapability, mode: '${mode}', name: '{tool_name}', args: '__VERTICE_ARGS__' }).replace('"__VERTICE_ARGS__"', '{tool_args}') }}`,
      placeholderDefinitions: { values: [
        { name: 'tool_name', description: `Nombre exacto de una herramienta permitida para ${mode}: ${ROLE_TOOLS[mode].join(', ')}`, type: 'string' },
        { name: 'tool_args', description: 'Argumentos JSON de esa herramienta; usa un objeto vacío cuando no requiera argumentos.', type: 'json' },
      ] },
      toolDescription: toolDescriptions[mode],
      options: { timeout: 12000 },
    },
  });
  connectAi(toolName, 'ai_tool', agentName);
  connectMain(agentName, 'Validar respuesta del asistente');
}

nodes.push({
  name: 'DeepSeek Chat Model', id: 'deepseek-chat-model', type: '@n8n/n8n-nodes-langchain.lmChatDeepSeek', typeVersion: 1,
  position: [470, 1160], parameters: {
    model: 'deepseek-flash',
    options: { temperature: 0.2, maxTokens: 2400, timeout: 40000, maxRetries: 1 },
  },
});
connections['DeepSeek Chat Model'] = { ai_languageModel: [[...assistantModes.map((mode) => ({ node: `AI Agent — ${agentLabels[mode]}`, type: 'ai_languageModel', index: 0 }))]] };

const normalizeName = 'Validar respuesta del asistente';
nodes.push({
  name: normalizeName, id: 'normalize-ai-response', type: 'n8n-nodes-base.code', typeVersion: 2,
  position: [1120, 680], parameters: { mode: 'runOnceForAllItems', jsCode: `const raw = $input.first().json.output ?? $input.first().json.text;
if (typeof raw !== 'string' || !raw.trim()) throw new Error('El Agent no devolvió una respuesta');
if (/agent stopped due to max iterations/i.test(raw)) return [{json:{output:{error:'ASSISTANT_ITERATION_LIMIT'}}}];
let output;
const normalized = raw.trim().replace(/^\x60\x60\x60(?:json)?\\s*/i,'').replace(/\\s*\x60\x60\x60$/,'');
try { output = JSON.parse(normalized); } catch { output = {reply:raw,links:[]}; }
if (output?.error === 'ASSISTANT_ITERATION_LIMIT') return [{json:{output:{error:output.error}}}];
if (!output || typeof output.reply !== 'string' || !output.reply.trim() || output.reply.length > 5000 || !Array.isArray(output.links)) throw new Error('Formato de respuesta inválido');
const draft = output.requestDraft && typeof output.requestDraft === 'object' && !Array.isArray(output.requestDraft) ? output.requestDraft : null;
const productDraft = output.productDraft && typeof output.productDraft === 'object' && !Array.isArray(output.productDraft) ? output.productDraft : null;
return [{json:{output:{reply:output.reply.trim(),links:output.links.filter(link => link && typeof link.label === 'string' && typeof link.path === 'string').slice(0,4),requestDraft:draft,productDraft}}}];` },
});

const rateWebhook = rates.nodes.find((node) => node.type.endsWith('.webhook'));
const rateWebhookName = add(rateWebhook, { name: 'Entrada — tasas públicas', id: 'entry-rates', position: [180, 1260] });
const rateNodes = rates.nodes.filter((node) => ['Consultar Hacienda', 'Consultar ARESEP', 'Recortar tarifas y responder'].includes(node.name));
const rateNames = new Map();
for (const [index, source] of rateNodes.entries()) rateNames.set(source.name, add(source, { id: `rates-${source.id}`, position: [470 + index * 300, 1260] }));
const ratesCodeName = rateNames.get('Recortar tarifas y responder');
nodes.find((node) => node.name === ratesCodeName).parameters.jsCode = nodes.find((node) => node.name === ratesCodeName).parameters.jsCode.replaceAll("$('Entrada segura')", `$('${rateWebhookName}')`);
connectMain(rateWebhookName, rateNames.get('Consultar Hacienda'));
connectMain(rateNames.get('Consultar Hacienda'), rateNames.get('Consultar ARESEP'));
connectMain(rateNames.get('Consultar ARESEP'), ratesCodeName);

const emailWebhook = email.nodes.find((node) => node.type.endsWith('.webhook'));
const emailWebhookName = add(emailWebhook, { name: 'Entrada — correo de cotización', id: 'entry-quote-email', position: [180, 1620] });
const emailNodes = email.nodes.filter((node) => ['Validar y preparar correo', 'Enviar correo al cliente + copia oculta', 'Confirmar aceptación de Gmail'].includes(node.name));
const emailNames = new Map();
for (const [index, source] of emailNodes.entries()) emailNames.set(source.name, add(source, { id: `email-${source.id}`, position: [470 + index * 320, 1620] }));
connectMain(emailWebhookName, emailNames.get('Validar y preparar correo'));
connectMain(emailNames.get('Validar y preparar correo'), emailNames.get('Enviar correo al cliente + copia oculta'));
connectMain(emailNames.get('Enviar correo al cliente + copia oculta'), emailNames.get('Confirmar aceptación de Gmail'));

// Payment notifications are deterministic. They never use an agent and only
// accept explicitly labelled DEMO or PayPal SANDBOX receipts.
const paymentEntryName = add(emailWebhook, {
  name: 'Entrada — aviso de pago', id: 'entry-payment-email', position: [180, 2010],
  parameters: { path: 'vertice-payment-email' },
});
const quotePreparer = email.nodes.find((node) => node.name === 'Validar y preparar correo');
const paymentPrepareName = 'Preparar recibo de pago';
const paymentPrepareCode = String.raw`const data = $input.first().json.body ?? $input.first().json;
const requiredText = (value, field, maxLength) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) throw new Error('Campo inválido: ' + field);
  return value.trim();
};
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const orderId = requiredText(data.orderId, 'orderId', 128);
if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(orderId)) throw new Error('orderId inválido');
const customerEmail = requiredText(data.customerEmail ?? data.to, 'customerEmail', 254);
const workshopEmail = requiredText(data.workshopEmail ?? data.bcc, 'workshopEmail', 254);
if (!validEmail(customerEmail) || !validEmail(workshopEmail)) throw new Error('Correo destinatario inválido');
const rawPaymentMode = requiredText(data.paymentMode, 'paymentMode', 24).toUpperCase();
if (!['DEMO', 'SANDBOX', 'PAYPAL_SANDBOX', 'SINPE_MANUAL'].includes(rawPaymentMode)) throw new Error('paymentMode debe ser DEMO, SANDBOX o SINPE_MANUAL');
const paymentMode = rawPaymentMode === 'PAYPAL_SANDBOX' ? 'SANDBOX' : rawPaymentMode;
if ((data.orderStatus !== undefined && String(data.orderStatus).toUpperCase() !== 'CONFIRMED') || (data.paymentStatus !== undefined && String(data.paymentStatus).toUpperCase() !== 'PAID')) throw new Error('El recibo requiere orderStatus CONFIRMED y paymentStatus PAID');
const amountValue = data.amountCrc ?? data.totalCrc;
const amountCrc = Number(amountValue);
if (amountValue === '' || amountValue === null || !Number.isSafeInteger(amountCrc) || amountCrc <= 0 || (data.currency !== undefined && data.currency !== 'CRC')) throw new Error('amountCrc debe ser un monto CRC entero y positivo');
const paidAt = requiredText(data.paidAt, 'paidAt', 40);
if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(paidAt)) throw new Error('paidAt debe incluir fecha ISO 8601 con zona horaria');
const paidDate = new Date(paidAt);
if (!Number.isFinite(paidDate.getTime())) throw new Error('paidAt inválido');
const deliveryKey = requiredText(data.deliveryKey, 'deliveryKey', 300);
const paymentMethod = typeof data.paymentMethod === 'string' ? data.paymentMethod.trim().slice(0, 60) : '';
const paymentReference = typeof data.paymentReference === 'string' ? data.paymentReference.trim().slice(0, 120) : '';
const rawLines = data.orderLines ?? data.lines;
if (rawLines !== undefined && rawLines !== null && (!Array.isArray(rawLines) || rawLines.length > 40)) throw new Error('orderLines debe ser una lista válida de máximo 40 elementos');
const orderLines = (rawLines || []).map((line, index) => {
  if (!line || typeof line !== 'object' || Array.isArray(line)) throw new Error('orderLines[' + index + '] inválido');
  const description = requiredText(line.description ?? line.productName ?? line.name, 'orderLines[' + index + '].description', 180);
  const quantity = line.quantity == null || line.quantity === '' ? null : Number(line.quantity);
  if (quantity !== null && (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000)) throw new Error('orderLines[' + index + '].quantity inválida');
  return {description, quantity};
});
const summary = data.summary == null || (typeof data.summary === 'string' && !data.summary.trim()) ? '' : requiredText(data.summary, 'summary', 300);
const amount = new Intl.NumberFormat('es-CR', {style:'currency', currency:'CRC', maximumFractionDigits:0}).format(amountCrc);
const date = new Intl.DateTimeFormat('es-CR', {dateStyle:'long', timeStyle:'short', timeZone:'America/Costa_Rica'}).format(paidDate);
const modeNotice = paymentMode === 'DEMO'
  ? 'Pago DEMO registrado para presentación académica. No se transfirió dinero real.'
  : paymentMode === 'SINPE_MANUAL'
    ? 'Comprobante SINPE Móvil verificado manualmente por el taller.'
    : 'Pago de PayPal SANDBOX registrado en entorno de pruebas. No se transfirió dinero real.';
const row = (label, value) => '<tr><th align="left" style="padding:12px 8px;border-bottom:1px solid #ded7cd;color:#71675e;font-size:14px">' + escapeHtml(label) + '</th><td align="right" style="padding:12px 8px;border-bottom:1px solid #ded7cd;color:#201b16;font-size:14px;word-break:break-word">' + escapeHtml(value) + '</td></tr>';
const lineRows = orderLines.map(line => '<tr><td style="padding:10px 8px;border-bottom:1px solid #ded7cd;color:#201b16;font-size:14px;word-break:break-word">' + escapeHtml(line.description) + '</td><td align="right" style="padding:10px 8px;border-bottom:1px solid #ded7cd;color:#71675e;font-size:14px;white-space:nowrap">' + (line.quantity === null ? '—' : String(line.quantity)) + '</td></tr>').join('');
const orderDetails = summary || lineRows
  ? '<h2 style="margin:24px 0 10px;font-size:17px">Detalle del pedido</h2>' + (summary ? '<p style="margin:0 0 12px;color:#51483f;font-size:14px;line-height:1.6">' + escapeHtml(summary) + '</p>' : '') + (lineRows ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + lineRows + '</table>' : '')
  : '';
const realPaymentNotice = paymentMode === 'SINPE_MANUAL' ? 'El taller revisó y registró el comprobante informado.' : 'No se transfirió dinero real.';
const html = '<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body style="margin:0;background:#ece6dc;font-family:Arial,Helvetica,sans-serif;color:#201b16"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ece6dc"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#faf7f1;border:1px solid #d8cfc2"><tr><td style="padding:26px 24px;background:#181510;border-bottom:3px solid #ff5500;color:#faf7f1"><strong style="font-size:22px;letter-spacing:2px">VÉRTICE <span style="color:#ff5500">CR</span></strong><div style="margin-top:8px;color:#c0b5a6;font-size:13px">PAYMENT_MODE: ' + paymentMode + ' · Pedido ' + escapeHtml(orderId) + '</div></td></tr><tr><td style="padding:26px 24px"><p style="margin:0 0 18px;padding:14px;background:#f1e6d7;color:#754217;font-size:14px;line-height:1.6"><strong>' + escapeHtml(modeNotice) + '</strong></p><h1 style="margin:0 0 10px;font-size:25px">Recibo de pago</h1><p style="margin:0 0 22px;color:#71675e;font-size:15px;line-height:1.6">Registramos el pago asociado a tu pedido. Conservá este mensaje como comprobante de la operación en el entorno indicado.</p>' + orderDetails + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px">' + row('Pedido', orderId) + row('Monto', amount + ' CRC') + row('Fecha', date) + row('Modo', paymentMode) + (paymentMethod ? row('Método', paymentMethod) : '') + (paymentReference ? row('Referencia', paymentReference) : '') + '</table><p style="margin:22px 0 0;color:#71675e;font-size:13px;line-height:1.6">' + escapeHtml(realPaymentNotice) + '</p></td></tr><tr><td style="padding:18px 24px;border-top:1px solid #ded7cd;color:#71675e;font-size:12px">VÉRTICE CR · Impresión 3D bajo pedido · Referencia ' + escapeHtml(orderId) + '</td></tr></table></td></tr></table></body></html>';
return [{json:{customerEmail, workshopEmail, orderId, paymentMode, amountCrc, paidAt, deliveryKey, orderLines, summary, subject:'[' + paymentMode + '] Pago registrado · Pedido ' + orderId, html}}];`;
const paymentPreparer = add(quotePreparer, {
  name: paymentPrepareName, id: 'prepare-payment-email', position: [470, 2010],
  parameters: { jsCode: paymentPrepareCode },
});
const quoteSender = email.nodes.find((node) => node.name === 'Enviar correo al cliente + copia oculta');
const paymentSenderName = 'Enviar recibo al cliente + BCC taller';
const paymentSender = add(quoteSender, {
  name: paymentSenderName, id: 'send-payment-email', position: [790, 2010],
  parameters: {
    sendTo: '={{ $json.customerEmail }}',
    subject: '={{ $json.subject }}',
    emailType: 'html',
    message: '={{ $json.html }}',
    options: { ...quoteSender.parameters.options, bccEmail: '={{ $json.workshopEmail }}' },
  },
});
const quoteConfirmation = email.nodes.find((node) => node.name === 'Confirmar aceptación de Gmail');
const paymentConfirmationName = 'Confirmar recibo de pago';
const paymentConfirmationCode = `const sent=$input.first().json; const context=$('${paymentPrepareName}').first().json;
if (!sent.id) throw new Error('Gmail no confirmó messageId');
return [{json:{delivered:true,messageId:sent.id,orderId:context.orderId,deliveryKey:context.deliveryKey}}];`;
const paymentConfirmation = add(quoteConfirmation, {
  name: paymentConfirmationName, id: 'confirm-payment-email', position: [1110, 2010],
  parameters: { jsCode: paymentConfirmationCode },
});
connectMain(paymentEntryName, paymentPreparer);
connectMain(paymentPreparer, paymentSender);
connectMain(paymentSender, paymentConfirmation);

nodes.push({ name: 'Mapa del flujo', id: 'unified-setup-guide', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: [160, 30], parameters: {
  width: 1220, height: 330,
  content: `# Vértice CR · DeepSeek y automatizaciones\n\nTres agentes separados (público, Admin y cotización) comparten DeepSeek Chat Model. Selecciona la credencial DeepSeek existente y un modelo disponible en tu cuenta. Cada agente tiene instrucciones y herramientas por rol. Admin prepara CRUD; el guardado se confirma en la app.\n\nLos correos son ramas deterministas: cotización → validar → Gmail → messageId; aviso de pago → validar orderId, monto CRC, fecha y deliveryKey → recibo con orderLines/summary opcionales → Gmail → messageId + deliveryKey. Se acepta PAYMENT_MODE DEMO, SANDBOX/PAYPAL_SANDBOX o SINPE_MANUAL con la etiqueta correspondiente. El cliente recibe el correo y bcc/workshopEmail queda en copia oculta. Selecciona la credencial Gmail OAuth2 existente y Header Auth compartido en las seis entradas. No se incluyen secretos en el JSON ni hay agente de IA en la ruta de correo de pago.\n\nConfigura las URLs y VERTICE_ASSISTANT_TOOLS_URL en la API. Para Docker, el callback debe alcanzar el host (host.docker.internal), no localhost. Workflow inactivo al importar; asigna las credenciales y publica.`
} });

const unified = { name: 'Vértice CR — Agentes y automatizaciones', nodes, connections, active: false,
  settings: { executionOrder: 'v1', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', executionTimeout: 120 }, tags: [] };
const ids = nodes.map((node) => node.id);
const names = nodes.map((node) => node.name);
if (new Set(ids).size !== ids.length || new Set(names).size !== names.length) throw new Error('El workflow debe tener IDs y nombres únicos.');
await writeFile(resolve(directory, 'vertice-cr-unificado.json'), `${JSON.stringify(unified, null, 2)}\n`);
console.log(`Generado workflow n8n unificado: ${nodes.length} nodos, tres Agents, DeepSeek, dos correos deterministas y 6 entradas.`);
