import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { DEMO_PROFILES } from '../src/utils/quoteAutomation.js';
import { ROLE_TOOLS } from '../src/utils/assistantPolicies.js';
import { prepareAdminCatalogAction } from './admin-ai-catalog.js';

// Isolated database and mock HTTP provider. Never sends email or calls a paid API.
const directory = await mkdtemp(join(tmpdir(), 'vertice-automation-'));
const dbFile = join(directory, 'db.json');
const attachmentDirectory = join(directory, 'attachments');
const users = [
  { id: 'admin-test', name: 'Admin QA', email: 'qa-admin@vertice.cr', role: 'admin', status: 'ACTIVE' },
  { id: 'customer-test', name: 'Cliente QA', email: 'qa-customer@vertice.cr', role: 'customer', status: 'ACTIVE' },
  { id: 'other-test', name: 'Otro QA', email: 'qa-other@vertice.cr', role: 'customer', status: 'ACTIVE' },
];
await writeFile(dbFile, JSON.stringify({ users, products: [], categories: [], orderItems: [], orders: [{ id: 'qa-order', userId: 'customer-test', status: 'PENDING', paymentStatus: 'UNPAID', currency: 'CRC', total: 5000, orderItems: [{ productName: 'Pieza QA', quantity: 1 }] }], customPrintRequests: [], activityLog: [] }));
let mails = 0;
let paymentMails = 0;
const provider = createServer(async (req, res) => {
  let raw = ''; for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || '{}');
  assert.equal(req.headers['x-vertice-webhook-token'], 'qa-only-token');
  let payload;
  if (req.url === '/rates') payload = { exchange: { venta: { valor: 460, fecha: new Date().toISOString().slice(0, 10) } }, electricity: { value: [] } };
  else if (req.url === '/email') { mails++; payload = { delivered: true, deliveryKey: body.deliveryKey, messageId: 'mock-gmail-1' }; }
  else if (req.url === '/payment-email') { paymentMails++; payload = { delivered: true, orderId: body.orderId, deliveryKey: body.deliveryKey, messageId: `mock-payment-${paymentMails}` }; }
  else if (req.url === '/assistant' && body.messages?.at(-1)?.content === 'QA_PROVIDER_DOWN') {
    res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'provider unavailable' })); return;
  }
  else if (req.url === '/assistant' && body.messages?.at(-1)?.content === 'QA_INVALID_RESPONSE') payload = { output: 'not-json' };
  else {
    const name = body.mode === 'admin' ? 'admin_overview' : body.mode === 'quote' ? 'material_guide' : 'search_catalog';
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
  VERTICE_ATTACHMENT_DIR: attachmentDirectory,
  VERTICE_PAYMENT_EMAIL_WEBHOOK_URL: `${mockUrl}/payment-email`,
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
async function postMultipart(path, payload, attachments = [], id, expected = 200) {
  const form = new FormData();
  form.append('payload', JSON.stringify(payload));
  attachments.forEach(file => form.append('attachments', new Blob([file.data], { type: file.type }), file.name));
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { method: 'POST', headers: id ? { Authorization: `Bearer ${token(id)}` } : {}, body: form, signal: AbortSignal.timeout(8000) });
  const responseText = await response.text();
  let result; try { result = JSON.parse(responseText); } catch { throw new Error(`${path} returned HTTP ${response.status} with non-JSON body: ${responseText}`); }
  assert.equal(response.status, expected, `${path}: ${JSON.stringify(result)}`); assertions++; return result;
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const ready = await fetch(`http://127.0.0.1:${port}/users`); if (ready.ok) break; } catch { /* Start-up only. */ }
    if (api.exitCode !== null || attempt === 99) throw new Error(`API did not start: ${output}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await post('/quotes/create', {}, 'customer-test', 410);
  const aiCategoryAction = prepareAdminCatalogAction({ entity: 'categories', operation: 'CREATE', changes: { name: 'Categoría IA QA' } }, { categories: [], products: [] });
  await post('/admin/actions/catalog-ai-confirm', { action: aiCategoryAction }, 'customer-test', 403);
  const aiCategory = await post('/admin/actions/catalog-ai-confirm', { action: aiCategoryAction }, 'admin-test');
  assert.equal(aiCategory.record.name, 'Categoría IA QA'); assertions++;
  const retryAiCategory = await post('/admin/actions/catalog-ai-confirm', { action: aiCategoryAction }, 'admin-test');
  assert.equal(retryAiCategory.alreadyApplied, true); assertions++;
  const savedAiData = JSON.parse(await readFile(dbFile, 'utf8'));
  assert.equal(savedAiData.categories.length, 1); assertions++;
  await post('/assistants/chat', { mode: 'admin', message: 'Resumen' }, 'customer-test', 403);
  const unavailable = await post('/assistants/chat', { mode: 'general', message: 'QA_PROVIDER_DOWN' }, undefined, 502);
  assert.equal(unavailable.code, 'ASSISTANT_UNAVAILABLE'); assertions++;
  const invalidAssistantResponse = await post('/assistants/chat', { mode: 'general', message: 'QA_INVALID_RESPONSE' }, undefined, 502);
  assert.equal(invalidAssistantResponse.code, 'ASSISTANT_INVALID_RESPONSE'); assertions++;
  const publicQuoteChat = await post('/assistants/chat', { mode: 'quote', message: 'Ayuda', history: [] }, undefined);
  assert.equal(publicQuoteChat.source, 'N8N'); assertions++;
  const compressedPhoto = `data:image/webp;base64,${Buffer.alloc(300 * 1024).toString('base64')}`;
  const catalogWithGallery = await post('/products', { name: 'Galería QA', status: 'DRAFT', images: Array(6).fill(compressedPhoto) }, 'admin-test', 201);
  assert.equal(catalogWithGallery.images.length, 6);
  assert.equal(catalogWithGallery.images[0], compressedPhoto);
  assertions += 2;
  for (const [mode, id] of [['general', undefined], ['admin', 'admin-test'], ['quote', 'customer-test']]) {
    const chat = await post('/assistants/chat', { mode, message: 'Ayuda', history: [] }, id);
    assert.equal(chat.source, 'N8N'); assert.ok(chat.reply.includes('consultada')); assertions += 2;
  }
  await post('/assistants/tools', { mode: 'general', name: 'search_catalog', args: {} }, undefined, 400);
  const form = { profileId: 'organizador', material: 'PETG', quantity: 2, sizeScale: 1, needsDesign: false, description: 'Organizador para escritorio', idempotencyKey: 'qa-quote-one' };
  const preview = await post('/quotes/preview', form); assert.equal(preview.quote.mode, 'DEMO'); assertions++;
  const intakePayload = { description: 'Soporte organizador para herramientas de QA', intendedUse: 'Prueba local', dimensions: '12 x 8 cm', material: 'PETG', quantity: 2, needsDesign: false, referenceUrl: 'https://example.org/reference', sourceType: 'FILE_UPLOAD', idempotencyKey: 'qa-intake-one' };
  const attachment = { name: 'pieza.stl', type: 'model/stl', data: 'solid qa test' };
  const intake = await postMultipart('/quotes/submit-intake', intakePayload, [attachment], 'customer-test', 201);
  assert.equal(intake.request.status, 'PENDING_QUOTE'); assert.equal(intake.request.quotedPrice, undefined); assert.equal(intake.request.quotePricing, undefined); assert.equal(mails, 0); assertions += 4;
  assert.equal(intake.request.attachments[0].name, 'pieza.stl'); assert.equal(intake.request.attachments[0].size, attachment.data.length); assertions += 2;
  const duplicateIntake = await postMultipart('/quotes/submit-intake', intakePayload, [attachment], 'customer-test');
  assert.equal(duplicateIntake.replay, true); assert.equal(duplicateIntake.request.id, intake.request.id); assertions += 2;
  const customerFile = await post('/quotes/attachment/read', { requestId: intake.request.id, attachmentId: intake.request.attachments[0].id }, 'customer-test');
  assert.equal(Buffer.from(customerFile.data, 'base64').toString(), attachment.data); assertions++;
  await post('/quotes/attachment/read', { requestId: intake.request.id, attachmentId: intake.request.attachments[0].id }, 'other-test', 404);
  const adminFile = await post('/quotes/attachment/read', { requestId: intake.request.id, attachmentId: intake.request.attachments[0].id }, 'admin-test');
  assert.equal(adminFile.name, 'pieza.stl'); assertions++;
  const afterIntake = JSON.parse(await readFile(dbFile, 'utf8'));
  assert.equal(afterIntake.customPrintRequests.length, 1); assert.equal(afterIntake.activityLog.find(entry => entry.action === 'REQUEST_SUBMITTED').action, 'REQUEST_SUBMITTED');
  assert.equal('data' in afterIntake.customPrintRequests[0].attachments[0], false); assertions += 3;
  const priced = await post('/admin/actions/auto-quote', { requestId: intake.request.id, expectedStatus: 'PENDING_QUOTE', expectedVersion: 0, profileId: 'organizador' }, 'admin-test');
  assert.equal(priced.request.status, 'QUOTED'); assert.equal(priced.request.quotePricing.mode, 'DEMO'); assert.equal(mails, 0); assertions += 3;
  const rejectedTestEmail = await post('/admin/actions/send-quote-email', { requestId: intake.request.id, expectedStatus: 'QUOTED', expectedVersion: 1, testRecipient: 'qa-recipient@example.net' }, 'admin-test', 400);
  assert.equal(rejectedTestEmail.code, 'TEST_EMAIL_UNSUPPORTED'); assert.equal(mails, 0); assertions += 2;
  const created = await post('/admin/actions/send-quote-email', { requestId: intake.request.id, expectedStatus: 'QUOTED', expectedVersion: 1 }, 'admin-test');
  assert.equal(created.request.status, 'AWAITING_APPROVAL'); assert.equal(created.messageId, 'mock-gmail-1'); assert.equal(mails, 1); assertions += 3;
  const duplicate = await post('/admin/actions/send-quote-email', { requestId: intake.request.id, expectedStatus: 'QUOTED', expectedVersion: 1 }, 'admin-test'); assert.equal(duplicate.replay, true); assert.equal(mails, 1); assertions += 2;
  await post('/quotes/approve', { requestId: intake.request.id, expectedVersion: 1 }, 'other-test', 404);
  await post('/quotes/approve', { requestId: intake.request.id, expectedVersion: 999 }, 'customer-test', 409);
  await post('/quotes/approve', { requestId: intake.request.id, expectedVersion: 1 }, 'customer-test');
  const own = await post('/quotes/mine', {}, 'customer-test'); assert.equal(own.requests[0].status, 'APPROVED'); assertions++;
  await post('/admin/actions/quote-fulfillment', { requestId: intake.request.id, expectedVersion: 1, mode: 'DEMO' }, 'customer-test', 403);
  await post('/admin/actions/quote-fulfillment', { requestId: intake.request.id, expectedVersion: 1, mode: 'DEMO' }, 'admin-test', 409);
  await post('/quotes/pay-demo', { requestId: intake.request.id, expectedVersion: 1 }, 'customer-test', 409);
  const fulfilled = await post('/quotes/checkout', { requestId: intake.request.id, expectedVersion: 1 }, 'customer-test');
  assert.equal(fulfilled.order.status, 'PENDING'); assert.equal(fulfilled.order.paymentStatus, 'UNPAID'); assertions += 2;
  assert.equal(fulfilled.order.scopeSnapshot.fileName, 'pieza.stl'); assertions++;
  const repeated = await post('/quotes/checkout', { requestId: intake.request.id, expectedVersion: 1 }, 'customer-test'); assert.equal(repeated.replay, true); assertions++;
  const proofImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1kAAAAASUVORK5CYII=';
  async function payWithReviewedProof(orderId) {
    const submitted = await post('/orders/submit-payment-proof', { orderId, referenceNumber: 'QA-123456', sinpePhone: '8888-8888', proofFileName: 'qa.png', proofImageDataUrl }, 'customer-test');
    const confirmation = { orderId, decision: 'CONFIRM', expectedProofSubmittedAt: submitted.order.paymentProof.submittedAt };
    const paid = await post('/admin/actions/verify-payment', confirmation, 'admin-test');
    assert.equal(paid.order.paymentEmail.status, 'SENT'); assertions++;
    const mailCount = paymentMails;
    const replay = await post('/admin/actions/verify-payment', confirmation, 'admin-test');
    assert.equal(replay.replay, true); assert.equal(paymentMails, mailCount); assertions += 2;
    return paid;
  }
  await payWithReviewedProof(fulfilled.order.id);
  const other = await post('/quotes/mine', {}, 'other-test'); assert.equal(other.requests.length, 0); assertions++;
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, 'customer-test', 403);
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'READY' }, 'admin-test', 400);
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', expectedUpdatedAt: null, nextStatus: 'CONFIRMED' }, 'admin-test', 409);
  await post('/orders/pay-demo', { orderId: 'qa-order' }, 'customer-test', 409);
  const paidCatalog = await payWithReviewedProof('qa-order');
  assert.equal(paidCatalog.order.paymentMode, 'SINPE_MANUAL'); assert.equal(paidCatalog.order.status, 'CONFIRMED'); assert.equal(paymentMails, 2); assertions += 3;
  await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'PENDING', nextStatus: 'CONFIRMED' }, 'admin-test', 409);
  const advanced = await post('/admin/actions/order-transition', { orderId: 'qa-order', expectedStatus: 'CONFIRMED', expectedUpdatedAt: paidCatalog.order.updatedAt, nextStatus: 'IN_PRODUCTION' }, 'admin-test');
  assert.equal(advanced.order.status, 'IN_PRODUCTION'); assertions++;
  const persisted = JSON.parse(await readFile(dbFile, 'utf8')); assert.equal(persisted.quoteDeliveries[0].status, 'SENT');
  assert.ok(persisted.activityLog.some(event => event.action === 'ORDER_PAYMENT_CONFIRMED'));
  assert.ok(persisted.activityLog.some(event => event.action === 'REQUEST_SINPE_PAYMENT_CONFIRMED')); assertions += 3;

  const files = (await readdir('automation/n8n')).filter(name => name.endsWith('.json') && name !== 'vertice-cr-unificado.json'); assert.equal(files.length, 5); assertions++;
  for (const file of files) {
    const workflow = JSON.parse(await readFile(`automation/n8n/${file}`, 'utf8'));
    assert.equal(workflow.active, false); assertions++;
    const names = new Set(workflow.nodes.map(node => node.name));
    for (const node of workflow.nodes) {
      if (node.type.endsWith('.webhook')) { assert.equal(node.parameters.authentication, 'headerAuth'); assert.equal(node.parameters.responseData, 'firstEntryJson'); assertions += 2; }
      if (node.type.endsWith('.code')) { new Function('$input', '$', node.parameters.jsCode); assertions++; }
    }
    if (file.includes('assistant-')) {
      const providerNode = workflow.nodes.find(node => node.name === 'DeepSeek por rol');
      assert.equal(providerNode.parameters.url, 'https://api.deepseek.com/chat/completions');
      assert.ok(workflow.nodes.find(node => node.type.endsWith('.code'))?.parameters.jsCode.includes('deepseek-flash'));
      assertions += 2;
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
  const legacyImportFiles = await readdir('automation/vertice-n8n-import/n8n').catch(() => []);
  assert.ok(!legacyImportFiles.includes('vertice-cr-unificado.json')); assertions++;
  const unifiedNames = new Set(unified.nodes.map(node => node.name));
  const unifiedIds = unified.nodes.map(node => node.id);
  assert.equal(unified.active, false); assert.equal(new Set(unifiedIds).size, unifiedIds.length); assertions += 2;
  const expectedWebhookPaths = ['vertice-assistant-general', 'vertice-assistant-admin', 'vertice-assistant-quote', 'vertice-rates', 'vertice-quote-email', 'vertice-payment-email'];
  const unifiedWebhooks = unified.nodes.filter(node => node.type.endsWith('.webhook'));
  assert.deepEqual(unifiedWebhooks.map(node => node.parameters.path).sort(), [...expectedWebhookPaths].sort()); assertions++;
  assert.ok(unifiedWebhooks.every(node => node.parameters.authentication === 'headerAuth' && node.parameters.responseData === 'firstEntryJson')); assertions++;
  const aiAgents = unified.nodes.filter(node => node.type === '@n8n/n8n-nodes-langchain.agent');
  const aiAgentNames = ['AI Agent — público', 'AI Agent — Admin', 'AI Agent — cotización'];
  assert.deepEqual(aiAgents.map(node => node.name), aiAgentNames); assertions++;
  assert.deepEqual(aiAgents.map(node => node.parameters.options.maxIterations), [4, 4, 3]); assertions++;
  const openRouterNode = unified.nodes.find(node => node.name === 'DeepSeek Chat Model');
  assert.equal(openRouterNode.type, '@n8n/n8n-nodes-langchain.lmChatDeepSeek');
  assert.equal(openRouterNode.parameters.model, 'deepseek-flash'); assertions += 2;
  assert.deepEqual(unified.connections[openRouterNode.name].ai_languageModel[0].map(connection => connection.node), aiAgentNames); assertions++;
  for (const [index, mode] of ['general', 'admin', 'quote'].entries()) {
    const entryName = `Entrada — asistente ${mode}`;
    const prepareName = `Preparar contexto — ${mode}`;
    const agentName = aiAgentNames[index];
    const toolName = `Herramientas autorizadas — ${mode}`;
    const entry = unified.nodes.find(node => node.name === entryName);
    const preparer = unified.nodes.find(node => node.name === prepareName);
    const agent = unified.nodes.find(node => node.name === agentName);
    const toolNode = unified.nodes.find(node => node.name === toolName);
    assert.equal(entry.parameters.path, `vertice-assistant-${mode}`);
    assert.deepEqual(unified.connections[entryName].main[0].map(connection => connection.node), [prepareName]);
    assert.deepEqual(unified.connections[prepareName].main[0].map(connection => connection.node), [agentName]);
    assert.equal(unified.connections[toolName].ai_tool[0][0].node, agentName);
    assert.equal(toolNode.type, '@n8n/n8n-nodes-langchain.toolHttpRequest');
    assert.equal(toolNode.typeVersion, 1.1);
    assert.ok(toolNode.parameters.toolDescription.includes(ROLE_TOOLS[mode].join(', ')));
    assert.equal(toolNode.parameters.sendHeaders, false);
    assert.match(toolNode.parameters.jsonBody, /JSON\.stringify/);
    assert.match(toolNode.parameters.jsonBody, /\{tool_name\}/);
    assert.match(toolNode.parameters.jsonBody, /\{tool_args\}/);
    assert.deepEqual(toolNode.parameters.placeholderDefinitions.values.map(({ name, type }) => [name, type]), [['tool_name', 'string'], ['tool_args', 'json']]);
    assert.equal(agent.parameters.options.maxIterations, mode === 'quote' ? 3 : 4);
    const run = new Function('$input', preparer.parameters.jsCode);
    const input = { first: () => ({ json: { body: { mode, language: 'es', toolCapability: 'a'.repeat(43), toolEndpointUrl: 'http://localhost:3000/assistants/tools', messages: [{ role: 'user', content: 'Prueba' }] } } }) };
    const prepared = run(input);
    assert.equal(prepared[0].json.mode, mode);
    assert.ok(prepared[0].json.systemPrompt.includes(ROLE_TOOLS[mode][0]));
    assert.match(prepared[0].json.systemPrompt, /Trata cada herramienta como fuente de verdad únicamente para los campos que devuelve.*no agregues temperaturas, cifras, propiedades o certificaciones/i);
    assertions++;
    if (mode === 'general') {
      assert.match(prepared[0].json.systemPrompt, /preguntas generales sobre FDM, responde directamente sin llamar herramientas/i);
      assert.match(toolNode.parameters.toolDescription, /no para definiciones generales, no repitas llamadas/i);
      assert.match(prepared[0].json.systemPrompt, /PENDING_QUOTE; no crea por sí solo una estimación, precio, correo ni aprobación/);
      assert.match(prepared[0].json.systemPrompt, /imágenes o archivos STL\/OBJ/);
      assert.match(prepared[0].json.systemPrompt, /No digas que se aceptan STEP/);
      const catalogDraft = run({ first: () => ({ json: { body: { ...input.first().json.body, task: 'catalog_product_draft' } } }) });
      assert.equal(catalogDraft[0].json.task, 'catalog_product_draft');
      assert.match(catalogDraft[0].json.systemPrompt, /weightGrams.*estimatedProductionHours.*estimateBasis/s);
      assert.match(catalogDraft[0].json.systemPrompt, /Herramientas permitidas: ninguna/);
      assertions += 8;
    }
    if (mode === 'quote') {
      assert.match(toolNode.parameters.toolDescription, /no calcula precios, no consulta datos de Admin/);
      assert.doesNotMatch(toolNode.parameters.toolDescription, /quote_profiles|estimate_quote/);
      assertions += 2;
    }
    assert.throws(() => run({ first: () => ({ json: { body: { ...input.first().json.body, mode: 'otro-rol' } } }) }), /Contexto de asistente inválido/);
    assertions += 12;
  }
  const normalizer = unified.nodes.find(node => node.name === 'Validar respuesta del asistente');
  const runNormalizer = new Function('$input', normalizer.parameters.jsCode);
  const fromAgent = output => ({ first: () => ({ json: { output } }) });
  assert.deepEqual(runNormalizer(fromAgent('```json\n{"reply":"Listo.","links":[],"requestDraft":null}\n```'))[0].json.output,
    { reply: 'Listo.', links: [], requestDraft: null, productDraft: null });
  const suggestedProduct = { description: 'Soporte compacto para escritorio.', material: 'PETG', colors: ['Negro'], weightGrams: 35, estimatedProductionHours: 2, estimateBasis: 'Estimación orientativa.' };
  assert.deepEqual(runNormalizer(fromAgent(JSON.stringify({ reply: 'Ficha propuesta.', links: [], requestDraft: null, productDraft: suggestedProduct })))[0].json.output.productDraft,
    suggestedProduct);
  assert.deepEqual(runNormalizer(fromAgent('Agent stopped due to max iterations'))[0].json.output,
    { error: 'ASSISTANT_ITERATION_LIMIT' });
  assertions += 3;
  assert.equal(unified.nodes.filter(node => node.type.endsWith('.gmail')).length, 2); assertions++;
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
