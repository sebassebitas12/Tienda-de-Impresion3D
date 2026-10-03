import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSISTANT_COMMON_PROMPT, ASSISTANT_PROMPTS, ROLE_TOOLS } from '../src/utils/assistantPolicies.js';

const directory = fileURLToPath(new URL('../automation/n8n/', import.meta.url));
const load = async (file) => JSON.parse(await readFile(resolve(directory, file), 'utf8'));
const assistantModes = ['general', 'admin', 'quote'];
const assistants = await Promise.all(assistantModes.map((mode) => load(`vertice-assistant-${mode}.json`)));
const rates = await load('vertice-rates.json');
const email = await load('vertice-quote-email.json');
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
const turns = body.messages.filter(m => ['user','assistant'].includes(m?.role) && typeof m.content === 'string').slice(-11).map(m => ({role:m.role,content:m.content.slice(0,3000)}));
if (!turns.length || turns.at(-1).role !== 'user') throw new Error('Falta el mensaje actual');
const transcript = turns.map(m => (m.role === 'user' ? 'Cliente' : 'Asistente') + ': ' + m.content).join('\\n\\n');
const systemPrompt = ${JSON.stringify(ASSISTANT_PROMPTS[mode] + '\n' + ASSISTANT_COMMON_PROMPT)} + '\\nIdioma: ' + (body.language === 'en' ? 'English' : 'español de Costa Rica') + '\\nHerramientas permitidas: ' + ${JSON.stringify(ROLE_TOOLS[mode].join(', '))};
return [{json:{mode,toolCapability:body.toolCapability,toolEndpointUrl:body.toolEndpointUrl,systemPrompt,agentInput:transcript+'\\n\\nDevuelve exclusivamente el JSON solicitado por el sistema.'}}];` },
  });
  connectMain(entryName, prepareName);
  nodes.push({
    name: agentName, id: `vertice-ai-agent-${mode}`, type: '@n8n/n8n-nodes-langchain.agent', typeVersion: 2.2,
    position: [790, y], parameters: {
      promptType: 'define', text: '={{ $json.agentInput }}',
      options: { systemMessage: '={{ $json.systemPrompt }}', maxIterations: 4, returnIntermediateSteps: false },
      hasOutputParser: false,
    },
  });
  connectMain(prepareName, agentName);
  nodes.push({
    name: toolName, id: `vertice-authorized-tools-${mode}`, type: '@n8n/n8n-nodes-langchain.toolHttpRequest', typeVersion: 1.1,
    position: [790, y + 150], parameters: {
      method: 'POST', url: `={{ $('${prepareName}').first().json.toolEndpointUrl }}`,
      sendHeaders: false,
      sendBody: true, specifyBody: 'json', jsonBody: `={{ ({ capability: $('${prepareName}').first().json.toolCapability, mode: '${mode}', name: $fromAI('tool_name', 'Nombre exacto de una herramienta permitida para ${mode}: ${ROLE_TOOLS[mode].join(', ')}', 'string'), args: $fromAI('tool_args', 'Argumentos JSON de esa herramienta; usa un objeto vacío cuando no requiera argumentos.', 'json') }) }}`,
      toolDescription: `Herramienta del asistente ${agentLabels[mode]}: ${ROLE_TOOLS[mode].join(', ')}. Ejecuta consultas/cálculos autorizados por Vértice; no edita registros ni envía mensajes.`,
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
    options: { temperature: 0.2, maxTokens: 1600, timeout: 40000, maxRetries: 1 },
  },
});
connections['DeepSeek Chat Model'] = { ai_languageModel: [[...assistantModes.map((mode) => ({ node: `AI Agent — ${agentLabels[mode]}`, type: 'ai_languageModel', index: 0 }))]] };

const normalizeName = 'Validar respuesta del asistente';
nodes.push({
  name: normalizeName, id: 'normalize-ai-response', type: 'n8n-nodes-base.code', typeVersion: 2,
  position: [1120, 680], parameters: { mode: 'runOnceForAllItems', jsCode: `const raw = $input.first().json.output ?? $input.first().json.text;
if (typeof raw !== 'string' || !raw.trim()) throw new Error('El Agent no devolvió una respuesta');
let output;
try { output = JSON.parse(raw); } catch { output = {reply:raw,links:[]}; }
if (!output || typeof output.reply !== 'string' || !output.reply.trim() || output.reply.length > 5000 || !Array.isArray(output.links)) throw new Error('Formato de respuesta inválido');
return [{json:{output:{reply:output.reply.trim(),links:output.links.filter(link => link && typeof link.label === 'string' && typeof link.path === 'string').slice(0,4)}}}];` },
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

nodes.push({ name: 'Mapa del flujo', id: 'unified-setup-guide', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: [160, 30], parameters: {
  width: 1220, height: 330,
  content: `# Vértice CR · Automatizaciones conectadas\n\n## Tres asistentes independientes\n**General:** webhook → contexto general → AI Agent público → respuesta. **Admin:** webhook → contexto Admin → AI Agent Admin → respuesta. **Cotización:** webhook → contexto de cotización → AI Agent de cotización → respuesta. Cada agente tiene instrucciones, permisos y herramienta HTTP propios. Comparten solo la conexión de modelo **DeepSeek Chat Model**; el servidor vuelve a validar rol y argumentos. Los botones ya existen en Home/Tienda, Admin protegido y /solicitud.\n\nLa herramienta llama al dispatcher Vértice con una capacidad temporal; no se transmite JWT ni se da acceso directo a JSON Server. El historial lo aporta la app.\n\n## Procesos deterministas\n**Tasas:** webhook → Hacienda → ARESEP → recorte/validación. **Correo:** webhook → validar → Gmail → confirmar messageId. Los agentes no controlan envíos ni inventan tarifas.\n\n## Credenciales y conexión\nSelecciona Header Auth «X-Vertice-Webhook-Token» en los 5 webhooks, credencial **DeepSeek API** en el Chat Model y **Gmail OAuth2** en el nodo Gmail. Configura las 3 URLs de webhook y VERTICE_ASSISTANT_TOOLS_URL en el backend. Si n8n corre en Docker, la URL de callback debe alcanzar el host del backend (por ejemplo host.docker.internal); no uses localhost para salir del contenedor.\n\nWorkflow inactivo al importar. Costos de cotización DEMO; las tasas oficiales no vuelven reales materiales, energía ni mano de obra.`
} });

const unified = { name: 'Vértice CR — Agentes y automatizaciones', nodes, connections, active: false,
  settings: { executionOrder: 'v1', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', executionTimeout: 120 }, tags: [] };
const ids = nodes.map((node) => node.id);
const names = nodes.map((node) => node.name);
if (new Set(ids).size !== ids.length || new Set(names).size !== names.length) throw new Error('El workflow debe tener IDs y nombres únicos.');
await writeFile(resolve(directory, 'vertice-cr-unificado.json'), `${JSON.stringify(unified, null, 2)}\n`);
console.log(`Generado workflow n8n unificado: ${nodes.length} nodos, Agent nativo, DeepSeek, dispatcher seguro y 5 entradas.`);
