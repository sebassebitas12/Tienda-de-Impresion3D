import { useEffect, useMemo, useState } from 'react';
import { readPreference, writePreference } from '../../utils/preferences.js';
import { PreferencesContext } from './contexts.js';
import { messages } from './messages.js';

export function PreferencesProvider({ children }) {
  const [language, setLanguage] = useState(() => readPreference('vertice-language', 'es') === 'en' ? 'en' : 'es');
  const [textScale, setTextScale] = useState(() => {
    const stored = Number(readPreference('vertice-text-scale', '1'));
    return [1, 1.5, 2].includes(stored) ? stored : 1;
  });
  const [contrast, setContrast] = useState(() => readPreference('vertice-high-contrast', 'false') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => readPreference('vertice-no-motion', 'false') === 'true');
  useEffect(() => {
    const root = document.documentElement;
    const updateResponsiveTypeScale = () => {
      // En pantallas anchas crece toda la tipografía; la preferencia elegida
      // por la persona sigue siendo el multiplicador sobre el tamaño normal.
      const desktopScale = Math.min(1.12, 1 + Math.max(0, window.innerWidth - 1440) / 4800);
      root.style.setProperty('--a11y-font-scale', String(textScale * desktopScale));
    };
    root.lang = language;
    root.dataset.motion = reducedMotion ? 'reduced' : 'full';
    root.dataset.contrast = contrast ? 'high' : 'normal';
    root.dataset.textScale = String(textScale);
    updateResponsiveTypeScale();
    window.addEventListener('resize', updateResponsiveTypeScale);
    writePreference('vertice-language', language);
    writePreference('vertice-text-scale', textScale);
    writePreference('vertice-high-contrast', contrast);
    writePreference('vertice-no-motion', reducedMotion);
    return () => window.removeEventListener('resize', updateResponsiveTypeScale);
  }, [language, textScale, contrast, reducedMotion]);

  const value = useMemo(() => ({
    language, copy: messages[language],
    setLanguage: next => setLanguage(next === 'en' ? 'en' : 'es'),
    textScale, setTextScale: next => setTextScale([1, 1.5, 2].includes(next) ? next : 1),
    contrast, setContrast, reducedMotion, setReducedMotion,
    resetReading: () => { setTextScale(1); setContrast(false); setReducedMotion(false); },
  }), [language, textScale, contrast, reducedMotion]);
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}
