import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StepperBar } from '../components/ui/StepperBar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { fetchMyOrders } from '../services/commerceService.js';
import { automationError } from '../services/automationService.js';
import { formatCRC } from '../utils/money.js';
import './quotes.css';

const INDEX = { PENDING: 0, CONFIRMED: 1, IN_PRODUCTION: 2, READY: 3, SHIPPED: 4, DELIVERED: 5, COMPLETED: 5 };

export function CustomerOrderDetailPage() {
  const { id = '' } = useParams();
  const { token } = useAuth();
  const { language } = usePreferences();
  const es = language !== 'en';
  const [version, setVersion] = useState(0);
  const requestKey = `${id}:${token || ''}:${version}`;
  const [state, setState] = useState({ key: '', loading: true, error: '', order: null });
  useEffect(() => {
    const controller = new AbortController();
    fetchMyOrders({ token, signal: controller.signal })
      .then(result => {
        const order = (result?.orders || []).find(item => String(item.id) === id) || null;
        setState({ key: requestKey, loading: false, error: '', order });
      })
      .catch(failure => {
        if (failure.name !== 'AbortError') setState({ key: requestKey, loading: false, error: automationError(failure.code), order: null });
      });
    return () => controller.abort();
  }, [id, requestKey, token]);

  const text = es ? {
    back: 'Volver a mis pedidos', title: 'Detalle del pedido', loading: 'Cargando pedido…', retry: 'Reintentar',
    error: 'No pudimos cargar el pedido. Revisá tu conexión e intentá de nuevo.', missing: 'No encontramos ese pedido en tu cuenta.',
    progress: 'Avance del taller', parts: 'Piezas incluidas', subtotal: 'Subtotal de piezas', total: paid => paid ? 'Comprobante de pago' : 'Resumen del pedido',
    amountNote: 'La tienda es una demo académica. PayPal Sandbox usa saldo de prueba; SINPE se confirma manualmente. No se procesan cobros reales.', payment: 'Estado del pago',
    status: { PENDING: 'Pago pendiente', CONFIRMED: 'Pago confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado', DELIVERED: 'Entregado', COMPLETED: 'Completado', CANCELLED: 'Cancelado', REJECTED: 'Rechazado' },
    steps: ['Recibido', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado'], quantity: 'Cantidad', unit: 'Por unidad',
  } : {
    back: 'Back to my orders', title: 'Order details', loading: 'Loading order…', retry: 'Try again',
    error: 'We could not load this order. Check your connection and try again.', missing: 'We could not find that order in your account.',
    progress: 'Workshop progress', parts: 'Included parts', subtotal: 'Parts subtotal', total: paid => paid ? 'Payment receipt' : 'Order summary',
    amountNote: 'This is an academic demo. PayPal Sandbox uses test funds; SINPE is confirmed manually. No real charges are processed.', payment: 'Payment status',
    status: { PENDING: 'Payment pending', CONFIRMED: 'Payment confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped', DELIVERED: 'Delivered', COMPLETED: 'Completed', CANCELLED: 'Cancelled', REJECTED: 'Rejected' },
    steps: ['Received', 'Confirmed', 'In production', 'Ready', 'Shipped', 'Delivered'], quantity: 'Quantity', unit: 'Each',
  };

  if (state.key !== requestKey || state.loading) return <section className="customer-order-detail" aria-busy="true"><p role="status">{text.loading}</p></section>;
  if (state.error) return <section className="customer-order-detail"><Link className="quote-back" to="/cuenta?tab=orders">← {text.back}</Link><p role="alert">{state.error || text.error}</p><button className="v-button v-button--secondary" type="button" onClick={() => setVersion(value => value + 1)}>{text.retry}</button></section>;
  if (!state.order) return <section className="customer-order-detail"><Link className="quote-back" to="/cuenta?tab=orders">← {text.back}</Link><p role="status">{text.missing}</p></section>;

  const order = state.order;
  const proofStatus = order.paymentProof?.status;
  const current = INDEX[order.status];
  const amount = order.total ?? order.subtotalCrc ?? order.subtotal;
  const date = order.createdAt && new Date(order.createdAt);
  const dateLabel = date && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(es ? 'es-CR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : null;

  return <section className="customer-order-detail" aria-labelledby="customer-order-detail-title">
    <Link className="quote-back" to="/cuenta?tab=orders">← {text.back}</Link>
    <header className="customer-order-detail__heading">
      <div><span className="quote-eyebrow">{order.id}{dateLabel ? ` · ${dateLabel}` : ''}</span><h1 id="customer-order-detail-title">{text.title}</h1></div>
      <span className={`v-badge v-badge--request status-${String(order.status || '').toLowerCase()}`} data-status={order.status}>{proofStatus === 'SUBMITTED' ? (es ? 'Comprobante en revisión' : 'Proof under review') : proofStatus === 'REJECTED' ? (es ? 'Comprobante observado' : 'Proof needs changes') : text.status[order.status] || order.status || '—'}</span>
    </header>

    {Number.isInteger(current) && <section className="customer-order-detail__progress" aria-label={text.progress}>
      <h2>{text.progress}</h2><StepperBar steps={text.steps} current={current} label={text.progress} />
    </section>}

    <div className="customer-order-detail__layout">
      <section className="customer-order-detail__items" aria-labelledby="customer-order-detail-items-title">
        <h2 id="customer-order-detail-items-title">{text.parts}</h2>
        {order.orderItems?.length ? <ul>{order.orderItems.map((item, index) => <li key={item.id || item.productId + '-' + index}>
          <div><strong>{item.productName || item.currentCatalogName || (es ? 'Modelo ' + item.productId : 'Model ' + item.productId)}</strong>
            <span>{[item.color, item.material].filter(Boolean).join(' · ')}</span>
            <small>{text.quantity}: {item.quantity} · {text.unit}: {formatCRC(item.unitPrice)}</small></div>
          <strong>{formatCRC(item.subtotal ?? Number(item.unitPrice) * Number(item.quantity))}</strong>
        </li>)}</ul> : order.scopeSnapshot ? <div className="customer-order-detail__custom-scope">
          <strong>{order.scopeSnapshot.name || (es ? 'Diseño personalizado' : 'Custom design')}</strong>
          <span>{[order.scopeSnapshot.material, order.scopeSnapshot.dimensions].filter(Boolean).join(' · ')}</span>
          <small>{text.quantity}: {order.scopeSnapshot.quantity || 1}</small>
          {order.scopeSnapshot.fileName && <small>{es ? 'Archivo de referencia' : 'Reference file'}: {order.scopeSnapshot.fileName}</small>}
          {order.scopeSnapshot.notes && <p>{order.scopeSnapshot.notes}</p>}
        </div> : <p>{es ? 'Este pedido no tiene piezas detalladas.' : 'No item details are available for this order.'}</p>}
      </section>

      <aside className="customer-order-detail__summary">
        <span className="quote-eyebrow">{text.total(order.paymentStatus === 'PAID')}</span>
        <strong>{formatCRC(amount) || '—'}</strong>
        {Number.isFinite(order.subtotalCrc ?? order.subtotal) && <p>{text.subtotal}: {formatCRC(order.subtotalCrc ?? order.subtotal)}</p>}
        <p>{text.amountNote}</p>
        {order.paymentStatus === 'PAID'
          ? <p className="customer-order-detail__payment" role="status">{order.paymentMode === 'PAYPAL_SANDBOX' ? (es ? 'Pago completado en PayPal Sandbox · fondos de prueba.' : 'Payment completed in PayPal Sandbox · test funds.') : order.paymentMode === 'SINPE_MANUAL' ? (es ? 'Comprobante SINPE revisado y confirmado por el taller.' : 'SINPE proof reviewed and confirmed by the workshop.') : order.paymentMode === 'DEMO' ? (es ? 'Pago simulado registrado · DEMO. No se transfirió dinero real.' : 'Simulated payment recorded · DEMO. No real money was transferred.') : (es ? 'Pago registrado' : 'Payment recorded')}</p>
          : proofStatus === 'SUBMITTED' ? <p className="customer-order-detail__payment" role="status">{es ? 'Recibimos tu comprobante SINPE. El pedido sigue pendiente mientras el taller revisa la referencia y el archivo.' : 'Your SINPE proof was received. The order remains pending while the workshop reviews its reference and file.'}</p>
            : proofStatus === 'REJECTED' ? <p className="customer-order-detail__payment" role="alert">{es ? `El taller pidió corregir el comprobante: ${order.paymentProof.rejectionReason || 'revisá los datos'}.` : `The workshop requested a proof correction: ${order.paymentProof.rejectionReason || 'check the details'}.`}</p>
              : order.paymentStatus === 'REVIEW_REQUIRED' ? <p className="customer-order-detail__payment" role="alert">{es ? 'El pago requiere revisión. No lo vuelvas a iniciar; consultá el seguimiento del taller.' : 'Payment needs review. Do not start it again; contact the workshop.'}</p>
                : order.status === 'PENDING' && <p className="customer-order-detail__payment" role="status">{es ? 'El encargo está guardado, pero todavía no está confirmado. Elegí PayPal Sandbox o reportá un SINPE desde el carrito.' : 'Your order is saved but not confirmed. Choose PayPal Sandbox or report SINPE from the cart.'}</p>}
        {order.status === 'PENDING' && order.paymentStatus !== 'PAID' && <Link className="v-button v-button--primary" to={`/carrito?orderId=${encodeURIComponent(order.id)}`}>{proofStatus === 'REJECTED' ? (es ? 'Corregir comprobante en el carrito' : 'Correct proof in cart') : proofStatus === 'SUBMITTED' ? (es ? 'Ver estado del pago en el carrito' : 'View payment status in cart') : (es ? 'Continuar al pago en el carrito' : 'Continue to payment in cart')}</Link>}
        <Link className="v-button v-button--secondary" to="/cuenta?tab=orders">{es ? 'Abrir Mis pedidos' : 'Open My orders'}</Link>
      </aside>
    </div>
  </section>;
}
