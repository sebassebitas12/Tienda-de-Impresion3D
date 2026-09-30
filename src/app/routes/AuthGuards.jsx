import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isRestoring) {
    return <div className="auth-route-status" role="status">Restaurando sesión…</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
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
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (auth.user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}
