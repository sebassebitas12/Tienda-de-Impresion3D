import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../automation/n8n/', import.meta.url));
const load = async (file) => JSON.parse(await readFile(resolve(directory, file), 'utf8'));
const assistantModes = ['general', 'admin', 'quote'];
const assistants = await Promise.all(assistantModes.map((mode) => load(`vertice-assistant-${mode}.json`)));
const rates = await load('vertice-rates.json');
const email = await load('vertice-quote-email.json');
const nodes = [];
const connections = {};
const uniqueId = (prefix, id) => `${prefix}-${id}`;
const add = (source, { name, id, position, parameters } = {}) => {
  const node = structuredClone(source);
  node.name = name || node.name;
  node.id = id || uniqueId('unified', node.id);
  if (position) node.position = position;
  if (parameters) node.parameters = { ...node.parameters, ...parameters };
  nodes.push(node);
  return node.name;
};
const connect = (from, to) => {
  connections[from] = { main: [[{ node: to, type: 'main', index: 0 }]] };
};

const assistantPreparers = [];
for (const [index, mode] of assistantModes.entries()) {
  const workflow = assistants[index];
  const trigger = workflow.nodes.find((node) => node.type.endsWith('.webhook'));
  const preparer = workflow.nodes.find((node) => node.name === 'Preparar rol y herramientas');
  const y = 220 + index * 250;
  const triggerName = add(trigger, {
    name: `Entrada — asistente ${mode}`,
    id: `entry-assistant-${mode}`,
    position: [180, y],
  });
  const preparerName = add(preparer, {
    name: `Preparar rol — ${mode}`,
    id: `prepare-assistant-${mode}`,
    position: [460, y],
  });
  connect(triggerName, preparerName);
  assistantPreparers.push(preparerName);
}

const sharedModel = assistants[0].nodes.find((node) => node.name === 'DeepSeek por rol');
const deepSeekName = add(sharedModel, {
  name: 'DeepSeek — orquestador compartido',
  id: 'deepseek-shared-orchestrator',
  position: [790, 470],
});
const normalize = assistants[0].nodes.find((node) => node.name === 'Respuesta normalizada');
const normalizeName = add(normalize, {
  name: 'Normalizar respuesta de IA',
  id: 'normalize-shared-ai-response',
  position: [1080, 470],
});
for (const preparer of assistantPreparers) connect(preparer, deepSeekName);
connect(deepSeekName, normalizeName);

const rateWebhook = rates.nodes.find((node) => node.type.endsWith('.webhook'));
const rateWebhookName = add(rateWebhook, {
  name: 'Entrada — tasas',
  id: 'entry-rates',
  position: [180, 1120],
});
const rateNodes = rates.nodes.filter((node) =>
  ['Consultar Hacienda', 'Consultar ARESEP', 'Recortar tarifas y responder'].includes(node.name));
const rateNames = new Map();
for (const [index, source] of rateNodes.entries()) {
  const name = add(source, {
    id: `rates-${source.id}`,
    position: [460 + index * 280, 1120],
  });
  rateNames.set(source.name, name);
}
const ratesCodeName = rateNames.get('Recortar tarifas y responder');
const ratesCode = nodes.find((node) => node.name === ratesCodeName);
ratesCode.parameters.jsCode = ratesCode.parameters.jsCode.replaceAll("$('Entrada segura')", `$('${rateWebhookName}')`);
connect(rateWebhookName, rateNames.get('Consultar Hacienda'));
connect(rateNames.get('Consultar Hacienda'), rateNames.get('Consultar ARESEP'));
connect(rateNames.get('Consultar ARESEP'), ratesCodeName);

const emailWebhook = email.nodes.find((node) => node.type.endsWith('.webhook'));
const emailWebhookName = add(emailWebhook, {
  name: 'Entrada — cotización por correo',
  id: 'entry-quote-email',
  position: [180, 1570],
});
const emailNodes = email.nodes.filter((node) =>
  ['Validar y preparar correo', 'Enviar correo al cliente + copia oculta', 'Confirmar aceptación de Gmail'].includes(node.name));
const emailNames = new Map();
for (const [index, source] of emailNodes.entries()) {
  emailNames.set(source.name, add(source, {
    id: `email-${source.id}`,
    position: [460 + index * 300, 1570],
  }));
}
connect(emailWebhookName, emailNames.get('Validar y preparar correo'));
connect(emailNames.get('Validar y preparar correo'), emailNames.get('Enviar correo al cliente + copia oculta'));
connect(emailNames.get('Enviar correo al cliente + copia oculta'), emailNames.get('Confirmar aceptación de Gmail'));

nodes.push({
  name: 'Guía de configuración',
  id: 'unified-setup-guide',
  type: 'n8n-nodes-base.stickyNote',
  typeVersion: 1,
  position: [180, 20],
  parameters: {
    width: 1160,
    height: 300,
    content: `# Vértice CR · Flujo unificado\n\nUn solo workflow con 5 entradas: tres asistentes, tasas y correo. Las entradas de IA comparten el mismo nodo DeepSeek después de validar su rol.\n\n## Credenciales\n- En los 5 Webhooks: Header Auth \u00b7 Name: X-Vertice-Webhook-Token. El valor coincide con el .env del backend.\n- En DeepSeek — orquestador compartido: Header Auth \u00b7 Name: Authorization \u00b7 Value: Bearer TU_API_KEY. Se configura una sola vez.\n- En Gmail — Enviar correo al cliente + copia oculta: selecciona/crea credencial Gmail OAuth2.\n\nConfigura URLs y token en el .env del backend. No publiques hasta completar las credenciales. Los costos siguen DEMO; tasas oficiales no vuelven reales los demás costos.`,
  },
});

const unified = {
  name: 'Vértice CR — Flujo unificado IA, tasas y cotización',
  nodes,
  connections,
  active: false,
  settings: {
    executionOrder: 'v1',
    saveDataSuccessExecution: 'none',
    saveDataErrorExecution: 'none',
    executionTimeout: 90,
  },
  tags: [],
};

const ids = nodes.map((node) => node.id);
const names = nodes.map((node) => node.name);
if (new Set(ids).size !== ids.length || new Set(names).size !== names.length) {
  throw new Error('El workflow unificado debe tener IDs y nombres únicos.');
}

await writeFile(resolve(directory, 'vertice-cr-unificado.json'), `${JSON.stringify(unified, null, 2)}\n`);
console.log(`Generado workflow n8n unificado: ${nodes.length} nodos, 5 entradas y DeepSeek compartido.`);
