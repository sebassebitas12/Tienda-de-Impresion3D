import { PublicLayout } from '../layout/PublicLayout.jsx';
import { AdminLayout } from '../layout/AdminLayout.jsx';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { ConstructionPage } from '../../pages/ConstructionPage.jsx';
import { NotFoundPage } from '../../pages/NotFoundPage.jsx';
import { RouteErrorPage } from '../../pages/RouteErrorPage.jsx';
import { adminPages, authPages, publicPages } from './manifest.js';

import { Home } from '../../pages/Home.jsx';

const pages = manifest => manifest.map(([path, titleKey]) => ({
  path, element: <ConstructionPage titleKey={titleKey} />,
}));

export const routes = [
  { element: <PublicLayout />, errorElement: <RouteErrorPage />, children: [{ path: '/', element: <Home /> }, ...pages(publicPages.filter(p => p[0] !== '/')), { path: '*', element: <NotFoundPage /> }] },
  { element: <AuthLayout />, errorElement: <RouteErrorPage />, children: pages(authPages) },
  { element: <AdminLayout />, errorElement: <RouteErrorPage />, children: pages(adminPages) },
];
