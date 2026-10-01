import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { formatCRC } from '../../utils/money.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAdminOverview } from './useAdminOverview.js';
import './admin.css';

const labels = {
  es: {
    title: 'Resumen del taller', intro: 'Pedidos y solicitudes que necesitan atención.',
    source: 'Datos académicos · JSON Server', orders: 'Pedidos activos', ordersHint: 'En curso según el flujo de pedidos',
    requests: 'Solicitudes por revisar', requestsHint: 'Revisión o cotización por preparar', sales: 'Ventas cobradas',
    salesHint: 'El origen no registra pagos confirmados', queue: 'Pedidos en curso', queueIntro: 'Los cinco más recientes que siguen activos.',
    requestsQueue: 'Solicitudes para revisar', noneOrders: 'No hay pedidos activos.', noneRequests: 'No hay solicitudes en revisión.',
    id: 'Pedido', customer: 'Cliente', status: 'Estado', total: 'Total registrado',
    customerUnknown: 'Cliente sin nombre asociado', submitted: 'Recibida', material: 'Material', quantity: 'Cantidad',
    statuses: { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado',
      PENDING_QUOTE: 'Pendiente de cotización', IN_REVIEW: 'En revisión' },
    legacyTitle: 'Registro fuera del flujo vigente', legacyText: count => `${count} registro${count === 1 ? '' : 's'} ${count === 1 ? 'usa' : 'usan'} un estado que no está en el contrato actual. Se excluye de los indicadores hasta revisar el dato.`,
    legacyStatus: 'Estado legado', errorTitle: 'No pudimos cargar el resumen',
    errorText: 'Revisá que JSON Server esté activo y vuelve a intentar.', retry: 'Reintentar',
    loading: 'Cargando información del taller', noPayments: 'Sin datos de cobros',
  },
  en: {
    title: 'Workshop overview', intro: 'Orders and requests that need attention.',
    source: 'Academic data · JSON Server', orders: 'Active orders', ordersHint: 'In progress by the order workflow',
    requests: 'Requests to review', requestsHint: 'Review or quote preparation needed', sales: 'Collected sales',
    salesHint: 'The source has no confirmed payment records', queue: 'Orders in progress', queueIntro: 'The five most recent active orders.',
    requestsQueue: 'Requests to review', noneOrders: 'There are no active orders.', noneRequests: 'There are no requests under review.',
    id: 'Order', customer: 'Customer', status: 'Status', total: 'Recorded total',
    customerUnknown: 'No customer name linked', submitted: 'Received', material: 'Material', quantity: 'Quantity',
    statuses: { PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped',
      PENDING_QUOTE: 'Pending quote', IN_REVIEW: 'Under review' },
    legacyTitle: 'Record outside the current workflow', legacyText: count => `${count} record${count === 1 ? '' : 's'} ${count === 1 ? 'uses' : 'use'} a status outside the current contract. Excluded from indicators until reviewed.`,
    legacyStatus: 'Legacy status', errorTitle: 'We could not load the overview',
    errorText: 'Check that JSON Server is running and try again.', retry: 'Retry',
    loading: 'Loading workshop data', noPayments: 'No collection data',
  },
};

function formatDate(value, language) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium' }).format(date);
}

function Metric({ label, value, note, emphasis = false }) {
  return (
    <article className={`admin-metric${emphasis ? ' admin-metric--emphasis' : ''}`} aria-label={`${label}: ${value}`}>
      <span className="admin-eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

export function AdminDashboard() {
  const { language } = usePreferences();
  const text = labels[language];
  const { status, data, retry } = useAdminOverview();

  return (
    <section className="admin-overview" aria-labelledby="admin-overview-title" aria-busy={status === 'loading'}>
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">{text.source}</span>
          <h1 id="admin-overview-title">{text.title}</h1>
          <p>{text.intro}</p>
        </div>
      </header>

      {status === 'loading' && (
        <div className="admin-metrics" role="status" aria-label={text.loading}>
          {[1, 2, 3].map(item => <Skeleton key={item} className="admin-metric-skeleton" />)}
        </div>
      )}

      {status === 'error' && (
        <ErrorState title={text.errorTitle} description={text.errorText} onRetry={retry} retryLabel={text.retry} />
      )}

      {status === 'success' && (
        <>
          <div className="admin-metrics">
            <Metric label={text.orders} value={data.activeOrders} note={text.ordersHint} />
            <Link className="admin-metric-link" to="/admin/solicitudes?fase=workshop" aria-label={`${text.requests}: ${data.requestsToReview.length}`}>
              <Metric label={text.requests} value={data.requestsToReview.length} note={text.requestsHint} emphasis />
              <span className="admin-metric-link__arrow" aria-hidden="true">↗</span>
            </Link>
            <Metric label={text.sales} value={text.noPayments} note={text.salesHint} />
          </div>

          {(data.legacyRequests.length + data.legacyOrders.length) > 0 && (
            <aside className="admin-data-notice" role="status">
              <span className="admin-eyebrow">{text.legacyTitle}</span>
              <p>{text.legacyText(data.legacyRequests.length + data.legacyOrders.length)}</p>
              <ul>
                {data.legacyRequests.map(request => <li key={`request-${request.id}`}>Solicitud {request.id} · {text.legacyStatus}: {request.status}</li>)}
                {data.legacyOrders.map(order => <li key={`order-${order.id}`}>Pedido {order.id} · {text.legacyStatus}: {order.status}</li>)}
              </ul>
            </aside>
          )}

          <div className="admin-work-queues">
            <section className="admin-queue" aria-labelledby="admin-orders-title">
              <header className="admin-queue-heading">
                <div><h2 id="admin-orders-title">{text.queue}</h2><p>{text.queueIntro}</p></div>
                <span className="admin-count">{data.activeOrders}</span>
              </header>
              {data.recentOrders.length === 0 ? <EmptyState title={text.noneOrders} /> : (
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead><tr><th scope="col">{text.id}</th><th scope="col">{text.customer}</th><th scope="col">{text.status}</th><th scope="col">{text.total}</th></tr></thead>
                    <tbody>{data.recentOrders.map(order => (
                      <tr key={order.id}>
                        <th scope="row">{order.id}</th>
                        <td>{order.customerName || text.customerUnknown}</td>
                        <td><span className="admin-state" data-status={order.status}>{text.statuses[order.status] || order.status}</span></td>
                        <td>{formatCRC(order.total) || '—'}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-queue admin-queue--requests" aria-labelledby="admin-requests-title">
              <header className="admin-queue-heading">
                <div><h2 id="admin-requests-title">{text.requestsQueue}</h2><p>{text.requestsHint}</p></div>
                <span className="admin-count">{data.requestsToReview.length}</span>
              </header>
              {data.requestsToReview.length === 0 ? <EmptyState title={text.noneRequests} /> : (
                <ol className="admin-request-list">
                  {data.requestsToReview.map(request => (
                    <li key={request.id}>
                      <Link className="admin-dashboard-request-link" to={`/admin/solicitudes/${encodeURIComponent(request.id)}`}>
                      <div className="admin-request-topline"><strong>{request.fileName || request.description || request.id}</strong><span className="admin-state" data-status={request.status}>{text.statuses[request.status]}</span></div>
                      <p>{request.id} · {text.material}: {request.material || '—'} · {text.quantity}: {request.quantity ?? '—'}</p>
                      <time dateTime={request.submittedAt}>{text.submitted}: {formatDate(request.submittedAt, language)}</time>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
}
