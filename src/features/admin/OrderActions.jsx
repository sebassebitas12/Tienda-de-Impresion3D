import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';
import '../../pages/quotes.css';

const NEXT = { PENDING: 'CONFIRMED', CONFIRMED: 'IN_PRODUCTION', IN_PRODUCTION: 'READY', READY: 'SHIPPED', SHIPPED: 'DELIVERED' };
const LABEL = { CONFIRMED: 'Confirmar pedido', IN_PRODUCTION: 'Iniciar producción', READY: 'Marcar listo', SHIPPED: 'Marcar enviado', DELIVERED: 'Confirmar entrega', CANCELLED: 'Cancelar pedido' };
const LABEL_EN = { CONFIRMED: 'Confirm order', IN_PRODUCTION: 'Start production', READY: 'Mark ready', SHIPPED: 'Mark shipped', DELIVERED: 'Confirm delivery', CANCELLED: 'Cancel order' };

export function OrderActions({ order, onSaved, language }) {
  const auth = useAuth();
  const [confirm, setConfirm] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const actionsRef = useRef(null);
  const confirmControl = useRef(null);
  const rejectionField = useRef(null);
  const focusAfterClose = useRef('');
  const es = language === 'es';
  const closure = confirm === 'CANCELLED';

  useEffect(() => {
    if (confirm) {
      (closure ? rejectionField : confirmControl).current?.focus();
      return;
    }
    const selector = '[data-order-action="' + focusAfterClose.current + '"]';
    const target = focusAfterClose.current && actionsRef.current?.querySelector(selector);
    target?.focus?.();
    focusAfterClose.current = '';
  }, [closure, confirm]);

  useEffect(() => {
    if (!confirm) return undefined;
    function handleEscape(event) {
      if (event.key !== 'Escape' || busy) return;
      event.preventDefault();
      focusAfterClose.current = closure ? 'cancel' : 'advance';
      setConfirm('');
      setReason('');
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [busy, confirm, closure]);

  function openTransition(nextStatus, action) {
    focusAfterClose.current = action;
    setConfirm(nextStatus);
  }

  if (auth?.user?.role !== 'admin' || !NEXT[order.status]) return null;
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await automationAction('/admin/actions/order-transition', { orderId: String(order.id), expectedStatus: order.status,
        expectedUpdatedAt: order.updatedAt || null, nextStatus: confirm, reason }, { token: auth.token });
      setConfirm(''); onSaved();
    } catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }

  return <section className="admin-order-actions" ref={actionsRef}>
    <span className="admin-eyebrow">{es ? 'Acción operativa · con historial' : 'Operational action · audited'}</span>
    <h2>{es ? 'Avanzar el pedido' : 'Advance this order'}</h2>
    {order.status === 'PENDING' && order.paymentStatus !== 'PAID'
      ? <p className="admin-order-payment-warning">{es ? 'Pago DEMO pendiente: el cliente lo registra desde su cuenta. No se revisan comprobantes ni transferencias aquí.' : 'DEMO payment pending: the customer records it from their account. No receipts or bank transfers are reviewed here.'}</p>
      : <p>{es ? 'Actualizá la etapa después de completarla. Este cambio deja historial; no cobra dinero ni envía correos.' : 'Update the stage after completing it. This change is recorded; it does not charge money or send email.'}</p>}
    {!confirm ? (
      <div className="admin-next-action__buttons">
        {!(order.status === 'PENDING' && order.paymentStatus !== 'PAID') && <button className="v-button v-button--primary" data-order-action="advance" disabled={busy} onClick={() => openTransition(NEXT[order.status], 'advance')}>
          {(es ? LABEL : LABEL_EN)[NEXT[order.status]]}
        </button>}
        {['PENDING', 'CONFIRMED'].includes(order.status) && <button className="v-button v-button--ghost" data-order-action="cancel" disabled={busy} onClick={() => openTransition('CANCELLED', 'cancel')}>
          {es ? 'Cancelar pedido' : 'Cancel order'}
        </button>}
      </div>
    ) : (
      <form onSubmit={save}>
        <p>{(es ? LABEL : LABEL_EN)[confirm]} · {es ? 'Se guardará en el historial con tu usuario.' : 'This will be recorded in your name.'}</p>
        {closure && <label>{es ? 'Motivo de cancelación' : 'Cancellation reason'}<textarea ref={rejectionField} required minLength={3} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} /></label>}
        <div className="admin-next-action__buttons">
          <button type="submit" className="v-button v-button--primary" ref={confirmControl} disabled={busy}>{busy ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Confirmar cambio' : 'Confirm change')}</button>
          <button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => { focusAfterClose.current = closure ? 'cancel' : 'advance'; setConfirm(''); setReason(''); }}>{es ? 'Volver' : 'Back'}</button>
        </div>
      </form>
    )}
    {error && <p role="alert">{error}</p>}
  </section>;
}
