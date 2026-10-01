import { useState } from 'react';
import { Link } from 'react-router-dom';
import { transitionRequest } from '../../services/adminActionsService.js';
import { formatCRC } from '../../utils/money.js';

export function RequestNextAction({ request, user, language, onSaved }) {
  const es = language === 'es';
  const [amount, setAmount] = useState(request.quotedPrice ?? '');
  const [validUntil, setValidUntil] = useState(request.quoteValidUntil?.slice(0, 10) || '');
  const [notes, setNotes] = useState(request.quoteNotes || '');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const busy = status === 'loading';
  async function act(action) {
    if (busy) return;
    setStatus('loading'); setMessage('');
    try {
      await transitionRequest({ requestId: request.id, actorId: user.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, action, amount: Number(amount), validUntil, notes });
      setStatus('success'); setMessage(es ? 'Cambio guardado en el historial.' : 'Change saved to the activity log.');
      onSaved();
    } catch (error) {
      setStatus('error');
      setMessage(error.code === 'INVALID_QUOTE'
        ? (es ? 'Revisá el monto total, el alcance y una fecha de vigencia futura antes de guardar o publicar.' : 'Check the total amount, scope and a future expiry date before saving or publishing.')
        : error.code === 'STATUS_CONFLICT' ? (es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.')
          : (es ? 'No se pudo guardar. Revisá la conexión y volvé a intentar.' : 'Could not save. Check your connection and try again.'));
    }
  }
  const editable = ['IN_REVIEW', 'QUOTED'].includes(request.status);
  if (user?.role !== 'admin') return null;
  return <section className="admin-next-action" aria-labelledby="request-next-title" aria-busy={busy}>
    <header><span className="admin-eyebrow">{es ? 'Tu siguiente paso' : 'Your next step'}</span><h2 id="request-next-title">
      {editable ? (es ? 'Prepará la cotización' : 'Prepare the quote') : request.status === 'SUBMITTED' ? (es ? 'Incorporar solicitud recibida' : 'Register received request') : (es ? 'Seguimiento del encargo' : 'Job follow-up')}
    </h2></header>
    {request.status === 'SUBMITTED' && <><p>{es ? 'Esta solicitud se recibió con una etiqueta antigua. Registrala como pendiente para poder iniciar su revisión. Se conservará el estado original en el historial.' : 'This request used an old label. Register it as pending to begin reviewing it. The original status will remain in its history.'}</p>
      <button className="v-button v-button--primary" disabled={busy} onClick={() => act('incorporate-request')}>{es ? 'Registrar como pendiente' : 'Register as pending'}</button></>}
    {editable && <form onSubmit={event => { event.preventDefault(); act('save-quote'); }}>
      <p>{es ? 'Ingresá el monto total y qué incluye el encargo después de la revisión técnica. Guardar deja la cotización preparada; publicarla la pone en espera de aprobación.' : 'Enter the total and job scope after technical review. Save prepares the quote; publishing moves it to customer approval.'}</p>
      <div className="admin-quote-fields"><label>{es ? 'Monto total del encargo (CRC)' : 'Total job amount (CRC)'}<input type="number" min="1" step="1" required value={amount} onChange={event => setAmount(event.target.value)} disabled={busy} /></label>
        <label>{es ? 'Válida hasta' : 'Valid until'}<input type="date" required value={validUntil} onChange={event => setValidUntil(event.target.value)} disabled={busy} /></label></div>
      <label>{es ? 'Alcance y condiciones' : 'Scope and terms'}<textarea required maxLength={2000} rows={3} value={notes} onChange={event => setNotes(event.target.value)} disabled={busy} /></label>
      <div className="admin-next-action__buttons"><button className="v-button v-button--primary" disabled={busy} type="submit">{busy ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Guardar cotización' : 'Save quote')}</button>
        {request.status === 'QUOTED' && <button className="v-button v-button--ghost" type="button" disabled={busy || String(amount) !== String(request.quotedPrice) || validUntil !== request.quoteValidUntil?.slice(0, 10) || notes !== (request.quoteNotes || '')} onClick={() => act('publish-quote')}>{es ? `Publicar ${formatCRC(request.quotedPrice)} para aprobación` : `Publish ${formatCRC(request.quotedPrice)} for approval`}</button>}</div>
    </form>}
    {request.status === 'AWAITING_APPROVAL' && <p>{es ? 'Cotización publicada. Ahora corresponde al cliente aprobarla; el administrador no aprueba en su nombre.' : 'Quote published. Customer approval is the next step; the administrator cannot approve on their behalf.'}</p>}
    {request.status === 'APPROVED' && <p>{es ? 'El cliente aprobó el encargo. El pago debe confirmarse con su comprobante antes de iniciar fabricación.' : 'The customer approved the job. Confirm payment against its receipt before starting production.'}</p>}
    {request.status === 'PAID' && <p>{es ? 'Pago registrado. Coordiná la fabricación según el alcance acordado.' : 'Payment recorded. Coordinate production according to the agreed scope.'}</p>}
    {status !== 'idle' && message && <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
    <Link className="admin-action-secondary" to={`/admin/actividad?solicitud=${encodeURIComponent(request.id)}`}>{es ? 'Ver historial del encargo' : 'View job history'} ↗</Link>
  </section>;
}
