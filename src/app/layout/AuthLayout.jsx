import { Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { RouteFocus } from './RouteFocus.jsx';
import '../../styles/auth.css';

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <RouteFocus />
      <header className="auth-header">
        <BrandLogo as={Link} to="/" />
        <Link className="auth-back-link" to="/">Volver al taller <span aria-hidden="true">↗</span></Link>
      </header>

      <main id="main-content" tabIndex={-1} className="auth-main">
        <aside className="auth-visual" aria-hidden="true">
          <span className="auth-visual-kicker">VÉRTICE / ACCESO</span>
          <div className="auth-visual-core">
            <span>PRECISIÓN</span>
            <strong>Materia.<br />Proceso.<br />Control.</strong>
          </div>
          <div className="auth-visual-grid" />
        </aside>

        <section className="auth-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
