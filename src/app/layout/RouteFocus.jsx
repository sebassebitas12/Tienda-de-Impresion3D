import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteFocus() {
  const location = useLocation();
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    const frame = requestAnimationFrame(() => {
      const destination = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (destination) destination.scrollIntoView();
      else { document.getElementById('main-content')?.focus(); window.scrollTo(0, 0); }
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return null;
}
