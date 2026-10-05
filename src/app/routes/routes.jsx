import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout.jsx';
import { AdminLayout } from '../layout/AdminLayout.jsx';
import { AuthLayout } from '../layout/AuthLayout.jsx';
import { RequireAuth, RequireRole } from './AuthGuards.jsx';
import { PageLoading } from './PageLoading.jsx';
import { ConstructionPage } from '../../pages/ConstructionPage.jsx';
import { Home } from '../../pages/Home.jsx';
import { LoginPage } from '../../pages/LoginPage.jsx';
import { RegisterPage } from '../../pages/RegisterPage.jsx';
import { NotFoundPage } from '../../pages/NotFoundPage.jsx';
import { RouteErrorPage } from '../../pages/RouteErrorPage.jsx';
import { adminPages, publicPages } from './manifest.js';

const lazyNamed = (load, name) => lazy(() => load().then(module => ({ default: module[name] })));

const AboutPage = lazyNamed(() => import('../../pages/AboutPage.jsx'), 'AboutPage');
const ContactPage = lazyNamed(() => import('../../pages/ContactPage.jsx'), 'ContactPage');
const CustomerInformationPage = lazyNamed(() => import('../../pages/CustomerInformationPage.jsx'), 'CustomerInformationPage');
const CustomerOrderDetailPage = lazyNamed(() => import('../../pages/CustomerOrderDetailPage.jsx'), 'CustomerOrderDetailPage');
const CartPage = lazyNamed(() => import('../../pages/Shop.jsx'), 'CartPage');
const CatalogPage = lazyNamed(() => import('../../pages/Shop.jsx'), 'CatalogPage');
const ProductPage = lazyNamed(() => import('../../pages/Shop.jsx'), 'ProductPage');
const QuoteRequestPage = lazyNamed(() => import('../../pages/QuoteRequestPage.jsx'), 'QuoteRequestPage');
const CustomerQuotesPage = lazyNamed(() => import('../../pages/CustomerQuotesPage.jsx'), 'CustomerQuotesPage');
const AdminDashboardPage = lazyNamed(() => import('../../pages/AdminDashboardPage.jsx'), 'AdminDashboardPage');
const AdminRequestsPage = lazyNamed(() => import('../../features/admin/AdminRequests.jsx'), 'AdminRequestsPage');
const AdminRequestDetailPage = lazyNamed(() => import('../../features/admin/AdminRequests.jsx'), 'AdminRequestDetailPage');
const AdminActivityPage = lazyNamed(() => import('../../features/admin/AdminActivity.jsx'), 'AdminActivityPage');
const AdminOrdersPage = lazyNamed(() => import('../../features/admin/AdminOrders.jsx'), 'AdminOrdersPage');
const AdminOrderDetailPage = lazyNamed(() => import('../../features/admin/AdminOrders.jsx'), 'AdminOrderDetailPage');
const AdminCatalogPage = lazyNamed(() => import('../../features/admin/AdminCatalog.jsx'), 'AdminCatalogPage');
const AdminCatalogDetailPage = lazyNamed(() => import('../../features/admin/AdminCatalog.jsx'), 'AdminCatalogDetailPage');
const AdminProductFormPage = lazyNamed(() => import('../../features/admin/AdminCatalogManagement.jsx'), 'AdminProductFormPage');
const AdminCategoriesPage = lazyNamed(() => import('../../features/admin/AdminCatalogManagement.jsx'), 'AdminCategoriesPage');
const AdminCustomersPage = lazyNamed(() => import('../../features/admin/AdminCustomers.jsx'), 'AdminCustomersPage');
const AdminCustomerDetailPage = lazyNamed(() => import('../../features/admin/AdminCustomers.jsx'), 'AdminCustomerDetailPage');
const AdminAssistantPage = lazyNamed(() => import('../../features/admin/AdminAssistantPage.jsx'), 'AdminAssistantPage');

const suspend = element => <Suspense fallback={<PageLoading />}>{element}</Suspense>;

const infoKeys = new Set(['faq', 'materials', 'requirements', 'terms', 'privacy', 'shipping']);

const pages = manifest => manifest.map(([path, titleKey]) => {
  let element;
  if (path === '/cuenta') element = <CustomerQuotesPage />;
  else if (path.startsWith('/solicitud')) element = <QuoteRequestPage />;
  else if (path === '/carrito') element = <CartPage />;
  else if (path === '/catalogo') element = <CatalogPage />;
  else if (path === '/producto/:id') element = <ProductPage />;
  else if (path === '/pedidos/:id') element = <CustomerOrderDetailPage />;
  else if (path === '/nosotros') element = <AboutPage />;
  else if (path === '/contacto') element = <ContactPage />;
  else if (path === '/checkout/productos') element = <Navigate to="/carrito" replace />;
  else if (path === '/checkout/solicitud') element = <Navigate to="/cuenta?tab=quotes" replace />;
  else if (infoKeys.has(titleKey)) element = <CustomerInformationPage pageKey={titleKey} />;
  else element = <ConstructionPage titleKey={titleKey} />;
  return { path, element: suspend(element) };
});

const protectedPublicPaths = new Set(['/cuenta']);
const protectedPublicPages = publicPages.filter(([path]) => protectedPublicPaths.has(path));
const customerOnlyPaths = new Set(['/carrito', '/pedidos/:id']);
const customerOnlyPages = publicPages.filter(([path]) => customerOnlyPaths.has(path));
const openPublicPages = publicPages.filter(([path]) => path !== '/' && !protectedPublicPaths.has(path) && !customerOnlyPaths.has(path));

const adminRoutePages = adminPages.map(([path, titleKey]) => {
  let element;
  if (path === '/admin') element = <AdminDashboardPage />;
  else if (path === '/admin/pedidos') element = <AdminOrdersPage />;
  else if (path === '/admin/pedidos/:id') element = <AdminOrderDetailPage />;
  else if (path === '/admin/catalogo') element = <AdminCatalogPage />;
  else if (path === '/admin/catalogo/nuevo' || path === '/admin/catalogo/:id/editar') element = <AdminProductFormPage />;
  else if (path === '/admin/catalogo/categorias') element = <AdminCategoriesPage />;
  else if (path === '/admin/catalogo/:id') element = <AdminCatalogDetailPage />;
  else if (path === '/admin/actividad') element = <AdminActivityPage />;
  else if (path === '/admin/clientes') element = <AdminCustomersPage />;
  else if (path === '/admin/clientes/:id') element = <AdminCustomerDetailPage />;
  else if (path === '/admin/asistente') element = <AdminAssistantPage />;
  else if (path === '/admin/solicitudes') element = <AdminRequestsPage />;
  else if (path === '/admin/solicitudes/:id') element = <AdminRequestDetailPage />;
  else element = <ConstructionPage titleKey={titleKey} />;
  return { path, element: suspend(element) };
});

export const routes = [
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      ...pages(openPublicPages),
      { element: <RequireAuth />, children: pages(protectedPublicPages) },
      { element: <RequireRole role="customer" />, children: pages(customerOnlyPages) },
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
