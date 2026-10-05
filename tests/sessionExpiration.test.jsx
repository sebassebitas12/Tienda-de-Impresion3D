import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { RequireAuth } from '../src/app/routes/AuthGuards.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import {
  createSimulatedToken,
  getTokenExpiresAt,
  isTokenExpired,
} from '../src/services/jsonServerAuthAdapter.js';

const testUser = {
  id: 'u-exp',
  name: 'Test Expiry',
  email: 'exp@example.com',
  role: 'customer',
  status: 'ACTIVE',
};

describe('Expiración activa de sesión y recuperación', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.useRealTimers();
  });

  afterEach(cleanup);

  it('isTokenExpired identifica correctamente tokens vigentes y vencidos', () => {
    const now = 1000000;
    const validToken = createSimulatedToken(testUser, { now, ttlMs: 60000 });
    expect(isTokenExpired(validToken, now)).toBe(false);
    expect(isTokenExpired(validToken, now + 59000)).toBe(false);
    expect(isTokenExpired(validToken, now + 61000)).toBe(true);

    expect(isTokenExpired('invalid-token', now)).toBe(true);
    expect(isTokenExpired(null, now)).toBe(true);
    expect(getTokenExpiresAt(validToken)).toBe(now + 60000);
  });

  it('AuthProvider desautentica activamente cuando el token expira durante el uso', async () => {
    const now = Date.now();
    // 2-second TTL ensures initial state is live and then expiration fires
    const token = createSimulatedToken(testUser, { now, ttlMs: 2000 });
    const mockAdapter = {
      restoreSession: jest.fn().mockResolvedValue({ user: testUser, token }),
      hasPersistedSession: () => true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn().mockResolvedValue(),
    };

    function StatusWidget() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="auth-status">{auth.isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</span>
          {auth.error && <span data-testid="auth-error">{auth.error.code}</span>}
        </div>
      );
    }

    render(
      <AuthProvider adapter={mockAdapter}>
        <StatusWidget />
      </AuthProvider>
    );

    // Initially authenticated
    expect(await screen.findByText('LOGGED_IN')).toBeInTheDocument();

    // Wait for the active expiration timer to fire
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
      expect(screen.getByTestId('auth-error')).toHaveTextContent('AUTH_SESSION_EXPIRED');
    }, { timeout: 3500 });
  });

  it('RequireAuth redirige a /login con reason session-expired y destino preservado', async () => {
    const now = Date.now();
    const token = createSimulatedToken(testUser, { now, ttlMs: 2000 });
    const mockAdapter = {
      restoreSession: jest.fn().mockResolvedValue({ user: testUser, token }),
      hasPersistedSession: () => true,
      login: jest.fn().mockResolvedValue({ user: testUser, token: createSimulatedToken(testUser, { now: Date.now(), ttlMs: 60000 }) }),
      register: jest.fn(),
      logout: jest.fn().mockResolvedValue(),
    };

    function ProtectedApp() {
      return (
        <PreferencesProvider>
          <AuthProvider adapter={mockAdapter}>
            <MemoryRouter initialEntries={['/cuenta']}>
              <Routes>
                <Route path="/cuenta" element={<RequireAuth><div>Contenido protegido de cuenta</div></RequireAuth>} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </PreferencesProvider>
      );
    }

    render(<ProtectedApp />);

    // Starts in protected account
    expect(await screen.findByText('Contenido protegido de cuenta')).toBeInTheDocument();

    // Token expires -> redirected to login with session expired notice
    await waitFor(() => {
      expect(screen.getByText(/Tu sesión expiró/)).toBeInTheDocument();
    }, { timeout: 3500 });
  });
});
