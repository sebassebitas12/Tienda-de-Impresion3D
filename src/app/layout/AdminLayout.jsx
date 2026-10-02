import { useRef, useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, ThemeToggle } from '../../components/ui/index.js';
import { useTheme } from '../../hooks/useTheme.js';
import { AssistantPanel } from '../../features/chatbot/AssistantPanel.jsx';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAuth } from '../../hooks/useAuth.js';
import { RouteFocus } from './RouteFocus.jsx';

export function AdminLayout() {
  const { copy } = usePreferences();
  const { theme, setTheme } = useTheme();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const assistantTrigger = useRef(null);
  const { user, logout, isPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState(false);
  const links = [['/admin', 'dashboard'], ['/admin/pedidos', 'orders'], ['/admin/solicitudes', 'requests'],
    ['/admin/catalogo', 'products'], ['/admin/catalogo/categorias', 'categories'], ['/admin/clientes', 'customers'], ['/admin/actividad', 'activity']];
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
          end={to === '/admin' || to === '/admin/actividad' || to === '/admin/catalogo/categorias' || (to === '/admin/catalogo' && location.pathname === '/admin/catalogo/categorias')}>
          {copy[label]}</NavLink>)}</nav>
        <div className="admin-session-inline" aria-label={copy.adminSession}><span>{copy.admin}</span><strong>{user?.name || copy.admin}</strong></div>
        <div className="admin-utilities"><ThemeToggle theme={theme} onToggle={setTheme} />
          <button className="v-button v-button--ghost admin-assistant-trigger" ref={assistantTrigger} type="button" aria-expanded={assistantOpen} aria-controls="admin-assistant" onClick={() => setAssistantOpen(value => !value)}>{copy.admin === 'Administración' ? 'Asistente Admin' : 'Admin assistant'} ✦</button>
        </div>
        <button className="v-button v-button--ghost" type="button" onClick={handleLogout} disabled={isPending}>{copy.logout}</button>
        {logoutError && <p role="alert">{copy.authGenericError}</p>}
      </aside>
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <AssistantPanel key={user?.id} mode="admin" id="admin-assistant" open={assistantOpen} onClose={() => setAssistantOpen(false)} triggerRef={assistantTrigger} />
    </div>
  );
}
