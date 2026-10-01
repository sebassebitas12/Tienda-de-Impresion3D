import { useCallback, useEffect, useMemo, useState } from 'react';
import { createAuthService } from '../../services/authService.js';
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

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.user),
    hasPersistedSession,
    isRestoring,
    isPending: Boolean(pendingAction),
    pendingAction,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
    hasRole: role => session?.user?.role === role,
  }), [error, hasPersistedSession, isRestoring, login, logout, pendingAction, register, session]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
