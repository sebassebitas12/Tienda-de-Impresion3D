import { randomUUID } from 'node:crypto';
import { isOrderableProduct } from '../src/utils/cart.js';
import { productSubtotal } from '../src/utils/money.js';
import { sessionActor } from './session-access.js';

function normalizeRequestedItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const seen = new Set();
  const normalized = [];
  for (const item of items) {
    if (typeof item?.productId !== 'string' || !item.productId.trim()
      || typeof item.color !== 'string' || !item.color.trim()
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1) return null;
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
    pricingScope: 'CATALOG_SUBTOTAL_ONLY', status: 'PENDING', createdAt: now,
    idempotencyKey: payload.idempotencyKey, idempotencyFingerprint: fingerprint,
  };
  const event = {
    id: `evt-${idFactory()}`, entity: 'order', entityId: orderId,
    action: 'CATALOG_ORDER_CREATED', fromStatus: null, toStatus: 'PENDING',
    actorId: String(actor.id), actorName: actor.name, occurredAt: now,
  };
  const nextData = structuredClone(data);
  nextData.orders = [...(nextData.orders || []), order];
  nextData.orderItems = [...(nextData.orderItems || []), ...lineItems.map(item => ({ ...item, orderId }))];
  nextData.activityLog = [...(nextData.activityLog || []), event];
  return { order, event, nextData };
}

export function installCatalogOrderOperations({ registerAction, db, serialize, persist }) {
  const failure = (res, code, status = 400) => res.status(status).json({ code });
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
}
