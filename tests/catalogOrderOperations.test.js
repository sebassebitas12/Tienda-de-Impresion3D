/** @jest-environment node */
import { describe, expect, it, jest } from '@jest/globals';
import { installCatalogOrderOperations, prepareCatalogOrder } from '../scripts/catalog-order-operations.js';
import { buildAdminOrders } from '../src/utils/adminOrders.js';

const actor = { id: 'c1', name: 'Cliente Uno', role: 'customer' };
const now = '2026-10-04T18:00:00.000Z';
const product = { id: 'p1', name: 'Organizador', status: 'ACTIVE', currency: 'CRC', material: 'PLA', price: 2500, availableColors: ['Negro'], stock: 0 };
const payload = { items: [{ productId: 'p1', color: 'Negro', quantity: 2, unitPrice: 1 }], idempotencyKey: 'test-idempotency-001' };
const fixture = () => ({ products: [product], users: [actor], orders: [], orderItems: [], activityLog: [] });

describe('creación de encargos de catálogo', () => {
  it('recalcula el precio, crea el pedido y refleja items/actividad en una persistencia', () => {
    let sequence = 0;
    const result = prepareCatalogOrder(fixture(), actor, payload, now, () => `id-${++sequence}`);
    expect(result.order).toMatchObject({ id: 'ord-id-2', userId: 'c1', status: 'PENDING', currency: 'CRC', createdAt: now, subtotalCrc: 5000, total: 5000, pricingScope: 'CATALOG_SUBTOTAL_ONLY' });
    expect(result.order.orderItems[0]).toMatchObject({ productId: 'p1', color: 'Negro', quantity: 2, unitPrice: 2500, subtotal: 5000 });
    expect(result.nextData.orders).toEqual([result.order]);
    expect(result.nextData.orderItems[0]).toMatchObject({ orderId: result.order.id, productId: 'p1', quantity: 2 });
    expect(result.nextData.activityLog[0]).toMatchObject({ action: 'CATALOG_ORDER_CREATED', entityId: result.order.id, actorId: 'c1', toStatus: 'PENDING' });
    expect(buildAdminOrders(result.nextData)[0]).toMatchObject({ id: result.order.id, customer: actor, total: 5000, items: [{ productId: 'p1', quantity: 2, product }] });
  });

  it('es idempotente y rechaza reutilizar una clave con otra selección', () => {
    let sequence = 0;
    const created = prepareCatalogOrder(fixture(), actor, payload, now, () => `id-${++sequence}`);
    const replay = prepareCatalogOrder(created.nextData, actor, payload, now, () => 'should-not-be-used');
    expect(replay).toEqual({ order: created.order, replay: true });
    expect(prepareCatalogOrder(created.nextData, actor, { ...payload, items: [{ productId: 'p1', color: 'Negro', quantity: 3 }] }, now).error).toBe('IDEMPOTENCY_CONFLICT');
  });

  it('exige customer, productos/colores publicados y líneas válidas sin usar stock', () => {
    expect(prepareCatalogOrder(fixture(), { ...actor, role: 'admin' }, payload, now).error).toBe('CUSTOMER_REQUIRED');
    expect(prepareCatalogOrder({ ...fixture(), products: [{ ...product, status: 'DRAFT' }] }, actor, payload, now).error).toBe('PRODUCT_UNAVAILABLE');
    expect(prepareCatalogOrder(fixture(), actor, { ...payload, items: [{ productId: 'p1', color: 'Azul', quantity: 1 }] }, now).error).toBe('PRODUCT_UNAVAILABLE');
    expect(prepareCatalogOrder(fixture(), actor, { ...payload, items: [{ productId: 'p1', color: 'Negro', quantity: 1.5 }] }, now).error).toBe('INVALID_ORDER');
    expect(prepareCatalogOrder(fixture(), actor, { ...payload, items: [payload.items[0], payload.items[0]] }, now).error).toBe('INVALID_ORDER');
    expect(prepareCatalogOrder(fixture(), actor, payload, now).order).toBeDefined();
  });

  it('conecta la ruta autenticada con persistencia e idempotencia sin duplicar eventos', async () => {
    const db = { data: { ...fixture(), users: [{ ...actor, status: 'ACTIVE' }] } };
    const handlers = new Map();
    const persist = jest.fn(async next => { db.data = next; });
    installCatalogOrderOperations({ registerAction: (path, handler) => handlers.set(path, handler), db, serialize: task => task(), persist });
    const requestPayload = { items: structuredClone(payload.items), idempotencyKey: payload.idempotencyKey };
    const encoded = btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: actor.id, role: 'customer', exp: 9999999999 }));
    const req = { headers: { authorization: `Bearer sim.v1.${encoded}` }, body: requestPayload };
    const invoke = async () => {
      let body; let status = 200;
      const res = { status(value) { status = value; return this; }, json(value) { body = value; return this; } };
      await handlers.get('/orders/submit-catalog-order')(req, res);
      return { status, body };
    };
    const first = await invoke();
    const replay = await invoke();
    expect(first.status).toBe(200);
    expect(first.body.order).toMatchObject({ userId: actor.id, status: 'PENDING', subtotalCrc: 5000 });
    expect(replay.body).toEqual({ order: first.body.order, replay: true });
    expect(persist).toHaveBeenCalledTimes(1);
  });
});
