import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendQuoteEmail, transitionRequest } from '../../services/adminActionsService.js';
import { formatCRC } from '../../utils/money.js';
import { isDeliverableEmail } from '../../utils/emailAddress.js';
import { useAuth } from '../../hooks/useAuth.js';
import { AutomaticQuote } from './AutomaticQuote.jsx';
import { QuoteFulfillment } from './QuoteFulfillment.jsx';

export function RequestNextAction({ request, user, language, onSaved }) {
  const auth = useAuth();
  const es = language === 'es';
  const [validUntil, setValidUntil] = useState(request.quoteValidUntil?.slice(0, 10) || '');
  const [notes, setNotes] = useState(request.quoteNotes || '');
  const [customPrice, setCustomPrice] = useState(request.quotedPrice || '');
  const [quoteMethod, setQuoteMethod] = useState(() => request.automationSource === 'DEMO_ENGINE'
    || request.quotePricing?.provenance?.slicing === 'DEMO_ANALOGUE' ? 'automatic' : 'manual');
  const [isEditingOverride, setIsEditingOverride] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const busy = status === 'loading';
  const editable = ['IN_REVIEW', 'QUOTED', 'CHANGES_REQUESTED'].includes(request.status);
  const editingQuote = request.status !== 'QUOTED' || isEditingOverride;

  if (user?.role !== 'admin') return null;

  const hasUnsavedManualChanges = editingQuote && quoteMethod === 'manual'
    && (validUntil !== (request.quoteValidUntil?.slice(0, 10) || '') || notes !== (request.quoteNotes || '') || Number(customPrice) !== Number(request.quotedPrice));

  const canSendQuote = isDeliverableEmail(request.customerEmail) && isDeliverableEmail(user.email)
    && Number.isSafeInteger(request.quotedPrice) && request.quotedPrice > 0 && request.currency === 'CRC'
    && Boolean(request.quoteNotes?.trim())
    && Boolean(request.quoteValidUntil)
    && !hasUnsavedManualChanges;

  async function act(action) {
    if (busy) return;
    setStatus('loading'); setMessage('');
    try {
      await transitionRequest({ requestId: request.id, actorId: user.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, action }, { token: auth?.token });
      setStatus('success');
      setMessage(action === 'reopen-review'
        ? (es ? 'Solicitud devuelta a revisión técnica.' : 'Request returned to technical review.')
        : (es ? 'Solicitud registrada para revisión.' : 'Request registered for review.'));
      onSaved();
    } catch (error) {
      setStatus('error');
      setMessage(error.code === 'STATUS_CONFLICT'
        ? (es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.')
        : (es ? 'No se pudo guardar. Revisá la conexión y volvé a intentar.' : 'Could not save. Check the connection and try again.'));
    }
  }

  async function sendQuote() {
    if (busy || request.status !== 'QUOTED' || !canSendQuote) return;
    setStatus('loading'); setMessage('');
    try {
      await sendQuoteEmail({ requestId: request.id, actorId: user.id, expectedVersion: request.quoteVersion || 0 }, { token: auth?.token });
      setStatus('success');
      setMessage(es ? 'Correo enviado al cliente con copia oculta al taller. Ahora esperamos la decisión del cliente en su cuenta.' : 'Quote emailed to the customer with a copy to the workshop. The customer’s decision in their account is next.');
      onSaved();
    } catch (error) {
      const copy = {
        QUOTE_EMAIL_NOT_CONFIGURED: es ? 'El envío no está conectado. Revisá el webhook de cotizaciones y la credencial Gmail en n8n.' : 'Email delivery is not connected. Check the quote webhook and Gmail credential in n8n.',
        QUOTE_EMAIL_RECIPIENT_INVALID: es ? 'No se envió: falta un correo válido del cliente o del taller. Corregí los datos antes de intentarlo.' : 'Not sent: the customer or workshop email is invalid. Correct the details before retrying.',
        QUOTE_EXPIRED: es ? 'La vigencia terminó. Actualizá la fecha y guardá una nueva versión antes de enviarla.' : 'This quote has expired. Update its validity and save a new version before sending.',
        QUOTE_EMAIL_DELIVERY_FAILED: es ? 'n8n no confirmó el envío. Revisá sus ejecuciones antes de volver a intentar.' : 'n8n did not confirm delivery. Check its executions before retrying.',
        QUOTE_EMAIL_SENT_BUT_NOT_RECORDED: es ? 'El correo pudo salir, pero no se guardó el historial. Revisá Gmail antes de reintentar para evitar duplicados.' : 'The email may have been sent, but its history was not saved. Check Gmail before retrying to avoid duplicates.',
        STATUS_CONFLICT: es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.',
        QUOTE_EMAIL_DELIVERY_UNCERTAIN: es ? 'No se confirmó la entrega. Revisá n8n y Gmail antes de repetir; podría haberse enviado.' : 'Delivery is uncertain. Check n8n and Gmail before retrying; it may have been sent.',
      };
      setStatus('error');
      setMessage(copy[error.code] || (es ? 'No se pudo enviar. La cotización permanece guardada.' : 'Could not send. The quote remains saved.'));
    }
  }

  async function saveCustomQuote(event) {
    event.preventDefault();
    if (busy) return;
    setStatus('loading'); setMessage('');
    try {
      await transitionRequest({ requestId: request.id, actorId: user.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, action: 'save-custom-quote', quotedPrice: Number(customPrice), validUntil, notes }, { token: auth?.token });
      setStatus('success');
      setMessage(es ? 'Cotización manual guardada. Revisá el resumen y luego enviala al cliente.' : 'Manual quote saved. Review the summary, then email it to the customer.');
      setIsEditingOverride(false);
      onSaved();
    } catch (error) {
      setStatus('error');
      setMessage(error.code === 'INVALID_QUOTE'
        ? (es ? 'Ingresá un monto entero, condiciones claras y una fecha futura.' : 'Enter a whole amount, clear terms and a future validity date.')
        : error.code === 'STATUS_CONFLICT' ? (es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.')
          : (es ? 'No se pudo guardar. Revisá la conexión y volvé a intentar.' : 'Could not save. Check the connection and retry.'));
    }
  }

  return <section className="admin-next-action" aria-labelledby="request-next-title" aria-busy={busy}>
    <header><span className="admin-eyebrow">{es ? 'Tu siguiente paso' : 'Your next step'}</span><h2 id="request-next-title">
      {request.status === 'QUOTED' ? (es ? 'Cotización lista para enviar' : 'Quote ready to email')
        : editable ? (es ? 'Prepará la cotización' : 'Prepare the quote')
          : request.status === 'SUBMITTED' ? (es ? 'Incorporar solicitud recibida' : 'Register received request')
            : (es ? 'Seguimiento del encargo' : 'Job follow-up')}
    </h2></header>
    {request.status === 'SUBMITTED' && <><p>{es ? 'Esta solicitud tiene un estado anterior. Registrala como pendiente para iniciar la revisión; el historial conservará el estado original.' : 'This request uses a legacy status. Register it as pending to begin review; its history will preserve the original status.'}</p>
      <button className="v-button v-button--primary" disabled={busy} onClick={() => act('incorporate-request')}>{es ? 'Registrar y revisar' : 'Register and review'}</button></>}
    {request.status === 'QUOTED' && <div className="admin-quote-send">
      <span className="admin-eyebrow">{es ? 'Siguiente paso · enviar cotización' : 'Next step · email the quote'}</span>
      <div className="admin-quote-send__summary">
        <p><strong>{es ? 'Total:' : 'Total:'}</strong> {formatCRC(request.quotedPrice)}</p>
        {request.quoteValidUntil && <p><strong>{es ? 'Válida hasta:' : 'Valid until:'}</strong> {request.quoteValidUntil.slice(0, 10)}</p>}
        {request.quoteNotes && <p><strong>{es ? 'Alcance:' : 'Scope:'}</strong> {request.quoteNotes}</p>}
      </div>
      <p>{es ? 'Se enviará al correo registrado del cliente y recibirás una copia. Al confirmar la entrega, la solicitud pasará a «Esperando aprobación». El cliente decide en su cuenta; vos no aprobás en su nombre.' : 'It will go to the customer’s registered email and you will receive a copy. Once delivery is confirmed, the request moves to “Awaiting approval”. The customer decides in their account.'}</p>
      <p className="admin-quote-send__recipients">{es ? <>Para: {request.customerEmail || 'correo no registrado'}<br />Copia oculta: {user.email}</> : <>To: {request.customerEmail || 'email not recorded'}<br />BCC: {user.email}</>}</p>
      {(!isDeliverableEmail(request.customerEmail) || !isDeliverableEmail(user.email)) && <p className="admin-quote-send__warning">{es ? 'El cliente o el taller contienen correos de ejemplo o inválidos; corregilos antes de enviar.' : 'Email delivery is blocked until both addresses are valid.'}</p>}
      <div className="admin-quote-send__actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button className="v-button v-button--primary" type="button" disabled={busy || !canSendQuote} onClick={sendQuote}>{busy ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar cotización al cliente' : 'Email quote to customer')}</button>
        <button className="v-button v-button--ghost" type="button" disabled={busy} onClick={() => act('reopen-review')}>{es ? 'Volver a revisión' : 'Return to review'}</button>
      </div>
    </div>}
    {request.status === 'CHANGES_REQUESTED' && <aside className="admin-quote-send__summary"><h3>{es ? 'El cliente pidió cambios' : 'Customer requested changes'}</h3><p>{request.customerDecisionReason || (es ? 'No indicó un motivo.' : 'No reason was provided.')}</p><p>{es ? `Prepará la versión ${(request.quoteVersion || 0) + 1}; luego se enviará al cliente para una nueva decisión.` : `Prepare version ${(request.quoteVersion || 0) + 1}; it will then be emailed for a new decision.`}</p></aside>}
    {editable && <>
      {request.status === 'QUOTED' && !editingQuote && <button className="v-button v-button--secondary" type="button" disabled={busy} onClick={() => setIsEditingOverride(true)}>{es ? 'Editar cotización' : 'Edit quote'}</button>}
      {request.status === 'QUOTED' && editingQuote && <button className="v-button v-button--ghost" type="button" disabled={busy} onClick={() => setIsEditingOverride(false)} style={{ marginBlock: '0.75rem' }}>{es ? 'Ocultar edición' : 'Hide edit'}</button>}
      {editingQuote && <section className="admin-quote-methods" aria-labelledby="admin-quote-method-title">
        <fieldset>
          <legend id="admin-quote-method-title">{es ? 'Elegí cómo preparar el precio' : 'Choose how to prepare the price'}</legend>
          <label><input type="radio" name="quote-method" value="manual" checked={quoteMethod === 'manual'} onChange={() => setQuoteMethod('manual')} disabled={busy} /> {es ? 'Manual' : 'Manual'}</label>
          <label><input type="radio" name="quote-method" value="automatic" checked={quoteMethod === 'automatic'} onChange={() => setQuoteMethod('automatic')} disabled={busy} /> {es ? 'Automatizada' : 'Automated'}</label>
        </fieldset>
        {quoteMethod === 'manual' ? <form className="admin-custom-quote-form" onSubmit={saveCustomQuote}>
          <span className="admin-eyebrow">{es ? 'COTIZACIÓN MANUAL' : 'MANUAL QUOTE'}</span>
          <p>{es ? 'Definí el total y qué incluye el encargo. No necesita existir en el catálogo.' : 'Set the total and what the job includes. It does not need to exist in the catalog.'}</p>
          <label>{es ? 'Monto total (CRC)' : 'Total amount (CRC)'}<input type="number" inputMode="numeric" min="1" max="1000000000" step="1" required value={customPrice} onChange={event => setCustomPrice(event.target.value)} disabled={busy} /></label>
          <label className="admin-quote-notes">{es ? 'Qué incluye y condiciones' : 'Scope and terms'}<textarea required maxLength={2000} rows={3} value={notes} onChange={event => setNotes(event.target.value)} disabled={busy} /></label>
          <label className="admin-quote-validity">{es ? 'Válida hasta' : 'Valid until'}<input type="date" required value={validUntil} onChange={event => setValidUntil(event.target.value)} disabled={busy} /></label>
          <div className="admin-next-action__buttons"><button className="v-button v-button--primary" disabled={busy} type="submit">{busy ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Guardar y continuar' : 'Save and continue')}</button></div>
        </form> : <div className="admin-quote-automated">
          <p>{es ? 'La herramienta prepara una estimación con un perfil análogo. Revisá el material y los supuestos antes de enviarla; no mide imágenes ni archivos 3D.' : 'The tool prepares an estimate from an analogous profile. Review its material and assumptions before sending; it does not measure images or 3D files.'}</p>
          <AutomaticQuote request={request} onSaved={() => { setIsEditingOverride(false); onSaved(); }} language={language} />
        </div>}
      </section>}
    </>}
    <QuoteFulfillment request={request} language={language} />
    {request.status === 'AWAITING_APPROVAL' && <p>{request.quoteEmailSentAt
      ? (es ? `Correo confirmado para ${request.quoteEmailSentTo || 'el cliente'}; copia al taller: ${request.quoteEmailCopiedTo || 'registrada'}. El cliente aprueba o pide cambios en su cuenta.` : `Email confirmed for ${request.quoteEmailSentTo || 'the customer'}; workshop copy: ${request.quoteEmailCopiedTo || 'recorded'}. The customer approves or requests changes in their account.`)
      : (es ? 'El cliente recibe una cotización por correo y decide en su cuenta. No aprobar en su nombre.' : 'The customer receives the quote by email and decides in their account. Do not approve on their behalf.')}</p>}
    {request.status === 'APPROVED' && <p>{es ? 'El cliente aprobó el total. El siguiente paso es pagar desde el checkout del encargo; todavía no comienza producción.' : 'The customer approved the total. Next, they pay through the job checkout; production has not started.'}</p>}
    {request.status === 'PAID' && <p>{es ? 'Pago registrado. Revisá el pedido vinculado y continuá con el seguimiento del taller.' : 'Payment recorded. Review the linked order and continue workshop tracking.'}</p>}
    {status !== 'idle' && message && <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
    <Link className="admin-action-secondary" to={`/admin/actividad?solicitud=${encodeURIComponent(request.id)}`}>{es ? 'Ver historial del encargo' : 'View job history'} ↗</Link>
  </section>;
}
