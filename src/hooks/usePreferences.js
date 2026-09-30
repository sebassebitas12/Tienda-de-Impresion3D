import { useContext } from 'react';
import { PreferencesContext } from '../app/providers/contexts.js';

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences requiere PreferencesProvider');
  return context;
}
