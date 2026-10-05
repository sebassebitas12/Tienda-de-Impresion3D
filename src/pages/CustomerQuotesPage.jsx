import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { formatCRC } from '../utils/money.js';
import './quotes.css';

export function CustomerQuotesPage() {
  const { user, token } = useAuth();
  const { language } = usePreferences();
  const location = useLocation();
  const es = language === 'es';
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ requests: [], loading: true, error: '' });
  const [submitting, setSubmitting] = useState(null);
  const [responseForm, setResponseForm] = useState({ requestId: '', decision: 'CHANGES_REQUESTED', reason: '' });
  const confirmation = location.state?.orderConfirmation;
  useEffect(() => {
    if (user?.role !== 'customer') return;
    const abort = new AbortController();
    automationAction('/quotes/mine', {}, { token, signal: abort.signal }).then(result => setState({ requests: result.requests, loading: false, error: '' }))
      .catch(failure => { if (failure.name !== 'AbortError') setState({ requests: [], loading: false, error: automationError(failure.code) }); });
    return () => abort.abort();
  }, [token, user?.role, version]);
  async function approve(request) {
    setSubmitting(request.id);
    try {
      await automationAction('/quotes/approve', { requestId: request.id, expectedVersion: request.quoteVersion }, { token });
      setVersion(value => value + 1);
    } catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setSubmitting(null); }
  }
  async function respond(request, event) {
    event.preventDefault();
    if (responseForm.requestId !== request.id) return;
    setSubmitting(request.id);
    try {
      await automationAction('/quotes/respond', {
        requestId: request.id, expectedVersion: request.quoteVersion,
        decision: responseForm.decision, reason: responseForm.reason,
      }, { token });
      setResponseForm({ requestId: '', decision: 'CHANGES_REQUESTED', reason: '' });
      setVersion(value => value + 1);
    } catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setSubmitting(null); }
  }
  const statusLabel = status => ({
    PENDING_QUOTE: es ? 'Por cotizar' : 'Awaiting quote', IN_REVIEW: es ? 'En revisión' : 'In review',
    QUOTED: es ? 'Cotizada' : 'Quoted', AWAITING_APPROVAL: es ? 'Esperando tu aprobación' : 'Awaiting your approval',
    APPROVED: es ? 'Aprobada' : 'Approved', CHANGES_REQUESTED: es ? 'Cambios solicitados' : 'Changes requested', PAID: es ? 'Pago registrado' : 'Payment recorded',
    REJECTED: es ? 'Rechazada' : 'Rejected', EXPIRED: es ? 'Vencida' : 'Expired', CANCELLED: es ? 'Cancelada' : 'Cancelled',
  })[status] || status;
  const amountLabel = es ? 'Monto cotizado' : 'Quoted amount';
  const breakdownLabels = es
    ? { materialCrc: 'Material', wearCrc: 'Desgaste', electricityCrc: 'Electricidad', postProcessCrc: 'Postprocesado', designCrc: 'Diseño', otherCostsCrc: 'Otros costos', costSubtotalCrc: 'Costo calculado' }
    : { materialCrc: 'Material', wearCrc: 'Wear', electricityCrc: 'Electricity', postProcessCrc: 'Post-processing', designCrc: 'Design', otherCostsCrc: 'Other costs', costSubtotalCrc: 'Calculated cost' };
  return <section className="quote-page"><header><span className="quote-eyebrow">{es ? 'Mi espacio' : 'My workspace'}</span><h1>{es ? 'Mis cotizaciones' : 'My quotes'}</h1><p>{user.name} · {es ? 'Solo vos aprobás el alcance de tus encargos.' : 'Only you approve the scope of your requests.'}</p></header>
    {confirmation && <p className="customer-order-confirmation" role="status">{es ? `Encargo ${confirmation.id} recibido. El taller lo revisará; todavía no se ha cobrado ni confirmado una fecha de entrega.` : `Order ${confirmation.id} received. The workshop will review it; no payment or delivery date has been confirmed.`} {formatCRC(confirmation.subtotalCrc)}</p>}
    {user.role === 'admin' ? <Link to="/admin">{es ? 'Abrir administración' : 'Open administration'}</Link> : <>
      {state.loading && <p role="status">{es ? 'Cargando…' : 'Loading…'}</p>}{state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && !state.requests.length && <p>{es ? 'Todavía no tenés solicitudes.' : 'You have no requests yet.'}</p>}
      <div className="customer-quotes">{state.requests.toSorted((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt))).map(request => <article className="customer-quote" key={request.id}>
        <header><div><span className="quote-eyebrow">{request.id}</span><h2>{request.quotePricing?.profile?.name || request.description || request.fileName}</h2></div><strong>{request.quotedPrice != null ? formatCRC(request.quotedPrice) : (es ? 'Sin cotizar' : 'Not quoted')}</strong></header>
        <p>{request.quantity} × {request.material}{request.status !== 'AWAITING_APPROVAL' ? ` · ${statusLabel(request.status)}` : ''}</p>{request.status !== 'AWAITING_APPROVAL' && request.quoteNotes && <p>{request.quoteNotes}</p>}
        {request.status === 'AWAITING_APPROVAL' && <section className="customer-quote__offer" aria-label={es ? 'Detalle de la cotización' : 'Quote details'}>
          <h3>{es ? 'Cotización recibida' : 'Quote received'}</h3>
          <p><strong>{amountLabel}: {formatCRC(request.quotedPrice)}</strong></p>
          {request.quoteValidUntil && <p>{es ? 'Válida hasta' : 'Valid until'}: <time dateTime={request.quoteValidUntil}>{request.quoteValidUntil.slice(0, 10)}</time></p>}
          {request.quoteNotes && <p>{request.quoteNotes}</p>}
          {request.quotePricing?.mode === 'DEMO' && <p className="quote-demo-disclaimer">{es ? 'Estimación DEMO: no es medición del archivo ni autoriza producción o cobro.' : 'DEMO estimate: not measured from the file and does not authorize production or payment.'}</p>}
          {request.quotePricing?.breakdown && <dl className="customer-quote__breakdown">{Object.entries(breakdownLabels).filter(([key]) => Number.isFinite(request.quotePricing.breakdown[key])).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{formatCRC(request.quotePricing.breakdown[key])}</dd></div>)}
            {Number.isFinite(request.quotePricing.breakdown.amountCrc) && Number.isFinite(request.quotePricing.breakdown.costSubtotalCrc) && <div><dt>{es ? `Recargo aplicado (${request.quotePricing.breakdown.markupPercent}%)` : `Applied markup (${request.quotePricing.breakdown.markupPercent}%)`}</dt><dd>{formatCRC(request.quotePricing.breakdown.amountCrc - request.quotePricing.breakdown.costSubtotalCrc)}</dd></div>}
            {Number.isFinite(request.quotePricing.breakdown.amountCrc) && <div className="customer-quote__breakdown-total"><dt>{es ? 'Total cotizado' : 'Quoted total'}</dt><dd>{formatCRC(request.quotePricing.breakdown.amountCrc)}</dd></div>}
          </dl>}
          <div className="customer-quote__actions">
            <button className="v-button v-button--primary" disabled={Boolean(submitting) || !(Date.parse(request.quoteValidUntil || '') > Date.now())} onClick={() => approve(request)}>{submitting === request.id ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Aprobar cotización' : 'Approve quote')}</button>
            <button className="v-button v-button--secondary" disabled={Boolean(submitting)} onClick={() => setResponseForm(current => current.requestId === request.id ? { requestId: '', decision: 'CHANGES_REQUESTED', reason: '' } : { requestId: request.id, decision: 'CHANGES_REQUESTED', reason: '' })}>{es ? 'Solicitar cambios / Rechazar' : 'Request changes / Reject'}</button>
          </div>
          {!(Date.parse(request.quoteValidUntil || '') > Date.now()) && <p role="status">{es ? 'La vigencia terminó. Ya no se puede aprobar esta versión; contactá al taller para renovarla.' : 'This quote has expired. This version can no longer be approved; contact the workshop to renew it.'}</p>}
          {responseForm.requestId === request.id && <form className="customer-quote__response" onSubmit={event => respond(request, event)}>
            <fieldset><legend>{es ? '¿Qué querés hacer?' : 'What would you like to do?'}</legend>
              <label><input type="radio" name={`decision-${request.id}`} value="CHANGES_REQUESTED" checked={responseForm.decision === 'CHANGES_REQUESTED'} onChange={() => setResponseForm(current => ({ ...current, decision: 'CHANGES_REQUESTED' }))} />{es ? 'Solicitar ajustes y una nueva revisión' : 'Request changes and a new review'}</label>
              <label><input type="radio" name={`decision-${request.id}`} value="REJECTED" checked={responseForm.decision === 'REJECTED'} onChange={() => setResponseForm(current => ({ ...current, decision: 'REJECTED' }))} />{es ? 'Rechazar esta cotización' : 'Reject this quote'}</label>
            </fieldset>
            <label>{es ? 'Motivo breve (obligatorio)' : 'Brief reason (required)'}<textarea required minLength="3" maxLength="500" value={responseForm.reason} onChange={event => setResponseForm(current => ({ ...current, reason: event.target.value }))} /></label>
            <button className="v-button v-button--primary" disabled={Boolean(submitting) || responseForm.reason.trim().length < 3}>{submitting === request.id ? (es ? 'Enviando…' : 'Sending…') : responseForm.decision === 'REJECTED' ? (es ? 'Confirmar rechazo' : 'Confirm rejection') : (es ? 'Enviar solicitud de cambios' : 'Send change request')}</button>
          </form>}
          <p>{es ? 'Tu respuesta queda registrada en la cuenta. Aprobar no confirma un pago ni inicia la producción automáticamente.' : 'Your response is recorded in your account. Approval does not confirm payment or automatically start production.'}</p>
        </section>}
        {request.status === 'APPROVED' && <p>{es ? 'Aprobación registrada. No se ha confirmado un pago ni iniciado producción automáticamente.' : 'Approval recorded. No payment or production has been confirmed automatically.'}</p>}
        {request.status === 'CHANGES_REQUESTED' && <p>{es ? 'El taller debe revisar tu comentario y preparar una respuesta. No se creó otro pedido.' : 'The workshop must review your comment and prepare a response. No new order was created.'} {request.customerDecisionReason}</p>}
      </article>)}</div><Link className="v-button v-button--secondary" to="/solicitud">{es ? 'Nueva cotización' : 'New quote'}</Link>
    </>}
  </section>;
}
