import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { Button } from '../../components/ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { formatCRC } from '../../utils/money.js';
import { filterAdminRequests, REQUEST_PHASES, summarizeRequestPhases } from '../../utils/adminRequests.js';
import { startRequestReview } from '../../services/adminActionsService.js';
import { useAdminRequests } from './useAdminRequests.js';
import './admin.css';
import { FilterChips } from '../../components/ui/FilterChips.jsx';
import { toggleFacetParams } from '../../utils/facetFilters.js';
import { RequestNextAction } from './RequestNextAction.jsx';
import { readQuoteAttachment } from '../../services/automationService.js';

function RequestAttachment({ requestId, attachment, token, language }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  async function openAttachment() {
    if (url) { window.open(url, '_blank', 'noopener,noreferrer'); return; }
    setBusy(true); setError('');
    try {
      const file = await readQuoteAttachment(requestId, attachment.id, { token });
      const binary = atob(file.data);
      const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
      const nextUrl = URL.createObjectURL(new Blob([bytes], { type: file.contentType }));
      setUrl(nextUrl);
    } catch { setError(language === 'es' ? 'No se pudo abrir el archivo.' : 'Could not open the file.'); }
    finally { setBusy(false); }
  }
  return <li className="admin-request-attachment"><div><strong>{attachment.name}</strong><small>{(attachment.size / 1024 / 1024).toFixed(1)} MB · {attachment.contentType}</small></div>
    <button className="admin-action-secondary" type="button" onClick={openAttachment} disabled={busy}>{busy ? (language === 'es' ? 'Abriendo…' : 'Opening…') : url ? (language === 'es' ? 'Abrir archivo' : 'Open file') : (language === 'es' ? 'Cargar vista' : 'Load preview')}</button>
    {error && <p role="alert">{error}</p>}{url && attachment.contentType.startsWith('image/') && <img src={url} alt={`${language === 'es' ? 'Referencia adjunta' : 'Attached reference'}: ${attachment.name}`} />}
    {url && <a href={url} download={attachment.name}>{language === 'es' ? 'Descargar' : 'Download'} ↗</a>}
  </li>;
}

const words = {
  es: {
    title: 'Solicitudes de fabricación', intro: 'Revisá cada encargo, su contexto y el paso en el que está.',
    source: 'Bandeja técnica · JSON Server', loading: 'Cargando solicitudes', retry: 'Reintentar',
    errorTitle: 'No pudimos cargar las solicitudes', errorText: 'Revisá que JSON Server esté activo y volvé a intentar.',
    all: 'Todas', workshop: 'Acción del taller', customer: 'Espera del cliente', production: 'Aprobadas / pagadas', closed: 'Cerradas', legacy: 'Estado no reconocido',
    legacySummary: count => `${count} solicitud${count === 1 ? '' : 'es'} pendiente${count === 1 ? '' : 's'} de incorporar`, legacyView: 'Revisar e incorporar',
    distribution: 'Mapa de solicitudes', distributionHint: count => `${count} solicitudes reconocidas en el flujo actual`,
    searchLabel: 'Buscar solicitud', searchPlaceholder: 'ID, cliente, archivo o material', results: count => `${count} resultados`,
    empty: 'No hay solicitudes en este grupo.', noMatch: 'No encontramos coincidencias.', noRequest: 'No encontramos esta solicitud.', customerLabel: 'Cliente',
    customerUnknown: 'Cliente no asociado', request: 'Solicitud', received: 'Recibida', material: 'Material', quantity: 'Cantidad',
    sourceType: 'Origen', file: 'Archivo indicado', description: 'Descripción', quote: 'Cotización registrada', quoteDate: 'Cotizada', validUntil: 'Válida hasta',
    workflow: 'Flujo de cotización', current: 'Estado actual', details: 'Ficha técnica', back: 'Volver a solicitudes',
    startReview: 'Iniciar revisión técnica', startingReview: 'Iniciando revisión…', reviewIntro: 'Al continuar, la solicitud queda en revisión y la acción se anota en su historial. ',
    reviewStarted: 'Revisión iniciada y registrada.', reviewBy: 'Revisión iniciada por', viewActivity: 'Ver historial completo', reviewActionError: 'No pudimos iniciar la revisión. Volvé a cargar la solicitud e intentá de nuevo.',
    types: { FILE: 'Archivo 3D', DESIGN_HELP: 'Ayuda de diseño' },
    statuses: { PENDING_QUOTE: 'Pendiente de cotización', IN_REVIEW: 'En revisión', QUOTED: 'Cotizada', AWAITING_APPROVAL: 'Espera aprobación', APPROVED: 'Aprobada', PAID: 'Pagada', REJECTED: 'Rechazada', EXPIRED: 'Vencida', CANCELLED: 'Cancelada' },
    waitingNote: 'Después de la revisión, prepará la cotización en «Tu siguiente paso».',
    noQuote: 'Todavía no hay una cotización final registrada.', noQuoteForStatus: 'Este estado no muestra un precio de cotización.', legacyTitle: 'Registro fuera del flujo vigente',
    legacyDescription: status => status === 'SUBMITTED' ? 'Se recibió con una etiqueta antigua. Abrí la solicitud y registrala como pendiente para iniciar su revisión.' : `Este registro usa «${status}». Revisá su origen antes de asignarle una etapa.`,
    flowSteps: ['Pendiente', 'En revisión', 'Cotizada', 'Aprobación', 'Aprobada', 'Pagada'],
  },
  en: {
    title: 'Print requests', intro: 'Review each job, its context and current step.', source: 'Technical queue · JSON Server',
    loading: 'Loading requests', retry: 'Retry', errorTitle: 'Could not load requests', errorText: 'Check that JSON Server is running and try again.',
    all: 'All', workshop: 'Workshop action', customer: 'Waiting on customer', production: 'Approved / paid', closed: 'Closed', legacy: 'Unrecognized status',
    legacySummary: count => `${count} request${count === 1 ? '' : 's'} with an unrecognized status`, legacyView: 'View these records',
    distribution: 'Request map', distributionHint: count => `${count} requests in the recognized workflow`,
    searchLabel: 'Search requests', searchPlaceholder: 'ID, customer, file or material', results: count => `${count} results`,
    empty: 'No requests in this group.', noMatch: 'No matching requests found.', noRequest: 'Request not found.', customerLabel: 'Customer',
    customerUnknown: 'No linked customer', request: 'Request', received: 'Received', material: 'Material', quantity: 'Quantity',
    sourceType: 'Source', file: 'File name', description: 'Description', quote: 'Recorded quote', quoteDate: 'Quoted', validUntil: 'Valid until',
    workflow: 'Quote workflow', current: 'Current state', details: 'Technical brief', back: 'Back to requests',
    startReview: 'Start technical review', startingReview: 'Starting review…', reviewIntro: 'This moves the request into review and records the action in its history. ', viewActivity: 'View full history',
    reviewStarted: 'Review started and recorded.', reviewBy: 'Review started by', reviewActionError: 'We could not start the review. Reload the request and try again.',
    types: { FILE: '3D file', DESIGN_HELP: 'Design help' },
    statuses: { PENDING_QUOTE: 'Pending quote', IN_REVIEW: 'Under review', QUOTED: 'Quoted', AWAITING_APPROVAL: 'Awaiting approval', APPROVED: 'Approved', PAID: 'Paid', REJECTED: 'Rejected', EXPIRED: 'Expired', CANCELLED: 'Cancelled' },
    waitingNote: 'The next step depends on a technical review. This screen does not generate a price.',
    noQuote: 'No final quote is recorded yet.', noQuoteForStatus: 'This status does not show a quote price.', legacyTitle: 'Record outside the current workflow',
    legacyDescription: status => `The record arrived as “${status}”, a status not covered by the current workflow. It is kept as received and separated from current stages and metrics.`,
    flowSteps: ['Pending', 'Review', 'Quoted', 'Approval', 'Approved', 'Paid'],
  },
};

const phaseKeys = ['all', ...REQUEST_PHASES, 'legacy'];
const phaseLabel = (text, phase) => text[phase] || text.legacy;
const FLOW = ['PENDING_QUOTE', 'IN_REVIEW', 'QUOTED', 'AWAITING_APPROVAL', 'APPROVED', 'PAID'];
const QUOTED_STATES = new Set(['QUOTED', 'AWAITING_APPROVAL', 'APPROVED', 'PAID']);

function formatDate(value, language) {
  const date = new Date(value);
  if (!value || !Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium' }).format(date);
}

function RequestDistribution({ requests, phase, onPhaseChange, text }) {
  const counts = useMemo(() => summarizeRequestPhases(requests), [requests]);
  const total = REQUEST_PHASES.reduce((sum, key) => sum + counts[key], 0);
  const circumference = 2 * Math.PI * 42;
  const segments = REQUEST_PHASES.map((key, index) => {
    const length = total ? counts[key] / total * circumference : 0;
    const offset = REQUEST_PHASES.slice(0, index).reduce((sum, previous) => sum + (total ? counts[previous] / total * circumference : 0), 0);
    return { key, length: Math.max(0, length - (counts[key] ? 3 : 0)), offset, count: counts[key] };
  });

  return (
    <section className="admin-request-map" aria-labelledby="admin-request-map-title">
      <div className="admin-request-map__heading">
        <div><span className="admin-eyebrow">01 / {text.distribution}</span><h2 id="admin-request-map-title">{text.distribution}</h2></div>
        <p>{text.distributionHint(total)}</p>
      </div>
      {total === 0 ? <div className="admin-request-map__empty" aria-live="polite">{text.empty}</div> : (
        <div className="admin-request-map__body">
          <div className="admin-donut-wrap">
            <svg className="admin-donut" viewBox="0 0 100 100" role="img" aria-labelledby="admin-donut-title admin-donut-description">
              <title id="admin-donut-title">{text.distribution}</title>
              <desc id="admin-donut-description">{text.distributionHint(total)}</desc>
              <circle className="admin-donut__track" cx="50" cy="50" r="42" />
              {segments.map(segment => <circle key={segment.key} className={`admin-donut__segment admin-donut__segment--${segment.key}`} cx="50" cy="50" r="42"
                strokeDasharray={`${segment.length} ${circumference}`} strokeDashoffset={-segment.offset} style={{ '--segment-delay': `${REQUEST_PHASES.indexOf(segment.key) * 90}ms`, '--donut-circumference': circumference, '--donut-end': -segment.offset }} />)}
            </svg>
            <div className="admin-donut__center" aria-hidden="true"><strong>{total}</strong><span>{text.request}</span></div>
          </div>
          <div className="admin-request-map__legend" role="group" aria-label={text.distribution}>
            {segments.map(segment => <button key={segment.key} type="button" className={`admin-legend-choice${phase.includes(segment.key) ? ' is-active' : ''}`}
              aria-pressed={phase.includes(segment.key)} onClick={() => onPhaseChange(segment.key)}>
              <span className={`admin-legend-dot admin-legend-dot--${segment.key}`} aria-hidden="true" />
              <span>{phaseLabel(text, segment.key)}</span><strong>{segment.count}</strong>
            </button>)}
          </div>
        </div>
      )}
    </section>
  );
}

export function AdminRequestsPage() {
  const { language } = usePreferences();
  const text = words[language];
  const { status, requests, retry } = useAdminRequests();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const phases = searchParams.getAll('fase').filter(value => value !== 'all' && phaseKeys.includes(value));
  const phase = phases.length === 1 ? phases[0] : 'all';
  const officialRequests = requests.filter(request => request.phase !== 'legacy');
  const legacyRequests = requests.filter(request => request.phase === 'legacy');
  const legacyCount = legacyRequests.length;
  const legacyStatuses = [...new Set(legacyRequests.map(request => request.status))].join(', ');
  const filtered = filterAdminRequests(requests, phases, search);
  const choosePhase = value => setSearchParams(toggleFacetParams(searchParams, 'fase', value));

  return (
    <section className="admin-requests-page" aria-labelledby="admin-requests-title" aria-busy={status === 'loading'}>
      <header className="admin-page-heading admin-requests-heading">
        <div><span className="admin-eyebrow">{text.source}</span><h1 id="admin-requests-title">{text.title}</h1><p>{text.intro}</p></div>
        <span className="admin-request-total"><strong>{officialRequests.length}</strong><span>{text.distributionHint(officialRequests.length)}</span></span>
      </header>

      {status === 'loading' && <div className="admin-request-loading" role="status" aria-label={text.loading}>{[1, 2].map(i => <Skeleton key={i} />)}</div>}
      {status === 'error' && <ErrorState title={text.errorTitle} description={text.errorText} onRetry={retry} retryLabel={text.retry} />}
      {status === 'success' && <>
        <RequestDistribution requests={officialRequests} phase={phases} onPhaseChange={choosePhase} text={text} />
        <FilterChips label={text.searchLabel} selected={phases} onToggle={choosePhase} options={['all', 'legacy'].map(value => ({ value, label: phaseLabel(text, value) }))} />
        {legacyCount > 0 && <div className="admin-legacy-strip"><span className="admin-legacy-strip__mark" aria-hidden="true">!</span>
          <p><strong>{text.legacySummary(legacyCount)}</strong><span> {text.legacyDescription(legacyStatuses)}</span></p>
          <button type="button" onClick={() => choosePhase('legacy')} aria-pressed={phase === 'legacy'}>{text.legacyView} →</button>
        </div>}
        <section className="admin-request-inbox" aria-labelledby="admin-request-inbox-title">
          <header className="admin-request-inbox__heading"><div><span className="admin-eyebrow">02 / {text.request}</span><h2 id="admin-request-inbox-title">{phases.length > 1 ? phases.map(value => phaseLabel(text, value)).join(' + ') : phaseLabel(text, phase)}</h2></div>
            <label className="admin-request-search"><span>{text.searchLabel}</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={text.searchPlaceholder} /></label>
          </header>
          <p className="admin-request-results" role="status" aria-live="polite">{text.results(filtered.length)}</p>
          {filtered.length === 0 ? <EmptyState title={search ? text.noMatch : text.empty} /> : (
            <ul className="admin-request-cards" key={`${phase}-${search}`}>
              {filtered.map((request, index) => <li key={request.id} style={{ '--row-index': index }}>
                <Link className="admin-request-card" to={`/admin/solicitudes/${encodeURIComponent(request.id)}`}>
                  <span className="admin-request-card__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className="admin-request-card__main"><span className="admin-request-card__title">{request.fileName || request.description || `${text.request} ${request.id}`}</span>
                    <span className="admin-request-card__meta">{request.id} <i aria-hidden="true">·</i> {request.customerName || text.customerUnknown} <i aria-hidden="true">·</i> {request.material || '—'} <i aria-hidden="true">·</i> {request.quantity ?? '—'} {text.quantity.toLocaleLowerCase()}</span></span>
                  <span className="admin-state" data-status={request.status}>{text.statuses[request.status] || request.status}</span>
                  <span className="admin-request-card__date"><span>{text.received}</span>{formatDate(request.submittedAt, language)}</span>
                  <span className="admin-request-card__arrow" aria-hidden="true">↗</span>
                </Link>
              </li>)}
            </ul>
          )}
        </section>
      </>}
    </section>
  );
}

export function AdminRequestDetailPage() {
  const { language } = usePreferences();
  const auth = useAuth();
  const user = auth?.user;
  const text = words[language];
  const { status, requests, retry } = useAdminRequests();
  const [reviewAction, setReviewAction] = useState({ status: 'idle', message: '' });
  const { id } = useParams();
  const request = requests.find(item => String(item.id) === id);
  const activeIndex = request ? FLOW.indexOf(request.status) : -1;
  const showsQuote = request && QUOTED_STATES.has(request.status)
    && typeof request.quotedPrice === 'number' && request.currency === 'CRC';
  const phaseIsLegacy = request?.phase === 'legacy';

  async function beginReview() {
    if (!request || request.status !== 'PENDING_QUOTE' || user?.role !== 'admin' || reviewAction.status === 'loading') return;
    setReviewAction({ status: 'loading', message: '' });
    try {
      await startRequestReview({ requestId: request.id, actorId: user.id, ...(auth?.token ? { token: auth.token } : {}) });
      setReviewAction({ status: 'success', message: text.reviewStarted });
      retry();
    } catch (error) {
      const message = error.code === 'STATUS_CONFLICT'
        ? (language === 'es' ? 'El estado cambió desde que abriste esta solicitud. Actualizá la vista.' : 'The request changed since you opened it. Refresh this view.')
        : error.code === 'ADMIN_REQUIRED'
          ? (language === 'es' ? 'Tu sesión no tiene permiso para iniciar la revisión.' : 'Your session cannot start this review.')
          : error.code === 'REQUEST_NOT_FOUND'
            ? (language === 'es' ? 'La solicitud ya no existe.' : 'This request no longer exists.')
            : text.reviewActionError;
      setReviewAction({ status: 'error', message });
    }
  }

  const reviewStartedLabel = request?.reviewStartedAt
    ? `${text.reviewBy} ${request.reviewStartedByName || text.customerUnknown} · ${new Intl.DateTimeFormat(language === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(request.reviewStartedAt))}`
    : null;

  return (
    <section className="admin-request-detail" aria-labelledby="admin-request-detail-title" aria-busy={status === 'loading'}>
      <Link className="admin-request-back" to="/admin/solicitudes">← {text.back}</Link>
      {status === 'loading' && <div role="status" aria-label={text.loading}><Skeleton className="admin-detail-skeleton" /></div>}
      {status === 'error' && <ErrorState title={text.errorTitle} description={text.errorText} onRetry={retry} retryLabel={text.retry} />}
      {status === 'success' && !request && <EmptyState title={text.noRequest} />}
      {status === 'success' && request && <>
        {reviewAction.status === 'success' && <p className="admin-action-feedback" role="status">{reviewAction.message}</p>}
        {reviewAction.status === 'error' && <p className="admin-action-feedback" role="alert">{reviewAction.message}</p>}
        <header className="admin-request-detail__heading">
          <div><span className="admin-eyebrow">{text.request} / {request.id}</span><h1 id="admin-request-detail-title">{request.fileName || request.description || request.id}</h1>
            <p>{request.customerName || text.customerUnknown} <span aria-hidden="true">·</span> {formatDate(request.submittedAt, language)}</p></div>
          <span className="admin-state" data-status={request.status}>{text.statuses[request.status] || request.status}</span>
        </header>
        {['SUBMITTED', 'PENDING_QUOTE', 'IN_REVIEW', 'QUOTED', 'AWAITING_APPROVAL', 'APPROVED', 'PAID'].includes(request.status) && <RequestNextAction key={`${request.id}-${request.updatedAt || request.status}`} request={request} user={user} language={language} onSaved={retry} />}
        {phaseIsLegacy ? <aside className="admin-detail-legacy" role="status"><strong>{text.legacyTitle}</strong><p>{text.legacyDescription(request.status)}</p></aside> : (
          <>
          {request.status === 'PENDING_QUOTE' && user?.role === 'admin' && <div className="admin-review-action">
            <p>{text.reviewIntro}<strong>{user.name}</strong></p>
            <Button loading={reviewAction.status === 'loading'} loadingLabel={text.startingReview} onClick={beginReview}>{text.startReview}</Button>
          </div>}
          <section className="admin-request-workflow" aria-labelledby="admin-workflow-title">
            <div className="admin-request-workflow__heading"><div><span className="admin-eyebrow">03 / {text.current}</span><h2 id="admin-workflow-title">{text.workflow}</h2></div>
              <span className="admin-state" data-status={request.status}>{text.statuses[request.status]}</span></div>
            {activeIndex >= 0 ? <ol className="admin-workflow-steps" aria-label={text.workflow}>
              {FLOW.map((step, index) => <li key={step} className={index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : ''}
                aria-current={index === activeIndex ? 'step' : undefined} style={{ '--step-index': index }}>
                <span className="admin-workflow-steps__mark" aria-hidden="true">{index < activeIndex ? '✓' : String(index + 1).padStart(2, '0')}</span><span>{text.flowSteps[index]}</span>
              </li>)}
            </ol> : <p className="admin-request-workflow__terminal">{text.statuses[request.status] || request.status}</p>}
            {reviewStartedLabel && <p className="admin-review-activity">{reviewStartedLabel} · <Link to={`/admin/actividad?solicitud=${encodeURIComponent(request.id)}`}>{text.viewActivity}</Link></p>}
          </section>
          </>
        )}
        <div className="admin-request-detail__grid">
          <section className="admin-detail-panel" aria-labelledby="admin-detail-brief-title"><span className="admin-eyebrow">04 / {text.details}</span><h2 id="admin-detail-brief-title">{text.details}</h2>
            <dl><div><dt>{text.customerLabel}</dt><dd>{request.customerName || text.customerUnknown}</dd></div>
              <div><dt>{text.sourceType}</dt><dd>{text.types[request.sourceType] || request.sourceType || '—'}</dd></div>
              <div><dt>{text.material}</dt><dd>{request.material || '—'}</dd></div>
              <div><dt>{text.quantity}</dt><dd>{request.quantity ?? '—'}</dd></div>
              {request.fileName && <div><dt>{text.file}</dt><dd className="admin-detail-file">{request.fileName}</dd></div>}
              {request.description && <div className="admin-detail-description"><dt>{text.description}</dt><dd>{request.description}</dd></div>}
              {request.intendedUse && <div><dt>{language === 'es' ? 'Uso previsto' : 'Intended use'}</dt><dd>{request.intendedUse}</dd></div>}
              {request.dimensions && <div><dt>{language === 'es' ? 'Medidas declaradas' : 'Stated dimensions'}</dt><dd>{request.dimensions}</dd></div>}
              {request.needsDesign && <div><dt>{language === 'es' ? 'Diseño' : 'Design'}</dt><dd>{language === 'es' ? 'Solicita ayuda con el diseño' : 'Design assistance requested'}</dd></div>}
              {request.referenceUrl && <div><dt>{language === 'es' ? 'Enlace de referencia' : 'Reference link'}</dt><dd><a href={request.referenceUrl} target="_blank" rel="noreferrer">{request.referenceUrl} ↗</a></dd></div>}
              {request.attachments?.length > 0 && <div className="admin-detail-description"><dt>{language === 'es' ? 'Fotos y archivos recibidos' : 'Received photos and files'}</dt><dd><ul className="admin-request-attachments">{request.attachments.map(attachment => <RequestAttachment key={attachment.id} requestId={request.id} attachment={attachment} token={auth?.token} language={language} />)}</ul></dd></div>}
              <div><dt>{text.received}</dt><dd>{formatDate(request.submittedAt, language)}</dd></div>
            </dl>
          </section>
          <aside className="admin-quote-panel" aria-labelledby="admin-quote-title"><span className="admin-eyebrow">05 / {text.quote}</span><h2 id="admin-quote-title">{text.quote}</h2>
            {showsQuote ? <><strong className="admin-quote-panel__amount">{formatCRC(request.quotedPrice)}</strong>
              {request.quotedAt && <p>{text.quoteDate}: {formatDate(request.quotedAt, language)}</p>}{request.quoteValidUntil && <p>{text.validUntil}: {formatDate(request.quoteValidUntil, language)}</p>}</>
          : <p>{['PENDING_QUOTE', 'IN_REVIEW'].includes(request.status) ? text.noQuote : text.noQuoteForStatus}</p>}
            {['PENDING_QUOTE', 'IN_REVIEW'].includes(request.status) && <p className="admin-quote-panel__note">{text.waitingNote}</p>}
          </aside>
        </div>
      </>}
    </section>
  );
}
