import { automationAction } from './automationService.js';

export function submitOrderPaymentProof({ orderId, referenceNumber, sinpePhone, proofNotes }, { token, signal } = {}) {
  return automationAction('/orders/submit-payment-proof', { orderId, referenceNumber, sinpePhone, proofNotes }, { token, signal });
}

export function verifyOrderPaymentProof({ orderId, decision, notes }, { token, signal } = {}) {
  return automationAction('/admin/actions/verify-payment', { orderId, decision, notes }, { token, signal });
}

export function fetchMyOrders({ token, signal } = {}) {
  return automationAction('/orders/mine', {}, { token, signal });
}

export async function fetchProductReviews(productId, { signal } = {}) {
  const base = globalThis.__VERTICE_JSON_SERVER_URL__ || 'http://localhost:3000';
  const response = await fetch(`${base}/reviews?productId=${encodeURIComponent(productId)}`, { signal });
  const body = await response.json();
  if (!response.ok || !Array.isArray(body)) throw Object.assign(new Error(body.code || 'INVALID_REVIEWS_RESPONSE'), { code: body.code || 'INVALID_REVIEWS_RESPONSE' });
  return body;
}

export function submitProductReview(payload, { token, signal } = {}) {
  return automationAction('/reviews/submit', payload, { token, signal });
}

export function createCatalogOrderIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return [...bytes].map((value, index) => `${[4, 6, 8, 10].includes(index) ? '-' : ''}${value.toString(16).padStart(2, '0')}`).join('');
}

export function submitCatalogOrder(payload, { token, signal } = {}) {
  return automationAction('/orders/submit-catalog-order', payload, { token, signal });
}
