import { AuthProvider } from './AuthProvider.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';
import { PreferencesProvider } from './PreferencesProvider.jsx';

export function AppProviders({ children }) {
  return <ThemeProvider><PreferencesProvider><AuthProvider>{children}</AuthProvider></PreferencesProvider></ThemeProvider>;
}
