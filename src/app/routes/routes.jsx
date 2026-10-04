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
import { AdminActivityPage } from '../../features/admin/AdminActivity.jsx';
import { AdminOrderDetailPage, AdminOrdersPage } from '../../features/admin/AdminOrders.jsx';
import { AdminCatalogDetailPage, AdminCatalogPage } from '../../features/admin/AdminCatalog.jsx';
import { AdminCategoriesPage, AdminProductFormPage } from '../../features/admin/AdminCatalogManagement.jsx';
import { AdminCustomerDetailPage, AdminCustomersPage } from '../../features/admin/AdminCustomers.jsx';
import { AdminAssistantPage } from '../../features/admin/AdminAssistantPage.jsx';
import { NotFoundPage } from '../../pages/NotFoundPage.jsx';
import { RouteErrorPage } from '../../pages/RouteErrorPage.jsx';
import { CartPage, CatalogPage, ProductPage } from '../../pages/Shop.jsx';
import { QuoteRequestPage } from '../../pages/QuoteRequestPage.jsx';
import { CustomerQuotesPage } from '../../pages/CustomerQuotesPage.jsx';
import { adminPages, publicPages } from './manifest.js';

const pages = manifest => manifest.map(([path, titleKey]) => ({
  path,
  element: path === '/cuenta' ? <CustomerQuotesPage /> : path.startsWith('/solicitud') ? <QuoteRequestPage /> : path === '/carrito' ? <CartPage /> : path === '/catalogo' ? <CatalogPage /> : path === '/producto/:id' ? <ProductPage /> : <ConstructionPage titleKey={titleKey} />,
}));

const protectedPublicPaths = new Set(['/cuenta', '/pedidos/:id']);
const protectedPublicPages = publicPages.filter(([path]) => protectedPublicPaths.has(path));
const openPublicPages = publicPages.filter(([path]) => path !== '/' && !protectedPublicPaths.has(path));
const adminRoutePages = adminPages.map(([path, titleKey]) => ({
      path,
      element: path === '/admin' ? <AdminDashboardPage />
        : path === '/admin/pedidos' ? <AdminOrdersPage />
        : path === '/admin/pedidos/:id' ? <AdminOrderDetailPage />
        : path === '/admin/catalogo' ? <AdminCatalogPage />
          : path === '/admin/catalogo/nuevo' ? <AdminProductFormPage />
          : path === '/admin/catalogo/:id/editar' ? <AdminProductFormPage />
          : path === '/admin/catalogo/categorias' ? <AdminCategoriesPage />
          : path === '/admin/catalogo/:id' ? <AdminCatalogDetailPage />
        : path === '/admin/actividad' ? <AdminActivityPage />
        : path === '/admin/clientes' ? <AdminCustomersPage />
        : path === '/admin/clientes/:id' ? <AdminCustomerDetailPage />
        : path === '/admin/asistente' ? <AdminAssistantPage />
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
