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
  const [rejectProof, setRejectProof] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
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
  async function handleVerify(decision) {
    setBusy(true); setError('');
    try {
      await automationAction('/admin/actions/verify-payment', {
        orderId: String(order.id),
        decision,
        expectedProofSubmittedAt: order.paymentProof?.submittedAt || null,
        ...(decision === 'REJECT' ? { notes: rejectReason } : {}),
      }, { token: auth.token });
      setRejectProof(false); setRejectReason(''); onSaved();
    } catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <section className="admin-order-actions"><span className="admin-eyebrow">{es ? 'Acción operativa · con historial' : 'Operational action · audited'}</span>
    {order.paymentProof && (
      <div className="admin-order-payment-proof-box">
        <span className="admin-eyebrow">{es ? 'Comprobante SINPE reportado por el cliente' : 'SINPE payment proof reported by customer'}</span>
        <div className="admin-order-payment-proof-grid">
          <div><strong>{es ? 'Referencia:' : 'Reference:'}</strong> #{order.paymentProof.referenceNumber}</div>
          <div><strong>{es ? 'Teléfono emisor:' : 'Sender phone:'}</strong> {order.paymentProof.sinpePhone}</div>
          {order.paymentProof.submittedAt && (
            <div><strong>{es ? 'Fecha reporte:' : 'Reported date:'}</strong> {order.paymentProof.submittedAt.slice(0, 16).replace('T', ' ')}</div>
          )}
          <div><strong>{es ? 'Estado comprobante:' : 'Proof status:'}</strong> <span className="customer-proof-status-pill">{order.paymentProof.status || 'SUBMITTED'}</span></div>
        </div>
        {order.paymentProof.proofNotes && (
          <p className="admin-order-payment-proof-notes"><strong>{es ? 'Notas del cliente:' : 'Customer notes:'}</strong> {order.paymentProof.proofNotes}</p>
        )}
        {order.status === 'PENDING' && order.paymentProof?.status === 'SUBMITTED' && (
          <div className="admin-order-payment-proof-actions" style={{ marginTop: '10px' }}>
            {!rejectProof ? (
              <div className="admin-next-action__buttons">
                <button type="button" className="v-button v-button--primary" disabled={busy} onClick={() => handleVerify('CONFIRM')}>
                  {es ? 'Confirmar pago y pedido' : 'Confirm payment and order'}
                </button>
                <button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => setRejectProof(true)}>
                  {es ? 'Observar / Rechazar comprobante' : 'Reject payment proof'}
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleVerify('REJECT'); }} style={{ display: 'grid', gap: '8px' }}>
                <label style={{ display: 'grid', gap: '4px', font: '12px var(--mono)' }}>
                  <span>{es ? 'Motivo de rechazo del comprobante (se mostrará al cliente):' : 'Rejection reason:'}</span>
                  <textarea required minLength={3} maxLength={500} placeholder={es ? 'Ej: Monto no acreditado en cuenta bancaria.' : 'e.g. Funds not found'} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                </label>
                <div className="admin-next-action__buttons">
                  <button type="submit" className="v-button v-button--primary" disabled={busy}>
                    {es ? 'Confirmar rechazo' : 'Confirm rejection'}
                  </button>
                  <button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => setRejectProof(false)}>
                    {es ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    )}
    <h2>{es ? 'Avanzar el pedido' : 'Advance this order'}</h2>
    {order.status === 'PENDING' && order.paymentStatus !== 'PAID' ? (
      <p className="admin-order-payment-warning" style={{ color: 'var(--lava)', font: '13px var(--mono)', margin: '8px 0' }}>
        {es ? 'Verificación requerida: Validá el comprobante de pago SINPE antes de poder confirmar el pedido.' : 'Verification required: Validate the SINPE payment proof before confirming the order.'}
      </p>
    ) : (
      <p>{es ? 'Actualizá solo después de completar la etapa. Esto no registra un cobro ni envía correos.' : 'Update only after completing the stage. This does not record payment or send emails.'}</p>
    )}
    {!confirm ? (
      <div className="admin-next-action__buttons">
        {!(order.status === 'PENDING' && order.paymentStatus !== 'PAID') && (
          <button className="v-button v-button--primary" onClick={() => setConfirm(NEXT[order.status])}>
            {(es ? LABEL : LABEL_EN)[NEXT[order.status]]}
          </button>
        )}
        {['PENDING', 'CONFIRMED'].includes(order.status) && (
          <button className="v-button v-button--ghost" onClick={() => setConfirm('CANCELLED')}>
            {es ? 'Cancelar pedido' : 'Cancel order'}
          </button>
        )}
      </div>
    ) : (
      <form onSubmit={save}><p>{(es ? LABEL : LABEL_EN)[confirm]} · {es ? 'Se guardará en el historial con tu usuario.' : 'This will be recorded in your name.'}</p>
        {closure && <label>{es ? 'Motivo del cierre' : 'Closure reason'}<textarea required minLength={3} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} /></label>}
        <div className="admin-next-action__buttons"><button type="submit" className="v-button v-button--primary" disabled={busy}>{es ? 'Confirmar cambio' : 'Confirm change'}</button><button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => setConfirm('')}>{es ? 'Volver' : 'Back'}</button></div></form>
    )}
    {error && <p role="alert">{error}</p>}
  </section>;
}
