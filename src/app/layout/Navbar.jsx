import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, Button, IconButton, Input, LanguageToggle, NavLink, Panel, ThemeToggle } from '../../components/ui/index.js';
import { useTheme } from '../../hooks/useTheme.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAuth } from '../../hooks/useAuth.js';

function MenuIcon({ type }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (type === 'user') return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.7-3.6 3-5.5 6.5-5.5s5.8 1.9 6.5 5.5" /></svg>;
  if (type === 'register') return <svg {...common}><circle cx="9" cy="8" r="3.5" /><path d="M3.5 20c.7-3.6 2.7-5.5 5.5-5.5 1.7 0 3.1.5 4.1 1.4M18 8v6M15 11h6" /></svg>;
  if (type === 'cart') return <svg {...common}><path d="M3 4h2l2.1 10.2h10.8L20 7H6" /><circle cx="9" cy="19" r="1" /><circle cx="17" cy="19" r="1" /></svg>;
  if (type === 'support') return <svg {...common}><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M9.5 10h5M9.5 13h3" /></svg>;
  if (type === 'settings') return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.5 1a7 7 0 0 0-1.7-1L14.4 3h-4.8l-.4 3.1a7 7 0 0 0-1.7 1L5 6.1 3 9.5 5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.5-1a7 7 0 0 0 1.7 1l.4 3h4.8l.4-3a7 7 0 0 0 1.7-1l2.5 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z" /></svg>;
  if (type === 'home') return <svg {...common}><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" /></svg>;
  if (type === 'shop') return <svg {...common}><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></svg>;
  if (type === 'about') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
  if (type === 'contact') return <svg {...common}><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>;
  if (type === 'faq') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 0 1 4.4 1c0 1.7-2.2 2-2.2 3.5M12 17h.01" /></svg>;
  return null;
}

export function Navbar({ onReading }) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, copy } = usePreferences();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState('');
  const searchTrigger = useRef(null);
  const menuTrigger = useRef(null);
  const searchField = useRef(null);
  const links = [['/', 'home', 'home'], ['/catalogo', 'shop', 'shop'], ['/nosotros', 'about', 'about'], ['/contacto', 'contact', 'contact']];
  const toggle = name => setPanel(current => current === name ? null : name);
  const closeMenu = () => setPanel(null);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <div className="header-inner">
        <BrandLogo as={Link} to="/" />
        <nav className="nav-links" aria-label={copy.navigation}>
          {links.map(([path, key]) => <NavLink as={Link} key={path} to={path} current={location.pathname === path}>{copy[key]}</NavLink>)}
        </nav>

        <div className="header-actions">
          <IconButton ref={searchTrigger} className="nav-search" label={copy.search} aria-expanded={panel === 'search'}
            aria-controls="search-panel" onClick={() => toggle('search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </IconButton>
          <Link className="v-button v-button--primary v-button--pill header-quote" to="/solicitud">{copy.quote}<span aria-hidden="true">↗</span></Link>
          <LanguageToggle language={language} onChange={setLanguage} />
          <ThemeToggle theme={theme} onToggle={setTheme} label={theme === 'dark' ? copy.light : copy.dark} />

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

          <Panel id="search-panel" className="search-panel" open={panel === 'search'} title={copy.searchTitle}
            closeLabel={copy.close} onClose={closeMenu} triggerRef={searchTrigger} initialFocusRef={searchField}>
            <form onSubmit={event => { event.preventDefault(); closeMenu(); navigate('/catalogo' + (query.trim() ? '?buscar=' + encodeURIComponent(query.trim()) : '')); }}>
              <Input ref={searchField} type="search" label={copy.searchLabel} value={query} onChange={event => setQuery(event.target.value)} />
              <p>{copy.searchHint}</p><Button type="submit" variant="ghost" fullWidth>{copy.searchSubmit}</Button>
            </form>
          </Panel>

          <Panel id="account-menu-panel" className="account-panel-dropdown" open={panel === 'menu'} title={copy.space}
            closeLabel={copy.close} onClose={closeMenu} triggerRef={menuTrigger}>
            <div className="account-identity">
              <span className="account-identity-icon"><MenuIcon type="user" /></span>
              <span><strong>{user?.name || copy.guest}</strong>{user && <small>{copy.accountHint}</small>}</span>
            </div>

            <nav className="mobile-menu-nav" aria-label={copy.navigation}>
              <span className="menu-group-label">{copy.navigation}</span>
              {links.map(([path, key, icon]) => (
                <Link key={path} to={path} onClick={closeMenu} aria-current={location.pathname === path ? 'page' : undefined}>
                  <span className="account-row-icon"><MenuIcon type={icon} /></span>
                  <span>{copy[key]}</span>
                </Link>
              ))}
              <Link to="/faq" onClick={closeMenu}>
                <span className="account-row-icon"><MenuIcon type="faq" /></span>
                <span>{copy.faq}</span>
              </Link>
            </nav>

            <div className="account-dropdown-results">
              <Link className="account-dropdown-link account-dropdown-primary" to={user ? '/cuenta' : '/login'} onClick={closeMenu}>
                <span className="account-row-icon"><MenuIcon type="user" /></span>
                <span>{user ? copy.account : copy.login}</span>
              </Link>

              {!user && <Link className="account-dropdown-link" to="/registro" onClick={closeMenu}>
                <span className="account-row-icon"><MenuIcon type="register" /></span>
                <span>{copy.register}</span>
              </Link>}

              <div className="account-dropdown-divider" />

              <Link className="account-dropdown-link" to="/carrito" onClick={closeMenu}>
                <span className="account-row-icon"><MenuIcon type="cart" /></span>
                <span>{copy.cart}</span>
              </Link>
              <Link className="account-dropdown-link" to="/faq" onClick={closeMenu}>
                <span className="account-row-icon"><MenuIcon type="support" /></span>
                <span>{copy.support}</span>
              </Link>
              <button type="button" className="account-dropdown-link" onClick={() => { closeMenu(); onReading(); }}>
                <span className="account-row-icon"><MenuIcon type="settings" /></span>
                <span>{copy.settings}</span>
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </header>
  );
}
