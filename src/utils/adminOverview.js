const ACTIVE_ORDER_STATUSES = new Set(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED']);
const TERMINAL_ORDER_STATUSES = new Set(['DELIVERED', 'CANCELLED', 'REJECTED']);
const REQUESTS_REQUIRING_REVIEW = new Set(['PENDING_QUOTE', 'IN_REVIEW']);
const KNOWN_REQUEST_STATUSES = new Set([
  'PENDING_QUOTE', 'IN_REVIEW', 'QUOTED', 'AWAITING_APPROVAL', 'APPROVED', 'PAID',
  'REJECTED', 'EXPIRED', 'CANCELLED',
]);

function dateValue(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateAdminOverview(data) {
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const requests = Array.isArray(data?.customPrintRequests) ? data.customPrintRequests : [];
  const users = Array.isArray(data?.users) ? data.users : [];
  const usersById = new Map(users.map(user => [String(user.id), user]));

  const recentOrders = [...orders]
    .filter(order => ACTIVE_ORDER_STATUSES.has(order?.status))
    .sort((a, b) => dateValue(b?.createdAt) - dateValue(a?.createdAt))
    .slice(0, 5)
    .map(order => ({
      ...order,
      customerName: usersById.get(String(order.userId))?.name || null,
    }));

  const requestsToReview = requests
    .filter(request => REQUESTS_REQUIRING_REVIEW.has(request?.status))
    .sort((a, b) => dateValue(a?.submittedAt) - dateValue(b?.submittedAt));

  return {
    activeOrders: orders.filter(order => ACTIVE_ORDER_STATUSES.has(order?.status)).length,
    unrecognizedOrderStatuses: orders.filter(order => !ACTIVE_ORDER_STATUSES.has(order?.status) && !TERMINAL_ORDER_STATUSES.has(order?.status)).length,
    requestsToReview,
    legacyRequests: requests.filter(request => request?.status && !KNOWN_REQUEST_STATUSES.has(request.status)),
    legacyOrders: orders.filter(order => order?.status && !ACTIVE_ORDER_STATUSES.has(order.status) && !TERMINAL_ORDER_STATUSES.has(order.status)),
    recentOrders,
    revenue: null,
    revenueUnavailableReason: 'No hay registros de pago que confirmen cobros en los datos académicos.',
  };
}
