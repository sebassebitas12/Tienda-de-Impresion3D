/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { Buffer } from 'node:buffer';
import { authorizeOrderResourceRequest } from '../scripts/order-resource-guard.js';

function tokenFor(id, role, exp = Math.floor(Date.now() / 1000) + 3600) {
  return `sim.v1.${Buffer.from(JSON.stringify({ kind: 'SIMULATED_JWT', sub: id, role, exp }))
    .toString('base64url')}`;
}

const data = { users: [
  { id: 'admin-1', role: 'admin', status: 'ACTIVE' },
  { id: 'customer-1', role: 'customer', status: 'ACTIVE' },
] };

describe('guard de recursos genéricos de pedidos', () => {
  it.each(['GET'])('solo un Admin activo puede leer pedidos por JSON Server (%s)', method => {
    expect(authorizeOrderResourceRequest({ method, path: '/orders', headers: {} }, data))
      .toEqual({ status: 403, code: 'ADMIN_REQUIRED' });
    expect(authorizeOrderResourceRequest({ method, path: '/orders/o1', headers: { authorization: `Bearer ${tokenFor('customer-1', 'customer')}` } }, data))
      .toEqual({ status: 403, code: 'ADMIN_REQUIRED' });
    expect(authorizeOrderResourceRequest({ method, path: '/orders/o1', headers: { authorization: `Bearer ${tokenFor('admin-1', 'admin')}` } }, data))
      .toBeNull();
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('bloquea %s genérico para forzar acciones auditadas', method => {
    expect(authorizeOrderResourceRequest({ method, path: '/orders', headers: {} }, data))
      .toEqual({ status: 405, code: 'ORDER_ACTION_REQUIRED' });
    expect(authorizeOrderResourceRequest({ method, path: '/orders/o1', headers: {} }, data))
      .toEqual({ status: 405, code: 'ORDER_ACTION_REQUIRED' });
  });

  it('deja pasar los endpoints de negocio anidados y otros recursos', () => {
    expect(authorizeOrderResourceRequest({ method: 'POST', path: '/orders/submit-payment-proof', headers: {} }, data)).toBeNull();
    expect(authorizeOrderResourceRequest({ method: 'POST', path: '/orders/paypal/capture', headers: {} }, data)).toBeNull();
    expect(authorizeOrderResourceRequest({ method: 'GET', path: '/products', headers: {} }, data)).toBeNull();
  });

  it('protege también la colección normalizada de líneas de pedido', () => {
    expect(authorizeOrderResourceRequest({ method: 'GET', path: '/orderItems?orderId=o1', headers: {} }, data))
      .toEqual({ status: 403, code: 'ADMIN_REQUIRED' });
    expect(authorizeOrderResourceRequest({ method: 'PATCH', path: '/orderItems/oi1', headers: { authorization: `Bearer ${tokenFor('admin-1', 'admin')}` } }, data))
      .toEqual({ status: 405, code: 'ORDER_ACTION_REQUIRED' });
  });
});
