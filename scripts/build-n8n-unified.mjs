import { readFile, writeFile } from 'node:fs/promises';
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

// Three authenticated entry points share one role-aware native n8n Tools Agent.
for (const [index, mode] of assistantModes.entries()) {
  const trigger = assistants[index].nodes.find((node) => node.type.endsWith('.webhook'));
  add(trigger, { name: `Entrada — asistente ${mode}`, id: `entry-assistant-${mode}`, position: [180, 430 + index * 170] });
}
const prepareName = 'Preparar contexto y permisos';
nodes.push({
  name: prepareName, id: 'prepare-ai-context', type: 'n8n-nodes-base.code', typeVersion: 2,
  position: [480, 680], parameters: { mode: 'runOnceForAllItems', jsCode: `const body = $input.first().json.body || {};
const modes = ${JSON.stringify(assistantModes)};
if (!modes.includes(body.mode) || !Array.isArray(body.messages) || body.messages.length > 12 || typeof body.toolCapability !== 'string' || body.toolCapability.length < 40 || typeof body.toolEndpointUrl !== 'string' || !/^https?:\\/\\//.test(body.toolEndpointUrl)) throw new Error('Contexto de asistente inválido');
const turns = body.messages.filter(m => ['user','assistant'].includes(m?.role) && typeof m.content === 'string').slice(-11).map(m => ({role:m.role,content:m.content.slice(0,3000)}));
if (!turns.length || turns.at(-1).role !== 'user') throw new Error('Falta el mensaje actual');
const transcript = turns.map(m => (m.role === 'user' ? 'Cliente' : 'Asistente') + ': ' + m.content).join('\\n\\n');
const prompts = ${JSON.stringify(ASSISTANT_PROMPTS)};
return [{json:{mode:body.mode,toolCapability:body.toolCapability,toolEndpointUrl:body.toolEndpointUrl,language:body.language==='en'?'English':'español de Costa Rica',systemPrompt:prompts[body.mode]+'\\n'+${JSON.stringify(ASSISTANT_COMMON_PROMPT)}+'\\nIdioma: '+(body.language==='en'?'English':'español de Costa Rica')+'\\nHerramientas permitidas: '+${JSON.stringify(ROLE_TOOLS)}[body.mode].join(', '),agentInput:transcript+'\\n\\nDevuelve exclusivamente el JSON solicitado por el sistema.'}}];` },
});
for (const mode of assistantModes) connectMain(`Entrada — asistente ${mode}`, prepareName);

const agentName = 'AI Agent — atención Vértice';
nodes.push({
  name: agentName, id: 'vertice-ai-agent', type: '@n8n/n8n-nodes-langchain.agent', typeVersion: 2.2,
  position: [800, 680], parameters: {
    promptType: 'define', text: '={{ $json.agentInput }}',
    options: { systemMessage: '={{ $json.systemPrompt }}', maxIterations: 4, returnIntermediateSteps: false },
    hasOutputParser: false,
  },
});
connectMain(prepareName, agentName);

nodes.push({
  name: 'DeepSeek Chat Model', id: 'deepseek-chat-model', type: '@n8n/n8n-nodes-langchain.lmChatDeepSeek', typeVersion: 1,
  position: [760, 930], parameters: {
    model: { __rl: true, mode: 'list', value: 'deepseek-chat', cachedResultName: 'deepseek-chat' },
    options: { temperature: 0.2, maxTokens: 1600, timeout: 40000, maxRetries: 1 },
  },
});
connectAi('DeepSeek Chat Model', 'ai_languageModel', agentName);

const toolName = 'Consultar herramientas autorizadas Vértice';
const toolList = assistantModes.map((mode) => `${mode}: ${ROLE_TOOLS[mode].join(', ')}`).join(' | ');
nodes.push({
  name: toolName, id: 'vertice-authorized-tools', type: 'n8n-nodes-base.httpRequestTool', typeVersion: 1.2,
  position: [1080, 930], parameters: {
    method: 'POST', url: "={{ $('Preparar contexto y permisos').first().json.toolEndpointUrl }}",
    sendHeaders: true, headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }] },
    sendBody: true, specifyBody: 'json', jsonBody: `={{ JSON.stringify({ capability: $('Preparar contexto y permisos').first().json.toolCapability, mode: $('Preparar contexto y permisos').first().json.mode, name: $fromAI('tool_name', 'Nombre exacto de una herramienta autorizada para este rol. ${toolList}', 'string'), args: $fromAI('arguments', 'Argumentos JSON requeridos por esa herramienta; pasa un objeto vacío si no requiere argumentos.', 'json') }) }}`,
    toolDescription: 'Consulta una herramienta de solo lectura/cálculo autorizada para el rol activo. La API valida rol, esquema y sesión; no edita catálogo, no cambia estados y no envía mensajes.',
    options: { timeout: 12000 },
  },
});
connectAi(toolName, 'ai_tool', agentName);

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
connectMain(agentName, normalizeName);

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
  content: `# Vértice CR · Automatizaciones conectadas\n\n## Conversación IA (fila superior)\nTres webhooks protegidos → contexto/rol → **AI Agent** → respuesta validada. El modelo conectado es **DeepSeek Chat Model**; la herramienta HTTP invoca el dispatcher de Vértice con una capacidad efímera. La API aplica allowlist por rol, valida argumentos y lee/calcúla datos; n8n no recibe JWT ni acceso directo a JSON Server. La app entrega historial acotado; no se duplica memoria.\n\n## Procesos deterministas (filas inferiores)\n**Tasas:** webhook → Hacienda → ARESEP → recorte/validación. **Correo:** webhook → validar → Gmail → confirmar messageId. El Agent nunca controla esos envíos ni inventa tarifas.\n\n## Credenciales y conexión\nSelecciona Header Auth «X-Vertice-Webhook-Token» en los 5 webhooks, credencial **DeepSeek API** en el Chat Model y **Gmail OAuth2** en el nodo Gmail. Configura las 3 URLs de webhook y VERTICE_ASSISTANT_TOOLS_URL en el backend. Si n8n corre en Docker, la URL de callback debe alcanzar el host del backend (por ejemplo host.docker.internal); no uses localhost para salir del contenedor.\n\nWorkflow inactivo al importar. Costos de cotización DEMO; las tasas oficiales no vuelven reales materiales, energía ni mano de obra.`
} });

const unified = { name: 'Vértice CR — Agentes y automatizaciones', nodes, connections, active: false,
  settings: { executionOrder: 'v1', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', executionTimeout: 120 }, tags: [] };
const ids = nodes.map((node) => node.id);
const names = nodes.map((node) => node.name);
if (new Set(ids).size !== ids.length || new Set(names).size !== names.length) throw new Error('El workflow debe tener IDs y nombres únicos.');
await writeFile(resolve(directory, 'vertice-cr-unificado.json'), `${JSON.stringify(unified, null, 2)}\n`);
console.log(`Generado workflow n8n unificado: ${nodes.length} nodos, Agent nativo, DeepSeek, dispatcher seguro y 5 entradas.`);
