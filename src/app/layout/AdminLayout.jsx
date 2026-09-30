import { NavLink, Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { RouteFocus } from './RouteFocus.jsx';

export function AdminLayout() {
  const { copy } = usePreferences();
  const links = [['/admin', 'dashboard'], ['/admin/pedidos', 'orders'], ['/admin/solicitudes', 'requests'],
    ['/admin/catalogo', 'products'], ['/admin/catalogo/categorias', 'categories'], ['/admin/clientes', 'customers'], ['/admin/actividad', 'activity']];
  return (
    <div className="admin-shell">
      <RouteFocus />
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <aside className="admin-sidebar">
        <BrandLogo as={Link} to="/" />
        <p>{copy.admin}</p>
        <nav aria-label={copy.admin}>{links.map(([to, label]) => <NavLink key={to} to={to} end>{copy[label]}</NavLink>)}</nav>
        <Link className="v-link-text" to="/">{copy.publicSite}</Link>
      </aside>
      <main id="main-content" tabIndex={-1}><Outlet /></main>
    </div>
  );
}
