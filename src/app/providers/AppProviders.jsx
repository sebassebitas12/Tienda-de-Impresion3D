import { AuthProvider } from './AuthProvider.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';
import { PreferencesProvider } from './PreferencesProvider.jsx';

export function AppProviders({ children, authAdapter }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <AuthProvider adapter={authAdapter}>{children}</AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
