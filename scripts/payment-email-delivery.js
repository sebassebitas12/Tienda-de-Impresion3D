import process from 'node:process';
import {
  buildPaymentEmailPayload,
  createPaymentEmailIntent,
  updatePaymentEmail,
} from './payment-email-outbox.js';

const DELIVERY_TIMEOUT_MS = 10_000;
const SAFE_REASON = /^[A-Z][A-Z0-9_]{0,63}$/;

/** Queue one deterministic email intent without mutating the paid order. */
export function queuePaymentEmail(order, now) {
  return createPaymentEmailIntent(order, now);
}

function safeNow(clock) {
  try {
    const value = clock();
    const date = value instanceof Date ? value : new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  } catch {
    return null;
  }
}

function resultForOrder(order) {
  const paymentEmail = order?.paymentEmail;
  const status = paymentEmail?.status;
  if (typeof status !== 'string') return { status: 'FAILED', reason: 'PAYMENT_EMAIL_INTENT_REQUIRED' };

  const result = { status };
  const messageId = paymentEmail.metadata?.messageId;
  const reason = paymentEmail.metadata?.reason;
  if (status === 'SENT' && typeof messageId === 'string' && messageId.trim()) {
    result.messageId = messageId.trim();
  }
  if (typeof reason === 'string' && SAFE_REASON.test(reason)) result.reason = reason;
  return result;
}

function hasControlCharacters(value) {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 31 || (codePoint >= 127 && codePoint <= 159)) return true;
  }
  return false;
}

function webhookConfiguration(env) {
  const webhookUrl = typeof env?.VERTICE_PAYMENT_EMAIL_WEBHOOK_URL === 'string'
    ? env.VERTICE_PAYMENT_EMAIL_WEBHOOK_URL.trim()
    : '';
  const sharedToken = env?.VERTICE_PAYMENT_EMAIL_WEBHOOK_TOKEN || env?.VERTICE_QUOTE_EMAIL_WEBHOOK_TOKEN;
  const webhookToken = typeof sharedToken === 'string'
    ? sharedToken.trim()
    : '';
  const workshopEmail = typeof env?.VERTICE_WORKSHOP_EMAIL === 'string'
    ? env.VERTICE_WORKSHOP_EMAIL.trim()
    : '';

  if (!webhookUrl) return { error: 'WEBHOOK_URL_MISSING' };
  if (!webhookToken) return { error: 'WEBHOOK_TOKEN_MISSING' };
  if (!workshopEmail) return { error: 'WORKSHOP_EMAIL_MISSING' };
  if (webhookToken.length > 4096 || hasControlCharacters(webhookToken)) {
    return { error: 'WEBHOOK_TOKEN_INVALID' };
  }

  try {
    const parsed = new URL(webhookUrl);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname
      || parsed.username || parsed.password || webhookUrl.length > 2048) {
      return { error: 'WEBHOOK_URL_INVALID' };
    }
  } catch {
    return { error: 'WEBHOOK_URL_INVALID' };
  }

  return { webhookUrl, webhookToken, workshopEmail };
}

function makeWebhookPayload(payload, order) {
  const paymentMethod = payload.paymentMode === 'SINPE_MANUAL'
    ? 'SINPE Móvil · verificado por el taller'
    : 'PayPal Sandbox';
  const paymentReference = payload.paymentMode === 'SINPE_MANUAL'
    ? order.paymentProof?.referenceNumber
    : order.paymentEvidence?.captureId;

  return {
    orderId: payload.orderId,
    customerEmail: payload.to,
    workshopEmail: payload.bcc,
    paymentMode: payload.paymentMode,
    amountCrc: payload.totalCrc,
    currency: payload.currency,
    paidAt: payload.paidAt,
    deliveryKey: payload.deliveryKey,
    orderStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod,
    ...(typeof paymentReference === 'string' && paymentReference.trim()
      ? { paymentReference: paymentReference.trim().slice(0, 120) }
      : {}),
    orderLines: payload.lines,
    summary: payload.summary,
  };
}

function cloneData(data) {
  return structuredClone(data);
}

function findOrderIndex(data, orderId) {
  return Array.isArray(data?.orders)
    ? data.orders.findIndex(order => String(order.id) === orderId)
    : -1;
}

function terminalResult(status, reason) {
  return { status, ...(reason ? { reason } : {}) };
}

/**
 * Dispatch a queued payment receipt once. SENDING is persisted before HTTP;
 * no serialization lock is held while the n8n request is in flight.
 */
export async function dispatchPaymentEmail({
  orderId,
  db,
  serialize,
  persist,
  fetchImpl = globalThis.fetch,
  env = process.env,
  clock = () => new Date(),
} = {}) {
  if (typeof orderId !== 'string' || !orderId.trim()
    || !db || typeof serialize !== 'function' || typeof persist !== 'function') {
    return terminalResult('FAILED', 'INVALID_DISPATCH_INPUT');
  }
  const requestedOrderId = orderId.trim();

  let prepared;
  try {
    prepared = await serialize(async () => {
      const data = db.data;
      const orderIndex = findOrderIndex(data, requestedOrderId);
      if (orderIndex < 0) return { result: terminalResult('FAILED', 'ORDER_NOT_FOUND') };

      const order = data.orders[orderIndex];
      const currentStatus = order.paymentEmail?.status;
      if (currentStatus && currentStatus !== 'PENDING') {
        return { result: resultForOrder(order) };
      }
      if (currentStatus !== 'PENDING') {
        return { result: terminalResult('FAILED', 'PAYMENT_EMAIL_INTENT_REQUIRED') };
      }

      const customer = Array.isArray(data.users)
        ? data.users.find(user => String(user.id) === String(order.userId) && user.role === 'customer')
        : null;
      const configuration = webhookConfiguration(env);
      const builtPayload = configuration.error
        ? { error: configuration.error }
        : buildPaymentEmailPayload({ order, customer, workshopEmail: configuration.workshopEmail });
      let invalidReason = builtPayload.error || null;
      if (!invalidReason && (order.paymentEmail.orderId !== builtPayload.orderId
        || order.paymentEmail.deliveryKey !== builtPayload.deliveryKey)) {
        invalidReason = 'PAYMENT_EMAIL_INTENT_MISMATCH';
      }
      if (!invalidReason && typeof fetchImpl !== 'function') invalidReason = 'FETCH_UNAVAILABLE';

      const startedAt = safeNow(clock);
      const sending = updatePaymentEmail(order, 'SENDING', startedAt ? { startedAt } : undefined);
      if (sending.error) return { result: terminalResult('FAILED', sending.error) };

      const sendingData = cloneData(data);
      sendingData.orders[orderIndex] = sending;
      try {
        await persist(sendingData);
      } catch {
        return { result: terminalResult('PENDING', 'PERSISTENCE_FAILED') };
      }

      if (invalidReason) {
        const failed = updatePaymentEmail(sending, 'FAILED', { reason: invalidReason });
        if (failed.error) return { result: terminalResult('SENDING', 'OUTBOX_TRANSITION_FAILED') };
        const failedData = cloneData(sendingData);
        failedData.orders[orderIndex] = failed;
        try {
          await persist(failedData);
          return { result: resultForOrder(failed) };
        } catch {
          return { result: terminalResult('SENDING', 'PERSISTENCE_FAILED') };
        }
      }

      return {
        orderId: requestedOrderId,
        deliveryKey: builtPayload.deliveryKey,
        webhookUrl: configuration.webhookUrl,
        webhookToken: configuration.webhookToken,
        body: makeWebhookPayload(builtPayload, order),
      };
    });
  } catch {
    return terminalResult('PENDING', 'PERSISTENCE_FAILED');
  }

  if (prepared?.result) return prepared.result;
  if (!prepared?.deliveryKey || !prepared?.body) {
    return terminalResult('FAILED', 'PAYMENT_EMAIL_PREPARATION_FAILED');
  }

  let outcome;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
  try {
    const response = await fetchImpl(prepared.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vertice-Webhook-Token': prepared.webhookToken,
      },
      body: JSON.stringify(prepared.body),
      signal: controller.signal,
    });
    if (!response?.ok || controller.signal.aborted) throw new Error('uncertain');

    const confirmation = await response.json();
    if (controller.signal.aborted) throw new Error('uncertain');
    const messageId = typeof confirmation?.messageId === 'string' ? confirmation.messageId.trim() : '';
    const validConfirmation = confirmation && typeof confirmation === 'object' && !Array.isArray(confirmation)
      && confirmation.delivered === true
      && confirmation.orderId === prepared.orderId
      && confirmation.deliveryKey === prepared.deliveryKey
      && messageId.length > 0 && messageId.length <= 500
      && !hasControlCharacters(messageId);
    outcome = validConfirmation
      ? { status: 'SENT', details: { messageId, sentAt: safeNow(clock) } }
      : { status: 'UNKNOWN', details: { reason: 'INVALID_CONFIRMATION' } };
  } catch {
    outcome = { status: 'UNKNOWN', details: { reason: 'DELIVERY_UNCERTAIN' } };
  } finally {
    clearTimeout(timeout);
  }

  try {
    return await serialize(async () => {
      const data = db.data;
      const orderIndex = findOrderIndex(data, prepared.orderId);
      if (orderIndex < 0) return terminalResult('UNKNOWN', 'ORDER_NOT_FOUND_AFTER_DELIVERY');

      const order = data.orders[orderIndex];
      if (order.paymentEmail?.status !== 'SENDING'
        || order.paymentEmail.deliveryKey !== prepared.deliveryKey) {
        return resultForOrder(order);
      }

      const updatedOrder = updatePaymentEmail(order, outcome.status, outcome.details);
      if (updatedOrder.error) return terminalResult('UNKNOWN', 'OUTBOX_TRANSITION_FAILED');
      const nextData = cloneData(data);
      nextData.orders[orderIndex] = updatedOrder;
      try {
        await persist(nextData);
      } catch {
        return terminalResult('UNKNOWN', 'PERSISTENCE_FAILED');
      }
      return resultForOrder(updatedOrder);
    });
  } catch {
    return terminalResult('UNKNOWN', 'PERSISTENCE_FAILED');
  }
}
