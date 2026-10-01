import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { formatCRC } from '../../utils/money.js';
import { filterAdminOrders, formatOrderReference, summarizeOrderGroups } from '../../utils/adminOrders.js';
import { FilterChips } from '../../components/ui/FilterChips.jsx';
import { toggleFacetParams } from '../../utils/facetFilters.js';
import { useAdminOrders } from './useAdminOrders.js';
import './admin.css';

const words = {
  es: {
    title: 'Pedidos del taller', intro: 'Encontrá un pedido y entendé en qué etapa está.', source: 'Registro de producción · JSON Server',
    loading: 'Cargando pedidos', error: 'No pudimos cargar los pedidos', errorHint: 'Revisá que JSON Server esté activo y volvé a intentar.', retry: 'Reintentar',
    all: 'Todos', active: 'En producción', delivered: 'Entregados', closed: 'Cerrados', unrecognized: 'Estado no reconocido',
    unrecognizedHint: 'Estos pedidos conservan el estado recibido porque no coincide con las etapas configuradas.',
    search: 'Buscar pedido', searchHint: 'Número, cliente o pieza', results: count => `${count} pedidos`,
    noMatch: 'No encontramos pedidos con esos filtros.', noOrders: 'Todavía no hay pedidos registrados.',
    id: 'Pedido', client: 'Cliente', created: 'Recibido', stage: 'Etapa', amount: 'Total registrado',
    detail: 'Detalle de pedido', back: 'Volver a pedidos', customer: 'Cliente', email: 'Correo', received: 'Recibido',
    tracking: 'Recorrido del pedido', items: 'Piezas del pedido', item: 'Pieza', quantity: 'Cantidad', each: 'Por unidad', lineTotal: 'Subtotal',
    summary: 'Resumen registrado', subtotal: 'Productos', shipping: 'Entrega', discount: 'Descuento', taxes: 'Impuestos', total: 'Total registrado',
    paymentLimit: 'Este registro no confirma por sí solo un pago.', deliveredAt: 'Entregado', missingProduct: id => `Pieza ${id}`,
    noItems: 'Este pedido no tiene piezas asociadas.', notFound: 'No encontramos este pedido.', legacyTitle: 'Estado por aclarar',
    legacyDescription: status => `El estado «${status}» no pertenece al flujo documentado. Se conserva el valor de origen y no se puede actualizar desde aquí.`,
    status: { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado', REJECTED: 'Rechazado' },
    steps: ['Pendiente', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado'],
    closeStatus: { CANCELLED: 'El pedido fue cancelado.', REJECTED: 'El pedido fue rechazado.' },
  },
  en: {
    title: 'Workshop orders', intro: 'Find an order and see what stage it has reached.', source: 'Production log · JSON Server',
    loading: 'Loading orders', error: 'Could not load orders', errorHint: 'Check that JSON Server is running and try again.', retry: 'Retry',
    all: 'All', active: 'In progress', delivered: 'Delivered', closed: 'Closed', unrecognized: 'Needs review',
    search: 'Search orders', searchHint: 'Order number, customer or part', results: count => `${count} orders`,
    noMatch: 'No orders match these filters.', noOrders: 'No orders have been recorded yet.',
    id: 'Order', client: 'Customer', created: 'Received', stage: 'Stage', amount: 'Recorded total',
    detail: 'Order details', back: 'Back to orders', customer: 'Customer', email: 'Email', received: 'Received',
    tracking: 'Order progress', items: 'Items in this order', item: 'Part', quantity: 'Quantity', each: 'Each', lineTotal: 'Subtotal',
    summary: 'Recorded summary', subtotal: 'Products', shipping: 'Delivery', discount: 'Discount', taxes: 'Taxes', total: 'Recorded total',
    paymentLimit: 'This record alone does not confirm a payment.', deliveredAt: 'Delivered', missingProduct: id => `Part ${id}`,
    unrecognizedHint: 'These orders keep the received status because it does not match the configured stages.',
    noItems: 'This order has no associated items.', notFound: 'We could not find this order.', legacyTitle: 'Unrecognized status',
    legacyDescription: status => `The record arrived with “${status}”, a status outside the configured order flow. It is preserved as received and cannot be changed here.`,
    status: { PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled', REJECTED: 'Rejected' },
    steps: ['Pending', 'Confirmed', 'In production', 'Ready', 'Shipped', 'Delivered'],
    closeStatus: { CANCELLED: 'This order was cancelled.', REJECTED: 'This order was rejected.' },
  },
};

const FILTERS = ['all', 'active', 'delivered', 'closed', 'unrecognized'];
const FLOW = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED'];
const AMOUNT_FIELDS = ['subtotal', 'shipping', 'discount', 'taxes', 'total'];

function formatDate(value, language, options = { dateStyle: 'medium' }) {
  const date = new Date(value || '');
  if (!Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', options).format(date);
}

function OrderState({ status, text }) {
  return <span className="admin-state" data-status={status}>{text.status[status] || status || '—'}</span>;
}

export function AdminOrdersPage() {
  const { language } = usePreferences();
  const text = words[language];
  const { status, orders, retry } = useAdminOrders();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const groups = params.getAll('grupo').filter(value => value !== 'all' && FILTERS.includes(value));
  const group = groups.length === 1 ? groups[0] : 'all';
  const counts = useMemo(() => summarizeOrderGroups(orders), [orders]);
  const filtered = filterAdminOrders(orders, groups, query);
  const chooseGroup = value => setParams(toggleFacetParams(params, 'grupo', value));

  return (
    <section className="admin-orders" aria-labelledby="admin-orders-page-title" aria-busy={status === 'loading'}>
      <header className="admin-page-heading admin-orders__heading">
        <div><span className="admin-eyebrow">{text.source}</span><h1 id="admin-orders-page-title">{text.title}</h1><p>{text.intro}</p></div>
        {status === 'success' && <span className="admin-orders__total"><strong>{orders.length}</strong><span>{text.results(orders.length)}</span></span>}
      </header>

      {status === 'loading' && <div className="admin-orders__loading" role="status" aria-label={text.loading}>{[1, 2, 3].map(index => <Skeleton key={index} height="68px" />)}</div>}
      {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
      {status === 'success' && <>
        <FilterChips className="admin-orders__filters" label={text.title} selected={groups} onToggle={chooseGroup} options={FILTERS.map(key => ({ value: key, label: text[key], count: counts[key] }))} />
        <section className="admin-orders__register" aria-labelledby="admin-orders-register-title">
          <header className="admin-orders__register-heading">
            <div><span className="admin-eyebrow">02 / {text.id}</span><h2 id="admin-orders-register-title">{groups.length > 1 ? groups.map(key => text[key]).join(' + ') : text[group]}</h2>
              {group === 'unrecognized' && <p className="admin-orders__group-note">{text.unrecognizedHint}</p>}
            </div>
            <label className="admin-orders__search"><span>{text.search}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={text.searchHint} /></label>
          </header>
          <p className="admin-orders__results" role="status" aria-live="polite">{text.results(filtered.length)}</p>
          {filtered.length === 0 ? <EmptyState title={query || group !== 'all' ? text.noMatch : text.noOrders} /> : (
            <div className="admin-table-scroll">
              <table className="admin-table admin-orders__table">
                <caption className="admin-sr-only">{text.title}: {filtered.length}</caption>
                <thead><tr><th scope="col">{text.id}</th><th scope="col">{text.client}</th><th scope="col">{text.created}</th><th scope="col">{text.stage}</th><th scope="col">{text.amount}</th></tr></thead>
                <tbody>{filtered.map((order, index) => <tr key={order.id} style={{ '--row-index': index }}>
                  <th scope="row"><Link className="admin-order-id" to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>{formatOrderReference(order.id)}<span aria-hidden="true">↗</span></Link></th>
                  <td>{order.customer?.name || '—'}</td>
                  <td><time dateTime={order.createdAt}>{formatDate(order.createdAt, language)}</time></td>
                  <td><OrderState status={order.status} text={text} /></td>
                  <td>{formatCRC(order.total) || '—'}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </>}
    </section>
  );
}

function OrderFlow({ order, text }) {
  const current = FLOW.indexOf(order.status);
  if (current < 0) return <aside className="admin-detail-legacy admin-order-flow__closed" role="status">
    <strong>{order.status && order.status in text.closeStatus ? text.status[order.status] : text.legacyTitle}</strong>
    <p>{text.closeStatus[order.status] || text.legacyDescription(order.status || '—')}</p>
  </aside>;

  return <section className="admin-request-workflow admin-order-flow" aria-labelledby="admin-order-flow-title">
    <div className="admin-request-workflow__heading"><div><span className="admin-eyebrow">01 / {text.stage}</span><h2 id="admin-order-flow-title">{text.tracking}</h2></div><OrderState status={order.status} text={text} /></div>
    <ol className="admin-workflow-steps admin-order-flow__steps" aria-label={text.tracking}>
      {FLOW.map((step, index) => <li key={step} className={index < current ? 'is-complete' : index === current ? 'is-current' : ''}
        aria-current={index === current ? 'step' : undefined}>
        <span className="admin-workflow-steps__mark" aria-hidden="true">{index < current ? '✓' : String(index + 1).padStart(2, '0')}</span><span>{text.steps[index]}</span>
      </li>)}
    </ol>
  </section>;
}

export function AdminOrderDetailPage() {
  const { language } = usePreferences();
  const text = words[language];
  const { id = '' } = useParams();
  const { status, orders, retry } = useAdminOrders();
  const order = orders.find(item => String(item.id) === id);

  return (
    <section className="admin-order-detail" aria-labelledby="admin-order-detail-title" aria-busy={status === 'loading'}>
      <Link className="admin-request-back" to="/admin/pedidos">← {text.back}</Link>
      {status === 'loading' && <div className="admin-orders__loading" role="status" aria-label={text.loading}><Skeleton height="220px" /></div>}
      {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
      {status === 'success' && !order && <EmptyState title={text.notFound} />}
      {status === 'success' && order && <>
        <header className="admin-order-detail__heading">
          <div><span className="admin-eyebrow">{text.detail} / {formatOrderReference(order.id)}</span><h1 id="admin-order-detail-title">{text.id} {formatOrderReference(order.id)}</h1>
            <p>{order.customer?.name || '—'} <span aria-hidden="true">·</span> {formatDate(order.createdAt, language)}</p></div>
          <OrderState status={order.status} text={text} />
        </header>

        <OrderFlow order={order} text={text} />

        <div className="admin-order-detail__grid">
          <section className="admin-order-items" aria-labelledby="admin-order-items-title">
            <header><span className="admin-eyebrow">02 / {text.items}</span><h2 id="admin-order-items-title">{text.items}</h2></header>
            {order.items.length === 0 ? <EmptyState title={text.noItems} /> : <div className="admin-table-scroll">
              <table className="admin-table admin-order-items__table">
                <caption className="admin-sr-only">{text.items}: {order.items.length}</caption>
                <thead><tr><th scope="col">{text.item}</th><th scope="col">{text.quantity}</th><th scope="col">{text.each}</th><th scope="col">{text.lineTotal}</th></tr></thead>
                <tbody>{order.items.map((item, index) => <tr key={item.id || `${item.orderId}-${item.productId}`} style={{ '--row-index': index }}>
                  <th scope="row">{item.product?.name || text.missingProduct(item.productId)}{item.product?.material && <span className="admin-order-items__material">{item.product.material}</span>}</th>
                  <td>{item.quantity ?? '—'}</td><td>{formatCRC(item.unitPrice) || '—'}</td><td>{formatCRC(item.subtotal) || '—'}</td>
                </tr>)}</tbody>
              </table>
            </div>}
          </section>

          <aside className="admin-order-summary" aria-labelledby="admin-order-summary-title">
            <span className="admin-eyebrow">03 / {text.summary}</span><h2 id="admin-order-summary-title">{text.summary}</h2>
            <dl>{AMOUNT_FIELDS.map(field => order[field] !== undefined && <div key={field} className={field === 'total' ? 'admin-order-summary__total' : ''}>
              <dt>{text[field]}</dt><dd>{formatCRC(order[field]) || '—'}</dd>
            </div>)}</dl>
            <p>{text.paymentLimit}</p>
          </aside>
        </div>

        <section className="admin-order-customer" aria-labelledby="admin-order-customer-title">
          <span className="admin-eyebrow">04 / {text.customer}</span><h2 id="admin-order-customer-title">{text.customer}</h2>
          <p><strong>{order.customer?.name || '—'}</strong>{order.customer?.email && <> · {order.customer.email}</>}</p>
          {order.deliveredAt && <p><span>{text.deliveredAt}: </span><time dateTime={order.deliveredAt}>{formatDate(order.deliveredAt, language, { dateStyle: 'medium', timeStyle: 'short' })}</time></p>}
        </section>
      </>}
    </section>
  );
}
