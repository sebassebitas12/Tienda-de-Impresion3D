import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';

export function QuoteFulfillment({ request, language, onSaved }) {
  const auth = useAuth();
  const [reference, setReference] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const es = language === 'es';
  const demo = request.quotePricing?.mode === 'DEMO';
  if (request.orderId) return <Link className="admin-action-primary" to={`/admin/pedidos/${request.orderId}`}>{es ? 'Abrir pedido vinculado' : 'Open linked order'} ↗</Link>;
  if (request.status !== 'APPROVED' || !request.quotePricing) return null;
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await automationAction('/admin/actions/quote-fulfillment', { requestId: request.id, expectedVersion: request.quoteVersion,
        mode: demo ? 'DEMO' : 'MANUAL_VERIFIED', reference, confirmed }, { token: auth?.token });
      onSaved();
    } catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <form className="admin-order-actions" onSubmit={save}><h2>{es ? 'Del encargo al pedido' : 'From quote to order'}</h2>
    <p>{demo ? (es ? 'Recorrido académico: se simula el pago y se crea un pedido DEMO. No se registra un cobro real ni se ordena fabricación física.' : 'Academic flow: simulate payment and create a DEMO order. No real charge or physical production is recorded.') : (es ? 'Registrá únicamente un pago que verificaste fuera del sistema. No se carga dinero a ningún medio de pago.' : 'Record only a payment verified outside this system. No payment method is charged.')}</p>
    {!demo && <><label>{es ? 'Referencia del comprobante' : 'Payment evidence reference'}<input required minLength={4} maxLength={200} value={reference} onChange={event => setReference(event.target.value)} /></label><label><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />{es ? 'Verifiqué el comprobante y el monto completo' : 'I verified the evidence and full amount'}</label></>}
    <button type="submit" className="v-button v-button--primary" disabled={busy}>{demo ? (es ? 'Simular pago y crear pedido DEMO' : 'Simulate payment and create DEMO order') : (es ? 'Registrar pago verificado y crear pedido' : 'Record verified payment and create order')}</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
