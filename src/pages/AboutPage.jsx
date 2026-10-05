import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';
import './institutional.css';

const content = {
  es: {
    eyebrow: 'VÉRTICE · COSTA RICA', title: 'Diseñamos para que las ideas tomen forma.',
    intro: 'Somos un taller de impresión 3D que convierte modelos digitales e ideas concretas en piezas hechas bajo pedido.',
    principle: 'Cada pieza empieza con una necesidad.',
    detail: 'Trabajamos con fabricación aditiva FDM para modelos de catálogo y proyectos personalizados. La forma, el uso previsto y el material se consideran juntos antes de fabricar.',
    stepsTitle: 'Un proceso claro, desde el inicio.',
    steps: [
      ['Explorás', 'Revisá las piezas disponibles o contanos qué querés resolver.'],
      ['Definimos', 'Para una pieza propia, organizamos medidas, uso y referencias antes de preparar la cotización.'],
      ['Fabricamos', 'Con el alcance aprobado, el taller prepara el pedido y comparte sus avances desde tu cuenta.'],
    ],
    boundary: 'Las estimaciones iniciales orientan la conversación. El material, el acabado, la viabilidad y el precio final se confirman para cada pieza antes de producirla.',
    catalog: 'Explorar catálogo', quote: 'Contar mi proyecto',
  },
  en: {
    eyebrow: 'VÉRTICE · COSTA RICA', title: 'We shape ideas into useful parts.',
    intro: 'We are a 3D printing workshop turning digital models and practical ideas into made-to-order parts.',
    principle: 'Every part starts with a need.',
    detail: 'We use FDM additive manufacturing for catalog models and custom projects. Intended use, geometry and material are considered together before production.',
    stepsTitle: 'A clear process from the start.',
    steps: [
      ['Explore', 'Browse available parts or tell us what you need to solve.'],
      ['Define', 'For a custom part, we organize dimensions, use and references before preparing a quote.'],
      ['Make', 'Once the scope is approved, the workshop prepares the order and shares progress through your account.'],
    ],
    boundary: 'Early estimates help frame the conversation. Material, finish, feasibility and final price are confirmed for each part before production.',
    catalog: 'Explore catalog', quote: 'Tell us about your project',
  },
};

export function AboutPage() {
  const { language } = usePreferences();
  const copy = content[language === 'en' ? 'en' : 'es'];
  return <article className="institutional-page about-page">
    <header className="institutional-hero">
      <span className="v-mono-label">{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p className="institutional-hero__lead">{copy.intro}</p>
    </header>
    <section className="about-principle" aria-labelledby="about-principle-title">
      <h2 id="about-principle-title">{copy.principle}</h2>
      <p>{copy.detail}</p>
    </section>
    <section className="about-process" aria-labelledby="about-process-title">
      <header><span className="v-mono-label">{copy.eyebrow}</span><h2 id="about-process-title">{copy.stepsTitle}</h2></header>
      <ol>{copy.steps.map(([title, description]) => <li key={title}>
        <div><h3>{title}</h3><p>{description}</p></div>
      </li>)}</ol>
    </section>
    <aside className="institutional-boundary"><p>{copy.boundary}</p></aside>
    <nav className="institutional-actions" aria-label={language === 'en' ? 'Next steps' : 'Siguientes pasos'}>
      <Link className="v-button v-button--primary v-button--pill" to="/catalogo">{copy.catalog} ↗</Link>
      <Link className="v-link-text" to="/solicitud">{copy.quote} <span aria-hidden="true">↗</span></Link>
    </nav>
  </article>;
}
