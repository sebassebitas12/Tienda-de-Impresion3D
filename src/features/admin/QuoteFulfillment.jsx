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
  return <form className="admin-order-actions" onSubmit={save}><h2>{es ? 'Inicialización de orden de taller' : 'Workshop order initialization'}</h2>
    <p>{demo ? (es ? 'Aprobación del cliente confirmada. Al inicializar la orden se programa la producción y se asigna al tablero de pedidos de taller.' : 'Customer approval confirmed. Initializing the order schedules production and assigns it to the workshop board.') : (es ? 'Registrá únicamente un pago verificado fuera del sistema. No se carga dinero a ningún medio de pago.' : 'Record only a payment verified outside this system. No payment method is charged.')}</p>
    {!demo && <><label>{es ? 'Referencia del comprobante' : 'Payment evidence reference'}<input required minLength={4} maxLength={200} value={reference} onChange={event => setReference(event.target.value)} /></label><label><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />{es ? 'Verifiqué el comprobante y el monto completo' : 'I verified the evidence and full amount'}</label></>}
    <button type="submit" className="v-button v-button--primary" disabled={busy}>{demo ? (es ? 'Inicializar orden de fabricación' : 'Initialize manufacturing order') : (es ? 'Registrar pago verificado y crear pedido' : 'Record verified payment and create order')}</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
