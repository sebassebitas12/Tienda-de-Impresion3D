import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthServiceError, createAuthService } from '../../services/authService.js';
import { getTokenExpiresAt, isTokenExpired } from '../../services/jsonServerAuthAdapter.js';
import { AuthContext } from './contexts.js';

export function AuthProvider({ children, adapter }) {
  const service = useMemo(() => createAuthService(adapter), [adapter]);
  const [session, setSession] = useState(null);
  const [hasPersistedSession, setHasPersistedSession] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    service.restoreSession()
      .then(restored => {
        if (!cancelled) {
          setSession(restored);
          setHasPersistedSession(Boolean(restored));
        }
      })
      .catch(restorationError => {
        if (!cancelled) {
          setError(restorationError);
          setHasPersistedSession(service.hasPersistedSession());
        }
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service]);

  const expireSession = useCallback(reason => {
    if (session) {
      service.logout(session).catch(() => {});
    }
    setSession(null);
    setHasPersistedSession(false);
    setError(new AuthServiceError(
      'AUTH_SESSION_EXPIRED',
      reason || 'Tu sesión expiró. Por favor ingresá nuevamente tus credenciales para continuar.'
    ));
  }, [service, session]);

  useEffect(() => {
    if (!session?.token) return;
    const expiresAt = getTokenExpiresAt(session.token);
    if (!expiresAt) return;

    const msUntilExpiry = expiresAt - Date.now();
    const timer = setTimeout(() => {
      expireSession('Tu sesión expiró. Por favor ingresá nuevamente tus credenciales para continuar.');
    }, Math.max(0, msUntilExpiry));

    return () => clearTimeout(timer);
  }, [session?.token, expireSession]);

  const run = useCallback(async (action, task) => {
    setPendingAction(action);
    setError(null);

    try {
      const nextSession = await task();
      setSession(nextSession);
      setHasPersistedSession(Boolean(nextSession));
      return nextSession.user;
    } catch (nextError) {
      setError(nextError);
      throw nextError;
    } finally {
      setPendingAction(null);
    }
  }, []);

  const login = useCallback(
    credentials => run('login', () => service.login(credentials)),
    [run, service]
  );

  const register = useCallback(
    payload => run('register', () => service.register(payload)),
    [run, service]
  );

  const logout = useCallback(async () => {
    setPendingAction('logout');
    setError(null);

    try {
      await service.logout(session);
      setSession(null);
      setHasPersistedSession(false);
    } catch (nextError) {
      setError(nextError);
      throw nextError;
    } finally {
      setPendingAction(null);
    }
  }, [service, session]);

  const authenticated = Boolean(session?.user && (!session?.token || !session.token.startsWith('sim.v1.') || !isTokenExpired(session.token)));

  const value = useMemo(() => ({
    user: authenticated ? (session?.user || null) : null,
    token: authenticated ? (session?.token || null) : null,
    isAuthenticated: authenticated,
    hasPersistedSession,
    isRestoring,
    isPending: Boolean(pendingAction),
    pendingAction,
    error,
    login,
    register,
    logout,
    expireSession,
    clearError: () => setError(null),
    hasRole: role => Boolean(authenticated && session?.user?.role === role),
  }), [authenticated, error, expireSession, hasPersistedSession, isRestoring, login, logout, pendingAction, register, session]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
