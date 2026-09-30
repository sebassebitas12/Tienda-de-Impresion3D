import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  RevealOnScroll,
  ProductCard,
  SectionBlock
} from '../components/ui/index.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { FEATURED_PRODUCTS, HERO_PIECES, getHomeContent } from './homeContent.js';
import '../styles/home.css';

export function Home() {
  const { language } = usePreferences();
  const content = getHomeContent(language);
  const [activePiece, setActivePiece] = useState(0);
  const visualRef = useRef(null);
  const photoWrapRef = useRef(null);

  const heroPieces = useMemo(
    () => HERO_PIECES.map(piece => ({ ...piece, ...content.heroPieces[piece.id] })),
    [content],
  );

  const featuredProducts = useMemo(
    () => FEATURED_PRODUCTS.map(product => ({ ...product, ...content.products[product.id] })),
    [content],
  );

  const piece = heroPieces[activePiece] ?? heroPieces[0];

  useEffect(() => {
    const visual = visualRef.current;
    const photoWrap = photoWrapRef.current;
    if (!visual || !photoWrap) return undefined;

    const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const manuallyReducedMotion = document.documentElement.dataset.motion === 'reduced';
    if (systemReducedMotion.matches || manuallyReducedMotion) return undefined;

    const resetMotion = () => {
      visual.style.setProperty('--pointer-x', '50%');
      visual.style.setProperty('--pointer-y', '50%');
      visual.style.setProperty('--note-x', '0px');
      visual.style.setProperty('--note-y', '0px');
      photoWrap.style.setProperty('--tilt-x', '0deg');
      photoWrap.style.setProperty('--tilt-y', '0deg');
      photoWrap.style.setProperty('--parallax-x', '0px');
      photoWrap.style.setProperty('--parallax-y', '0px');
    };

    const handlePointerMove = (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.setProperty('--pointer-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      visual.style.setProperty('--pointer-y', `${((y + 0.5) * 100).toFixed(1)}%`);
      visual.style.setProperty('--note-x', `${(x * -5).toFixed(2)}px`);
      visual.style.setProperty('--note-y', `${(y * -5).toFixed(2)}px`);
      photoWrap.style.setProperty('--tilt-x', `${(y * -2).toFixed(2)}deg`);
      photoWrap.style.setProperty('--tilt-y', `${(x * 2).toFixed(2)}deg`);
      photoWrap.style.setProperty('--parallax-x', `${(x * 8).toFixed(2)}px`);
      photoWrap.style.setProperty('--parallax-y', `${(y * 8).toFixed(2)}px`);
    };

    visual.addEventListener('pointermove', handlePointerMove);
    visual.addEventListener('pointerleave', resetMotion);

    return () => {
      visual.removeEventListener('pointermove', handlePointerMove);
      visual.removeEventListener('pointerleave', resetMotion);
    };
  }, []);

  const selectRelativePiece = (offset) => {
    setActivePiece(current => (current + offset + heroPieces.length) % heroPieces.length);
  };

  return (
    <>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker mono-label">{content.heroKicker}</div>
              <h1 id="hero-title">{content.heroTitle}<br /><em>{content.heroAccent}</em></h1>
              <p className="hero-lede">{content.heroLead}</p>
              <div className="hero-actions">
                <Button as="a" href="#piezas" variant="primary" pill>
                  {content.explore} <span aria-hidden="true">↓</span>
                </Button>
                <Button as={Link} to="/solicitud" variant="ghost">
                  {content.hasFile} <span aria-hidden="true">↗</span>
                </Button>
              </div>
              <div className="hero-signals" aria-label={content.capabilities}>
                <div><span className="signal-value">±0.05 mm</span><span className="signal-text">{content.tolerance}</span></div>
                <div><span className="signal-value">FDM / SLA</span><span className="signal-text">{content.processes}</span></div>
                <div><span className="signal-value">{content.stagedValue}</span><span className="signal-text">{content.stagedReview}</span></div>
              </div>
            </div>

            <div className="hero-visual" ref={visualRef} aria-label={content.featuredPieces}>
              <span className="visual-coordinate">{content.workbench}</span>
              <div className="hero-photo-wrap" ref={photoWrapRef}>
                <img
                  className="hero-photo"
                  src={piece.image}
                  alt={piece.alt}
                  width="700"
                  height="560"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="scan-line" aria-hidden="true" />
                <div className="visual-status" aria-hidden="true"><i /> {content.activeReview}</div>
                <div className="visual-note" aria-hidden="true">
                  <strong>{piece.material}</strong>
                  <span>{piece.process}</span>
                </div>
                <svg className="visual-note-line" viewBox="0 0 185 130" aria-hidden="true">
                  <path d={piece.target} />
                  <circle cx={piece.dot[0]} cy={piece.dot[1]} r="3" />
                </svg>
                <div className="visual-meta">
                  <div>
                    <h2>{piece.title}</h2>
                    <p>{piece.description}</p>
                  </div>
                  <div className="visual-ref">{piece.ref}<br />{piece.tolerance}</div>
                </div>
              </div>

              <div className="thumb-rail">
                <button className="rail-arrow" type="button" aria-label={content.previousPiece} onClick={() => selectRelativePiece(-1)}>↑</button>
                <div className="thumb-list" role="tablist" aria-label={content.featuredPieces}>
                  {heroPieces.map((item, index) => (
                    <button
                      key={item.id}
                      className={`thumb${index === activePiece ? ' is-active' : ''}`}
                      type="button"
                      role="tab"
                      aria-selected={index === activePiece}
                      aria-label={item.label}
                      onClick={() => setActivePiece(index)}
                    >
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
                <button className="rail-arrow" type="button" aria-label={content.nextPiece} onClick={() => selectRelativePiece(1)}>↓</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionBlock
        id="piezas"
        className="catalog-section"
        title={<>{content.catalogTitleA}<br />{content.catalogTitleB}</>}
        kicker={content.catalogKicker}
        subtitle={content.catalogIntro}
      >
        <div className="catalog-grid">
          {featuredProducts.map(product => (
            <RevealOnScroll key={product.id}>
              <ProductCard
                product={product}
                linkAs={Link}
                to={`/producto/${product.id}`}
                viewLabel={content.viewProduct}
                imageUnavailableLabel={content.imageUnavailable}
              />
            </RevealOnScroll>
          ))}
        </div>
      </SectionBlock>

      <section className="section manifesto">
        <div className="section-inner manifesto-grid">
          <RevealOnScroll className="manifesto-copy">
            <span className="mono-label">{content.methodKicker}</span>
            <h2>{content.methodTitleA}<br />{content.methodTitleB}<br /><span>{content.methodTitleC}</span></h2>
            <p>{content.methodIntro}</p>
          </RevealOnScroll>
          <div className="process-list">
            {content.methods.map(([title, description], index) => (
              <RevealOnScroll key={title} delay={index * 100} className="process-item">
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="process-arrow" aria-hidden="true">↗</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section spec-section" id="precision" aria-labelledby="precision-title">
        <div className="section-inner">
          <RevealOnScroll as="header" className="section-heading precision-heading">
            <div>
              <span className="mono-label">{content.precisionKicker}</span>
              <h2 id="precision-title">{content.precisionTitleA}<br />{content.precisionTitleB}</h2>
            </div>
            <p>{content.precisionIntro}</p>
          </RevealOnScroll>
          <div className="spec-grid">
            {content.specs.map(([index, title, description, chip], position) => (
              <RevealOnScroll key={index} className="spec-card" delay={position * 100}>
                <span className="spec-index">{index}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="spec-chip">{chip}</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section quote-section">
        <div className="section-inner">
          <RevealOnScroll className="quote-box">
            <div>
              <span className="mono-label">{content.projectKicker}</span>
              <h2>{content.projectTitleA}<br />{content.projectTitleB}</h2>
              <p>{content.projectIntro}</p>
            </div>
            <Button as={Link} to="/solicitud" variant="primary" pill>
              {content.startRequest} <span aria-hidden="true">↗</span>
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
