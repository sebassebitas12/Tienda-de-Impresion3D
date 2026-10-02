import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { DEMO_PROFILES } from '../src/utils/quoteAutomation.js';
import { ROLE_TOOLS } from '../src/utils/assistantPolicies.js';

// Isolated database and mock HTTP provider. Never sends email or calls a paid API.
const directory = await mkdtemp(join(tmpdir(), 'vertice-automation-'));
const dbFile = join(directory, 'db.json');
const users = [
  { id: 'admin-test', name: 'Admin QA', email: 'qa-admin@vertice.cr', role: 'admin', status: 'ACTIVE' },
  { id: 'customer-test', name: 'Cliente QA', email: 'qa-customer@vertice.cr', role: 'customer', status: 'ACTIVE' },
  { id: 'other-test', name: 'Otro QA', email: 'qa-other@vertice.cr', role: 'customer', status: 'ACTIVE' },
];
await writeFile(dbFile, JSON.stringify({ users, products: [], categories: [], orderItems: [], orders: [{ id: 'qa-order', userId: 'customer-test', status: 'PENDING', total: 5000 }], customPrintRequests: [], activityLog: [] }));
let mails = 0;
const provider = createServer(async (req, res) => {
  let raw = ''; for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || '{}');
  assert.equal(req.headers['x-vertice-webhook-token'], 'qa-only-token');
  let payload;
  if (req.url === '/rates') payload = { exchange: { venta: { valor: 460, fecha: new Date().toISOString().slice(0, 10) } }, electricity: { value: [] } };
  else if (req.url === '/email') { mails++; payload = { delivered: true, deliveryKey: body.deliveryKey, messageId: 'mock-gmail-1' }; }
  else {
    const name = body.mode === 'admin' ? 'admin_overview' : body.mode === 'quote' ? 'quote_profiles' : 'search_catalog';
    const tool = await fetch(`http://127.0.0.1:${port}/assistants/tools`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capability: body.toolCapability, mode: body.mode, name, args: name === 'search_catalog' ? { query: '' } : {} }) });
    assert.equal(tool.status, 200, `assistant tool callback: ${await tool.clone().text()}`);
    const toolResult = await tool.json();
    payload = { output: JSON.stringify({ reply: `Herramienta ${name} consultada.`, links: toolResult.result?.path ? [{ label: 'Abrir', path: toolResult.result.path }] : [] }) };
  }
  res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(payload));
});
await new Promise(resolve => provider.listen(0, '127.0.0.1', resolve));
const mockUrl = `http://127.0.0.1:${provider.address().port}`;
const portProbe = createServer(); await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve));
const port = portProbe.address().port; await new Promise(resolve => portProbe.close(resolve));
const api = spawn(process.execPath, ['scripts/api-server.js'], { cwd: process.cwd(), env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', VERTICE_DB_FILE: dbFile,
  VERTICE_QUOTE_EMAIL_WEBHOOK_URL: `${mockUrl}/email`, VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN: 'qa-only-token', VERTICE_RATES_WEBHOOK_URL: `${mockUrl}/rates`,
  VERTICE_ASSISTANT_GENERAL_URL: `${mockUrl}/assistant`, VERTICE_ASSISTANT_ADMIN_URL: `${mockUrl}/assistant`, VERTICE_ASSISTANT_QUOTE_URL: `${mockUrl}/assistant`,
  VERTICE_ASSISTANT_TOOLS_URL: `http://127.0.0.1:${port}/assistants/tools`, VERTICE_WORKSHOP_EMAIL: 'qa-admin@vertice.cr',
} });
let output = ''; api.stdout.on('data', chunk => { output += chunk; }); api.stderr.on('data', chunk => { output += chunk; });
const token = id => `sim.v1.${Buffer.from(JSON.stringify({ kind: 'SIMULATED_JWT', sub: id, role: users.find(u => u.id === id).role, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}`;
let assertions = 0;
async function post(path, body, id, expected = 200) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(id ? { Authorization: `Bearer ${token(id)}` } : {}) }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  const result = await response.json(); assert.equal(response.status, expected, `${path}: ${JSON.stringify(result)}`); assertions++; return result;
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const ready = await fetch(`http://127.0.0.1:${port}/users`); if (ready.ok) break; } catch { /* Start-up only. */ }
    if (api.exitCode !== null || attempt === 99) throw new Error(`API did not start: ${output}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await post('/quotes/create', {}, undefined, 403);
  await post('/assistants/chat', { mode: 'admin', message: 'Resumen' }, 'customer-test', 403);
  await post('/assistants/chat', { mode: 'quote', message: 'Ayuda' }, undefined, 403);
  for (const [mode, id] of [['general', undefined], ['admin', 'admin-test'], ['quote', 'customer-test']]) {
    const chat = await post('/assistants/chat', { mode, message: 'Ayuda', history: [] }, id);
    assert.equal(chat.source, 'DEEPSEEK'); assert.ok(chat.reply.includes('consultada')); assertions += 2;
  }
  await post('/assistants/tools', { mode: 'general', name: 'search_catalog', args: {} }, undefined, 400);
  const form = { profileId: 'organizador', material: 'PETG', quantity: 2, sizeScale: 1, needsDesign: false, description: 'Organizador para escritorio', idempotencyKey: 'qa-quote-one' };
  const preview = await post('/quotes/preview', form); assert.equal(preview.quote.mode, 'DEMO'); assertions++;
  const created = await post('/quotes/create', { ...form, sendEmail: true }, 'customer-test', 201);
  assert.equal(created.request.status, 'AWAITING_APPROVAL'); assert.equal(created.email.delivered, true); assert.equal(mails, 1); assertions += 3;
  const duplicate = await post('/quotes/create', { ...form, sendEmail: true }, 'customer-test'); assert.equal(duplicate.replay, true); assert.equal(mails, 1); assertions += 2;
  await post('/quotes/approve', { requestId: created.request.id, expectedVersion: 1 }, 'other-test', 409);
  await post('/quotes/approve', { requestId: created.request.id, expectedVersion: 999 }, 'customer-test', 409);
  await post('/quotes/approve', { requestId: created.request.id, expectedVersion: 1 }, 'customer-test');
  const own = await post('/quotes/mine', {}, 'customer-test'); assert.equal(own.requests[0].status, 'APPROVED'); assertions++;
  await post('/admin/actions/quote-fulfillment', { requestId: created.request.id, expectedVersion: 1, mode: 'DEMO' }, 'customer-test', 403);
  await post('/admin/actions/quote-fulfillment', { requestId: created.request.id, expectedVersion: 1, mode: 'MANUAL_VERIFIED', reference: 'fake-receipt', confirmed: true }, 'admin-test', 409);
  const fulfilled = await post('/admin/actions/quote-fulfillment', { requestId: created.request.id, expectedVersion: 1, mode: 'DEMO' }, 'admin-test');
  assert.equal(fulfilled.order.pricingMode, 'DEMO'); assert.equal(fulfilled.order.paymentEvidence.mode, 'DEMO'); assertions += 2;
  const repeated = await post('/admin/actions/quote-fulfillment', { requestId: created.request.id, expectedVersion: 1, mode: 'DEMO' }, 'admin-test'); assert.equal(repeated.replay, true); assertions++;
  const other = await post('/quotes/mine', {}, 'other-test'); assert.equal(other.requests.length, 0); assertions++;
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, 'customer-test', 403);
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'READY' }, 'admin-test', 400);
  const advanced = await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', expectedUpdatedAt: null, nextStatus: 'CONFIRMED' }, 'admin-test');
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, 'admin-test', 409);
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'CONFIRMED', expectedUpdatedAt: advanced.order.updatedAt, nextStatus: 'CANCELLED', reason: 'Cierre QA de prueba' }, 'admin-test');
  const persisted = JSON.parse(await readFile(dbFile, 'utf8')); assert.equal(persisted.quoteDeliveries[0].status, 'SENT'); assert.equal(persisted.activityLog.length, 6); assertions += 2;

  const files = (await readdir('automation/n8n')).filter(name => name.endsWith('.json') && name !== 'vertice-cr-unificado.json'); assert.equal(files.length, 5); assertions++;
  for (const file of files) {
    const workflow = JSON.parse(await readFile(`automation/n8n/${file}`, 'utf8'));
    assert.equal(workflow.active, false); assertions++;
    const names = new Set(workflow.nodes.map(node => node.name));
    for (const node of workflow.nodes) {
      if (node.type.endsWith('.webhook')) { assert.equal(node.parameters.authentication, 'headerAuth'); assert.equal(node.parameters.responseData, 'firstEntryJson'); assertions += 2; }
      if (node.type.endsWith('.code')) { new Function('$input', '$', node.parameters.jsCode); assertions++; }
    }
    for (const output of Object.values(workflow.connections)) for (const connections of output.main) for (const connection of connections) { assert.ok(names.has(connection.node)); assertions++; }
    if (file.includes('quote-email')) {
      const code = workflow.nodes.find(node => node.name === 'Validar y preparar correo').parameters.jsCode;
      const payload = { requestId: 'qa', amountCrc: 5000, deliveryKey: 'qa:1', mode: 'DEMO', customerEmail: 'qa@vertice.cr', adminEmail: 'taller@vertice.cr', validUntil: '2099-10-10', notes: '<script>attack</script>' };
      const prepared = new Function('$input', code)({ first: () => ({ json: { body: payload } }) });
      assert.ok(prepared[0].json.subject.startsWith('[DEMO]')); assert.equal(prepared[0].json.deliveryKey, 'qa:1'); assert.ok(!prepared[0].json.html.includes('<script>')); assertions += 3;
    }
  }
  const unified = JSON.parse(await readFile('automation/n8n/vertice-cr-unificado.json', 'utf8'));
  const unifiedNames = new Set(unified.nodes.map(node => node.name));
  const unifiedIds = unified.nodes.map(node => node.id);
  assert.equal(unified.active, false); assert.equal(new Set(unifiedIds).size, unifiedIds.length); assertions += 2;
  const expectedWebhookPaths = ['vertice-assistant-general', 'vertice-assistant-admin', 'vertice-assistant-quote', 'vertice-rates', 'vertice-quote-email'];
  const unifiedWebhooks = unified.nodes.filter(node => node.type.endsWith('.webhook'));
  assert.deepEqual(unifiedWebhooks.map(node => node.parameters.path).sort(), [...expectedWebhookPaths].sort()); assertions++;
  assert.ok(unifiedWebhooks.every(node => node.parameters.authentication === 'headerAuth' && node.parameters.responseData === 'firstEntryJson')); assertions++;
  const aiAgent = unified.nodes.find(node => node.name === 'AI Agent — atención Vértice');
  const deepSeekNode = unified.nodes.find(node => node.name === 'DeepSeek Chat Model');
  const toolNode = unified.nodes.find(node => node.name === 'Consultar herramientas autorizadas Vértice');
  assert.equal(aiAgent.type, '@n8n/n8n-nodes-langchain.agent'); assert.equal(aiAgent.parameters.options.maxIterations, 4); assertions += 2;
  assert.equal(deepSeekNode.type, '@n8n/n8n-nodes-langchain.lmChatDeepSeek'); assert.equal(deepSeekNode.parameters.model.value, 'deepseek-chat'); assertions += 2;
  assert.equal(toolNode.type, 'n8n-nodes-base.httpRequestTool'); assert.ok(toolNode.parameters.toolDescription); assertions += 2;
  assert.deepEqual(unified.connections[deepSeekNode.name].ai_languageModel[0][0], { node: aiAgent.name, type: 'ai_languageModel', index: 0 }); assertions++;
  assert.deepEqual(unified.connections[toolNode.name].ai_tool[0][0], { node: aiAgent.name, type: 'ai_tool', index: 0 }); assertions++;
  assert.equal(unified.nodes.filter(node => node.type.endsWith('.gmail')).length, 1); assertions++;
  const preparer = unified.nodes.find(node => node.name === 'Preparar contexto y permisos');
  const run = new Function('$input', preparer.parameters.jsCode);
  const makeInput = mode => ({ first: () => ({ json: { body: { mode, language: 'es', toolCapability: 'a'.repeat(43),
    toolEndpointUrl: 'http://localhost:3000/assistants/tools', messages: [{ role: 'user', content: 'Prueba' }] } } }) });
  for (const mode of ['general', 'admin', 'quote']) {
    const prepared = run(makeInput(mode)); assert.equal(prepared[0].json.mode, mode);
    assert.ok(prepared[0].json.systemPrompt.includes(ROLE_TOOLS[mode][0])); assertions += 2;
  }
  assert.throws(() => run(makeInput('otro-rol')), /Contexto de asistente inválido/); assertions++;
  for (const [from, output] of Object.entries(unified.connections)) {
    assert.ok(unifiedNames.has(from));
    for (const branch of output.main || []) for (const connection of branch) assert.ok(unifiedNames.has(connection.node));
    for (const [type, branches] of Object.entries(output)) if (type !== 'main') for (const branch of branches.flat()) assert.ok(unifiedNames.has(branch.node));
    assertions += (output.main?.flat().length || 0) + Object.entries(output).filter(([type]) => type !== 'main').reduce((sum, [, branches]) => sum + branches.flat().length, 0) + 1;
  }
  for (const node of unified.nodes) if (node.type.endsWith('.code')) { new Function('$input', '$', node.parameters.jsCode); assertions++; }
  for (const profile of DEMO_PROFILES) { await readFile(`public${profile.image}`); assertions++; }
  console.log(`PASS: ${assertions} comprobaciones HTTP, permisos, idempotencia, correo mock, tools, workflows y assets. Base aislada: ${dbFile}`);
} finally {
  api.kill(); provider.close();
}
