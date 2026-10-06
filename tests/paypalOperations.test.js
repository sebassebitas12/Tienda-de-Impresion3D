/** @jest-environment node */
import { Buffer } from 'node:buffer';
import { describe, expect, it, jest } from '@jest/globals';
import { fetchCrcUsdQuote, installPaypalPaymentOperations } from '../scripts/paypal-operations.js';
import { convertCrcToUsd } from '../src/utils/paypalCurrency.js';

const now = '2026-10-05T18:00:00.000Z';
function tokenFor(id, role = 'customer') {
  return `sim.v1.${Buffer.from(JSON.stringify({ kind: 'SIMULATED_JWT', sub: id, role,
    exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}`;
}
function setup(orderPatch = {}, capturedAmount = '10.00') {
  const db = { data: { users: [{ id: 'c1', role: 'customer', status: 'ACTIVE', name: 'Cliente' },
    { id: 'c2', role: 'customer', status: 'ACTIVE', name: 'Otro cliente' },
    { id: 'a1', role: 'admin', status: 'ACTIVE' }], orders: [{ id: 'ord-1', userId: 'c1',
    status: 'PENDING', paymentStatus: 'UNPAID', total: 5000, currency: 'CRC', ...orderPatch }], activityLog: [] } };
  const routes = new Map();
  const persist = jest.fn(async next => { db.data = next; });
  const fetchImpl = jest.fn(async url => ({ ok: true, json: async () => url.endsWith('/oauth2/token')
    ? { access_token: 'mock-token' } : url.endsWith('/capture')
      ? { status: 'COMPLETED', purchase_units: [{ payments: { captures: [{ id: 'capture-1', status: 'COMPLETED', amount: { currency_code: 'USD', value: capturedAmount } }] } }] }
      : { id: 'pp-1', status: 'CREATED', links: [{ rel: 'approve', href: 'https://www.sandbox.paypal.com/checkoutnow?token=pp-1' }] } }));
  installPaypalPaymentOperations({ registerAction: (path, handler) => routes.set(path, handler), db,
    serialize: action => action(), persist, fetchImpl, clock: () => new Date(now),
    getFxQuote: async () => ({ rate: 500, rateDate: now, source: 'Fixture' }),
    env: { VERTICE_PAYPAL_CLIENT_ID: 'mock-client', VERTICE_PAYPAL_CLIENT_SECRET: 'mock-secret', VERTICE_PAYPAL_ENV: 'sandbox' } });
  async function invoke(path, body, id = 'c1', role = 'customer') {
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
    await routes.get(path)({ headers: { authorization: `Bearer ${tokenFor(id, role)}` }, body }, res);
    return res;
  }
  return { db, persist, fetchImpl, invoke };
}

describe('PayPal Sandbox operations', () => {
  it('expone solo el client ID público al cliente propietario con un pedido pendiente', async () => {
    const { invoke, fetchImpl } = setup();
    const config = await invoke('/orders/paypal/client-config', { orderId: 'ord-1' });
    expect(config.body).toEqual({ clientId: 'mock-client', environment: 'sandbox' });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect((await invoke('/orders/paypal/client-config', { orderId: 'ord-1' }, 'c2', 'customer')).statusCode).toBe(404);
    expect((await invoke('/orders/paypal/client-config', { orderId: 'ord-1', secret: 'ignored' }, 'a1', 'admin')).statusCode).toBe(403);
  });

  it('normaliza USD por CRC de la API a CRC por USD antes de calcular', async () => {
    const quote = await fetchCrcUsdQuote(async () => ({ ok: true, json: async () => ({ result: 'success', base_code: 'CRC',
      rates: { USD: 0.002 }, time_last_update_utc: now }) }));
    expect(quote.rate).toBe(500);
    expect(convertCrcToUsd(5000, quote).amountUsd).toBe(10);
  });

  it('crea sin cobrar y captura el monto exacto una sola vez', async () => {
    const { invoke, db, fetchImpl } = setup();
    const created = await invoke('/orders/paypal/create', { orderId: 'ord-1' });
    expect(created.body.amountUsd).toBe(10);
    expect(created.body).toMatchObject({ providerOrderId: 'pp-1', clientId: 'mock-client' });
    expect(db.data.orders[0]).toMatchObject({ status: 'PENDING', paymentStatus: 'UNPAID' });
    const captured = await invoke('/orders/paypal/capture', { orderId: 'ord-1', paypalOrderId: 'pp-1' });
    expect(captured.body.order).toMatchObject({ status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'PAYPAL_SANDBOX' });
    const calls = fetchImpl.mock.calls.length;
    expect((await invoke('/orders/paypal/capture', { orderId: 'ord-1', paypalOrderId: 'pp-1' })).body.replay).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(calls);
    expect(fetchImpl.mock.calls.every(([, options]) => options.signal)).toBe(true);
  });

  it('retiene una captura de monto distinto sin marcarla pagada', async () => {
    const { invoke, db } = setup({}, '11.00');
    await invoke('/orders/paypal/create', { orderId: 'ord-1' });
    expect((await invoke('/orders/paypal/capture', { orderId: 'ord-1', paypalOrderId: 'pp-1' })).body.code).toBe('PAYMENT_REQUIRES_REVIEW');
    expect(db.data.orders[0]).toMatchObject({ status: 'PENDING', paymentStatus: 'REVIEW_REQUIRED' });
  });

  it('exige cliente propietario y bloquea SINPE en revisión', async () => {
    const { invoke, fetchImpl } = setup({ paymentProof: { status: 'SUBMITTED' } });
    expect((await invoke('/orders/paypal/create', { orderId: 'ord-1' }, 'a1', 'admin')).statusCode).toBe(403);
    expect((await invoke('/orders/paypal/create', { orderId: 'missing' })).statusCode).toBe(404);
    expect((await invoke('/orders/paypal/create', { orderId: 'ord-1' })).body.code).toBe('PAYMENT_METHOD_CONFLICT');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('no permite pagar un personalizado sin cotización aprobada', async () => {
    const { invoke, fetchImpl } = setup({ sourceQuoteId: 'r1', scopeSnapshot: { quoteVersion: 1 } });
    expect((await invoke('/orders/paypal/create', { orderId: 'ord-1' })).statusCode).toBe(409);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
