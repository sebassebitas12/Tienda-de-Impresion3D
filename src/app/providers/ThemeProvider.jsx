import { useEffect, useMemo, useState } from 'react';
import { readPreference, writePreference } from '../../utils/preferences.js';
import { ThemeContext } from './contexts.js';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readPreference('vertice-theme', 'dark') === 'light' ? 'light' : 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writePreference('vertice-theme', theme);
  }, [theme]);
  const value = useMemo(() => ({
    theme,
    setTheme: next => setTheme(next === 'light' ? 'light' : 'dark'),
    toggleTheme: () => setTheme(current => current === 'dark' ? 'light' : 'dark'),
  }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
