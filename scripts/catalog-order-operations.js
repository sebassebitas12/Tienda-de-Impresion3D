import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { isOrderableProduct, MAX_CATALOG_ORDER_QUANTITY } from '../src/utils/cart.js';
import { productSubtotal } from '../src/utils/money.js';
import { sessionActor } from './session-access.js';
import { installDemoOrderPaymentOperation } from './order-payment-operations.js';

function normalizeRequestedItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const seen = new Set();
  const normalized = [];
  for (const item of items) {
    if (typeof item?.productId !== 'string' || !item.productId.trim()
      || typeof item.color !== 'string' || !item.color.trim()
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CATALOG_ORDER_QUANTITY) return null;
    const productId = item.productId.trim();
    const color = item.color.trim();
    const key = JSON.stringify([productId, color]);
    if (seen.has(key)) return null;
    seen.add(key);
    normalized.push({ productId, color, quantity: item.quantity });
  }
  return normalized.sort((a, b) => a.productId.localeCompare(b.productId) || a.color.localeCompare(b.color));
}

export function prepareCatalogOrder(data, actor, payload, now, idFactory = randomUUID) {
  if (actor?.role !== 'customer') return { error: 'CUSTOMER_REQUIRED' };
  if (typeof payload?.idempotencyKey !== 'string' || payload.idempotencyKey.length < 16 || payload.idempotencyKey.length > 120) {
    return { error: 'INVALID_ORDER' };
  }
  const requestedItems = normalizeRequestedItems(payload.items);
  if (!requestedItems) return { error: 'INVALID_ORDER' };
  const fingerprint = JSON.stringify(requestedItems);
  const existing = (data.orders || []).find(order => String(order.userId) === String(actor.id)
    && order.idempotencyKey === payload.idempotencyKey);
  if (existing) return existing.idempotencyFingerprint === fingerprint
    ? { order: existing, replay: true }
    : { error: 'IDEMPOTENCY_CONFLICT' };

  const products = data.products || [];
  const lineItems = [];
  let subtotalCrc = 0;
  for (const requested of requestedItems) {
    const product = products.find(row => String(row.id) === requested.productId);
    if (!isOrderableProduct(product) || !(product.availableColors || []).includes(requested.color)) {
      return { error: 'PRODUCT_UNAVAILABLE' };
    }
    const subtotal = productSubtotal(requested.quantity, product.price);
    if (subtotal === null || !Number.isSafeInteger(Math.round(subtotal * 100))) return { error: 'PRODUCT_PRICE_INVALID' };
    subtotalCrc = Math.round((subtotalCrc + subtotal + Number.EPSILON) * 100) / 100;
    lineItems.push({
      id: `oi-${idFactory()}`, productId: String(product.id), productName: product.name,
      material: product.material, color: requested.color, quantity: requested.quantity,
      unitPrice: product.price, subtotal, currency: 'CRC',
    });
  }
  if (!Number.isFinite(subtotalCrc) || subtotalCrc < 0 || !Number.isSafeInteger(Math.round(subtotalCrc * 100))) {
    return { error: 'PRODUCT_PRICE_INVALID' };
  }

  const orderId = `ord-${idFactory()}`;
  const order = {
    id: orderId, userId: String(actor.id), orderItems: lineItems,
    subtotalCrc, subtotal: subtotalCrc, total: subtotalCrc, currency: 'CRC',
    pricingScope: 'CATALOG_SUBTOTAL_ONLY', status: 'PENDING', paymentStatus: 'UNPAID', createdAt: now, updatedAt: now,
    idempotencyKey: payload.idempotencyKey, idempotencyFingerprint: fingerprint,
  };
  const event = {
    id: `evt-${idFactory()}`, entity: 'order', entityId: orderId,
    action: 'CATALOG_ORDER_CREATED', fromStatus: null, toStatus: 'PENDING',
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    metadata: { paymentStatus: 'UNPAID', pricingScope: 'CATALOG_SUBTOTAL_ONLY' },
  };
  const nextData = structuredClone(data);
  nextData.orders = [...(nextData.orders || []), order];
  nextData.orderItems = [...(nextData.orderItems || []), ...lineItems.map(item => ({ ...item, orderId }))];
  nextData.activityLog = [...(nextData.activityLog || []), event];
  return { order, event, nextData };
}

export function prepareOrderPaymentProof(data, actor, payload, now, idFactory = randomUUID) {
  if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return { error: 'CUSTOMER_REQUIRED', status: 403 };
  const orderIndex = (data.orders || []).findIndex(order => String(order.id) === String(payload?.orderId)
    && String(order.userId) === String(actor.id));
  if (orderIndex < 0) return { error: 'ORDER_NOT_FOUND', status: 404 };
  const order = data.orders[orderIndex];
  if (order.status !== 'PENDING' || order.paymentStatus === 'PAID') return { error: 'STATUS_CONFLICT', status: 409 };
  if (order.paymentProof?.status === 'SUBMITTED') return { error: 'PROOF_ALREADY_SUBMITTED', status: 409 };
  if (order.paymentProof?.status === 'CONFIRMED'
    || order.paymentMode === 'PAYPAL_SANDBOX' || order.paypalCheckout?.status === 'CREATED') {
    return { error: 'PAYMENT_METHOD_CONFLICT', status: 409 };
  }
  const quoteRequestId = order.sourceQuoteId || order.customPrintRequestId;
  if (quoteRequestId) {
    const quote = (data.customPrintRequests || []).find(row => String(row.id) === String(quoteRequestId));
    if (!quote || quote.status !== 'APPROVED' || quote.quoteVersion !== order.scopeSnapshot?.quoteVersion) {
      return { error: 'STATUS_CONFLICT', status: 409 };
    }
    const expiresAt = Date.parse(quote.quoteValidUntil || '');
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.parse(now)) return { error: 'QUOTE_EXPIRED', status: 409 };
  }
  const referenceNumber = typeof payload.referenceNumber === 'string' ? payload.referenceNumber.trim() : '';
  const sinpePhone = typeof payload.sinpePhone === 'string' ? payload.sinpePhone.trim() : '';
  const proofNotes = typeof payload.proofNotes === 'string' ? payload.proofNotes.trim() : '';
  const imageMatch = typeof payload.proofImageDataUrl === 'string'
    ? payload.proofImageDataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/)
    : null;
  if (referenceNumber.length < 4 || referenceNumber.length > 100) return { error: 'INVALID_REFERENCE', status: 400 };
  if (sinpePhone.length < 8 || sinpePhone.length > 25) return { error: 'INVALID_PHONE', status: 400 };
  if (typeof payload.proofNotes !== 'undefined' && typeof payload.proofNotes !== 'string') return { error: 'INVALID_NOTES', status: 400 };
  if (proofNotes.length > 500) return { error: 'INVALID_NOTES', status: 400 };
  if (!imageMatch || payload.proofImageDataUrl.length > 2_100_000) return { error: 'INVALID_PROOF_IMAGE', status: 400 };
  const imageBytes = Buffer.from(imageMatch[2], 'base64');
  const validImageSignature = imageMatch[1] === 'png'
    ? imageBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : imageMatch[1] === 'jpeg'
      ? imageBytes[0] === 255 && imageBytes[1] === 216 && imageBytes[2] === 255
      : imageBytes.subarray(0, 4).toString() === 'RIFF' && imageBytes.subarray(8, 12).toString() === 'WEBP';
  if (!validImageSignature || imageBytes.length > 1_500_000) return { error: 'INVALID_PROOF_IMAGE', status: 400 };
  const proofFileName = typeof payload.proofFileName === 'string' ? payload.proofFileName.trim().slice(0, 120) : '';
  const updated = { ...order, paymentProof: { referenceNumber, sinpePhone, proofNotes, proofFileName, imageDataUrl: payload.proofImageDataUrl,
    submittedAt: now, status: 'SUBMITTED' }, updatedAt: now };
  const event = { id: `evt-${idFactory()}`, entity: 'order', entityId: String(order.id),
    action: 'ORDER_PAYMENT_PROOF_SUBMITTED', fromStatus: 'PENDING', toStatus: 'PENDING',
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
    metadata: { referenceNumber, sinpePhone } };
  const nextData = structuredClone(data);
  nextData.orders[orderIndex] = updated;
  nextData.activityLog = [...(nextData.activityLog || []), event];
  return { order: updated, event, nextData };
}

export function installCatalogOrderOperations({ registerAction, db, serialize, persist }) {
  installDemoOrderPaymentOperation({ registerAction, db, serialize, persist });
  const failure = (res, code, status = 400) => res.status(status).json({ code });
  registerAction('/orders/mine', (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    const orders = (db.data.orders || [])
      .filter(order => String(order.userId) === String(actor.id))
      .map(order => ({ ...order, orderItems: (Array.isArray(order.orderItems)
        ? order.orderItems
        : (db.data.orderItems || []).filter(item => String(item.orderId) === String(order.id))).map(item => {
        const product = (db.data.products || []).find(candidate => String(candidate.id) === String(item.productId));
        return product && !item.productName ? { ...item, currentCatalogName: product.name } : item;
      }) }));
    return res.json({ orders });
  });
  registerAction('/orders/submit-catalog-order', async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer') return failure(res, 'CUSTOMER_REQUIRED', 403);
    try {
      const result = await serialize(async () => {
        const prepared = prepareCatalogOrder(db.data, actor, req.body || {}, new Date().toISOString());
        if (prepared.error || prepared.replay) return prepared;
        await persist(prepared.nextData);
        return prepared;
      });
      if (result.error) {
        const status = result.error === 'IDEMPOTENCY_CONFLICT' || result.error === 'PRODUCT_UNAVAILABLE' ? 409 : 400;
        return failure(res, result.error, status);
      }
      return res.json({ order: result.order, replay: Boolean(result.replay) });
    } catch { return failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });
  registerAction('/orders/submit-payment-proof', async (req, res) => {
    const actor = sessionActor(req.headers.authorization, db.data);
    if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return failure(res, 'CUSTOMER_REQUIRED', 403);
    try {
      const result = await serialize(async () => {
        const prepared = prepareOrderPaymentProof(db.data, actor, req.body || {}, new Date().toISOString());
        if (!prepared.error) await persist(prepared.nextData);
        return prepared;
      });
      if (result.error) return failure(res, result.error, result.status);
      return res.json({ order: result.order });
    } catch { return failure(res, 'ACTION_PERSISTENCE_FAILED', 500); }
  });
}
