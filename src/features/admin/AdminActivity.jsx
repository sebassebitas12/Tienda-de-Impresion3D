import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { getAdminActivity } from '../../services/adminActivityService.js';
import './admin.css';

const copy = {
  es: {
    title: 'Actividad del taller', intro: 'Un registro de las acciones administrativas que quedaron guardadas.',
    source: 'Historial · JSON Server', loading: 'Cargando historial', error: 'No pudimos cargar la actividad',
    errorHint: 'Revisá que JSON Server esté activo y volvé a intentar.', retry: 'Reintentar',
    empty: 'Todavía no hay actividad registrada.', emptyHint: 'Las acciones administrativas aparecerán aquí cuando se guarden en el historial.',
    requestTitle: id => `Solicitud ${id}`, back: 'Ver toda la actividad', requestLink: 'Abrir solicitud',
    review: 'Se inició la revisión técnica', by: name => `Acción registrada por ${name}.`,
    statusChange: (from, to) => `${from} → ${to}`, unknownAction: 'Acción administrativa registrada',
    statuses: { SUBMITTED: 'Etiqueta antigua', PENDING_QUOTE: 'Pendiente de cotización', IN_REVIEW: 'En revisión', QUOTED: 'Cotizada', AWAITING_APPROVAL: 'Espera aprobación' },
  },
  en: {
    title: 'Workshop activity', intro: 'A record of administrative actions saved to the activity log.',
    source: 'Activity log · JSON Server', loading: 'Loading activity', error: 'Could not load activity',
    errorHint: 'Check that JSON Server is running and try again.', retry: 'Retry',
    empty: 'There is no recorded activity yet.', emptyHint: 'Administrative actions will appear here once they are saved to the log.',
    requestTitle: id => `Request ${id}`, back: 'View all activity', requestLink: 'Open request',
    review: 'Technical review started', by: name => `Action recorded by ${name}.`,
    statusChange: (from, to) => `${from} → ${to}`, unknownAction: 'Administrative action recorded',
    statuses: { SUBMITTED: 'Old label', PENDING_QUOTE: 'Pending quote', IN_REVIEW: 'Under review', QUOTED: 'Quoted', AWAITING_APPROVAL: 'Awaiting approval' },
  },
};

function formatDate(value, language) {
  const date = new Date(value || '');
  if (!Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function eventTitle(event, text) {
  if (event.action === 'REQUEST_REVIEW_STARTED') return text.review;
  const es = text.review === 'Se inició la revisión técnica';
  if (event.action === 'REQUEST_INCORPORATED') return es ? 'Solicitud incorporada a pendientes' : 'Request registered as pending';
  if (event.action === 'REQUEST_QUOTE_SAVED') return es ? 'Cotización preparada' : 'Quote prepared';
  if (event.action === 'REQUEST_QUOTE_PUBLISHED') return es ? 'Cotización disponible para aprobación' : 'Quote available for approval';
  if (event.action === 'REQUEST_AUTO_QUOTED') return es ? 'Cotización DEMO calculada automáticamente' : 'DEMO quote calculated automatically';
  if (event.action === 'REQUEST_DEMO_FULFILLED') return es ? 'Pago simulado y pedido DEMO creado' : 'Payment simulated and DEMO order created';
  if (event.action === 'REQUEST_PAYMENT_RECORDED') return es ? 'Comprobante de pago verificado y pedido creado' : 'Payment evidence verified and order created';
  if (event.action === 'REQUEST_CUSTOMER_APPROVED') return es ? 'El cliente aprobó el alcance' : 'Customer approved the scope';
  if (event.action === 'ORDER_STATUS_CHANGED') return es ? 'Etapa del pedido actualizada' : 'Order stage updated';
  if (event.action === 'REQUEST_QUOTE_EMAIL_SENT') return es ? 'Cotización enviada por correo' : 'Quote emailed';
  if (event.action === 'REQUEST_QUOTE_TEST_EMAIL_SENT') return es ? 'Correo de prueba DEMO enviado' : 'DEMO test email sent';
  return text.unknownAction;
}

export function AdminActivityPage() {
  const { language } = usePreferences();
  const text = copy[language];
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('solicitud')?.trim() || '';
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState({ status: 'loading', events: [], requestId: null });

  useEffect(() => {
    const controller = new AbortController();
    getAdminActivity({ signal: controller.signal, requestId: requestId || undefined })
      .then(events => setState({ status: 'success', events, requestId }))
      .catch(error => { if (error?.name !== 'AbortError') setState({ status: 'error', events: [], requestId }); });
    return () => controller.abort();
  }, [requestId, reloadKey]);

  const status = state.requestId === requestId ? state.status : 'loading';

  return (
    <section className="admin-activity" aria-labelledby="admin-activity-title" aria-busy={status === 'loading'}>
      <header className="admin-page-heading admin-activity__heading">
        <div>
          <span className="admin-eyebrow">{text.source}</span>
          <h1 id="admin-activity-title">{requestId ? text.requestTitle(requestId) : text.title}</h1>
          <p>{text.intro}</p>
          {requestId && <Link className="admin-activity__filter" to="/admin/actividad">← {text.back}</Link>}
        </div>
      </header>

      {status === 'loading' && <div className="admin-activity__loading" role="status" aria-label={text.loading}>
        {[1, 2, 3].map(item => <Skeleton key={item} height="74px" />)}
      </div>}
      {status === 'error' && <ErrorState title={text.error} description={text.errorHint} retryLabel={text.retry} onRetry={() => { setState({ status: 'loading', events: [], requestId }); setReloadKey(value => value + 1); }} />}
      {status === 'success' && state.events.length === 0 && <EmptyState title={text.empty} description={text.emptyHint} />}
      {status === 'success' && state.events.length > 0 && <ol className="admin-activity__timeline" aria-label={text.title}>
        {state.events.map((event, index) => (
          <li className="admin-activity__event" key={event.id || `${event.action}-${event.entityId}-${event.occurredAt}`} style={{ '--row-index': index }}>
            <time dateTime={event.occurredAt}>{formatDate(event.occurredAt, language)}</time>
            <h2>{eventTitle(event, text)}</h2>
            <p>
              {event.entity === 'customPrintRequest' && <>
                {text.requestTitle(event.entityId)} · <Link to={`/admin/solicitudes/${encodeURIComponent(event.entityId)}`}>{text.requestLink}</Link>
                <br />
              </>}
              {event.entity === 'order' && <><Link to={`/admin/pedidos/${encodeURIComponent(event.entityId)}`}>{language === 'es' ? 'Abrir pedido' : 'Open order'} {event.entityId}</Link><br /></>}
              {text.by(event.actorName || event.actorId || '—')}
              {event.fromStatus && event.toStatus && <> · {text.statusChange(text.statuses[event.fromStatus] || event.fromStatus, text.statuses[event.toStatus] || event.toStatus)}</>}
            </p>
          </li>
        ))}
      </ol>}
    </section>
  );
}
