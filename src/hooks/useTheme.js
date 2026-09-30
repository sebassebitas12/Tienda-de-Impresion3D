import { useContext } from 'react';
import { ThemeContext } from '../app/providers/contexts.js';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requiere ThemeProvider');
  return context;
}
