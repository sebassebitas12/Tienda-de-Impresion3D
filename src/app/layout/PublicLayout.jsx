import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { FloatingTools } from './FloatingTools.jsx';
import { RouteFocus } from './RouteFocus.jsx';

export function PublicLayout() {
  const [activeTool, setActiveTool] = useState(null);
  const location = useLocation();
  return (
    <div className="app-shell">
      <RouteFocus />
      <Navbar key={location.pathname + location.search} onReading={() => setActiveTool('reading')} />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <Footer />
      <FloatingTools active={activeTool} onActiveChange={setActiveTool} />
    </div>
  );
}
