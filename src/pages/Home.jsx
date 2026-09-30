import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  RevealOnScroll,
  ProductCard,
  SectionBlock
} from '../components/ui/index.js';
import '../styles/home.css';

const heroPieces = [
  {
    image: '/images/hero-soporte.jpg',
    alt: 'Soporte modular de carga en PETG',
    material: 'PETG PRO',
    process: '/ ESTRUCTURA LATTICE',
    title: 'Soporte Modular de Carga',
    description: 'Estructura mecánica con alivios lattice de alta rigidez',
    ref: 'REF: PRT-001',
    tolerance: '±0.05 mm',
    target: 'M 0 0 L 45 0 L 155 93',
    dot: [155, 93],
    label: 'Pieza 1, soporte modular'
  },
  {
    image: '/images/producto-engranaje.jpg',
    alt: 'Engranaje helicoidal de precisión en nylon',
    material: 'NYLON PA12',
    process: '/ MÓDULO 2.0',
    title: 'Engranaje Helicoidal 60T',
    description: 'Transmisión de bajo ruido para ciclos mecánicos continuos',
    ref: 'REF: PRT-002',
    tolerance: 'MÓDULO 2.0',
    target: 'M 0 0 L 45 0 L 138 76',
    dot: [138, 76],
    label: 'Pieza 2, engranaje helicoidal'
  },
  {
    image: '/images/producto-dragon.jpg',
    alt: 'Dragón geométrico articulado',
    material: 'PLA SILK',
    process: '/ ACABADO IRIDISCENTE',
    title: 'Dragón de Colección',
    description: 'Escultura de facetas con articulaciones internas continuas',
    ref: 'REF: PRT-003',
    tolerance: 'ARTICULADO',
    target: 'M 0 0 L 45 0 L 148 101',
    dot: [148, 101],
    label: 'Pieza 3, dragón geométrico'
  },
  {
    image: '/images/producto-drone.jpg',
    alt: 'Brazo de chasis de drone en ASA',
    material: 'ASA CARBON',
    process: '/ RESISTENCIA UV',
    title: 'Brazo de Chasis Drone',
    description: 'Estructura tubular para motor brushless y alto impacto',
    ref: 'REF: PRT-004',
    tolerance: 'RESISTENCIA UV',
    target: 'M 0 0 L 45 0 L 128 70',
    dot: [128, 70],
    label: 'Pieza 4, brazo de drone'
  }
];

const temporaryProductImage = '/images/producto-temporal.png';

const featuredProducts = [
  {
    id: 'p1',
    reference: 'REF: PRT-001 · ±0.05 MM',
    name: 'Soporte de Alta Precisión Modular',
    description: 'Geometría lattice optimizada con alivios de peso para montajes mecánicos y rigidez estructural.',
    material: 'PETG PRO',
    categoryName: 'Piezas funcionales',
    stock: 14,
    stockLabel: 'EN STOCK (14)',
    stockStatus: 'in-stock',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  },
  {
    id: 'p2',
    reference: 'REF: PRT-002 · MÓDULO 2.0',
    name: 'Engranaje de Nylon de Precisión 60T',
    description: 'Dientes helicoidales para transmisión de bajo nivel sonoro y resistencia continua al desgaste.',
    material: 'NYLON PA12',
    categoryName: 'Mecánica / Robótica',
    stock: 21,
    stockLabel: 'EN STOCK (21)',
    stockStatus: 'in-stock',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  },
  {
    id: 'p3',
    reference: 'REF: PRT-003 · IRIDISCENTE',
    name: 'Dragón de Colección Geométrico',
    description: 'Escultura low-poly con articulaciones internas continuas, impresa en una sola pieza móvil.',
    material: 'PLA SILK',
    categoryName: 'Colección / Arte',
    stock: 0,
    stockLabel: 'BAJO PEDIDO',
    stockStatus: 'order',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  },
  {
    id: 'p4',
    reference: 'REF: PRT-004 · RESISTENCIA UV',
    name: 'Brazo de Chasis de Drone Pro',
    description: 'Estructura tubular con montura para motor brushless y amortiguación elástica de impacto.',
    material: 'ASA CARBON',
    categoryName: 'Aeroespacial / Drones',
    stock: 8,
    stockLabel: 'EN STOCK (8)',
    stockStatus: 'in-stock',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  },
  {
    id: 'p5',
    reference: 'REF: PRT-005 · CAPA 0.08 MM',
    name: 'Maqueta de Rascacielos Cúbico',
    description: 'Modelo arquitectónico de precisión con vanos definidos, terrazas y textura de fachada limpia.',
    material: 'PLA HIGH DETAIL',
    categoryName: 'Arquitectura',
    stock: 0,
    stockLabel: 'BAJO PEDIDO',
    stockStatus: 'order',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  },
  {
    id: 'p6',
    reference: 'REF: PRT-006 · TEMPORAL',
    name: 'Busto de Precisión Cibernético',
    description: 'Referencia temporal del catálogo mientras se incorporan fotografías reales de producto.',
    material: 'RESINA 8K',
    categoryName: 'Prototipo',
    stock: 1,
    stockLabel: 'NUEVO LOTE',
    stockStatus: 'in-stock',
    status: 'ACTIVE',
    images: [temporaryProductImage]
  }
];

export function Home() {
  const [activePiece, setActivePiece] = useState(0);
  const visualRef = useRef(null);
  const photoWrapRef = useRef(null);
  const piece = heroPieces[activePiece];

  useEffect(() => {
    const visual = visualRef.current;
    const photoWrap = photoWrapRef.current;
    if (!visual || !photoWrap) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return undefined;

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
    setActivePiece((current) => (current + offset + heroPieces.length) % heroPieces.length);
  };

  return (
    <>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker mono-label">Manufactura aditiva / San José, CR</div>
              <h1 id="hero-title">Lo que imaginas.<br /><em>Hecho preciso.</em></h1>
              <p className="hero-lede">
                Piezas funcionales, prototipos y objetos de alto detalle fabricados con criterio técnico,
                materiales correctos y una revisión humana en cada etapa.
              </p>
              <div className="hero-actions">
                <Button as="a" href="#piezas" variant="primary" className="btn-pill">
                  Explorar piezas <span aria-hidden="true">↓</span>
                </Button>
                <Button as={Link} to="/solicitud" variant="ghost">
                  Tengo un archivo <span aria-hidden="true">↗</span>
                </Button>
              </div>
              <div className="hero-signals" aria-label="Capacidades principales">
                <div><span className="signal-value">±0.05 mm</span><span className="signal-text">Tolerancia objetivo</span></div>
                <div><span className="signal-value">FDM / SLA</span><span className="signal-text">Procesos disponibles</span></div>
                <div><span className="signal-value">Por etapas</span><span className="signal-text">Revisión por etapas</span></div>
              </div>
            </div>

            <div className="hero-visual" ref={visualRef} aria-label="Pieza destacada interactiva">
              <span className="visual-coordinate">WORKBENCH</span>
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
                <div className="visual-status" aria-hidden="true"><i /> REVISIÓN ACTIVA</div>
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
                <button className="rail-arrow" type="button" aria-label="Pieza anterior" onClick={() => selectRelativePiece(-1)}>↑</button>
                <div className="thumb-list" role="tablist" aria-label="Piezas destacadas">
                  {heroPieces.map((item, index) => (
                    <button
                      key={item.ref}
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
                <button className="rail-arrow" type="button" aria-label="Pieza siguiente" onClick={() => selectRelativePiece(1)}>↓</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionBlock
        id="piezas"
        title={<>Objetos que<br />resuelven algo.</>}
        kicker="Selección de taller"
        description="Una selección de piezas funcionales y modelos de colección. El catálogo muestra referencias; la cotización ocurre después de revisar tu solicitud."
      >
        <div className="catalog-grid">
          {featuredProducts.map((product) => (
            <RevealOnScroll key={product.id}>
              <ProductCard product={product} linkAs={Link} to={`/producto/${product.id}`} />
            </RevealOnScroll>
          ))}
        </div>
      </SectionBlock>

      <section className="section manifesto">
        <div className="section-inner manifesto-grid">
          <RevealOnScroll className="manifesto-copy">
            <span className="mono-label">El método</span>
            <h2>No imprimimos<br />por imprimir.<br /><span>Resolvemos.</span></h2>
            <p>Una pieza empieza mucho antes de tocar la cama de impresión: revisamos geometría, esfuerzo, material y acabado para que el resultado tenga sentido fuera de la pantalla.</p>
          </RevealOnScroll>
          <div className="process-list">
            {[
              ['Entender el archivo', 'Revisión de malla, escala, orientación y puntos críticos.'],
              ['Elegir el material', 'Definimos el polímero según esfuerzo, temperatura y acabado.'],
              ['Fabricar con control', 'Impresión aditiva con supervisión y revisión dimensional.'],
              ['Entregar una pieza lista', 'Curado, acabado, verificación y despacho seguro.']
            ].map(([title, description], index) => (
              <RevealOnScroll key={title} delay={index * 100} className="process-item">
                <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="process-arrow" aria-hidden="true">↗</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section spec-section">
        <div className="section-inner">
          <div className="spec-grid">
            <RevealOnScroll className="spec-card">
              <span className="spec-index">A / DIMENSIONAL</span>
              <h3>±0.05 mm</h3>
              <p>Tolerancia objetivo para piezas y ajustes que necesitan repetibilidad.</p>
              <span className="spec-chip">VERIFICACIÓN MANUAL</span>
            </RevealOnScroll>
            <RevealOnScroll className="spec-card" delay={100}>
              <span className="spec-index">B / MATERIALES</span>
              <h3>Polímeros técnicos</h3>
              <p>PETG, Nylon CF, ASA, PLA de detalle y resina para distintos usos.</p>
              <span className="spec-chip">FDM + SLA</span>
            </RevealOnScroll>
            <RevealOnScroll className="spec-card" delay={200}>
              <span className="spec-index">C / ENTREGAS</span>
              <h3>GAM + 7 provincias</h3>
              <p>Prototipado y entregas coordinadas desde San José, Costa Rica.</p>
              <span className="spec-chip">CORREOS DE COSTA RICA</span>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section quote-section">
        <div className="section-inner">
          <RevealOnScroll className="quote-box">
            <div>
              <span className="mono-label">Tu proyecto</span>
              <h2>¿Tenés un archivo<br />que quiere existir?</h2>
              <p>Envíanos STL, STEP u OBJ para una revisión técnica antes de cotizar.</p>
            </div>
            <Button as={Link} to="/solicitud" variant="primary" className="btn-pill">
              Iniciar solicitud <span aria-hidden="true">↗</span>
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
