import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import process from 'node:process';
import { convertCrcToUsd } from '../src/utils/paypalCurrency.js';
import { sessionActor } from './session-access.js';
import { queuePaymentEmail } from './payment-email-delivery.js';

const FX_ENDPOINT = 'https://open.er-api.com/v6/latest/CRC';
const SANDBOX_API = 'https://api-m.sandbox.paypal.com';
let cachedFxQuote = null;
let cachedFxUntil = 0;

function safeAmount(value) {
  return Number.isFinite(value) ? value.toFixed(2) : null;
}

export async function fetchCrcUsdQuote(fetchImpl = globalThis.fetch) {
  if (cachedFxQuote && Date.now() < cachedFxUntil) return cachedFxQuote;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetchImpl(FX_ENDPOINT, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('FX_PROVIDER_UNAVAILABLE');
    const payload = await response.json();
    const usdPerCrc = payload?.rates?.USD;
    const rateDate = Date.parse(payload?.time_last_update_utc || '');
    if (payload?.result !== 'success' || payload.base_code !== 'CRC' || !Number.isFinite(usdPerCrc) || usdPerCrc <= 0 || !Number.isFinite(rateDate)) {
      throw new Error('FX_RESPONSE_INVALID');
    }
    const quote = { rate: 1 / usdPerCrc, rateDate: new Date(rateDate).toISOString(), source: 'ExchangeRate-API · open.er-api.com', sourceUrl: 'https://www.exchangerate-api.com' };
    const providerNextUpdate = Date.parse(payload?.time_next_update_utc || '');
    cachedFxQuote = quote;
    cachedFxUntil = Number.isFinite(providerNextUpdate) && providerNextUpdate > Date.now()
      ? providerNextUpdate - 5000 : Date.now() + 23 * 60 * 60 * 1000;
    return quote;
  } finally {
    clearTimeout(timeout);
  }
}

function requestId(orderId, action) {
  return createHash('sha256').update(`vertice:${action}:${orderId}`).digest('hex').slice(0, 24);
}

async function paypalRequest(fetchImpl, apiBase, path, { method = 'GET', token, body, idempotencyKey } = {}) {
  const response = await fetchImpl(`${apiBase}${path}`, {
    method,
    signal: AbortSignal.timeout(30000),
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(idempotencyKey ? { 'PayPal-Request-Id': idempotencyKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('PAYPAL_REQUEST_FAILED');
    error.providerStatus = response.status;
    error.providerCode = result?.name || result?.error || null;
    throw error;
  }
  return result;
}

async function getPaypalToken(fetchImpl, apiBase, env) {
  const clientId = env.VERTICE_PAYPAL_CLIENT_ID;
  const clientSecret = env.VERTICE_PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret || (env.VERTICE_PAYPAL_ENV || 'sandbox').toLowerCase() !== 'sandbox') {
    throw new Error('PAYPAL_NOT_CONFIGURED');
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetchImpl(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    signal: AbortSignal.timeout(30000),
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: 'grant_type=client_credentials',
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || typeof result.access_token !== 'string') {
    const error = new Error(response.status === 401 ? 'PAYPAL_CREDENTIALS_INVALID' : 'PAYPAL_UNAVAILABLE');
    error.providerStatus = response.status;
    throw error;
  }
  return result.access_token;
}

function validQuoteForPayment(order, data, now) {
  if (!order.sourceQuoteId && !order.customPrintRequestId) return true;
  const requestId = String(order.sourceQuoteId || order.customPrintRequestId);
  const request = (data.customPrintRequests || []).find(row => String(row.id) === requestId);
  return Boolean(request && request.status === 'APPROVED'
    && request.quoteVersion === order.scopeSnapshot?.quoteVersion
    && Date.parse(request.quoteValidUntil || '') > Date.parse(now));
}

function capturedPayment(paypalOrder) {
  const units = paypalOrder?.purchase_units || [];
  const captures = units.flatMap(unit => unit?.payments?.captures || []);
  return captures.find(capture => capture.status === 'COMPLETED') || null;
}

function makeEvent(order, actor, action, now, metadata = {}) {
  return { id: `evt-${createHash('sha256').update(`${order.id}:${action}:${now}`).digest('hex').slice(0, 24)}`,
    entity: 'order', entityId: String(order.id), action,
    fromStatus: order.status, toStatus: action === 'ORDER_PAYPAL_SANDBOX_CAPTURED' ? 'CONFIRMED' : order.status,
    actorId: String(actor.id), actorName: actor.name, occurredAt: now, metadata };
}

export function installPaypalPaymentOperations({ registerAction, db, serialize, persist, onPaymentConfirmed = async () => null, fetchImpl = globalThis.fetch, getFxQuote = fetchCrcUsdQuote, env = process.env, clock = () => new Date() }) {
  const failure = (res, code, status = 400) => res.status(status).json({ code });
  const apiBase = SANDBOX_API;

  registerAction('/orders/paypal/client-config', async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const orderId = req.body?.orderId;
    if (typeof orderId !== 'string' || !orderId) return failure(res, 'INVALID_ORDER', 400);
    const order = (db.data.orders || []).find(item => String(item.id) === orderId && String(item.userId) === String(actor.id));
    if (!order) return failure(res, 'ORDER_NOT_FOUND', 404);
    if (order.status !== 'PENDING' || order.paymentStatus === 'PAID' || !validQuoteForPayment(order, db.data, clock().toISOString())) {
      return failure(res, 'STATUS_CONFLICT', 409);
    }
    if (order.paymentProof?.status === 'SUBMITTED' || order.paymentProof?.status === 'CONFIRMED'
      || order.paymentMode === 'SINPE_MANUAL') return failure(res, 'PAYMENT_METHOD_CONFLICT', 409);
    if (!env.VERTICE_PAYPAL_CLIENT_ID || !env.VERTICE_PAYPAL_CLIENT_SECRET
      || (env.VERTICE_PAYPAL_ENV || 'sandbox').toLowerCase() !== 'sandbox') return failure(res, 'PAYPAL_NOT_CONFIGURED', 503);
    return res.json({ clientId: env.VERTICE_PAYPAL_CLIENT_ID, environment: 'sandbox' });
  });

  registerAction('/orders/paypal/create', async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const orderId = req.body?.orderId;
    if (typeof orderId !== 'string' || !orderId) return failure(res, 'INVALID_ORDER', 400);
    try {
      const result = await serialize(async () => {
        const orderIndex = (db.data.orders || []).findIndex(order => String(order.id) === orderId && String(order.userId) === String(actor.id));
        if (orderIndex < 0) return { error: 'ORDER_NOT_FOUND', status: 404 };
        const order = db.data.orders[orderIndex];
        if (order.status !== 'PENDING' || order.paymentStatus === 'PAID' || !validQuoteForPayment(order, db.data, clock().toISOString())) {
          return { error: 'STATUS_CONFLICT', status: 409 };
        }
        if (order.paymentProof?.status === 'SUBMITTED' || order.paymentProof?.status === 'CONFIRMED'
          || order.paymentMode === 'SINPE_MANUAL') return { error: 'PAYMENT_METHOD_CONFLICT', status: 409 };
        if (order.paypalCheckout?.status === 'CREATED' && order.paypalCheckout.approvalUrl) {
          return { order, approvalUrl: order.paypalCheckout.approvalUrl, providerOrderId: order.paypalCheckout.providerOrderId, clientId: env.VERTICE_PAYPAL_CLIENT_ID, fxSnapshot: order.paypalCheckout.fxSnapshot, amountUsd: order.paypalCheckout.amountUsd, replay: true };
        }

        const rateQuote = await getFxQuote(fetchImpl);
        const fxSnapshot = convertCrcToUsd(order.total ?? order.subtotalCrc ?? order.subtotal, rateQuote);
        if (!fxSnapshot || !Number.isFinite(fxSnapshot.amountUsd) || fxSnapshot.amountUsd <= 0) return { error: 'PAYMENT_AMOUNT_INVALID', status: 409 };
        const accessToken = await getPaypalToken(fetchImpl, apiBase, env);
        const appUrl = (env.VERTICE_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
        const paypalOrder = await paypalRequest(fetchImpl, apiBase, '/v2/checkout/orders', {
          method: 'POST', token: accessToken, idempotencyKey: requestId(order.id, 'create'),
          body: {
            intent: 'CAPTURE',
            purchase_units: [{
              reference_id: String(order.id), custom_id: String(order.id), invoice_id: String(order.id).slice(0, 127),
              description: order.scopeSnapshot?.name || `Vértice CR · pedido ${order.id}`,
              amount: { currency_code: 'USD', value: safeAmount(fxSnapshot.amountUsd) },
            }],
            application_context: {
              brand_name: 'Vértice 3D CR', user_action: 'PAY_NOW',
              return_url: `${appUrl}/carrito?paypal=return&orderId=${encodeURIComponent(order.id)}`,
              cancel_url: `${appUrl}/carrito?paypal=cancel&orderId=${encodeURIComponent(order.id)}`,
            },
          },
        });
        const approvalUrl = (paypalOrder.links || []).find(link => ['approve', 'payer-action'].includes(link.rel))?.href;
        if (paypalOrder.status !== 'CREATED' || typeof paypalOrder.id !== 'string' || !approvalUrl) return { error: 'PAYPAL_RESPONSE_INVALID', status: 502 };
        const now = clock().toISOString();
        const updated = { ...order, paypalCheckout: { providerOrderId: paypalOrder.id, status: 'CREATED', approvalUrl,
          amountUsd: fxSnapshot.amountUsd, currency: 'USD', fxSnapshot, createdAt: now }, updatedAt: now };
        const next = structuredClone(db.data);
        next.orders[orderIndex] = updated;
        await persist(next);
        return { order: updated, approvalUrl, providerOrderId: paypalOrder.id, clientId: env.VERTICE_PAYPAL_CLIENT_ID, fxSnapshot, amountUsd: fxSnapshot.amountUsd, replay: false };
      });
      if (result.error) return failure(res, result.error, result.status);
      return res.json({ orderId: result.order.id, approvalUrl: result.approvalUrl, providerOrderId: result.providerOrderId, clientId: result.clientId, fxSnapshot: result.fxSnapshot, amountUsd: result.amountUsd, replay: result.replay });
    } catch (error) {
      const code = ['PAYPAL_NOT_CONFIGURED', 'PAYPAL_CREDENTIALS_INVALID', 'PAYPAL_UNAVAILABLE', 'PAYPAL_REQUEST_FAILED', 'FX_PROVIDER_UNAVAILABLE', 'FX_RESPONSE_INVALID'].includes(error.message)
        ? error.message : 'PAYPAL_UNAVAILABLE';
      return failure(res, code, code === 'PAYPAL_NOT_CONFIGURED' ? 503 : 502);
    }
  });

  registerAction('/orders/paypal/capture', async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const { orderId, paypalOrderId } = req.body || {};
    if (typeof orderId !== 'string' || typeof paypalOrderId !== 'string' || !orderId || !paypalOrderId) return failure(res, 'INVALID_ORDER', 400);
    try {
      const result = await serialize(async () => {
        const orderIndex = (db.data.orders || []).findIndex(order => String(order.id) === orderId && String(order.userId) === String(actor.id));
        if (orderIndex < 0) return { error: 'ORDER_NOT_FOUND', status: 404 };
        const order = db.data.orders[orderIndex];
        if (order.paymentStatus === 'PAID' && order.paymentMode === 'PAYPAL_SANDBOX'
          && order.paypalCheckout?.providerOrderId === paypalOrderId) return { order, replay: true };
        if (order.status !== 'PENDING' || order.paymentStatus === 'PAID'
          || order.paypalCheckout?.providerOrderId !== paypalOrderId
          || !validQuoteForPayment(order, db.data, clock().toISOString())
          || order.paymentProof?.status === 'SUBMITTED' || order.paymentProof?.status === 'CONFIRMED'
          || order.paymentMode === 'SINPE_MANUAL') return { error: 'STATUS_CONFLICT', status: 409 };

        const accessToken = await getPaypalToken(fetchImpl, apiBase, env);
        const captured = await paypalRequest(fetchImpl, apiBase, `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
          method: 'POST', token: accessToken, idempotencyKey: requestId(order.id, 'capture'), body: {},
        });
        const payment = capturedPayment(captured);
        const amount = payment?.amount?.value;
        const amountCents = typeof amount === 'string' && /^\d+(\.\d{1,2})?$/.test(amount) ? Math.round(Number(amount) * 100) : null;
        const expectedCents = Math.round(order.paypalCheckout.amountUsd * 100);
        const amountMatches = captured.status === 'COMPLETED' && payment?.amount?.currency_code === 'USD' && amountCents === expectedCents;
        const now = clock().toISOString();
        const next = structuredClone(db.data);
        if (captured.status !== 'COMPLETED' || !payment) return { error: 'PAYMENT_NOT_COMPLETED', status: 409 };
        if (!amountMatches) {
          next.orders[orderIndex] = { ...order, paymentStatus: 'REVIEW_REQUIRED', updatedAt: now,
            paypalCheckout: { ...order.paypalCheckout, status: captured.status || 'UNKNOWN', reconciliationRequired: true,
              providerCaptureId: payment?.id || null, receivedCurrency: payment?.amount?.currency_code || null, receivedAmount: amount || null } };
          next.activityLog = [...(next.activityLog || []), makeEvent(order, actor, 'ORDER_PAYPAL_AMOUNT_REVIEW_REQUIRED', now,
            { providerOrderId: paypalOrderId, providerStatus: captured.status || null, expectedUsd: safeAmount(order.paypalCheckout.amountUsd), receivedCurrency: payment?.amount?.currency_code || null, receivedAmount: amount || null })];
          await persist(next);
          return { error: 'PAYMENT_REQUIRES_REVIEW', status: 409 };
        }

        const updated = queuePaymentEmail({ ...order, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'PAYPAL_SANDBOX',
          paidAt: now, updatedAt: now,
          paypalCheckout: { ...order.paypalCheckout, status: 'COMPLETED', providerCaptureId: payment.id, capturedAt: now },
          paymentEvidence: { mode: 'PAYPAL_SANDBOX', providerOrderId: paypalOrderId, captureId: payment.id,
            amountUsd: Number(amount), currency: 'USD', recordedAt: now } }, now);
        if (updated.error) throw new Error('PAYMENT_EMAIL_QUEUE_FAILED');
        next.orders[orderIndex] = updated;
        next.activityLog = [...(next.activityLog || []), makeEvent(order, actor, 'ORDER_PAYPAL_SANDBOX_CAPTURED', now,
          { providerOrderId: paypalOrderId, captureId: payment.id, amountUsd: Number(amount), currency: 'USD', amountCrc: order.total ?? order.subtotalCrc ?? order.subtotal,
            fxRate: order.paypalCheckout.fxSnapshot.rate, fxRateDate: order.paypalCheckout.fxSnapshot.rateDate })];
        if (order.customPrintRequestId || order.sourceQuoteId) {
          const requestIdValue = String(order.sourceQuoteId || order.customPrintRequestId);
          const requestIndex = (next.customPrintRequests || []).findIndex(row => String(row.id) === requestIdValue);
          if (requestIndex >= 0) {
            const request = next.customPrintRequests[requestIndex];
            next.customPrintRequests[requestIndex] = { ...request, status: 'PAID', orderId: order.id, paidAt: now, paymentMode: 'PAYPAL_SANDBOX', updatedAt: now };
            next.activityLog.push({ id: `evt-${createHash('sha256').update(`${order.id}:quote-paid:${now}`).digest('hex').slice(0, 24)}`,
              entity: 'customPrintRequest', entityId: requestIdValue, action: 'REQUEST_PAYPAL_SANDBOX_PAYMENT_RECORDED',
              fromStatus: 'APPROVED', toStatus: 'PAID', actorId: String(actor.id), actorName: actor.name, occurredAt: now,
              metadata: { orderId: order.id, providerCaptureId: payment.id } });
          }
        }
        await persist(next);
        return { order: updated, replay: false };
      });
      if (result.error) return failure(res, result.error, result.status);
      const paymentEmail = !result.replay ? await Promise.resolve().then(() => onPaymentConfirmed(result.order.id)).catch(() => ({ status: 'UNKNOWN' })) : null;
      const latestOrder = db.data.orders.find(order => String(order.id) === String(result.order.id)) || result.order;
      return res.json({ order: latestOrder, replay: result.replay, ...(paymentEmail ? { paymentEmail } : {}) });
    } catch (error) {
      const code = ['PAYPAL_NOT_CONFIGURED', 'PAYPAL_CREDENTIALS_INVALID', 'PAYPAL_UNAVAILABLE', 'PAYPAL_REQUEST_FAILED'].includes(error.message) ? error.message : 'PAYPAL_UNAVAILABLE';
      return failure(res, code, code === 'PAYPAL_NOT_CONFIGURED' ? 503 : 502);
    }
  });
}
