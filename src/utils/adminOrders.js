import { matchesFacet } from './facetFilters.js';

export function formatOrderReference(id) {
  const match = /^o(\d+)$/i.exec(String(id));
  return match ? `#${match[1].padStart(4, '0')}` : String(id);
}

export const ORDER_STATUS_GROUPS = {
  active: new Set(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED']),
  delivered: new Set(['DELIVERED']),
  closed: new Set(['CANCELLED', 'REJECTED']),
};

const ALL_KNOWN_STATUSES = new Set([...ORDER_STATUS_GROUPS.active, ...ORDER_STATUS_GROUPS.delivered, ...ORDER_STATUS_GROUPS.closed]);

function dateValue(value) {
  const parsed = Date.parse(value || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildAdminOrders({ orders = [], orderItems = [], products = [], users = [] } = {}) {
  const usersById = new Map(users.map(user => [String(user.id), user]));
  const productsById = new Map(products.map(product => [String(product.id), product]));
  const itemsByOrderId = new Map();

  orderItems.forEach(item => {
    const key = String(item.orderId);
    const lines = itemsByOrderId.get(key) || [];
    lines.push({ ...item, product: productsById.get(String(item.productId)) || null });
    itemsByOrderId.set(key, lines);
  });

  return [...orders]
    .map(order => ({
      ...order,
      customer: usersById.get(String(order.userId)) || null,
      items: itemsByOrderId.get(String(order.id)) || [],
      isKnownStatus: ALL_KNOWN_STATUSES.has(order.status),
    }))
    .sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));
}

export function getOrderGroup(status) {
  return Object.keys(ORDER_STATUS_GROUPS).find(group => ORDER_STATUS_GROUPS[group].has(status)) || 'unrecognized';
}

export function filterAdminOrders(orders = [], group = 'all', query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return orders.filter(order => {
    const groupMatches = matchesFacet(getOrderGroup(order.status), group);
    if (!groupMatches) return false;
    const searchable = [order.id, formatOrderReference(order.id), order.status, order.customer?.name, order.customer?.email,
      ...order.items.flatMap(item => [item.product?.name, item.product?.material])]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return !normalizedQuery || searchable.includes(normalizedQuery);
  });
}

export function summarizeOrderGroups(orders = []) {
  return orders.reduce((counts, order) => {
    const group = getOrderGroup(order.status);
    counts[group] = (counts[group] || 0) + 1;
    return counts;
  }, { all: orders.length, active: 0, delivered: 0, closed: 0, unrecognized: 0 });
}
