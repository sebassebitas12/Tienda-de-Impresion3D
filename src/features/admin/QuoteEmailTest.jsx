import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { isDeliverableEmail } from '../../utils/emailAddress.js';

export function QuoteEmailTest({ request, language, onSaved }) {
  const auth = useAuth();
  const [recipient, setRecipient] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const es = language === 'es';
  if (request.status !== 'QUOTED' || request.quotePricing?.mode !== 'DEMO') return null;
  async function send(event) {
    event.preventDefault(); setBusy(true); setFeedback('');
    try {
      await automationAction('/admin/actions/send-quote-email', { requestId: request.id, actorId: auth?.user?.id,
        expectedStatus: 'QUOTED', expectedVersion: request.quoteVersion, testRecipient: recipient }, { token: auth?.token });
      setFeedback(es ? 'Gmail aceptó la prueba. No se envió al cliente ni se avanzó su solicitud.' : 'Gmail accepted the test. The customer was not emailed and the request stage was not changed.');
      onSaved();
    } catch (failure) { setFeedback(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <details className="admin-email-test"><summary>{es ? 'Probar correo conmigo · sin enviar al cliente' : 'Test email with me · do not email customer'}</summary>
    <p>{es ? 'Útil con cuentas demo. El correo llevará [DEMO] [PRUEBA] y solo llegará a la dirección que indiques. No cambia la etapa del encargo.' : 'Useful with demo accounts. The [DEMO] [PRUEBA] email goes only to your chosen address; the request stage stays unchanged.'}</p>
    <form onSubmit={send}><label>{es ? 'Mi correo real para la prueba' : 'My real email for the test'}<input type="email" required value={recipient} onChange={event => setRecipient(event.target.value)} disabled={busy} /></label><button type="submit" className="v-button v-button--ghost" disabled={busy || !isDeliverableEmail(recipient)}>{busy ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar prueba DEMO a este correo' : 'Send DEMO test to this email')}</button></form>
    {feedback && <p role="status">{feedback}</p>}
  </details>;
}
