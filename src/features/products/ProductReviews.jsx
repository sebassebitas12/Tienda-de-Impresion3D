import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchProductReviews, submitProductReview } from '../../services/commerceService.js';
import './productReviews.css';

function StarIcon({ filled = false, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'var(--lava)' : 'none'}
      stroke={filled ? 'var(--lava)' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="v-star-icon"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRating({ rating = 0, size = 14 }) {
  return (
    <div className="v-star-rating" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(index => (
        <StarIcon key={index} filled={index <= Math.round(rating)} size={size} />
      ))}
    </div>
  );
}

export function ProductReviews({ productId, es = true }) {
  const { user, token } = useAuth();
  const [state, setState] = useState({ reviews: [], loading: true, error: '' });

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    let active = true;
    fetchProductReviews(productId)
      .then(items => {
        if (active) setState({ reviews: Array.isArray(items) ? items : [], loading: false, error: '' });
      })
      .catch(() => {
        if (active) setState({ reviews: [], loading: false, error: es ? 'No se pudieron cargar las opiniones de este modelo.' : 'Could not load reviews for this model.' });
      });
    return () => { active = false; };
  }, [productId, es]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (!user || user.role !== 'customer' || !token) {
      setFormError(es ? 'Iniciá sesión como cliente para enviar tu opinión.' : 'Sign in as a customer to submit a review.');
      return;
    }
    if (!title.trim()) {
      setFormError(es ? 'Ingresá un título para tu opinión.' : 'Please enter a title for your review.');
      return;
    }
    if (comment.trim().length < 10) {
      setFormError(es ? 'El comentario debe tener al menos 10 caracteres.' : 'The comment must be at least 10 characters long.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSuccessNotice('');

    try {
      const response = await submitProductReview({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        authorName: user.name || (es ? 'Cliente Vértice' : 'Vértice Customer'),
      }, { token });

      if (response?.review) {
        setState(prev => ({ ...prev, reviews: [response.review, ...prev.reviews] }));
      }
      setTitle('');
      setComment('');
      setRating(5);
      setSuccessNotice(es ? 'Tu opinión fue publicada en el catálogo.' : 'Your review was published to the catalog.');
    } catch (failure) {
      const messages = {
        CUSTOMER_REQUIRED: es ? 'Se requiere una cuenta de cliente activa.' : 'An active customer account is required.',
        INVALID_REVIEW: es ? 'Verificá los datos ingresados (mínimo 10 caracteres en comentario).' : 'Check your input (minimum 10 characters in comment).',
        PRODUCT_NOT_FOUND: es ? 'El producto no fue encontrado en catálogo.' : 'Product was not found in catalog.',
      };
      setFormError(messages[failure.code] || (es ? 'No se pudo guardar la opinión. Intentá de nuevo.' : 'Could not save review. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  const { reviews, loading, error } = state;
  const average = reviews.length
    ? (reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-title">
      <header className="product-reviews__header">
        <div className="product-reviews__heading">
          <span className="product-reviews__eyebrow">{es ? 'Control de calidad y acabados' : 'Quality & finish feedback'}</span>
          <h2 id="product-reviews-title">{es ? 'Opiniones de clientes' : 'Customer reviews'}</h2>
        </div>
        {average !== null && (
          <div className="product-reviews__summary">
            <span className="product-reviews__avg">{average}</span>
            <div>
              <StarRating rating={Number(average)} size={16} />
              <small className="product-reviews__count">
                {reviews.length} {reviews.length === 1 ? (es ? 'opinión verificada' : 'verified review') : (es ? 'opiniones verificadas' : 'verified reviews')}
              </small>
            </div>
          </div>
        )}
      </header>

      {loading && <p className="product-reviews__status" role="status">{es ? 'Cargando opiniones…' : 'Loading reviews…'}</p>}
      {error && <p className="product-reviews__error" role="alert">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <div className="product-reviews__empty">
          <p>{es ? 'Este modelo todavía no tiene opiniones publicadas.' : 'This model has no published reviews yet.'}</p>
          <small>{es ? 'Las piezas se fabrican bajo pedido y los clientes pueden retroalimentar el acabado final.' : 'Parts are made to order and verified customers can review the final finish.'}</small>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="product-reviews__list">
          {reviews.map(item => (
            <article className="product-review-card" key={item.id}>
              <header className="product-review-card__header">
                <div>
                  <StarRating rating={item.rating} size={14} />
                  <h3 className="product-review-card__title">{item.title}</h3>
                </div>
                <div className="product-review-card__meta">
                  <span className="product-review-card__author">{item.authorName}</span>
                  {item.createdAt && <time className="product-review-card__date">{item.createdAt.slice(0, 10)}</time>}
                </div>
              </header>
              <p className="product-review-card__comment">{item.comment}</p>
              <span className="product-review-card__badge">{es ? 'Opinión de cliente' : 'Customer opinion'}</span>
            </article>
          ))}
        </div>
      )}

      <div className="product-reviews__form-container">
        {user?.role === 'customer' ? (
          <form className="product-review-form" onSubmit={handleSubmit}>
            <span className="product-review-form__eyebrow">{es ? 'Compartí tu experiencia' : 'Share your experience'}</span>
            <h3>{es ? 'Dejar una opinión sobre este modelo' : 'Leave a review for this model'}</h3>

            <div className="product-review-form__rating-row">
              <label id="rating-label">{es ? 'Calificación general:' : 'Overall rating:'}</label>
              <div className="product-rating-picker" role="radiogroup" aria-labelledby="rating-label">
                {[1, 2, 3, 4, 5].map(starValue => (
                  <button
                    key={starValue}
                    type="button"
                    role="radio"
                    aria-checked={rating === starValue}
                    className={`product-rating-star-btn ${rating >= starValue ? 'is-active' : ''}`}
                    onClick={() => setRating(starValue)}
                    title={`${starValue} ${starValue === 1 ? (es ? 'estrella' : 'star') : (es ? 'estrellas' : 'stars')}`}
                  >
                    <StarIcon filled={rating >= starValue} size={20} />
                    <span className="v-visually-hidden">{starValue}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="product-review-form__field">
              <span>{es ? 'Título de tu reseña' : 'Review title'}</span>
              <input
                type="text"
                maxLength={100}
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={es ? 'Ej: Excelente precisión en los encajes' : 'E.g.: Great precision on fits'}
              />
            </label>

            <label className="product-review-form__field">
              <span>{es ? 'Comentario y acabado (mínimo 10 caracteres)' : 'Comment & finish details (min 10 chars)'}</span>
              <textarea
                rows={3}
                minLength={10}
                maxLength={2000}
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={es ? 'Describí cómo se siente la pieza, adherencia entre capas o tolerancia dimensional...' : 'Describe how the part feels, layer adhesion or dimensional fit...'}
              />
            </label>

            {formError && <p className="product-reviews__error" role="alert">{formError}</p>}
            {successNotice && <p className="product-reviews__success" role="status">{successNotice}</p>}

            <button
              className="v-button v-button--primary v-button--pill"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (es ? 'Publicando…' : 'Submitting…') : (es ? 'Publicar opinión' : 'Post review')}
            </button>
          </form>
        ) : (
          <div className="product-reviews__signin-prompt">
            <p>
              {es
                ? '¿Compraste esta pieza? Iniciá sesión con tu cuenta de cliente para evaluar la calidad y precisión de la impresión.'
                : 'Ordered this part? Sign in with your customer account to review print quality and tolerances.'}
            </p>
            <Link className="v-button v-button--ghost v-button--pill" to="/login">
              {es ? 'Iniciar sesión para opinar' : 'Sign in to review'} ↗
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
