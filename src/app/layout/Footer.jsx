import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';

const year = new Date().getFullYear();

export function Footer() {
  const { copy } = usePreferences();
  const groups = [
    ['services', [['/catalogo', 'catalog'], ['/solicitud', 'quoteFile'], ['/materiales', 'materials']]],
    ['support', [['/faq', 'faq'], ['/requisitos', 'requirements'], ['/contacto', 'directContact']]],
    ['legal', [['/terminos', 'terms'], ['/privacidad', 'privacy'], ['/envios', 'shipping']]],
  ];
  return (
    <footer className="site-footer"><div className="section-inner">
      <div className="footer-grid">
        <div><BrandLogo as={Link} to="/" /><p>{copy.footerDescription}</p></div>
        {groups.map(([title, links]) => <div key={title}>
          <h2 className="footer-title">{copy[title]}</h2>
          <div className="footer-links">{links.map(([path, label]) => <Link key={path} to={path}>{copy[label]}</Link>)}</div>
        </div>)}
      </div>
      <div className="footer-bottom"><span>© {year} VÉRTICE CR. {copy.made}</span><span>{copy.signature}</span></div>
    </div></footer>
  );
}
