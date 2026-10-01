import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { HERO_PIECES, getHomeContent } from '../../pages/homeContent.js';
import { RouteFocus } from './RouteFocus.jsx';
import '../../styles/auth.css';

function ProductGallery() {
  const { copy, language } = usePreferences();
  const home = getHomeContent(language);
  const pieces = HERO_PIECES.map(piece => ({
    ...piece,
    ...home.heroPieces[piece.id],
  })).concat([
    {
      id: 'architectural-model',
      image: '/images/producto-maqueta.jpg',
      material: 'ABS',
      title: home.products.p5.name,
      alt: language === 'en' ? 'Architectural model printed in 3D' : 'Maqueta arquitectónica impresa en 3D',
    },
    {
      id: 'upcoming-product',
      image: '/images/producto-temporal.png',
      material: 'TPU',
      title: home.products.p6.name,
      alt: home.products.p6.imageAlt,
    },
  ]);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoveredPieceId, setHoveredPieceId] = useState(null);
  const activePieceId = hoveredPieceId || selectedPieceId;
  const activePiece = pieces.find(piece => piece.id === activePieceId);

  return (
    <section className="auth-visual" aria-label={copy.authGalleryLabel}>
      <div className="auth-collage-wrap">
        <header className="auth-gallery-heading">
          <span>{copy.authGalleryEyebrow}</span>
          <p>{copy.authGalleryIntro}</p>
        </header>
        <div className="auth-collage" role="group" aria-label={copy.authGalleryLabel}>
          {pieces.map((piece, index) => (
            <button
              key={piece.id}
              type="button"
              className={`auth-collage-item auth-collage-item--${index + 1}`}
              aria-label={`${piece.title}: ${piece.alt}`}
              aria-pressed={selectedPieceId === piece.id}
              data-active={selectedPieceId === piece.id}
              onMouseEnter={() => setHoveredPieceId(piece.id)}
              onMouseLeave={() => setHoveredPieceId(null)}
              onFocus={() => setSelectedPieceId(piece.id)}
              onClick={() => setSelectedPieceId(piece.id)}
            >
              <img src={piece.image} alt="" />
            </button>
          ))}
        </div>
        <p className="auth-collage-caption" aria-live="polite">
          {activePiece ? <>
            <span>{activePiece.title}</span>
            <span>{activePiece.material}</span>
          </> : <span className="auth-collage-hint">{copy.authGalleryHint}</span>}
        </p>
      </div>
    </section>
  );
}

export function AuthLayout() {
  const { copy } = usePreferences();
  return (
    <div className="auth-shell">
      <RouteFocus />
      <header className="auth-header">
        <BrandLogo as={Link} to="/" />
        <Link className="auth-back-link" to="/">Volver al taller <span aria-hidden="true">↗</span></Link>
      </header>

      <main id="main-content" tabIndex={-1} className="auth-main">
        <ProductGallery />
        <section className="auth-content" aria-label={copy.authFormRegion}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
