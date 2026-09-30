import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  RevealOnScroll, 
  ProductCard, 
  SectionBlock, 
  SignalMetric 
} from '../components/ui/index.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { useTheme } from '../hooks/useTheme.js';
import '../styles/home.css';

export function Home() {
  const { copy } = usePreferences();
  
  // Example dummy products for the catalog highlight
  const featuredProducts = [
    { id: '1', ref: 'PRT-006', name: 'Soporte Estructural Articulado', description: 'Pieza de carga de alto rendimiento para ensamblajes.', material: 'PETG CF', category: 'Ingeniería', stock: 12, price: 18500, image: '/placeholder.jpg' },
    { id: '2', ref: 'MEC-012', name: 'Engranaje Helicoidal', description: 'Transmisión de fuerza silenciosa y precisa.', material: 'Nylon 12', category: 'Mecánica', stock: 5, price: 24000, image: '/placeholder.jpg' },
    { id: '3', ref: 'CUS-099', name: 'Carcasa Protectora IP67', description: 'Protección contra polvo y agua para sensores.', material: 'TPU 95A', category: 'Electrónica', stock: 0, price: 15000, image: '/placeholder.jpg' }
  ];

  return (
    <>
      {/* 1. HERO WORKBENCH */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-grid">
            <RevealOnScroll className="hero-copy">
              <div className="hero-kicker">
                <span className="mono-label">SISTEMA EN LÍNEA</span>
              </div>
              <h1>Servicio de impresión 3D <em>preciso</em> para la industria.</h1>
              <p className="hero-lede">
                Desde prototipos rápidos hasta lotes de piezas finales. 
                Sube tu modelo, selecciona el material y recibe una cotización en horas.
              </p>
              <div className="hero-actions">
                <Button as={Link} to="/solicitud" variant="primary" className="btn-pill">
                  Cotizar Archivo 3D <span aria-hidden="true">↗</span>
                </Button>
                <Button as={Link} to="/catalogo" variant="ghost" className="btn-pill">
                  Ver Catálogo
                </Button>
              </div>
              <div className="hero-signals">
                <div><span className="signal-value">±0.05 mm</span><span className="signal-text">Tolerancia dimensional</span></div>
                <div><span className="signal-value">24-48h</span><span className="signal-text">Tiempo de respuesta</span></div>
                <div><span className="signal-value">CR</span><span className="signal-text">Envío a todo el país</span></div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll className="hero-visual" delay={100}>
              {/* Aquí irá la foto del producto, las anotaciones SVG y el telemetría */}
              <div className="hero-photo-wrap">
                <div className="scan-line" />
                <div className="visual-status"><i></i> SISTEMA ACTIVO</div>
                <div className="visual-meta">
                  <div>
                    <h2>Prototipo Funcional</h2>
                    <p>PETG + Fibra de Carbono</p>
                  </div>
                  <div className="visual-ref">REF<br/>PT-29A</div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DESTACADO */}
      <SectionBlock title="Piezas de Alta Demanda" kicker="01 / CATÁLOGO" description="Explora nuestros productos pre-diseñados listos para manufactura.">
        <div className="catalog-grid">
          {featuredProducts.map(product => (
            <RevealOnScroll key={product.id}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </SectionBlock>

      {/* 3. EL MÉTODO (MANIFIESTO) */}
      <section className="section manifesto">
        <div className="section-inner manifesto-grid">
          <RevealOnScroll className="manifesto-copy">
            <h2 className="section-heading">Nuestra <span>precisión</span> es tu ventaja.</h2>
            <p>
              Controlamos cada variable del proceso, desde la humedad del filamento hasta 
              la temperatura de la cámara de impresión, para asegurar que cada capa se 
              fusione perfectamente.
            </p>
          </RevealOnScroll>
          <div className="process-list">
            {[
              { num: '01', title: 'Análisis Geométrico', desc: 'Evaluamos tu modelo buscando voladizos, puentes y áreas de tensión.' },
              { num: '02', title: 'Selección de Material', desc: 'Asignamos el termoplástico correcto según los requerimientos mecánicos y térmicos.' },
              { num: '03', title: 'Corte (Slicing) Optimizado', desc: 'Configuramos perímetros, relleno y orientación para maximizar la resistencia isotrópica.' },
              { num: '04', title: 'Control de Calidad', desc: 'Verificación de tolerancia dimensional antes del envío.' }
            ].map((step, idx) => (
              <RevealOnScroll key={step.num} delay={idx * 100} className="process-item">
                <span className="process-number">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <span className="process-arrow">↗</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEÑALES / ESPECIFICACIONES */}
      <section className="section spec-section">
        <div className="section-inner">
          <div className="spec-grid">
            <RevealOnScroll className="spec-card">
              <span className="spec-index">01.</span>
              <h3>Tolerancias Industriales</h3>
              <p>Logramos precisión dimensional de ±0.05 mm en piezas técnicas mediante la calibración constante de ejes lineales y flujo de extrusión.</p>
              <span className="spec-chip">/ VOLUMEN MAX: 300x300x400mm</span>
            </RevealOnScroll>
            <RevealOnScroll className="spec-card" delay={100}>
              <span className="spec-index">02.</span>
              <h3>Materiales de Ingeniería</h3>
              <p>Trabajamos con polímeros avanzados como Nylon, TPU flexible, ASA resistente a UV, y compuestos reforzados con Fibra de Carbono.</p>
              <span className="spec-chip">/ TEMP MAX: 300°C</span>
            </RevealOnScroll>
            <RevealOnScroll className="spec-card" delay={200}>
              <span className="spec-index">03.</span>
              <h3>Prototipado a Producción</h3>
              <p>Desde una pieza única para validación de concepto hasta lotes pequeños y medianos listos para uso final o ensamblaje.</p>
              <span className="spec-chip">/ VOLUMEN: 1 - 500 uds</span>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 5. CTA COTIZACIÓN */}
      <section className="section quote-section">
        <div className="section-inner">
          <RevealOnScroll className="quote-box">
            <div>
              <h2>¿Tienes un proyecto en mente?</h2>
              <p>Sube tu archivo STL o STEP y recibe un análisis de fabricabilidad y una cotización exacta sin compromiso.</p>
            </div>
            <Button as={Link} to="/solicitud" variant="primary" className="btn-pill">
              Iniciar Cotización <span aria-hidden="true">↗</span>
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
