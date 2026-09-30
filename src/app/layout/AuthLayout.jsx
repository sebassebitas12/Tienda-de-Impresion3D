import { Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/index.js';
import { RouteFocus } from './RouteFocus.jsx';

export function AuthLayout() {
  return <div className="auth-shell"><RouteFocus /><BrandLogo as={Link} to="/" /><main id="main-content" tabIndex={-1}><Outlet /></main></div>;
}
