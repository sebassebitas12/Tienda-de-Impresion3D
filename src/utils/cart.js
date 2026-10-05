import { CATALOG_MATERIALS } from './adminCatalog.js';
import { productSubtotal } from './money.js';

export const MAX_CATALOG_ORDER_QUANTITY = 100;

export function isOrderableProduct(product) {
  return product?.status === 'ACTIVE' && product.currency === 'CRC' && Number.isFinite(product.price) && product.price >= 0 && CATALOG_MATERIALS.has(String(product.material || '').toUpperCase());
}

export function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(line => {
    if (typeof line?.productId !== 'string' || typeof line.color !== 'string' || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_CATALOG_ORDER_QUANTITY) return false;
    const key = JSON.stringify([line.productId, line.color]);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).map(({ productId, color, quantity }) => ({ productId, color, quantity }));
}

export function reconcileCart(lines, products) {
  return lines.map(line => {
    const product = products.find(item => String(item.id) === line.productId);
    const available = isOrderableProduct(product) && (product.availableColors || []).includes(line.color);
    return { ...line, product, available, subtotal: available ? productSubtotal(line.quantity, product.price) : null };
  });
}
