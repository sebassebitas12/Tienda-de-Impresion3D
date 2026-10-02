import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { formatCRC } from '../utils/money.js';
import './quotes.css';

export function CustomerQuotesPage() {
  const { user, token } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ requests: [], loading: true, error: '' });
  const [approving, setApproving] = useState(null);
  useEffect(() => {
    if (user?.role !== 'customer') return;
    const abort = new AbortController();
    automationAction('/quotes/mine', {}, { token, signal: abort.signal }).then(result => setState({ requests: result.requests, loading: false, error: '' }))
      .catch(failure => { if (failure.name !== 'AbortError') setState({ requests: [], loading: false, error: automationError(failure.code) }); });
    return () => abort.abort();
  }, [token, user?.role, version]);
  async function approve(request) {
    setApproving(request.id);
    try { await automationAction('/quotes/approve', { requestId: request.id, expectedVersion: request.quoteVersion }, { token }); setVersion(value => value + 1); }
    catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setApproving(null); }
  }
  const statusLabel = status => ({
    PENDING_QUOTE: es ? 'Por cotizar' : 'Awaiting quote', IN_REVIEW: es ? 'En revisión' : 'In review',
    QUOTED: es ? 'Cotizada' : 'Quoted', AWAITING_APPROVAL: es ? 'Esperando tu aprobación' : 'Awaiting your approval',
    APPROVED: es ? 'Aprobada' : 'Approved', PAID: es ? 'Pago registrado' : 'Payment recorded',
    REJECTED: es ? 'Rechazada' : 'Rejected', EXPIRED: es ? 'Vencida' : 'Expired', CANCELLED: es ? 'Cancelada' : 'Cancelled',
  })[status] || status;
  return <section className="quote-page"><header><span className="quote-eyebrow">{es ? 'Mi espacio' : 'My workspace'}</span><h1>{es ? 'Mis cotizaciones' : 'My quotes'}</h1><p>{user.name} · {es ? 'Solo vos aprobás el alcance de tus encargos.' : 'Only you approve the scope of your requests.'}</p></header>
    {user.role === 'admin' ? <Link to="/admin">{es ? 'Abrir administración' : 'Open administration'}</Link> : <>
      {state.loading && <p role="status">{es ? 'Cargando…' : 'Loading…'}</p>}{state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && !state.requests.length && <p>{es ? 'Todavía no tenés solicitudes.' : 'You have no requests yet.'}</p>}
      <div className="customer-quotes">{state.requests.toSorted((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt))).map(request => <article className="customer-quote" key={request.id}>
        <header><div><span className="quote-eyebrow">{request.id}</span><h2>{request.quotePricing?.profile?.name || request.description || request.fileName}</h2></div><strong>{request.quotedPrice ? formatCRC(request.quotedPrice) : (es ? 'Sin cotizar' : 'Not quoted')}</strong></header>
        <p>{request.quantity} × {request.material} · {statusLabel(request.status)}</p><p>{request.quoteNotes}</p>
        {request.quoteValidUntil && <p>{es ? 'Vigencia' : 'Validity'}: {request.quoteValidUntil.slice(0, 10)}</p>}
        {['QUOTED', 'AWAITING_APPROVAL'].includes(request.status) && <button className="v-button v-button--primary" disabled={Boolean(approving) || !(Date.parse(request.quoteValidUntil) > Date.now())} onClick={() => approve(request)}>{request.quotePricing?.mode === 'DEMO' ? (es ? 'Aprobar simulación DEMO' : 'Approve DEMO simulation') : (es ? 'Aprobar alcance y cotización' : 'Approve scope and quote')}</button>}
        {request.status === 'APPROVED' && <p>{es ? 'Aprobación registrada. No se ha confirmado un pago ni iniciado producción automáticamente.' : 'Approval recorded. No payment or production has been confirmed automatically.'}</p>}
      </article>)}</div><Link className="v-button v-button--secondary" to="/solicitud">{es ? 'Nueva cotización' : 'New quote'}</Link>
    </>}
  </section>;
}
