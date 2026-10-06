import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const workflow = JSON.parse(await readFile(resolve(root, 'automation/n8n/vertice-cr-unificado.json'), 'utf8'));
const nodeByName = name => workflow.nodes.find(node => node.name === name);
const paymentEntry = nodeByName('Entrada — aviso de pago');
const paymentPrepare = nodeByName('Preparar recibo de pago');
const paymentGmail = nodeByName('Enviar recibo al cliente + BCC taller');
const paymentConfirmation = nodeByName('Confirmar recibo de pago');

assert.ok(paymentEntry && paymentPrepare && paymentGmail && paymentConfirmation, 'Debe existir la rama completa de correo de pago.');
assert.equal(workflow.active, false);
assert.equal(paymentEntry.parameters.httpMethod, 'POST');
assert.equal(paymentEntry.parameters.path, 'vertice-payment-email');
assert.equal(paymentEntry.parameters.authentication, 'headerAuth');
assert.equal(paymentEntry.parameters.responseMode, 'lastNode');
assert.equal(paymentEntry.parameters.responseData, 'firstEntryJson');
assert.equal(paymentGmail.type, 'n8n-nodes-base.gmail');
assert.equal(paymentGmail.parameters.sendTo, '={{ $json.customerEmail }}');
assert.equal(paymentGmail.parameters.options.bccEmail, '={{ $json.workshopEmail }}');
assert.equal(paymentGmail.parameters.emailType, 'html');
assert.deepEqual(workflow.connections[paymentEntry.name].main[0].map(link => link.node), [paymentPrepare.name]);
assert.deepEqual(workflow.connections[paymentPrepare.name].main[0].map(link => link.node), [paymentGmail.name]);
assert.deepEqual(workflow.connections[paymentGmail.name].main[0].map(link => link.node), [paymentConfirmation.name]);
assert.ok(!workflow.nodes.some(node => node.name === paymentPrepare.name && node.type.includes('langchain')));

const runPrepare = new Function('$input', paymentPrepare.parameters.jsCode);
const runConfirmation = new Function('$input', '$', paymentConfirmation.parameters.jsCode);
const input = payload => ({ first: () => ({ json: { body: payload } }) });
const payload = {
  paymentMode: 'DEMO', orderId: 'ord-qa:42', to: 'qa-customer@vertice.cr',
  bcc: 'qa-admin@vertice.cr', totalCrc: 5000, currency: 'CRC',
  paidAt: '2026-10-05T16:00:00.000Z', deliveryKey: 'payment-email:ord-qa%3A42:2026-10-05T16%3A00%3A00.000Z',
  orderLines: [{ description: 'Brazo de prueba', quantity: 2 }, { description: 'Base <b>extra</b>', quantity: null }],
  summary: '2 líneas <b>de pedido</b>', paymentMethod: 'SINPE Móvil', paymentReference: '<ref-qa>',
};
const prepared = runPrepare(input(payload))[0].json;
assert.equal(prepared.orderId, payload.orderId);
assert.equal(prepared.paymentMode, 'DEMO');
assert.equal(prepared.amountCrc, 5000);
assert.equal(prepared.paidAt, payload.paidAt);
assert.equal(prepared.deliveryKey, payload.deliveryKey);
assert.equal(prepared.summary, payload.summary);
assert.ok(prepared.subject.startsWith('[DEMO]'));
assert.match(prepared.html, /PAYMENT_MODE: DEMO/);
assert.match(prepared.html, /no se transfirió dinero real/i);
assert.match(prepared.html, /CRC/);
assert.match(prepared.html, /Detalle del pedido/);
assert.match(prepared.html, /Brazo de prueba/);
assert.match(prepared.html, /2 líneas &lt;b&gt;de pedido&lt;\/b&gt;/);
assert.match(prepared.html, /Base &lt;b&gt;extra&lt;\/b&gt;/);
assert.match(prepared.html, /&lt;ref-qa&gt;/);
assert.ok(!prepared.html.includes('<ref-qa>'), 'El contenido del correo debe escapar valores externos.');
const fromOutbox = runPrepare(input({ ...payload, orderLines: undefined, lines: payload.orderLines }))[0].json;
assert.match(fromOutbox.html, /Brazo de prueba/);
const summaryOnly = runPrepare(input({ ...payload, orderLines: undefined, summary: 'Resumen sin líneas' }))[0].json;
assert.match(summaryOnly.html, /Resumen sin líneas/);
const linesOnly = runPrepare(input({ ...payload, summary: '', orderLines: [{ description: 'Solo línea', quantity: 1 }] }))[0].json;
assert.match(linesOnly.html, /Solo línea/);

const sandbox = runPrepare(input({ ...payload, paymentMode: 'SANDBOX' }))[0].json;
assert.ok(sandbox.subject.startsWith('[SANDBOX]'));
assert.match(sandbox.html, /PayPal SANDBOX/);
const paypalSandbox = runPrepare(input({ ...payload, paymentMode: 'PAYPAL_SANDBOX' }))[0].json;
assert.equal(paypalSandbox.paymentMode, 'SANDBOX');
assert.ok(paypalSandbox.subject.startsWith('[SANDBOX]'));
const sinpeManual = runPrepare(input({ ...payload, paymentMode: 'SINPE_MANUAL' }))[0].json;
assert.match(sinpeManual.html, /comprobante SINPE Móvil verificado/i);
assert.doesNotMatch(sinpeManual.html, /No se transfirió dinero real/i);
const withoutOptionalDetails = runPrepare(input({
  paymentMode: 'DEMO', orderId: payload.orderId, customerEmail: 'qa-customer@vertice.cr',
  workshopEmail: 'qa-admin@vertice.cr', amountCrc: 5000, paidAt: payload.paidAt,
  deliveryKey: payload.deliveryKey,
}))[0].json;
assert.equal(withoutOptionalDetails.orderLines.length, 0);
assert.equal(withoutOptionalDetails.summary, '');
assert.doesNotMatch(withoutOptionalDetails.html, /Detalle del pedido/);

for (const [invalid, expectedError] of [
  [{ ...payload, to: '' }, /customerEmail/],
  [{ ...payload, bcc: 'not-an-email' }, /Correo destinatario/],
  [{ ...payload, paymentMode: 'LIVE' }, /DEMO, SANDBOX/],
  [{ ...payload, orderStatus: 'PENDING' }, /orderStatus CONFIRMED/],
  [{ ...payload, paymentStatus: 'UNPAID' }, /orderStatus CONFIRMED/],
  [{ ...payload, totalCrc: 0 }, /amountCrc/],
  [{ ...payload, totalCrc: 5.5 }, /amountCrc/],
  [{ ...payload, currency: 'USD' }, /amountCrc/],
  [{ ...payload, paidAt: '2026-10-05' }, /ISO 8601/],
  [{ ...payload, orderId: 'ord\nforged' }, /orderId inválido/],
  [{ ...payload, deliveryKey: '' }, /deliveryKey/],
  [{ ...payload, orderLines: [{ description: 'Pieza', quantity: 0 }] }, /quantity inválida/],
  [{ ...payload, summary: { total: 2 } }, /summary/],
]) assert.throws(() => runPrepare(input(invalid)), expectedError);

const ack = runConfirmation(
  { first: () => ({ json: { id: 'mock-gmail-payment-1' } }) },
  () => ({ first: () => ({ json: prepared }) }),
)[0].json;
assert.deepEqual(ack, { delivered: true, messageId: 'mock-gmail-payment-1', orderId: 'ord-qa:42', deliveryKey: payload.deliveryKey });
assert.throws(
  () => runConfirmation({ first: () => ({ json: {} }) }, () => ({ first: () => ({ json: prepared }) })),
  /Gmail no confirmó messageId/,
);

console.log('PASS: webhook de pago, desglose opcional, deliveryKey, modos y acuse mock; Gmail no se ejecutó.');
