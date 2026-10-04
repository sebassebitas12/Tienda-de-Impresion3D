import { useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, ThemeToggle } from '../../components/ui/index.js';
import { useTheme } from '../../hooks/useTheme.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAuth } from '../../hooks/useAuth.js';
import { RouteFocus } from './RouteFocus.jsx';

export function AdminLayout() {
  const { copy } = usePreferences();
  const { theme, setTheme } = useTheme();
  const { user, logout, isPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState(false);
  const links = [['/admin', 'dashboard'], ['/admin/pedidos', 'orders'], ['/admin/solicitudes', 'requests'],
    ['/admin/catalogo', 'products'], ['/admin/catalogo/categorias', 'categories'], ['/admin/clientes', 'customers'], ['/admin/actividad', 'activity'], ['/admin/asistente', 'copilot']];
  const handleLogout = async () => {
    setLogoutError(false);
    const adminPath = location.pathname;
    await navigate('/', { replace: true, flushSync: true });
    try {
      await logout();
    } catch {
      setLogoutError(true);
      navigate(adminPath, { replace: true });
    }
  };
  return (
    <div className="admin-shell">
      <RouteFocus />
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <aside className="admin-sidebar">
        <BrandLogo as={Link} to="/" />
        <p>{copy.admin}</p>
        <nav aria-label={copy.admin}>{links.map(([to, label]) => <NavLink key={to} to={to}
          end={to === '/admin' || to === '/admin/actividad' || to === '/admin/catalogo/categorias' || to === '/admin/asistente' || (to === '/admin/catalogo' && location.pathname === '/admin/catalogo/categorias')}>
          {label === 'copilot' ? (copy.admin === 'Administración' ? 'Copiloto' : 'Copilot') : copy[label]}</NavLink>)}</nav>
        <div className="admin-session-inline" aria-label={copy.adminSession}><span>{copy.admin}</span><strong>{user?.name || copy.admin}</strong></div>
        <div className="admin-utilities"><ThemeToggle theme={theme} onToggle={setTheme} /></div>
        <button className="v-button v-button--ghost" type="button" onClick={handleLogout} disabled={isPending}>{copy.logout}</button>
        {logoutError && <p role="alert">{copy.authGenericError}</p>}
      </aside>
      <main id="main-content" tabIndex={-1}><Outlet /></main>
    </div>
  );
}
