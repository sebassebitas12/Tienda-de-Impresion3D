import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSISTANT_COMMON_PROMPT, ASSISTANT_PROMPTS, ROLE_TOOLS } from '../src/utils/assistantPolicies.js';
import { RATE_SOURCES } from './quote-rates.js';

const directory = fileURLToPath(new URL('../automation/n8n/', import.meta.url));
await mkdir(directory, { recursive: true });
const node = (name, type, parameters, x, version = 2) => ({ name, id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'), type: `n8n-nodes-base.${type}`, typeVersion: version, position: [x, 300], parameters });
const webhook = (path) => node('Entrada segura', 'webhook', { httpMethod: 'POST', path, authentication: 'headerAuth', responseMode: 'lastNode', responseData: 'firstEntryJson', options: {} }, 180, 2.1);
const code = (name, jsCode, x) => node(name, 'code', { mode: 'runOnceForAllItems', jsCode }, x);
const http = (name, url, x, options = {}) => node(name, 'httpRequest', { url, options: { timeout: 10000 }, ...options }, x, 4.2);
function workflow(name, nodes, description) {
  const connections = Object.fromEntries(nodes.slice(0, -1).map((n, index) => [n.name, { main: [[{ node: nodes[index + 1].name, type: 'main', index: 0 }]] }]));
  return { name, nodes: [...nodes, { name: 'Configuración y alcance', id: 'setup-note', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: [180, 60], parameters: { content: description, width: 930, height: 200 } }],
    connections, active: false, settings: { executionOrder: 'v1', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', executionTimeout: 90 }, tags: [] };
}

for (const mode of ['general', 'admin', 'quote']) {
  const system = `${ASSISTANT_PROMPTS[mode]}\n${ASSISTANT_COMMON_PROMPT}`;
  const prepare = `const body = $input.first().json.body || {};
if (body.mode !== ${JSON.stringify(mode)} || !Array.isArray(body.messages) || body.messages.length > 30 || !Array.isArray(body.tools)) throw new Error('Contexto inválido');
const allowed = ${JSON.stringify(ROLE_TOOLS[mode])};
const tools = body.tools.filter(t => allowed.includes(t.function?.name));
const messages = body.messages.filter(m => ['user','assistant','tool'].includes(m.role));
if (!messages.length) throw new Error('Falta mensaje');
return [{json:{model:'deepseek-flash',thinking:{type:'disabled'},max_tokens:1600,response_format:{type:'json_object'},
messages:[{role:'system',content:${JSON.stringify(system)}+'\\nIdioma: '+(body.language==='en'?'English':'Español de Costa Rica')},...messages],tools,tool_choice:'auto'}}];`;
  const model = http('DeepSeek por rol', 'https://api.deepseek.com/chat/completions', 660, {
    method: 'POST', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth', sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json) }}',
    options: { timeout: 40000 },
  });
  const normalize = `const body=$input.first().json; const choice=body.choices?.[0];
if (!choice || !['stop','tool_calls'].includes(choice.finish_reason) || choice.message?.role!=='assistant') throw new Error('Respuesta incompleta del modelo');
return [{json:{message:choice.message}}];`;
  const data = workflow(`Vértice — Asistente ${mode}`, [webhook(`vertice-assistant-${mode}`), code('Preparar rol y herramientas', prepare, 420), model, code('Respuesta normalizada', normalize, 900)],
    `## Asistente ${mode}\n1. Entrada: selecciona tu Header Auth existente (X-Vertice-Webhook-Token).\n2. DeepSeek: selecciona Header Auth con Name Authorization y Value Bearer TU_API_KEY. Modelo editable: deepseek-flash.\n3. Publica. La API Vértice valida sesión y ejecuta las tools por rol; este workflow solo recibe contexto autorizado. Tools: ${ROLE_TOOLS[mode].join(', ')}. No accede a JSON Server ni modifica datos.`);
  await writeFile(resolve(directory, `vertice-assistant-${mode}.json`), JSON.stringify(data, null, 2) + '\n');
}

const exchange = http('Consultar Hacienda', RATE_SOURCES.exchange, 420);
exchange.onError = 'continueRegularOutput';
const electricity = http('Consultar ARESEP', RATE_SOURCES.electricity, 660);
electricity.onError = 'continueRegularOutput';
const rates = workflow('Vértice — Tasas públicas de cotización', [webhook('vertice-rates'), exchange, electricity,
  code('Recortar tarifas y responder', `const body=$('Entrada segura').first().json.body||{};
const selection=body.selection||{}; const date=String(body.date||'');
const rows=$('Consultar ARESEP').first().json.value||[];
const value=Array.isArray(rows)?rows.filter(r=>Number(r.anho)===Number(date.slice(0,4))&&Number(r.id_Mes)===Number(date.slice(5,7))&&r.empresa===selection.company&&r.tipoTarifa===selection.tariff&&String(r.bloque).trim()===String(selection.block||'').trim()).slice(0,3):[];
return [{json:{exchange:$('Consultar Hacienda').first().json,electricity:{value}}}];`, 900)],
  '## Tasas oficiales\nSelecciona Header Auth existente en Entrada segura y publica. Hacienda entrega USD compra/venta sin API key. ARESEP devuelve empresa/tarifa/bloque; la API Vértice revalida fecha, unidad y coincidencia única. Sin selección exacta se mantiene electricidad DEMO. Errores externos producen fallback DEMO identificado en el snapshot; no se inventa una tasa oficial.');
await writeFile(resolve(directory, 'vertice-rates.json'), JSON.stringify(rates, null, 2) + '\n');

const emailPath = resolve(directory, 'vertice-quote-email.json');
const email = JSON.parse(await readFile(emailPath, 'utf8'));
email.nodes[0].parameters.responseData = 'firstEntryJson';
const preparer = email.nodes.find(n => n.type === 'n8n-nodes-base.code');
if (!preparer.parameters.jsCode.includes('deliveryKey: data.deliveryKey')) preparer.parameters.jsCode = preparer.parameters.jsCode
  .replace('const name = escapeHtml', "const name = escapeHtml")
  .replace('html } }];', 'html, deliveryKey: data.deliveryKey } }];')
  .replace("subject: `Cotización Vértice CR", "subject: `${data.mode === 'DEMO' ? '[DEMO] ' : ''}${data.test ? '[PRUEBA] ' : ''}Cotización Vértice CR");
const finalName = 'Confirmar aceptación de Gmail';
email.nodes = email.nodes.filter(n => n.name !== finalName && n.type !== 'n8n-nodes-base.stickyNote');
email.nodes.push(code(finalName, `const sent=$input.first().json; const context=$('Validar y preparar correo').first().json;
if (!sent.id || !context.deliveryKey) throw new Error('Gmail no confirmó identificador');
return [{json:{delivered:true,messageId:sent.id,deliveryKey:context.deliveryKey}}];`, 1040));
email.connections['Enviar correo al cliente + copia oculta'] = { main: [[{ node: finalName, type: 'main', index: 0 }]] };
email.settings = { ...email.settings, saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', executionTimeout: 60 };
email.nodes.push({ name: 'Configuración del correo', id: 'email-setup', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: [180, 50], parameters: { width: 1020, height: 180, content: '## Cotización y copia al taller\nReutiliza Header Auth en Webhook y tu Gmail conectado. Publica. La API guarda una clave de entrega por solicitud/versión para evitar reintentos ambiguos. Gmail confirma messageId; solo entonces se registra el envío. Las simulaciones llevan [DEMO] y las pruebas [PRUEBA]. No actives retries automáticos del nodo Gmail.' } });
await writeFile(emailPath, JSON.stringify(email, null, 2) + '\n');
console.log('Generados 5 workflows n8n: 3 asistentes, tasas oficiales y correo.');
