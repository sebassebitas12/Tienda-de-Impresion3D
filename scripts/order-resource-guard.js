import { sessionActor } from './session-access.js';

const ORDER_RESOURCE_PATH = /^\/(?:orders|orderItems)(?:\/[^/]+)?\/?$/;
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const ORDER_ACTION_PATHS = new Set(['/orders/mine', '/orders/pay-demo', '/orders/submit-catalog-order', '/orders/submit-payment-proof']);

/**
 * Return null when a JSON Server order resource request may continue; return
 * an explicit response for reads/writes that must use audited business flows.
 */
export function authorizeOrderResourceRequest(req, data) {
  const pathname = String(req.path || req.url || '').split('?')[0].replace(/\/$/, '') || '/';
  if (ORDER_ACTION_PATHS.has(pathname)) return null;
  if (!ORDER_RESOURCE_PATH.test(pathname)) return null;

  const method = String(req.method || 'GET').toUpperCase();
  const actor = sessionActor(req.headers?.authorization, data);

  if (WRITE_METHODS.has(method)) return { status: 405, code: 'ORDER_ACTION_REQUIRED' };
  if (method === 'GET' && actor?.role !== 'admin') return { status: 403, code: 'ADMIN_REQUIRED' };
  return null;
}

export function createOrderResourceGuard(dataProvider) {
  return (req, res, next) => {
    const denied = authorizeOrderResourceRequest(req, dataProvider());
    if (denied) return res.status(denied.status).json({ code: denied.code });
    return next();
  };
}
