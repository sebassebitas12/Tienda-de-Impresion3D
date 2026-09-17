import './App.css'

const metrics = [
  { value: '±0.2 mm', label: 'tolerancia dimensional' },
  { value: '48 h', label: 'entrega express' },
  { value: '320+', label: 'proyectos entregados' },
  { value: '90%', label: 'repetición de clientes' },
]

const products = [
  { name: 'Prototipos funcionales', price: 'desde ₡12.000', tone: 'lava' },
  { name: 'Figuras coleccionables', price: 'desde ₡8.500', tone: 'graphite' },
  { name: 'Piezas de repuesto', price: 'desde ₡6.000', tone: 'ember' },
  { name: 'Maquetas arquitectónicas', price: 'cotización', tone: 'steel' },
]

const process = [
  { step: '01', title: 'Diseño', text: 'Definimos forma, material y producción con precisión.' },
  { step: '02', title: 'Preparación', text: 'Optimizamos la pieza para impresión y validación.' },
  { step: '03', title: 'Impresión', text: 'Fabricamos con control de calidad y tolerancias.' },
  { step: '04', title: 'Entrega', text: 'Entregamos el resultado listo para usar o vender.' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Vértice CR home">
          <span className="brand-mark">V</span>
          <span className="brand-text">Vértice <strong>CR</strong></span>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#precision">Precisión</a>
          <a href="#proceso">Proceso</a>
        </nav>

        <button type="button" className="primary-button small-button">
          Cotizar impresión
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Fabricación digital · Costa Rica</span>
            <h1>
              Materializamos ideas con <span>precisión</span> y presencia.
            </h1>
            <p>
              Devolvemos vida a piezas, prototipos y productos con un lenguaje visual que
              mezcla tecnología, creatividad y confianza local.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button">
                Cotizar impresión
              </button>
              <button type="button" className="secondary-button">
                Ver catálogo
              </button>
            </div>

            <div className="mini-proof" aria-label="Estadísticas destacadas">
              <div>
                <strong>3.6k</strong>
                <span>piezas entregadas</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>soporte técnico</span>
              </div>
            </div>
          </div>

          <div className="showcase" aria-label="Productos destacados">
            <div className="showcase-glow" />
            <div className="showcase-card showcase-card-large">
              <div className="card-header">
                <span className="chip">Prototipo</span>
                <span className="code-tag">PRT-01</span>
              </div>
              <div className="object-visual object-visual--lava" aria-hidden="true">
                <span className="object-layer object-layer--one" />
                <span className="object-layer object-layer--two" />
              </div>
              <div className="card-meta">
                <span>Diseño funcional</span>
                <strong>₡12.000</strong>
              </div>
            </div>

            <div className="showcase-stack">
              <div className="showcase-card small-card">
                <span className="chip">Figura</span>
                <strong>FIG-02</strong>
              </div>
              <div className="showcase-card small-card dark-card">
                <span className="chip">Repuesto</span>
                <strong>RPT-03</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="metrics" id="precision" aria-label="Métricas de precisión">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-item">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="catalog" id="catalogo">
          <div className="section-heading">
            <span className="eyebrow">Catálogo</span>
            <h2>Productos pensados para uso real.</h2>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.name} className={`product-card product-card--${product.tone}`}>
                <div className="product-visual" aria-hidden="true" />
                <div className="product-copy">
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="process" id="proceso">
          <div className="section-heading">
            <span className="eyebrow">Proceso</span>
            <h2>De la idea al producto final.</h2>
          </div>

          <div className="process-grid">
            {process.map((item) => (
              <article key={item.step} className="process-card">
                <span className="process-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="request-panel">
          <div className="request-copy">
            <span className="eyebrow">Impresión personalizada</span>
            <h2>Tu pieza empieza con una idea clara.</h2>
            <p>
              Subí tu archivo 3D o pedinos ayuda para definir la geometría, material y
              presupuesto ideal para tu proyecto.
            </p>
          </div>

          <div className="request-summary" aria-label="Resumen de solicitud">
            <div className="summary-row">
              <span>Origen</span>
              <strong>Archivo STL</strong>
            </div>
            <div className="summary-row">
              <span>Material</span>
              <strong>PLA / PETG</strong>
            </div>
            <div className="summary-row">
              <span>Calidad</span>
              <strong>Alta precisión</strong>
            </div>
            <div className="summary-row summary-row--status">
              <span>Estado</span>
              <strong>Pendiente de cotización</strong>
            </div>
            <button type="button" className="primary-button full-width">
              Enviar a revisión
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Vértice CR</span>
        <span>Diseño de impresión 3D para ideas reales.</span>
      </footer>
    </div>
  )
}

export default App
