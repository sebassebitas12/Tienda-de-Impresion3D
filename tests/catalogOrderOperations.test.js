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
  const tokenFor = (user, exp = 9999999999) => `Bearer sim.v1.${btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: user.id, role: user.role, exp }))}`;
  function mineFixture(users = [{ ...actor, status: 'ACTIVE' }]) {
    const embedded = [{ productId: 'p1', quantity: 2, unitPrice: 2500, subtotal: 5000 }];
    const db = { data: { ...fixture(), users, orders: [
      { id: 'own', userId: 'c1', orderItems: embedded },
      { id: 'legacy', userId: 'c1' },
      { id: 'other', userId: 'c2', orderItems: [{ productId: 'private' }] },
    ], orderItems: [{ orderId: 'legacy', productId: 'p2', quantity: 1 }, { orderId: 'other', productId: 'private' }] } };
    const handlers = new Map();
    const persist = jest.fn();
    installCatalogOrderOperations({ registerAction: (path, handler) => handlers.set(path, handler), db, serialize: task => task(), persist });
    return { db, persist, invoke(authorization, body = {}) {
      let result; let status = 200;
      const res = { status(value) { status = value; return this; }, json(value) { result = value; return this; } };
      handlers.get('/orders/mine')({ headers: { authorization }, body }, res);
      return { status, body: result };
    } };
  }

  it('consulta solo pedidos propios con sus líneas, ignorando userId del payload', () => {
    const { db, persist, invoke } = mineFixture();
    const before = structuredClone(db.data);
    const result = invoke(tokenFor(actor), { userId: 'c2' });
    expect(result.status).toBe(200);
    expect(result.body.orders.map(order => order.id)).toEqual(['own', 'legacy']);
    expect(result.body.orders[0].orderItems).toEqual(before.orders[0].orderItems.map(item => ({ ...item, currentCatalogName: 'Organizador' })));
    expect(result.body.orders[1].orderItems).toEqual([before.orderItems[0]]);
    expect(db.data).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });

  it('conserva el snapshot histórico y nunca rellena costos/material desde el catálogo vigente', () => {
    const { db, invoke } = mineFixture();
    db.data.orders[0].orderItems[0].productName = 'Nombre al comprar';
    const result = invoke(tokenFor(actor)).body.orders[0].orderItems[0];
    expect(result.productName).toBe('Nombre al comprar');
    expect(result.currentCatalogName).toBeUndefined();
    expect(result.material).toBeUndefined();
    expect(result.unitPrice).toBe(2500);
  });

  it('rechaza ausencia de sesión, admin, cuenta inactiva y token vencido con 403', () => {
    const admin = { id: 'a1', role: 'admin', status: 'ACTIVE' };
    const inactive = { id: 'c3', role: 'customer', status: 'INACTIVE' };
    const { invoke } = mineFixture([{ ...actor, status: 'ACTIVE' }, admin, inactive]);
    for (const token of [undefined, 'Bearer inválido', tokenFor(admin), tokenFor(inactive), tokenFor(actor, 1)]) {
      expect(invoke(token)).toEqual({ status: 403, body: { code: 'CUSTOMER_REQUIRED' } });
    }
  });

  it('devuelve una lista vacía cuando el cliente no tiene pedidos', () => {
    const user = { id: 'empty', role: 'customer', status: 'ACTIVE' };
    expect(mineFixture([user]).invoke(tokenFor(user)).body).toEqual({ orders: [] });
  });
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
