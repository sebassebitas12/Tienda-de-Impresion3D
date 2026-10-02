import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { formatCRC } from '../../utils/money.js';
import { formatOrderReference } from '../../utils/adminOrders.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAdminOverview } from './useAdminOverview.js';
import './admin.css';

const ORDER_STAGES = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED'];

const labels = {
  es: {
    title: 'Resumen del taller', intro: 'Pedidos y solicitudes que necesitan atención.',
    source: 'Datos académicos · JSON Server', orders: 'Pedidos activos', ordersHint: 'En curso según el flujo de pedidos',
    requests: 'Solicitudes por revisar', requestsHint: 'Revisión técnica por preparar', sales: 'Ventas cobradas',
    salesHint: 'El origen no registra pagos confirmados', queue: 'Registro de producción', queueIntro: 'Los cinco pedidos activos más recientes.',
    requestsQueue: 'Atención técnica', noneOrders: 'No hay pedidos activos.', noneRequests: 'No hay solicitudes en revisión.',
    id: 'Pedido', customer: 'Cliente', status: 'Etapa', total: 'Total registrado',
    customerUnknown: 'Cliente sin nombre asociado', submitted: 'Recibida', material: 'Material', quantity: 'Cantidad',
    flow: 'Distribución por etapa', flowEyebrow: 'CARGA DEL TALLER', activeCountLabel: 'ACTIVOS', openRequestLabel: 'ABIERTAS',
    flowDescription: count => `${count} pedidos activos distribuidos por etapa de producción.`, flowCaption: 'Cada segmento representa una proporción del total activo.',
    statuses: { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado',
      PENDING_QUOTE: 'Pendiente de cotización', IN_REVIEW: 'En revisión' },
    legacyTitle: 'Registro fuera del flujo actual', legacyText: (requests, orders) => {
      const submitted = requests.some(request => request.status === 'SUBMITTED');
      const parts = [];
      if (requests.length) parts.push(`${requests.length} solicitud${requests.length === 1 ? '' : 'es'}`);
      if (orders.length) parts.push(`${orders.length} pedido${orders.length === 1 ? '' : 's'}`);
      return `Hay ${parts.join(' y ')} con un estado que el flujo actual no reconoce. ${submitted ? 'SUBMITTED es una etiqueta del formato anterior: no equivale automáticamente a “Pendiente de cotización”. ' : ''}No se convierte${parts.length === 1 ? '' : 'n'} ni se cuenta${parts.length === 1 ? '' : 'n'} en las etapas actuales. ${requests.length ? 'Abrí la solicitud y revisá sus datos; su ficha permite registrarla como pendiente si corresponde. ' : ''}${orders.length ? 'El pedido conserva su estado de origen y no se modifica desde este aviso.' : ''}`;
    },
    legacyStatus: 'Estado', errorTitle: 'No pudimos cargar el resumen',
    errorText: 'Revisá que JSON Server esté activo y volvé a intentar.', retry: 'Reintentar',
    loading: 'Cargando información del taller', noPayments: 'Sin datos de cobros',
  },
  en: {
    title: 'Workshop overview', intro: 'Orders and requests that need attention.',
    source: 'Academic data · JSON Server', orders: 'Active orders', ordersHint: 'In progress by the order workflow',
    requests: 'Requests to review', requestsHint: 'Technical review to prepare', sales: 'Collected sales',
    salesHint: 'The source has no confirmed payment records', queue: 'Production register', queueIntro: 'The five most recent active orders.',
    requestsQueue: 'Technical attention', noneOrders: 'There are no active orders.', noneRequests: 'There are no requests to review.',
    id: 'Order', customer: 'Customer', status: 'Stage', total: 'Recorded total',
    customerUnknown: 'No customer name linked', submitted: 'Received', material: 'Material', quantity: 'Quantity',
    flow: 'Orders by stage', flowEyebrow: 'WORKSHOP LOAD', activeCountLabel: 'ACTIVE', openRequestLabel: 'OPEN',
    flowDescription: count => `${count} active orders distributed by production stage.`, flowCaption: 'Each segment shows its share of active orders.',
    statuses: { PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped',
      PENDING_QUOTE: 'Pending quote', IN_REVIEW: 'Under review' },
    legacyTitle: 'Record outside the current workflow', legacyText: (requests, orders) => {
      const submitted = requests.some(request => request.status === 'SUBMITTED');
      const parts = [];
      if (requests.length) parts.push(`${requests.length} request${requests.length === 1 ? '' : 's'}`);
      if (orders.length) parts.push(`${orders.length} order${orders.length === 1 ? '' : 's'}`);
      const conversionRule = parts.length === 1 ? 'It is not converted or counted in current stages. ' : 'They are not converted or counted in current stages. ';
      return `${parts.join(' and ')} ${parts.length === 1 ? 'has' : 'have'} a status not recognized by the current workflow. ${submitted ? 'SUBMITTED is a label from the previous format; it does not automatically mean “Pending quote”. ' : ''}${conversionRule}${requests.length ? 'Open the request and review its details; its record lets you register it as pending if appropriate. ' : ''}${orders.length ? 'The order keeps its original status and is not changed from this notice.' : ''}`;
    },
    legacyStatus: 'Status', errorTitle: 'We could not load the overview',
    errorText: 'Check that JSON Server is running and try again.', retry: 'Retry',
    loading: 'Loading workshop data', noPayments: 'No collection data',
  },
};

function formatDate(value, language) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium' }).format(date);
}

function Metric({ label, value, note, emphasis = false, unavailable = false }) {
  return (
    <article className={`admin-metric${emphasis ? ' admin-metric--emphasis' : ''}${unavailable ? ' admin-metric--unavailable' : ''}`} aria-label={`${label}: ${value}`}>
      <span className="admin-eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function OrderFlow({ counts, total, text }) {
  const radius = 43;
  const shares = ORDER_STAGES.map(status => ({ status, count: counts[status] || 0, length: total ? (counts[status] || 0) / total * 100 : 0 }));
  const segments = shares.map((segment, index) => ({
    ...segment,
    dashLength: Math.max(0, segment.length - (segment.count ? 1.2 : 0)),
    offset: shares.slice(0, index).reduce((sum, previous) => sum + previous.length, 0),
    index,
  }));

  return (
    <section className="admin-flow" aria-labelledby="admin-flow-title">
      <header className="admin-section-heading">
        <div><span className="admin-eyebrow">{text.flowEyebrow}</span><h2 id="admin-flow-title">{text.flow}</h2></div>
        <p>{text.flowDescription(total)}</p>
      </header>
      <div className="admin-flow__body">
        <figure className="admin-flow__chart">
          <div className="admin-flow__ring-wrap">
            <svg className="admin-flow__ring" viewBox="0 0 100 100" role="img" aria-labelledby="admin-flow-chart-title admin-flow-chart-description">
              <title id="admin-flow-chart-title">{text.flow}</title>
              <desc id="admin-flow-chart-description">{text.flowDescription(total)}</desc>
              <circle className="admin-flow__track" cx="50" cy="50" r={radius} pathLength="100" />
              {segments.map(segment => <circle key={segment.status} className={`admin-flow__segment admin-flow__segment--${segment.status.toLowerCase()}`}
                cx="50" cy="50" r={radius} pathLength="100" strokeDasharray={`${segment.dashLength} 100`} strokeDashoffset={-segment.offset}
                style={{ '--segment-index': segment.index, '--segment-dasharray': `${segment.dashLength} 100` }} />)}
            </svg>
            <div className="admin-flow__center" aria-hidden="true"><strong>{total}</strong><span>{text.activeCountLabel}</span></div>
          </div>
          <figcaption>{text.flowCaption}</figcaption>
        </figure>
        <ol className="admin-flow__legend" aria-label={text.flow}>
          {segments.map(segment => <li key={segment.status}>
            <span className={`admin-flow__dot admin-flow__dot--${segment.status.toLowerCase()}`} aria-hidden="true" />
            <span>{text.statuses[segment.status]}</span><strong>{segment.count}</strong>
          </li>)}
        </ol>
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const { language } = usePreferences();
  const text = labels[language];
  const { status, data, retry } = useAdminOverview();
  const legacyCount = data ? data.legacyRequests.length + data.legacyOrders.length : 0;

  return (
    <section className="admin-overview" aria-labelledby="admin-overview-title" aria-busy={status === 'loading'}>
      <header className="admin-page-heading admin-overview__heading">
        <div><span className="admin-eyebrow">{text.source}</span><h1 id="admin-overview-title">{text.title}</h1><p>{text.intro}</p></div>
      </header>

      {status === 'loading' && <div className="admin-metrics" role="status" aria-label={text.loading}>{[1, 2, 3].map(item => <Skeleton key={item} className="admin-metric-skeleton" />)}</div>}
      {status === 'error' && <ErrorState title={text.errorTitle} description={text.errorText} onRetry={retry} retryLabel={text.retry} />}

      {status === 'success' && <>
        <div className="admin-metrics" aria-label={text.source}>
          <Metric label={text.orders} value={data.activeOrders} note={text.ordersHint} />
          <Link className="admin-metric-link" to="/admin/solicitudes?fase=workshop" aria-label={`${text.requests}: ${data.requestsToReview.length}`}>
            <Metric label={text.requests} value={data.requestsToReview.length} note={text.requestsHint} emphasis />
            <span className="admin-metric-link__arrow" aria-hidden="true">↗</span>
          </Link>
          <Metric label={text.sales} value={text.noPayments} note={text.salesHint} unavailable />
        </div>

        <OrderFlow counts={data.activeOrdersByStatus} total={data.activeOrders} text={text} />

        <div className="admin-work-queues">
          <section className="admin-queue admin-queue--orders" aria-labelledby="admin-orders-title">
            <header className="admin-queue-heading">
              <div><span className="admin-eyebrow">{text.orders}</span><h2 id="admin-orders-title">{text.queue}</h2><p>{text.queueIntro}</p></div>
              <span className="admin-count"><strong>{data.activeOrders}</strong><span>{text.activeCountLabel}</span></span>
            </header>
            {data.recentOrders.length === 0 ? <EmptyState title={text.noneOrders} /> : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <caption className="admin-sr-only">{text.queue}: {data.recentOrders.length}</caption>
                  <thead><tr><th scope="col">{text.id}</th><th scope="col">{text.customer}</th><th scope="col">{text.status}</th><th scope="col">{text.total}</th></tr></thead>
                  <tbody>{data.recentOrders.map((order, index) => (
                    <tr key={order.id} style={{ '--row-index': index }}>
                      <th scope="row"><Link className="admin-order-id" to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>{formatOrderReference(order.id)} <span aria-hidden="true">↗</span></Link></th>
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
              <div><span className="admin-eyebrow">{text.requests}</span><h2 id="admin-requests-title">{text.requestsQueue}</h2><p>{text.requestsHint}</p></div>
              <span className="admin-count"><strong>{data.requestsToReview.length}</strong><span>{text.openRequestLabel}</span></span>
            </header>
            {data.requestsToReview.length === 0 ? <EmptyState title={text.noneRequests} /> : (
              <ol className="admin-request-list">
                {data.requestsToReview.map((request, index) => (
                  <li key={request.id} style={{ '--row-index': index }}>
                    <Link className="admin-dashboard-request-link" to={`/admin/solicitudes/${encodeURIComponent(request.id)}`}>
                      <span className="admin-request-list__content">
                        <span className="admin-request-topline"><strong>{request.fileName || request.description || request.id}</strong><span className="admin-state" data-status={request.status}>{text.statuses[request.status]}</span></span>
                        <span className="admin-request-list__meta">{request.id} <i aria-hidden="true">·</i> {text.material}: {request.material || '—'} <i aria-hidden="true">·</i> {text.quantity}: {request.quantity ?? '—'}</span>
                        <time dateTime={request.submittedAt}>{text.submitted}: {formatDate(request.submittedAt, language)}</time>
                      </span>
                      <span className="admin-request-list__arrow" aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {legacyCount > 0 && <aside className="admin-data-notice" aria-labelledby="admin-data-notice-title">
          <header className="admin-data-notice__header"><span className="admin-data-notice__mark" aria-hidden="true">!</span>
            <div><span className="admin-eyebrow">{language === 'es' ? 'REVISIÓN DE DATOS' : 'DATA REVIEW'}</span><h2 id="admin-data-notice-title">{text.legacyTitle}</h2><p>{text.legacyText(data.legacyRequests, data.legacyOrders)}</p></div>
          </header>
          <ul className="admin-data-notice__records">
            {data.legacyRequests.map(request => <li key={`request-${request.id}`}>
              <span><strong>{language === 'es' ? 'Solicitud' : 'Request'} {request.id}</strong><small>{text.legacyStatus}: {request.status}</small></span>
              <Link to={`/admin/solicitudes/${encodeURIComponent(request.id)}`}>{language === 'es' ? 'Revisar registro' : 'Review record'} ↗</Link>
            </li>)}
            {data.legacyOrders.map(order => <li key={`order-${order.id}`}>
              <span><strong>{language === 'es' ? 'Pedido' : 'Order'} {formatOrderReference(order.id)}</strong><small>{text.legacyStatus}: {order.status}</small></span>
              <Link to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>{language === 'es' ? 'Ver pedido' : 'View order'} ↗
              </Link>
            </li>)}
          </ul>
        </aside>}
      </>}
    </section>
  );
}
