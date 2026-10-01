import { PublicLayout } from '../layout/PublicLayout.jsx';
import { AdminLayout } from '../layout/AdminLayout.jsx';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { RequireAuth, RequireRole } from './AuthGuards.jsx';
import { ConstructionPage } from '../../pages/ConstructionPage.jsx';
import { Home } from '../../pages/Home.jsx';
import { LoginPage } from '../../pages/LoginPage.jsx';
import { RegisterPage } from '../../pages/RegisterPage.jsx';
import { AdminDashboardPage } from '../../pages/AdminDashboardPage.jsx';
import { AdminRequestDetailPage, AdminRequestsPage } from '../../features/admin/AdminRequests.jsx';
import { NotFoundPage } from '../../pages/NotFoundPage.jsx';
import { RouteErrorPage } from '../../pages/RouteErrorPage.jsx';
import { adminPages, publicPages } from './manifest.js';

const pages = manifest => manifest.map(([path, titleKey]) => ({
  path,
  element: <ConstructionPage titleKey={titleKey} />,
}));

const protectedPublicPaths = new Set(['/cuenta', '/pedidos/:id']);
const protectedPublicPages = publicPages.filter(([path]) => protectedPublicPaths.has(path));
const openPublicPages = publicPages.filter(([path]) => path !== '/' && !protectedPublicPaths.has(path));
const adminRoutePages = adminPages.map(([path, titleKey]) => ({
  path,
  element: path === '/admin' ? <AdminDashboardPage />
    : path === '/admin/solicitudes' ? <AdminRequestsPage />
      : path === '/admin/solicitudes/:id' ? <AdminRequestDetailPage />
        : <ConstructionPage titleKey={titleKey} />,
}));

export const routes = [
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      ...pages(openPublicPages),
      {
        element: <RequireAuth />,
        children: pages(protectedPublicPages),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireRole role="admin"><AdminLayout /></RequireRole>,
    errorElement: <RouteErrorPage />,
    children: adminRoutePages,
  },
];
