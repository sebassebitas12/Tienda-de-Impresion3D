import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isRestoring) {
    return <div className="auth-route-status" role="status">Restaurando sesión…</div>;
  }

  if (!auth.isAuthenticated) {
    const isExpired = auth.error?.code === 'AUTH_SESSION_EXPIRED';
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, reason: isExpired ? 'session-expired' : undefined }} />;
  }

  return children || <Outlet />;
}

export function RequireRole({ role, children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isRestoring) {
    return <div className="auth-route-status" role="status">Restaurando sesión…</div>;
  }

  if (!auth.isAuthenticated) {
    const isExpired = auth.error?.code === 'AUTH_SESSION_EXPIRED';
    const reason = isExpired ? 'session-expired' : role === 'customer' && location.pathname === '/carrito' ? 'customer-cart-required' : undefined;
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, reason }} />;
  }

  if (auth.user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}
