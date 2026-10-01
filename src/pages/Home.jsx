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
  const [leader, setLeader] = useState(null);
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
    const wrap = photoWrapRef.current;
    const image = wrap?.querySelector('.hero-photo');
    const note = wrap?.querySelector('.visual-note');
    if (!wrap || !image || !note) return undefined;

    const updateLeader = () => {
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
      const wrapRect = wrap.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const noteRect = note.getBoundingClientRect();
      const imageStyle = window.getComputedStyle(image);
      const paddingLeft = parseFloat(imageStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(imageStyle.paddingRight) || 0;
      const paddingTop = parseFloat(imageStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(imageStyle.paddingBottom) || 0;
      const contentWidth = imageRect.width - paddingLeft - paddingRight;
      const contentHeight = imageRect.height - paddingTop - paddingBottom;
      const fit = Math.min(contentWidth / image.naturalWidth, contentHeight / image.naturalHeight);
      const renderedWidth = image.naturalWidth * fit;
      const renderedHeight = image.naturalHeight * fit;
      const imageLeft = imageRect.left + paddingLeft + (contentWidth - renderedWidth) / 2;
      const imageTop = imageRect.top + paddingTop + (contentHeight - renderedHeight) / 2;
      const [targetX, targetY] = piece.target;
      const x = imageLeft - wrapRect.left + targetX * fit;
      const y = imageTop - wrapRect.top + targetY * fit;
      const startX = noteRect.left - wrapRect.left;
      const noteTopY = noteRect.top - wrapRect.top;
      const startY = noteRect.bottom - wrapRect.top;
      const elbowY = startY + 10;
      const elbowX = startX + 26;

      setLeader({
        viewBox: `0 0 ${wrapRect.width} ${wrapRect.height}`,
        path: `M ${startX} ${noteTopY} L ${startX} ${elbowY} L ${elbowX} ${elbowY} L ${x} ${y}`,
        x,
        y,
      });
    };

    const observer = new ResizeObserver(updateLeader);
    observer.observe(wrap);
    observer.observe(image);
    observer.observe(note);
    image.addEventListener('load', updateLeader);
    const frame = requestAnimationFrame(updateLeader);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      image.removeEventListener('load', updateLeader);
    };
  }, [piece.image, piece.target, content.filamentLabel]);

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
              <div className="hero-signals" role="group" aria-label={content.capabilities}>
                <div className="hero-signal">
                  <span className="signal-value">{content.orderValue}</span>
                  <span className="signal-text">{content.orderDetail}</span>
                </div>
                <div className="hero-signal">
                  <span className="signal-value">FDM</span>
                  <span className="signal-text">{content.materialList}</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" ref={visualRef}>
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
                  <strong>{content.filamentLabel} · {piece.material}</strong>
                  <span>{piece.process}</span>
                </div>
                <svg className="visual-note-line" viewBox={leader?.viewBox ?? '0 0 1 1'} aria-hidden="true">
                  <path d={leader?.path ?? ''} />
                  {leader && <circle cx={leader.x} cy={leader.y} r="3" />}
                </svg>
                <div className="visual-meta">
                  <div>
                    <h2>{piece.title}</h2>
                    <p>{piece.description}</p>
                  </div>
                </div>
              </div>

              <div className="thumb-rail">
                <button className="rail-arrow" type="button" aria-label={content.previousPiece} onClick={() => selectRelativePiece(-1)}>↑</button>
                <div className="thumb-list" role="group" aria-label={content.featuredPieces}>
                  {heroPieces.map((item, index) => (
                    <button
                      key={item.id}
                      className={`thumb${index === activePiece ? ' is-active' : ''}`}
                      type="button"
                      aria-pressed={index === activePiece}
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
                layout="featured"
                showAvailability={false}
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
            {content.specs.map(([title, description], position) => (
              <RevealOnScroll key={title} className="spec-card" delay={position * 100}>
                <h3>{title}</h3>
                <p>{description}</p>
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
