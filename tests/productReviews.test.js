import { describe, expect, it, jest } from '@jest/globals';
import { prepareProductReview, installProductReviewOperations } from '../scripts/product-review-operations.js';

const actor = { id: 'u2', role: 'customer', status: 'ACTIVE', name: 'Cliente' };
const payload = { productId: 'p1', rating: 5, title: 'Excelente', comment: 'Muy buen acabado de la pieza.', authorName: 'Otro nombre' };
const data = { products: [{ id: 'p1' }], users: [actor] };
const now = '2026-10-04T12:00:00Z';
describe('reseñas de producto', () => {
  it.each([0, 6, 1.5, '5', null])('rechaza rating %s', rating => {
    expect(prepareProductReview(data, actor, { ...payload, rating }, now).error).toBe('INVALID_REVIEW');
  });
  it('valida texto, producto y permisos sin mutar el origen', () => {
    expect(prepareProductReview(data, actor, { ...payload, comment: ' corto ' }, now).error).toBe('INVALID_REVIEW');
    expect(prepareProductReview(data, actor, { ...payload, title: ' ' }, now).error).toBe('INVALID_REVIEW');
    expect(prepareProductReview(data, actor, { ...payload, productId: 'no' }, now).error).toBe('PRODUCT_NOT_FOUND');
    for (const user of [null, { ...actor, role: 'admin' }, { ...actor, status: 'INACTIVE' }]) expect(prepareProductReview(data, user, payload, now).error).toBe('CUSTOMER_REQUIRED');
    const result = prepareProductReview(data, actor, payload, now, () => 'test');
    expect(result.review).toMatchObject({ id: 'rev-test', authorName: 'Cliente', rating: 5 });
    expect(result.review.userId).toBeUndefined();
    expect(result.nextData.reviews[0].userId).toBe('u2');
    expect(data.reviews).toBeUndefined();
  });
  it('persiste con sesión activa y consulta solo reseñas públicas del producto', async () => {
    const db = { data: JSON.parse(JSON.stringify(data)) };
    const handlers = new Map();
    const persist = jest.fn(async next => { db.data = next; });
    installProductReviewOperations({ registerAction: (path, handler) => handlers.set(path, handler), registerRead: (path, handler) => handlers.set(path, handler), db, serialize: task => task(), persist });
    const token = `sim.v1.${btoa(JSON.stringify({ kind: 'SIMULATED_JWT', sub: 'u2', role: 'customer', exp: 9999999999 }))}`;
    let body; let status;
    const res = { status(value) { status = value; return this; }, json(value) { body = value; return this; } };
    await handlers.get('/reviews/submit')({ body: payload, headers: {} }, res);
    expect(status).toBe(403); expect(persist).not.toHaveBeenCalled();
    await handlers.get('/reviews/submit')({ body: payload, headers: { authorization: `Bearer ${token}` } }, res);
    expect(status).toBe(201); expect(persist).toHaveBeenCalledTimes(1);
    db.data.reviews.push({ ...db.data.reviews[0], status: 'HIDDEN' }, { ...db.data.reviews[0], productId: 'p2' });
    handlers.get('/reviews')({ query: { productId: 'p1' } }, res);
    expect(body).toHaveLength(1); expect(body[0].userId).toBeUndefined();
    persist.mockRejectedValueOnce(new Error('disk'));
    await handlers.get('/reviews/submit')({ body: payload, headers: { authorization: `Bearer ${token}` } }, res);
    expect(status).toBe(500);
  });
});
