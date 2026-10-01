import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, IconButton, Input, LanguageToggle, NavLink, Panel, ThemeToggle } from '../../components/ui/index.js';
import { useTheme } from '../../hooks/useTheme.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAuth } from '../../hooks/useAuth.js';


function AccountMenuIcon({ type }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (type === 'login') {
    return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  }

  if (type === 'register') {
    return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M17 11h6" /></svg>;
  }

  if (type === 'support') {
    return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;
  }

  if (type === 'logout') {
    return <svg {...common}><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>;
  }

  return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>;
}


export function Navbar({ onReading }) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, copy } = usePreferences();
  const { user, logout, isPending, hasPersistedSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState('');
  const [logoutError, setLogoutError] = useState(false);
  const searchTrigger = useRef(null);
  const menuTrigger = useRef(null);
  const searchField = useRef(null);
  const links = [['/', 'home'], ['/catalogo', 'shop'], ['/nosotros', 'about'], ['/contacto', 'contact']];
  const toggle = name => setPanel(current => current === name ? null : name);
  const closePanel = () => setPanel(null);
  const handleLogout = async () => {
    setLogoutError(false);
    try {
      await logout();
      closePanel();
      navigate('/', { replace: true });
    } catch {
      setLogoutError(true);
    }
  };

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <div className="header-inner">
        <BrandLogo as={Link} to="/" />

        <nav className="nav-links" aria-label={copy.navigation}>
          {links.map(([path, key]) => (
            <NavLink as={Link} key={path} to={path} current={location.pathname === path}>
              {copy[key]}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <IconButton
            ref={searchTrigger}
            className="nav-search header-search"
            label={copy.search}
            aria-expanded={panel === 'search'}
            aria-controls="search-panel"
            onClick={() => toggle('search')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </IconButton>

          <Link className="v-button v-button--primary v-button--pill header-quote" to="/solicitud">
            {copy.quote}<span aria-hidden="true">↗</span>
          </Link>

          <LanguageToggle className="header-language" language={language} onChange={setLanguage} />
          <ThemeToggle className="header-theme" theme={theme} onToggle={setTheme} label={theme === 'dark' ? copy.light : copy.dark} />

          <IconButton
            ref={menuTrigger}
            className="hamburger"
            label={panel === 'menu' ? copy.close : copy.openMenu}
            aria-expanded={panel === 'menu'}
            aria-controls="account-menu-panel"
            onClick={() => toggle('menu')}
          >
            <i /><i /><i />
          </IconButton>

          <Panel
            id="search-panel"
            className="search-panel"
            open={panel === 'search'}
            title={<span className="search-panel-title"><img src="/favicon-32.png" alt="" />{copy.searchTitle}</span>}
            closeLabel={copy.close}
            onClose={closePanel}
            triggerRef={searchTrigger}
            initialFocusRef={searchField}
          >
            <form onSubmit={event => {
              event.preventDefault();
              closePanel();
              navigate('/catalogo' + (query.trim() ? '?buscar=' + encodeURIComponent(query.trim()) : ''));
            }}>
              <Input
                ref={searchField}
                type="search"
                label={copy.searchLabel}
                value={query}
                onChange={event => setQuery(event.target.value)}
                autoComplete="off"
              />

              <div className="search-panel-content">
                {query.trim() ? (
                  <button type="submit" className="search-query-action">
                    <span className="search-query-mark" aria-hidden="true">⌕</span>
                    <span>
                      <strong>{copy.searchFor} “{query.trim()}”</strong>
                      <small>{copy.searchQueryHint}</small>
                    </span>
                    <span className="search-query-arrow" aria-hidden="true">↗</span>
                  </button>
                ) : (
                  <>
                    <p className="search-panel-hint">{copy.searchHint}</p>
                    <span className="search-shortcuts-label">{copy.searchShortcuts}</span>
                    <div className="search-shortcuts">
                      <Link to="/catalogo" onClick={closePanel}>
                        <span><strong>{copy.catalog}</strong><small>{copy.searchCatalogHint}</small></span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                      <Link to="/materiales" onClick={closePanel}>
                        <span><strong>{copy.materials}</strong><small>{copy.searchMaterialsHint}</small></span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                      <Link to="/requisitos" onClick={closePanel}>
                        <span><strong>{copy.requirements}</strong><small>{copy.searchRequirementsHint}</small></span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </form>
          </Panel>

          <Panel
            id="account-menu-panel"
            className="account-panel-dropdown"
            open={panel === 'menu'}
            title={copy.space}
            closeLabel={copy.close}
            onClose={closePanel}
            triggerRef={menuTrigger}
          >
            <div className="account-dropdown-head">
              <strong>{copy.space}</strong>
              <span>{user?.name || (hasPersistedSession ? copy.authSessionUnverified : copy.guest)}</span>
            </div>

            <nav className="mobile-menu-nav" aria-label={copy.navigation}>
              {links.map(([path, key]) => (
                <Link key={path} to={path} onClick={closePanel} aria-current={location.pathname === path ? 'page' : undefined}>
                  <span>{copy[key]}</span><span aria-hidden="true">↗</span>
                </Link>
              ))}
              <Link to="/faq" onClick={closePanel}>
                <span>{copy.faq}</span><span aria-hidden="true">↗</span>
              </Link>
            </nav>

            <div className="account-dropdown-results">
              <Link className="account-dropdown-link account-dropdown-primary" to={user ? '/cuenta' : '/login'} onClick={closePanel}>
                <AccountMenuIcon type="login" />
                <span>{user ? copy.account : copy.login}</span>
              </Link>

              {!user && (
                <Link className="account-dropdown-link" to="/registro" onClick={closePanel}>
                  <AccountMenuIcon type="register" />
                  <span>{copy.register}</span>
                </Link>
              )}

              <div className="account-dropdown-divider" />

              <Link className="account-dropdown-link" to="/faq" onClick={closePanel}>
                <AccountMenuIcon type="support" />
                <span>{copy.support}</span>
              </Link>

              <button type="button" className="account-dropdown-link" onClick={() => { closePanel(); onReading(); }}>
                <AccountMenuIcon type="settings" />
                <span>{copy.settings}</span>
              </button>
              {(user || hasPersistedSession) && (
                <>
                  <div className="account-dropdown-divider" />
                  <button type="button" className="account-dropdown-link account-dropdown-logout" onClick={handleLogout} disabled={isPending}>
                    <AccountMenuIcon type="logout" />
                    <span>{copy.logout}</span>
                  </button>
                </>
              )}
              {logoutError && <p className="auth-error" role="alert">{copy.authGenericError}</p>}
            </div>
          </Panel>
        </div>
      </div>
    </header>
  );
}
