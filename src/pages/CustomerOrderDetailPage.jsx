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
    progress: 'Avance del taller', parts: 'Piezas incluidas', subtotal: 'Subtotal de piezas', total: 'Total registrado',
    amountNote: 'El monto registrado no confirma un pago por sí solo.', payment: 'Estado del comprobante', reference: 'Referencia', phone: 'Teléfono emisor',
    rejection: 'Motivo indicado por el taller', proof: 'El comprobante está pendiente de revisión por el taller.',
    noProof: 'Este prototipo no recibe pagos. No reportes un comprobante real: el número SINPE mostrado es solo de demostración y no es un destino de pago.',
    status: { PENDING: 'Pendiente de revisión', CONFIRMED: 'Confirmado', IN_PRODUCTION: 'En producción', READY: 'Listo', SHIPPED: 'Enviado', DELIVERED: 'Entregado', COMPLETED: 'Completado', CANCELLED: 'Cancelado', REJECTED: 'Rechazado' },
    steps: ['Recibido', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado'], quantity: 'Cantidad', unit: 'Por unidad',
  } : {
    back: 'Back to my orders', title: 'Order details', loading: 'Loading order…', retry: 'Try again',
    error: 'We could not load this order. Check your connection and try again.', missing: 'We could not find that order in your account.',
    progress: 'Workshop progress', parts: 'Included parts', subtotal: 'Parts subtotal', total: 'Recorded total',
    amountNote: 'The recorded amount alone does not confirm payment.', payment: 'Receipt status', reference: 'Reference', phone: 'Sender phone',
    rejection: 'Workshop note', proof: 'The receipt is waiting for workshop review.',
    noProof: 'This prototype does not receive payments. Do not submit a real receipt: the sample SINPE number is for demonstration only and is not a payment destination.',
    status: { PENDING: 'Awaiting review', CONFIRMED: 'Confirmed', IN_PRODUCTION: 'In production', READY: 'Ready', SHIPPED: 'Shipped', DELIVERED: 'Delivered', COMPLETED: 'Completed', CANCELLED: 'Cancelled', REJECTED: 'Rejected' },
    steps: ['Received', 'Confirmed', 'In production', 'Ready', 'Shipped', 'Delivered'], quantity: 'Quantity', unit: 'Each',
  };

  if (state.key !== requestKey || state.loading) return <section className="customer-order-detail" aria-busy="true"><p role="status">{text.loading}</p></section>;
  if (state.error) return <section className="customer-order-detail"><Link className="quote-back" to="/cuenta?tab=orders">← {text.back}</Link><p role="alert">{state.error || text.error}</p><button className="v-button v-button--secondary" type="button" onClick={() => setVersion(value => value + 1)}>{text.retry}</button></section>;
  if (!state.order) return <section className="customer-order-detail"><Link className="quote-back" to="/cuenta?tab=orders">← {text.back}</Link><p role="status">{text.missing}</p></section>;

  const order = state.order;
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
      <span className={`v-badge v-badge--request status-${String(order.status || '').toLowerCase()}`} data-status={order.status}>{text.status[order.status] || order.status || '—'}</span>
    </header>

    {Number.isInteger(current) && <section className="customer-order-detail__progress" aria-label={text.progress}>
      <h2>{text.progress}</h2><StepperBar steps={text.steps} current={current} label={text.progress} />
    </section>}

    <div className="customer-order-detail__layout">
      <section className="customer-order-detail__items" aria-labelledby="customer-order-detail-items-title">
        <h2 id="customer-order-detail-items-title">{text.parts}</h2>
        {order.orderItems?.length ? <ul>{order.orderItems.map((item, index) => <li key={item.id || `${item.productId}-${index}`}>
          <div><strong>{item.productName || item.currentCatalogName || (es ? `Modelo ${item.productId}` : `Model ${item.productId}`)}</strong>
            <span>{[item.color, item.material].filter(Boolean).join(' · ')}</span>
            <small>{text.quantity}: {item.quantity} · {text.unit}: {formatCRC(item.unitPrice)}</small></div>
          <strong>{formatCRC(item.subtotal ?? Number(item.unitPrice) * Number(item.quantity))}</strong>
        </li>)}</ul> : <p>{es ? 'Este pedido no tiene piezas detalladas.' : 'No item details are available for this order.'}</p>}
      </section>

      <aside className="customer-order-detail__summary">
        <span className="quote-eyebrow">{text.total}</span>
        <strong>{formatCRC(amount) || '—'}</strong>
        {Number.isFinite(order.subtotalCrc ?? order.subtotal) && <p>{text.subtotal}: {formatCRC(order.subtotalCrc ?? order.subtotal)}</p>}
        <p>{text.amountNote}</p>
        {order.paymentStatus === 'PAID' ? <p className="customer-order-detail__payment" role="status">{es ? 'Pago verificado por el taller.' : 'Payment verified by the workshop.'}</p>
          : order.paymentProof?.status === 'SUBMITTED' ? <div className="customer-order-detail__payment" role="status">
            <strong>{text.payment}: {order.paymentProof.status}</strong>
            <span>{text.reference}: {order.paymentProof.referenceNumber}</span>
            <span>{text.phone}: {order.paymentProof.sinpePhone}</span>
            <p>{text.proof}</p>
          </div>
            : order.paymentProof?.status === 'REJECTED' ? <div className="customer-proof-rejection-alert" role="alert"><strong>{text.payment}: {order.paymentProof.status}</strong><p>{text.rejection}: {order.paymentProof.rejectionReason}</p></div>
              : order.status === 'PENDING' && <p className="customer-order-detail__payment">{text.noProof}</p>}
        <Link className="v-button v-button--secondary" to="/cuenta?tab=orders">{es ? 'Abrir Mis pedidos' : 'Open My orders'}</Link>
      </aside>
    </div>
  </section>;
}
