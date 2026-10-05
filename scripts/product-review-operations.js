import { randomUUID } from 'node:crypto';
import { sessionActor } from './session-access.js';

const publicReview = ({ id, productId, rating, title, comment, authorName, createdAt }) => ({ id, productId, rating, title, comment, authorName, createdAt });

export function prepareProductReview(data, actor, payload, now, idFactory = randomUUID) {
  if (actor?.role !== 'customer' || actor.status !== 'ACTIVE') return { error: 'CUSTOMER_REQUIRED' };
  if (typeof payload?.productId !== 'string' || !payload.productId.trim()
    || !Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5
    || typeof payload.title !== 'string' || !payload.title.trim() || payload.title.trim().length > 100
    || typeof payload.comment !== 'string' || payload.comment.trim().length < 10 || payload.comment.trim().length > 2000
    || typeof payload.authorName !== 'string' || !payload.authorName.trim() || payload.authorName.trim().length > 100) return { error: 'INVALID_REVIEW' };
  const productId = payload.productId.trim();
  if (!(data.products || []).some(product => String(product.id) === productId)) return { error: 'PRODUCT_NOT_FOUND' };
  const review = { id: `rev-${idFactory()}`, productId, userId: String(actor.id), rating: payload.rating,
    title: payload.title.trim(), comment: payload.comment.trim(), authorName: actor.name || payload.authorName.trim(), status: 'PUBLISHED', createdAt: now };
  return { review: publicReview(review), nextData: { ...data, reviews: [...(data.reviews || []), review] } };
}

export function installProductReviewOperations({ registerAction, registerRead, db, serialize, persist }) {
  registerRead('/reviews', (req, res) => {
    const productId = req.query?.productId;
    if (typeof productId !== 'string' || !productId.trim()) return res.status(400).json({ code: 'PRODUCT_REQUIRED' });
    return res.json((db.data.reviews || []).filter(review => String(review.productId) === productId.trim() && review.status === 'PUBLISHED').map(publicReview));
  });
  registerAction('/reviews/submit', async (req, res) => {
    try {
      const result = await serialize(async () => {
        const actor = sessionActor(req.headers.authorization, db.data);
        const prepared = prepareProductReview(db.data, actor, req.body, new Date().toISOString());
        if (!prepared.error) await persist(prepared.nextData);
        return prepared;
      });
      if (result.error) return res.status(result.error === 'CUSTOMER_REQUIRED' ? 403 : result.error === 'PRODUCT_NOT_FOUND' ? 404 : 400).json({ code: result.error });
      return res.status(201).json({ review: result.review });
    } catch { return res.status(500).json({ code: 'ACTION_PERSISTENCE_FAILED' }); }
  });
}
