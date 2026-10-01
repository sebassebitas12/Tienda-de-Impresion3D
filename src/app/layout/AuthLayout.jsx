import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { HERO_PIECES, getHomeContent } from '../../pages/homeContent.js';
import { RouteFocus } from './RouteFocus.jsx';
import '../../styles/auth.css';

const ROTATION_INTERVAL_MS = 6400;

function ProductGallery() {
  const { copy, language, reducedMotion } = usePreferences();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const rotationStateOnPointerDown = useRef(null);
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => (
    typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setSystemReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.('change', updatePreference);
    return () => preference.removeEventListener?.('change', updatePreference);
  }, []);

  const pieces = HERO_PIECES.map(piece => ({
    ...piece,
    ...getHomeContent(language).heroPieces[piece.id],
  }));
  const activePiece = pieces[activeIndex];
  const motionReduced = reducedMotion || systemReducedMotion;
  const rotationPaused = motionReduced || manuallyPaused || focusPaused;
  const rotationActive = !rotationPaused && !hoverPaused;

  useEffect(() => {
    if (!rotationActive) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % pieces.length);
    }, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [pieces.length, rotationActive]);

  const move = direction => {
    setActiveIndex(index => (index + direction + pieces.length) % pieces.length);
  };

  const toggleRotation = event => {
    // Capture the pre-focus state on pointerdown so focusing the button does
    // not reverse the pause/play action before click is dispatched.
    if (event.detail > 0) {
      const wasPaused = rotationStateOnPointerDown.current ?? rotationPaused;
      setManuallyPaused(!wasPaused);
      setFocusPaused(false);
      rotationStateOnPointerDown.current = null;
      return;
    }
    if (rotationPaused) {
      setManuallyPaused(false);
      setFocusPaused(false);
    } else {
      setManuallyPaused(true);
    }
  };

  return (
    <section
      className="auth-visual"
      aria-label={copy.authGalleryLabel}
      aria-roledescription={copy.authGalleryRole}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
    >
      <div className="auth-gallery">
        <figure
          id="auth-gallery-slide"
          className="auth-gallery-slide"
          role="group"
          aria-roledescription={copy.authGallerySlideRole}
          aria-label={copy.authGallerySlidePosition
            .replace('{current}', String(activeIndex + 1))
            .replace('{total}', String(pieces.length))}
          aria-live={rotationActive ? 'off' : 'polite'}
        >
          <div className="auth-gallery-frame">
            <img
              key={activePiece.id}
              className="auth-gallery-image"
              src={activePiece.image}
              alt={activePiece.alt}
            />
          </div>
          <figcaption className="auth-gallery-title">{activePiece.title}</figcaption>
        </figure>
        <div className="auth-gallery-caption">
          <div className="auth-gallery-controls">
            <span className="auth-gallery-position" aria-hidden="true">
              {activeIndex + 1} / {pieces.length}
            </span>
            {!motionReduced && (
              <button
                type="button"
                className="auth-gallery-control auth-gallery-rotation"
                aria-label={rotationPaused ? copy.authGalleryResume : copy.authGalleryPause}
                aria-controls="auth-gallery-slide"
                onPointerDown={() => { rotationStateOnPointerDown.current = rotationPaused; }}
                onClick={toggleRotation}
              >
                <span aria-hidden="true">{rotationPaused ? '▶' : 'Ⅱ'}</span>
              </button>
            )}
            <button
              type="button"
              className="auth-gallery-control"
              aria-label={copy.authGalleryPrevious}
              aria-controls="auth-gallery-slide"
              onClick={() => move(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="auth-gallery-control auth-gallery-next"
              aria-label={copy.authGalleryNext}
              aria-controls="auth-gallery-slide"
              onClick={() => move(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
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
