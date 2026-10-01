import { AuthProvider } from './AuthProvider.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';
import { PreferencesProvider } from './PreferencesProvider.jsx';
import { CartProvider } from './CartProvider.jsx';

export function AppProviders({ children, authAdapter }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <AuthProvider adapter={authAdapter}><CartProvider>{children}</CartProvider></AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
