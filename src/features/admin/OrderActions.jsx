import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';
import '../../pages/quotes.css';

const NEXT = { PENDING: 'CONFIRMED', CONFIRMED: 'IN_PRODUCTION', IN_PRODUCTION: 'READY', READY: 'SHIPPED', SHIPPED: 'DELIVERED' };
const LABEL = { CONFIRMED: 'Confirmar pedido', IN_PRODUCTION: 'Iniciar producción', READY: 'Marcar listo', SHIPPED: 'Marcar enviado', DELIVERED: 'Confirmar entrega', CANCELLED: 'Cancelar pedido', REJECTED: 'Rechazar pedido' };
const LABEL_EN = { CONFIRMED: 'Confirm order', IN_PRODUCTION: 'Start production', READY: 'Mark ready', SHIPPED: 'Mark shipped', DELIVERED: 'Confirm delivery', CANCELLED: 'Cancel order', REJECTED: 'Reject order' };

export function OrderActions({ order, onSaved, language }) {
  const auth = useAuth();
  const [confirm, setConfirm] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const es = language === 'es';
  if (auth?.user?.role !== 'admin' || !NEXT[order.status]) return null;
  const closure = ['CANCELLED', 'REJECTED'].includes(confirm);
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await automationAction('/admin/actions/order-transition', { orderId: String(order.id), expectedStatus: order.status,
        expectedUpdatedAt: order.updatedAt || null, nextStatus: confirm, reason }, { token: auth.token });
      setConfirm(''); onSaved();
    } catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <section className="admin-order-actions"><span className="admin-eyebrow">{es ? 'Acción operativa · con historial' : 'Operational action · audited'}</span>
    <h2>{es ? 'Avanzar el pedido' : 'Advance this order'}</h2>
    <p>{es ? 'Actualizá solo después de completar la etapa. Esto no registra un cobro ni envía correos.' : 'Update only after completing the stage. This does not record payment or send emails.'}</p>
    {!confirm ? <div className="admin-next-action__buttons"><button className="v-button v-button--primary" onClick={() => setConfirm(NEXT[order.status])}>{(es ? LABEL : LABEL_EN)[NEXT[order.status]]}</button>
      {['PENDING', 'CONFIRMED'].includes(order.status) && <button className="v-button v-button--ghost" onClick={() => setConfirm('CANCELLED')}>{es ? 'Cancelar pedido' : 'Cancel order'}</button>}</div>
      : <form onSubmit={save}><p>{(es ? LABEL : LABEL_EN)[confirm]} · {es ? 'Se guardará en el historial con tu usuario.' : 'This will be recorded in your name.'}</p>
        {closure && <label>{es ? 'Motivo del cierre' : 'Closure reason'}<textarea required minLength={3} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} /></label>}
        <div className="admin-next-action__buttons"><button type="submit" className="v-button v-button--primary" disabled={busy}>{es ? 'Confirmar cambio' : 'Confirm change'}</button><button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => setConfirm('')}>{es ? 'Volver' : 'Back'}</button></div></form>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
