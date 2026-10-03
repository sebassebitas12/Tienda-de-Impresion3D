import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { formatOrderReference } from '../../utils/adminOrders.js';
import { filterAdminCustomers } from '../../utils/adminCustomers.js';
import { useAdminCustomers } from './useAdminCustomers.js';
import './admin.css';

const copy = {
  es: {
    title: 'Clientes', intro: 'Consultá cuentas y el historial asociado, sin editar datos personales desde aquí.',
    source: 'Cuentas de cliente · JSON Server', loading: 'Cargando clientes', error: 'No pudimos cargar los clientes',
    errorHint: 'Revisá que JSON Server esté activo y volvé a intentar.', retry: 'Reintentar', search: 'Buscar cliente',
    searchHint: 'Nombre, correo o referencia', count: value => `${value} clientes`, noMatch: 'No encontramos clientes con esa búsqueda.',
    empty: 'Todavía no hay cuentas de cliente.', detail: 'Ficha de cliente', back: 'Volver a clientes',
    email: 'Correo electrónico', status: 'Cuenta', registered: 'Registro', orders: 'Pedidos', requests: 'Solicitudes',
    noOrders: 'Este cliente no tiene pedidos asociados.', noRequests: 'Este cliente no tiene solicitudes asociadas.',
    received: 'Recibido', stage: 'Etapa', viewOrder: 'Abrir pedido', viewRequest: 'Abrir solicitud',
    notFound: 'No encontramos esta cuenta.', active: 'Activa', inactive: 'Inactiva',
    stages: { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado', REJECTED: 'Rechazado', PENDING_QUOTE: 'Pendiente de cotización', IN_REVIEW: 'En revisión', QUOTED: 'Cotizada', AWAITING_APPROVAL: 'Esperando aprobación', APPROVED: 'Aprobada', PAID: 'Pagada', EXPIRED: 'Vencida' },
  },
  en: {
    title: 'Customers', intro: 'Review customer accounts and their linked history. Personal data cannot be edited here.',
    source: 'Customer accounts · JSON Server', loading: 'Loading customers', error: 'Could not load customers',
    errorHint: 'Check that JSON Server is running and try again.', retry: 'Retry', search: 'Search customers',
    searchHint: 'Name, email or reference', count: value => `${value} customers`, noMatch: 'No customers match this search.',
    empty: 'There are no customer accounts yet.', detail: 'Customer profile', back: 'Back to customers',
    email: 'Email address', status: 'Account', registered: 'Registered', orders: 'Orders', requests: 'Requests',
    noOrders: 'This customer has no linked orders.', noRequests: 'This customer has no linked requests.',
    received: 'Received', stage: 'Stage', viewOrder: 'Open order', viewRequest: 'Open request',
    notFound: 'We could not find this account.', active: 'Active', inactive: 'Inactive',
    stages: { PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled', REJECTED: 'Rejected', PENDING_QUOTE: 'Pending quote', IN_REVIEW: 'In review', QUOTED: 'Quoted', AWAITING_APPROVAL: 'Awaiting approval', APPROVED: 'Approved', PAID: 'Paid', EXPIRED: 'Expired' },
  },
};

function dateLabel(value, language) {
  const date = new Date(value || '');
  if (!Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium' }).format(date);
}

function customerInitials(name, fallback) {
  const parts = String(name || fallback || '?').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase();
}

function CustomerOrders({ orders, text, language }) {
  return <section className="admin-customer-history" aria-labelledby="admin-customer-orders-title">
    <header><span className="admin-eyebrow">01 / {text.orders}</span><h2 id="admin-customer-orders-title">{text.orders} <small>{orders.length}</small></h2></header>
    {orders.length ? <ol>{orders.map(order => <li key={order.id}>
      <Link to={`/admin/pedidos/${encodeURIComponent(order.id)}`}><strong>{formatOrderReference(order.id)}</strong><span className="admin-state" data-status={order.status}>{text.stages[order.status] || order.status}</span><time dateTime={order.createdAt}>{dateLabel(order.createdAt, language)}</time><span aria-hidden="true">↗</span></Link>
    </li>)}</ol> : <p>{text.noOrders}</p>}
  </section>;
}

function CustomerRequests({ requests, text, language }) {
  return <section className="admin-customer-history" aria-labelledby="admin-customer-requests-title">
    <header><span className="admin-eyebrow">02 / {text.requests}</span><h2 id="admin-customer-requests-title">{text.requests} <small>{requests.length}</small></h2></header>
    {requests.length ? <ol>{requests.map(request => <li key={request.id}>
      <Link to={`/admin/solicitudes/${encodeURIComponent(request.id)}`}><strong>{request.fileName || request.description || request.id}</strong><span className="admin-state" data-status={request.status}>{text.stages[request.status] || request.status}</span><time dateTime={request.submittedAt}>{dateLabel(request.submittedAt, language)}</time><span aria-hidden="true">↗</span></Link>
    </li>)}</ol> : <p>{text.noRequests}</p>}
  </section>;
}

export function AdminCustomersPage() {
  const { language } = usePreferences();
  const text = copy[language];
  const { status, customers, retry } = useAdminCustomers();
  const [query, setQuery] = useState('');
  const filtered = filterAdminCustomers(customers, query);

  return <section className="admin-customers" aria-labelledby="admin-customers-title" aria-busy={status === 'loading'}>
    <header className="admin-page-heading"><div><span className="admin-eyebrow">{text.source}</span><h1 id="admin-customers-title">{text.title}</h1><p>{text.intro}</p></div></header>
    {status === 'loading' && <div role="status" aria-label={text.loading}><Skeleton height="68px" /><Skeleton height="68px" /></div>}
    {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
    {status === 'success' && <>
      <div className="admin-customers__toolbar">
        <label className="admin-customers__search"><span>{text.search}</span><input type="search" value={query} placeholder={text.searchHint} onChange={event => setQuery(event.target.value)} /></label>
        <p className="admin-customers__total" role="status" aria-live="polite"><strong>{String(filtered.length).padStart(2, '0')}</strong><span>{text.count(filtered.length)}</span></p>
      </div>
      <div className="admin-customers__register-label"><span className="admin-eyebrow">{language === 'es' ? 'REGISTRO DE CUENTAS' : 'ACCOUNT REGISTER'}</span><span className="admin-eyebrow">{language === 'es' ? 'PEDIDOS / SOLICITUDES' : 'ORDERS / REQUESTS'}</span></div>
      {filtered.length ? <ul className="admin-customers__list">{filtered.map((customer, index) => <li key={customer.id} style={{ '--row-index': index }}>
        <Link to={`/admin/clientes/${encodeURIComponent(customer.id)}`}>
          <span className="admin-customers__ordinal">{String(index + 1).padStart(2, '0')}</span>
          <span className="admin-customers__monogram" aria-hidden="true">{customerInitials(customer.name, customer.id)}</span>
          <span className="admin-customers__identity"><strong>{customer.name || customer.id}</strong><small>{customer.email || '—'}</small></span>
          <span className="admin-state" data-status={customer.status}>{text[customer.status.toLowerCase()] || customer.status}</span>
          <span className="admin-customers__counts"><span><small>{text.orders}</small><strong>{String(customer.orders.length).padStart(2, '0')}</strong></span><span><small>{text.requests}</small><strong>{String(customer.requests.length).padStart(2, '0')}</strong></span></span>
          <span className="admin-customers__arrow" aria-hidden="true">↗</span>
        </Link>
      </li>)}</ul> : <EmptyState title={query ? text.noMatch : text.empty} />}
    </>}
  </section>;
}

export function AdminCustomerDetailPage() {
  const { language } = usePreferences();
  const text = copy[language];
  const { status, customers, retry } = useAdminCustomers();
  const { id } = useParams();
  const customer = customers.find(item => item.id === id);

  return <section className="admin-customer-detail" aria-busy={status === 'loading'}>
    <Link className="admin-request-back" to="/admin/clientes">← {text.back}</Link>
    {status === 'loading' && <div role="status" aria-label={text.loading}><Skeleton height="220px" /></div>}
    {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
    {status === 'success' && !customer && <EmptyState title={text.notFound} />}
    {status === 'success' && customer && <>
      <header className="admin-customer-detail__heading"><div><span className="admin-eyebrow">{text.detail} / {customer.id}</span><h1>{customer.name || customer.id}</h1></div><span className="admin-state" data-status={customer.status}>{text[customer.status.toLowerCase()] || customer.status}</span></header>
      <dl className="admin-customer-detail__facts"><div><dt>{text.email}</dt><dd>{customer.email ? <a href={`mailto:${customer.email}`}>{customer.email}</a> : '—'}</dd></div><div><dt>{text.registered}</dt><dd>{dateLabel(customer.createdAt, language)}</dd></div><div><dt>{text.orders}</dt><dd>{customer.orders.length}</dd></div><div><dt>{text.requests}</dt><dd>{customer.requests.length}</dd></div></dl>
      <div className="admin-customer-detail__history"><CustomerOrders orders={customer.orders} text={text} language={language} /><CustomerRequests requests={customer.requests} text={text} language={language} /></div>
    </>}
  </section>;
}
