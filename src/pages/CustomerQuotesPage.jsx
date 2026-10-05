import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { fetchMyOrders, submitOrderPaymentProof } from '../services/commerceService.js';
import { StepperBar } from '../components/ui/StepperBar.jsx';
import { formatCRC } from '../utils/money.js';
import './quotes.css';

export function CustomerQuotesPage() {
  const { user, token } = useAuth();
  const { language } = usePreferences();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const es = language === 'es';
  const confirmation = location.state?.orderConfirmation;
  const requestedTab = searchParams.get('tab');
  const [tab, setTab] = useState(confirmation || requestedTab === 'orders' ? 'orders' : requestedTab === 'profile' ? 'profile' : 'quotes');
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ requests: [], loading: true, error: '' });
  const [ordersState, setOrdersState] = useState({ orders: [], loading: true, error: '' });
  const [submitting, setSubmitting] = useState(null);
  const [responseForm, setResponseForm] = useState({ requestId: '', decision: 'CHANGES_REQUESTED', reason: '' });
  const [proofForm, setProofForm] = useState({ orderId: '', referenceNumber: '', sinpePhone: '', proofNotes: '' });
  const [proofSubmitting, setProofSubmitting] = useState(null);
  const [proofError, setProofError] = useState('');
  const [proofSuccess, setProofSuccess] = useState('');

  useEffect(() => {
    if (requestedTab === 'orders' || requestedTab === 'profile' || requestedTab === 'quotes') setTab(requestedTab);
    else if (confirmation) setTab('orders');
  }, [confirmation, requestedTab]);

  function selectTab(nextTab) {
    setTab(nextTab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', nextTab);
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    if (user?.role !== 'customer') return;
    const abort = new AbortController();
    setState(current => ({ ...current, loading: true, error: '' }));
    setOrdersState(current => ({ ...current, loading: true, error: '' }));
    automationAction('/quotes/mine', {}, { token, signal: abort.signal })
      .then(result => setState({ requests: result.requests || [], loading: false, error: '' }))
      .catch(failure => { if (failure.name !== 'AbortError') setState({ requests: [], loading: false, error: automationError(failure.code) }); });
    fetchMyOrders({ token, signal: abort.signal })
      .then(result => setOrdersState({ orders: result?.orders || [], loading: false, error: '' }))
      .catch(failure => { if (failure.name !== 'AbortError') setOrdersState({ orders: [], loading: false, error: automationError(failure.code) }); });
    return () => abort.abort();
  }, [token, user?.role, version]);
  async function approve(request) {
    setSubmitting(request.id);
    try {
      await automationAction('/quotes/approve', { requestId: request.id, expectedVersion: request.quoteVersion }, { token });
      setVersion(value => value + 1);
    } catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setSubmitting(null); }
  }
  async function respond(request, event) {
    event.preventDefault();
    if (responseForm.requestId !== request.id) return;
    setSubmitting(request.id);
    try {
      await automationAction('/quotes/respond', {
        requestId: request.id, expectedVersion: request.quoteVersion,
        decision: responseForm.decision, reason: responseForm.reason,
      }, { token });
      setResponseForm({ requestId: '', decision: 'CHANGES_REQUESTED', reason: '' });
      setVersion(value => value + 1);
    } catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setSubmitting(null); }
  }
  async function deleteRequest(request) {
    setSubmitting(request.id);
    try {
      await automationAction('/quotes/delete', { requestId: request.id }, { token });
      setState(current => ({ ...current, requests: current.requests.filter(r => r.id !== request.id) }));
    } catch (failure) { setState(current => ({ ...current, error: automationError(failure.code) })); }
    finally { setSubmitting(null); }
  }
  async function handleSendPaymentProof(order, event) {
    event.preventDefault();
    setProofSubmitting(order.id);
    setProofError('');
    setProofSuccess('');
    try {
      await submitOrderPaymentProof({
        orderId: order.id,
        referenceNumber: proofForm.referenceNumber,
        sinpePhone: proofForm.sinpePhone,
        proofNotes: proofForm.proofNotes,
      }, { token });
      setProofForm({ orderId: '', referenceNumber: '', sinpePhone: '', proofNotes: '' });
      setProofSuccess(order.id);
      setVersion(value => value + 1);
    } catch (failure) {
      setProofError(automationError(failure.code));
    } finally {
      setProofSubmitting(null);
    }
  }
  const statusLabel = status => ({
    PENDING_QUOTE: es ? 'Por cotizar' : 'Awaiting quote', IN_REVIEW: es ? 'En revisión' : 'In review',
    QUOTED: es ? 'Cotizada' : 'Quoted', AWAITING_APPROVAL: es ? 'Esperando tu aprobación' : 'Awaiting your approval',
    APPROVED: es ? 'Aprobada' : 'Approved', CHANGES_REQUESTED: es ? 'Cambios solicitados' : 'Changes requested', PAID: es ? 'Pago registrado' : 'Payment recorded',
    REJECTED: es ? 'Rechazada' : 'Rejected', EXPIRED: es ? 'Vencida' : 'Expired', CANCELLED: es ? 'Cancelada' : 'Cancelled',
  })[status] || status;
  const amountLabel = es ? 'Monto cotizado' : 'Quoted amount';
  const breakdownLabels = es
    ? { materialCrc: 'Material', wearCrc: 'Desgaste', electricityCrc: 'Electricidad', postProcessCrc: 'Postprocesado', designCrc: 'Diseño', otherCostsCrc: 'Otros costos', costSubtotalCrc: 'Costo calculado' }
    : { materialCrc: 'Material', wearCrc: 'Wear', electricityCrc: 'Electricity', postProcessCrc: 'Post-processing', designCrc: 'Design', otherCostsCrc: 'Other costs', costSubtotalCrc: 'Calculated cost' };

  const orderStepIndex = status => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'IN_PRODUCTION': return 2;
      case 'READY': return 3;
      case 'SHIPPED': return 4;
      case 'DELIVERED': case 'COMPLETED': return 5;
      default: return -1;
    }
  };
  const orderSteps = es
    ? ['Recibido', 'Confirmado', 'En producción', 'Listo', 'Enviado', 'Entregado']
    : ['Received', 'Confirmed', 'In production', 'Ready', 'Shipped', 'Delivered'];
  const orderStatusLabel = status => ({
    PENDING: es ? 'Recibido / Pendiente SINPE' : 'Received / Pending SINPE',
    CONFIRMED: es ? 'Confirmado' : 'Confirmed',
    IN_PRODUCTION: es ? 'En taller' : 'In workshop',
    READY: es ? 'Listo' : 'Ready',
    SHIPPED: es ? 'Enviado' : 'Shipped',
    DELIVERED: es ? 'Entregado' : 'Delivered',
    COMPLETED: es ? 'Listo / Completado' : 'Ready / Completed',
    CANCELLED: es ? 'Cancelado' : 'Cancelled',
    REJECTED: es ? 'Rechazado' : 'Rejected',
  })[status] || (es ? 'Etapa por revisar' : 'Stage needs review');

  return <section className="quote-page">
    <header>
      <span className="quote-eyebrow">{es ? 'Mi espacio' : 'My workspace'}</span>
      <h1>{user.role === 'admin' ? (es ? 'Tu espacio de taller.' : 'Your workshop workspace.') : es ? 'Tu cuenta, tus piezas.' : 'Your account, your parts.'}</h1>
      <p>{user.name} · {user.role === 'admin' ? (es ? 'El seguimiento de solicitudes y pedidos del taller vive en Administración.' : 'Workshop requests and order management live in Administration.') : es ? 'Gestión de cotizaciones, pedidos de catálogo y seguimiento de producción.' : 'Quote management, catalog orders and production tracking.'}</p>
    </header>

    {confirmation && (
      <p className="customer-order-confirmation" role="status">
        {es ? `Encargo ${confirmation.id} recibido. El taller lo revisará; todavía no se ha cobrado ni confirmado una fecha de entrega.` : `Order ${confirmation.id} received. The workshop will review it; no payment or delivery date has been confirmed.`} {formatCRC(confirmation.subtotalCrc)}
      </p>
    )}

    {user.role === 'admin' ? (
      <section className="customer-admin-handoff" aria-labelledby="customer-admin-handoff-title">
        <span className="quote-eyebrow">{es ? 'ACCESO DE TALLER' : 'WORKSHOP ACCESS'}</span>
        <h2 id="customer-admin-handoff-title">{es ? 'Continuá el trabajo desde el panel operativo.' : 'Continue work in the operations dashboard.'}</h2>
        <p>{es ? 'Esta vista es para pedidos y cotizaciones de clientes. En Administración encontrás solicitudes, catálogo, clientes y actividad.' : 'This space is for customer orders and quotes. Administration contains requests, catalog, customers and activity.'}</p>
        <div><Link className="v-button v-button--primary v-button--pill" to="/admin">{es ? 'Abrir Administración' : 'Open administration'} ↗</Link><Link className="v-link-text" to="/catalogo">{es ? 'Volver a la tienda' : 'Return to the store'} ↗</Link></div>
      </section>
    ) : (
      <>
        <nav className="customer-tabs" role="tablist" aria-label={es ? 'Secciones de la cuenta' : 'Account sections'}>
          <button
            type="button"
            role="tab"
            id="tab-quotes"
            aria-controls="panel-quotes"
            aria-selected={tab === 'quotes'}
            className={`customer-tab-btn ${tab === 'quotes' ? 'is-active' : ''}`}
            onClick={() => selectTab('quotes')}
          >
            {es ? 'Mis cotizaciones' : 'My quotes'} {state.requests.length > 0 && <span className="customer-tab-count">{state.requests.length}</span>}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-orders"
            aria-controls="panel-orders"
            aria-selected={tab === 'orders'}
            className={`customer-tab-btn ${tab === 'orders' ? 'is-active' : ''}`}
            onClick={() => selectTab('orders')}
          >
            {es ? 'Mis pedidos' : 'My orders'} {ordersState.orders.length > 0 && <span className="customer-tab-count">{ordersState.orders.length}</span>}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-profile"
            aria-controls="panel-profile"
            aria-selected={tab === 'profile'}
            className={`customer-tab-btn ${tab === 'profile' ? 'is-active' : ''}`}
            onClick={() => selectTab('profile')}
          >
            {es ? 'Mi perfil' : 'My profile'}
          </button>
        </nav>

        {tab === 'quotes' && (
          <div id="panel-quotes" role="tabpanel" aria-labelledby="tab-quotes">
            {state.loading && <p role="status">{es ? 'Cargando…' : 'Loading…'}</p>}
            {state.error && <p role="alert">{state.error}</p>}
            {!state.loading && !state.error && !state.requests.length && (
              <p>{es ? 'Todavía no tenés solicitudes.' : 'You have no requests yet.'}</p>
            )}
            <div className="customer-quotes">
              {state.requests.toSorted((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt))).map(request => (
                <article className="customer-quote" key={request.id}>
                  <header>
                    <div className="customer-quote-title-group">
                      <div className="customer-quote-tags">
                        <span className="quote-eyebrow">{request.id}</span>
                        <span className={`v-badge v-badge--request customer-quote-status status-${request.status.toLowerCase()}`}>{statusLabel(request.status)}</span>
                        {request.submittedAt && <time className="customer-quote-date">{request.submittedAt.slice(0, 10)}</time>}
                      </div>
                      <h2>{request.quotePricing?.profile?.name || request.description || request.fileName}</h2>
                      <div className="customer-quote-chips">
                        <span><span className="customer-quote-chip-label">{es ? 'Cant:' : 'Qty:'}</span> {request.quantity} {request.quantity === 1 ? (es ? 'pieza' : 'unit') : (es ? 'piezas' : 'units')}</span>
                        {request.material && <span><span className="customer-quote-chip-label">{es ? 'Mat:' : 'Mat:'}</span> {request.material}</span>}
                        {request.dimensions && <span><span className="customer-quote-chip-label">{es ? 'Dim:' : 'Dim:'}</span> {request.dimensions}</span>}
                      </div>
                    </div>
                    <div className="customer-quote-price-col">
                      <strong>{request.quotedPrice != null ? formatCRC(request.quotedPrice) : (es ? 'Sin cotizar' : 'Not quoted')}</strong>
                      {request.quotedPrice != null && <small>{es ? 'Monto cotizado' : 'Quoted amount'}</small>}
                    </div>
                  </header>

                  {request.status === 'QUOTED' && <p className="customer-quote-next-step">{es ? 'El taller está preparando la propuesta para enviártela. Cuando esté lista para tu aprobación, verás aquí las opciones para aprobar o pedir cambios. No tenés que pagar todavía.' : 'The workshop is preparing your proposal. Once sent for approval, you will be able to approve or request changes here. No payment is required yet.'}</p>}
                  {request.status === 'CHANGES_REQUESTED' && <p className="customer-quote-next-step">{es ? 'El taller recibió tu solicitud de cambios. Esperá la nueva versión antes de aprobar o pagar.' : 'The workshop received your change request. Wait for the revised quote before approving or paying.'}</p>}
                  {request.status !== 'AWAITING_APPROVAL' && request.quoteNotes && (
                    <div className="customer-quote-notes">
                      <span className="customer-quote-notes__title">{es ? 'Notas del taller' : 'Workshop notes'}</span>
                      <p>{request.quoteNotes}</p>
                    </div>
                  )}

                  {request.status === 'AWAITING_APPROVAL' && (
                    <section className="customer-quote__offer" aria-label={es ? 'Detalle de la cotización' : 'Quote details'}>
                      <h3>{es ? 'Cotización recibida' : 'Quote received'}</h3>
                      <p><strong>{amountLabel}: {formatCRC(request.quotedPrice)}</strong></p>
                      {request.quoteValidUntil && (
                        <p>{es ? 'Válida hasta' : 'Valid until'}: <time dateTime={request.quoteValidUntil}>{request.quoteValidUntil.slice(0, 10)}</time></p>
                      )}
                      {request.quoteNotes && <p>{request.quoteNotes}</p>}
                      {request.quotePricing?.mode === 'DEMO' && (
                        <p className="quote-demo-disclaimer">{es ? 'Estimación técnica preliminar: calculada según especificaciones y perfil de taller. Sujeta a inspección dimensional previa a manufactura.' : 'Preliminary technical estimate: calculated according to specs and workshop profile. Subject to dimensional inspection prior to manufacturing.'}</p>
                      )}
                      {request.quotePricing?.breakdown && (
                        <dl className="customer-quote__breakdown">
                          {Object.entries(breakdownLabels).filter(([key]) => Number.isFinite(request.quotePricing.breakdown[key])).map(([key, label]) => (
                            <div key={key}><dt>{label}</dt><dd>{formatCRC(request.quotePricing.breakdown[key])}</dd></div>
                          ))}
                          {Number.isFinite(request.quotePricing.breakdown.amountCrc) && Number.isFinite(request.quotePricing.breakdown.costSubtotalCrc) && (
                            <div><dt>{es ? `Recargo aplicado (${request.quotePricing.breakdown.markupPercent}%)` : `Applied markup (${request.quotePricing.breakdown.markupPercent}%)`}</dt><dd>{formatCRC(request.quotePricing.breakdown.amountCrc - request.quotePricing.breakdown.costSubtotalCrc)}</dd></div>
                          )}
                          {Number.isFinite(request.quotePricing.breakdown.amountCrc) && (
                            <div className="customer-quote__breakdown-total"><dt>{es ? 'Total cotizado' : 'Quoted total'}</dt><dd>{formatCRC(request.quotePricing.breakdown.amountCrc)}</dd></div>
                          )}
                        </dl>
                      )}
                      <div className="customer-quote__actions">
                        <button className="v-button v-button--primary" disabled={Boolean(submitting) || !(Date.parse(request.quoteValidUntil || '') > Date.now())} onClick={() => approve(request)}>
                          {submitting === request.id ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Aprobar cotización' : 'Approve quote')}
                        </button>
                        <button className="v-button v-button--secondary" disabled={Boolean(submitting)} onClick={() => setResponseForm(current => current.requestId === request.id ? { requestId: '', decision: 'CHANGES_REQUESTED', reason: '' } : { requestId: request.id, decision: 'CHANGES_REQUESTED', reason: '' })}>
                          {es ? 'Solicitar cambios / Rechazar' : 'Request changes / Reject'}
                        </button>
                      </div>
                      {!(Date.parse(request.quoteValidUntil || '') > Date.now()) && (
                        <p role="status">{es ? 'La vigencia terminó. Ya no se puede aprobar esta versión; contactá al taller para renovarla.' : 'This quote has expired. This version can no longer be approved; contact the workshop to renew it.'}</p>
                      )}
                      {responseForm.requestId === request.id && (
                        <form className="customer-quote__response" onSubmit={event => respond(request, event)}>
                          <fieldset>
                            <legend>{es ? '¿Qué querés hacer?' : 'What would you like to do?'}</legend>
                            <label><input type="radio" name={`decision-${request.id}`} value="CHANGES_REQUESTED" checked={responseForm.decision === 'CHANGES_REQUESTED'} onChange={() => setResponseForm(current => ({ ...current, decision: 'CHANGES_REQUESTED' }))} />{es ? 'Solicitar ajustes y una nueva revisión' : 'Request changes and a new review'}</label>
                            <label><input type="radio" name={`decision-${request.id}`} value="REJECTED" checked={responseForm.decision === 'REJECTED'} onChange={() => setResponseForm(current => ({ ...current, decision: 'REJECTED' }))} />{es ? 'Rechazar esta cotización' : 'Reject this quote'}</label>
                          </fieldset>
                          <label>{es ? 'Motivo breve (obligatorio)' : 'Brief reason (required)'}<textarea required minLength="3" maxLength="500" value={responseForm.reason} onChange={event => setResponseForm(current => ({ ...current, reason: event.target.value }))} /></label>
                          <button className="v-button v-button--primary" disabled={Boolean(submitting) || responseForm.reason.trim().length < 3}>
                            {submitting === request.id ? (es ? 'Enviando…' : 'Sending…') : responseForm.decision === 'REJECTED' ? (es ? 'Confirmar rechazo' : 'Confirm rejection') : (es ? 'Enviar solicitud de cambios' : 'Send change request')}
                          </button>
                        </form>
                      )}
                      <p>{es ? 'Tu respuesta queda registrada en la cuenta. Aprobar no confirma un pago ni inicia la producción automáticamente.' : 'Your response is recorded in your account. Approval does not confirm payment or automatically start production.'}</p>
                    </section>
                  )}
                  {request.status === 'APPROVED' && (
                    <p>{es ? 'Aprobación registrada. No se ha confirmado un pago ni iniciado producción automáticamente.' : 'Approval recorded. No payment or production has been confirmed automatically.'}</p>
                  )}
                  {request.status === 'CHANGES_REQUESTED' && (
                    <p>{es ? 'El taller debe revisar tu comentario y preparar una respuesta. No se creó otro pedido.' : 'The workshop must review your comment and prepare a response. No new order was created.'} {request.customerDecisionReason}</p>
                  )}
                  {['PENDING_QUOTE', 'IN_REVIEW', 'SUBMITTED', 'CHANGES_REQUESTED'].includes(request.status) && (
                    <div className="customer-quote__actions">
                      <button
                        type="button"
                        className="v-button v-button--ghost"
                        disabled={Boolean(submitting)}
                        onClick={() => deleteRequest(request)}
                      >
                        {submitting === request.id ? (es ? 'Descartando…' : 'Discarding…') : (es ? 'Descartar solicitud' : 'Discard request')}
                      </button>
                    </div>
                  )}
                  {['CANCELLED', 'REJECTED'].includes(request.status) && (
                    <div className="customer-quote__actions">
                      <button
                        type="button"
                        className="v-button v-button--ghost"
                        disabled={Boolean(submitting)}
                        onClick={() => deleteRequest(request)}
                      >
                        {submitting === request.id ? (es ? 'Eliminando…' : 'Removing…') : (es ? 'Eliminar de mi lista' : 'Remove from list')}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <Link className="v-button v-button--secondary" to="/solicitud">{es ? 'Nueva cotización' : 'New quote'}</Link>
          </div>
        )}

        {tab === 'orders' && (
          <div id="panel-orders" role="tabpanel" aria-labelledby="tab-orders">
            <button type="button" className="v-button v-button--secondary" disabled={ordersState.loading || Boolean(proofSubmitting)} onClick={() => setVersion(value => value + 1)}>
              {es ? 'Actualizar pedidos' : 'Refresh orders'}
            </button>
            {ordersState.loading && <p role="status">{es ? 'Cargando pedidos…' : 'Loading orders…'}</p>}
            {ordersState.error && <p role="alert">{ordersState.error}</p>}
            {!ordersState.loading && !ordersState.error && !ordersState.orders.length && (
              <div className="customer-order-sinpe-box">
                <p>{es ? 'Todavía no tenés pedidos registrados desde el catálogo.' : 'You do not have any catalog orders yet.'}</p>
                <Link className="v-button v-button--primary v-button--pill" to="/catalogo">{es ? 'Explorar catálogo de piezas' : 'Explore catalog'} ↗</Link>
              </div>
            )}
            <div className="customer-orders">
              {ordersState.orders.toSorted((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).map(order => (
                <article className="customer-order-card" key={order.id}>
                  <header className="customer-order-header">
                    <div className="customer-order-title-group">
                      <div className="customer-order-tags">
                        <span className="quote-eyebrow">{order.id}</span>
                        <span className={`v-badge v-badge--request status-${order.status?.toLowerCase()}`}>{orderStatusLabel(order.status)}</span>
                        {order.createdAt && <time className="customer-quote-date">{order.createdAt.slice(0, 10)}</time>}
                      </div>
                      <h2>{es ? `Pedido de ${order.orderItems?.length || 0} ${(order.orderItems?.length || 0) === 1 ? 'modelo' : 'modelos'}` : `Order with ${order.orderItems?.length || 0} models`}</h2>
                    </div>
                    <div className="customer-quote-price-col">
                      <strong>{formatCRC(order.total ?? order.subtotalCrc)}</strong>
                      <small>{order.paymentStatus === 'PAID' ? (es ? 'Pago acreditado' : 'Payment received') : (es ? 'Monto registrado · no acredita pago' : 'Recorded amount · not proof of payment')}</small>
                    </div>
                  </header>

                  <div className="customer-order-items" aria-label={es ? 'Piezas del pedido' : 'Order items'}>
                    {(order.orderItems || []).map(item => (
                      <div className="customer-order-item" key={item.id || `${item.productId}-${item.color}`}>
                        <div className="customer-order-item-info">
                          <span className="customer-order-item-name">{item.productName || item.currentCatalogName || (es ? `Modelo ${item.productId}` : `Model ${item.productId}`)}</span>
                          {!item.productName && item.currentCatalogName && <small>{es ? 'Referencia del catálogo actual' : 'Current catalog reference'}</small>}
                          <span className="customer-order-item-meta">{item.color} · {item.material || (es ? 'Material no registrado' : 'Material not recorded')} · <span className="customer-quote-chip-label">{es ? 'Cant:' : 'Qty:'}</span> {item.quantity}</span>
                        </div>
                        <div className="customer-order-item-price">
                          <strong>{formatCRC(item.subtotal ?? item.unitPrice * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                  <dl className="customer-order-amounts" aria-label={es ? 'Desglose registrado' : 'Recorded breakdown'}>
                    {[
                      ['subtotal', es ? 'Piezas' : 'Parts'],
                      ['subtotalCrc', es ? 'Subtotal de piezas' : 'Parts subtotal'],
                      ['shipping', es ? 'Entrega registrada' : 'Recorded delivery'],
                      ['discount', es ? 'Descuento registrado' : 'Recorded discount'],
                      ['taxes', es ? 'Impuestos registrados' : 'Recorded taxes'],
                    ].filter(([field]) => Number.isFinite(order[field]) && !(field === 'subtotalCrc' && Number.isFinite(order.subtotal))).map(([field, label]) => (
                      <div key={field}><dt>{label}</dt><dd>{formatCRC(order[field])}</dd></div>
                    ))}
                  </dl>
                  {(!Number.isFinite(order.shipping) || !Number.isFinite(order.taxes)) && <p>{es ? 'Entrega e impuestos sin confirmar: no se consideran gratuitos ni incluidos por defecto.' : 'Delivery and taxes are not confirmed: they are not assumed free or included.'}</p>}

                  {orderStepIndex(order.status) >= 0 && <div className="customer-order-stepper">
                    <StepperBar steps={orderSteps} current={orderStepIndex(order.status)} label={es ? 'Progreso de taller' : 'Workshop progress'} />
                  </div>}

                  <Link className="v-link-text customer-order-detail-link" to={`/pedidos/${encodeURIComponent(order.id)}`}>
                    {es ? 'Ver detalle del pedido' : 'View order details'} <span aria-hidden="true">↗</span>
                  </Link>

                  {order.paymentStatus === 'PAID' ? (
                    <div className="customer-order-paid-box">
                      <div className="customer-order-proof-badge">
                        <span className="quote-eyebrow">{es ? 'PAGO VERIFICADO' : 'PAYMENT VERIFIED'}</span>
                        <span className="customer-proof-status-pill customer-proof-status-pill--paid">
                          {es ? 'Acreditado' : 'Received'}
                        </span>
                      </div>
                      <p className="customer-order-proof-subtext">
                        {order.sourceQuoteId
                          ? (es ? `Pago verificado desde la cotización #${order.sourceQuoteId}. Consultá la etapa de producción arriba; no necesitás pagar otra vez.` : `Payment verified from quote #${order.sourceQuoteId}. Check the production stage above; no further payment is needed.`)
                          : (es ? 'El taller verificó y acreditó la transferencia. La producción continúa según la etapa.' : 'The workshop verified and credited the transfer. Production proceeds.')}
                      </p>
                    </div>
                  ) : order.status === 'PENDING' && (
                    <div className="customer-order-sinpe-box">
                      {order.paymentProof && order.paymentProof.status !== 'REJECTED' ? (
                        <div className="customer-order-proof-status">
                          <div className="customer-order-proof-badge">
                            <span className="quote-eyebrow">{es ? 'COMPROBANTE REGISTRADO' : 'PROOF REGISTERED'}</span>
                            <span className="customer-proof-status-pill">{es ? 'En verificación por taller' : 'Pending workshop review'}</span>
                          </div>
                          <p className="customer-order-proof-details">
                            <strong>{es ? 'Ref. comprobante:' : 'Receipt Ref:'}</strong> #{order.paymentProof.referenceNumber} · <strong>{es ? 'Teléfono:' : 'Phone:'}</strong> {order.paymentProof.sinpePhone}
                          </p>
                          {order.paymentProof.proofNotes && (
                            <p className="customer-order-proof-notes"><strong>{es ? 'Notas:' : 'Notes:'}</strong> {order.paymentProof.proofNotes}</p>
                          )}
                          <p className="customer-order-proof-subtext">
                            {es ? 'El taller debe verificar el pago. La confirmación del pago no inicia la impresión: la etapa de producción se actualiza por separado.' : 'The workshop must verify payment. Payment confirmation does not start printing: production is updated separately.'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <strong>{es ? 'Reporte de pago · demostración académica' : 'Payment report · academic demo'}</strong>
                          <p>{es ? `Referencia del encargo: ${order.id}. El número SINPE 8888-8888 es de ejemplo: no transfirás dinero. El monto registrado es ${formatCRC(order.total ?? order.subtotalCrc)}; entrega, costos adicionales y fecha deben confirmarse con el taller antes de un pago real.` : `Order reference: ${order.id}. SINPE number 8888-8888 is a placeholder: do not send money. The recorded amount is ${formatCRC(order.total ?? order.subtotalCrc)}; delivery, additional costs and date must be confirmed with the workshop before any real payment.`}</p>
                          <p>{es ? 'Podés probar el reporte con una referencia ficticia. Reportar no confirma el pago ni inicia producción: el taller debe verificarlo.' : 'You can test the report with a fictional reference. Reporting does not confirm payment or start production: workshop verification is required.'}</p>

                          {order.paymentProof?.status === 'REJECTED' && (
                            <div className="customer-proof-rejection-alert" role="alert">
                              <strong>{es ? 'Comprobante anterior observado por el taller:' : 'Previous proof flagged by workshop:'}</strong>
                              <p>{order.paymentProof.rejectionReason || (es ? 'Datos inconsistentes con el depósito recibido. Por favor reingresá el número correcto.' : 'Data does not match received transfer.')}</p>
                            </div>
                          )}

                          {proofSuccess === order.id && (
                            <p className="customer-proof-success" role="status">
                              {es ? 'Comprobante reportado con éxito al taller.' : 'Proof successfully submitted to workshop.'}
                            </p>
                          )}

                          <form className="customer-order-proof-form" onSubmit={(e) => handleSendPaymentProof(order, e)}>
                            <div className="customer-order-proof-fields">
                              <label>
                                <span>{es ? 'Número de comprobante SINPE' : 'SINPE reference number'} *</span>
                                <input
                                  type="text"
                                  required
                                  minLength={4}
                                  maxLength={100}
                                  placeholder={es ? 'Ej: 94820194' : 'e.g. 94820194'}
                                  value={proofForm.orderId === order.id ? proofForm.referenceNumber : ''}
                                  onChange={e => setProofForm(current => ({ ...current, orderId: order.id, referenceNumber: e.target.value }))}
                                  disabled={proofSubmitting === order.id}
                                />
                              </label>
                              <label>
                                <span>{es ? 'Teléfono emisor del SINPE' : 'Sender phone number'} *</span>
                                <input
                                  type="tel"
                                  required
                                  minLength={8}
                                  maxLength={25}
                                  placeholder="8888-1234"
                                  value={proofForm.orderId === order.id ? proofForm.sinpePhone : ''}
                                  onChange={e => setProofForm(current => ({ ...current, orderId: order.id, sinpePhone: e.target.value }))}
                                  disabled={proofSubmitting === order.id}
                                />
                              </label>
                            </div>
                            <label className="customer-order-proof-notes-label">
                              <span>{es ? 'Notas adicionales o titular de cuenta (opcional)' : 'Additional notes or account holder (optional)'}</span>
                              <input
                                type="text"
                                maxLength={300}
                                placeholder={es ? 'Ej: Transferencia a nombre de Juan Pérez' : 'e.g. Sent from Juan Perez account'}
                                value={proofForm.orderId === order.id ? proofForm.proofNotes : ''}
                                onChange={e => setProofForm(current => ({ ...current, orderId: order.id, proofNotes: e.target.value }))}
                                disabled={proofSubmitting === order.id}
                              />
                            </label>
                            {proofError && proofForm.orderId === order.id && (
                              <p className="customer-proof-error" role="alert">{proofError}</p>
                            )}
                            <button
                              type="submit"
                              className="v-button v-button--primary"
                              disabled={proofSubmitting === order.id}
                            >
                              {proofSubmitting === order.id ? (es ? 'Reportando…' : 'Submitting…') : (es ? 'Notificar comprobante al taller' : 'Notify workshop proof')}
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  )}

                  {['DELIVERED', 'COMPLETED'].includes(order.status) && (
                    <div className="customer-order-footer">
                      <span>{es ? 'Piezas impresas y verificadas por el taller.' : 'Parts 3D printed and verified by workshop.'}</span>
                      {(order.orderItems || []).length > 0 && (
                        <Link to={`/producto/${encodeURIComponent(order.orderItems[0].productId)}`} className="v-link-text">
                          {es ? 'Dejar opinión sobre este modelo' : 'Leave a review for this model'} ↗
                        </Link>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
            <div className="customer-profile-card">
              <h3>{es ? 'Datos de tu cuenta' : 'Your account details'}</h3>
              <p className="customer-profile-note" role="note">{es ? 'Esta versión académica solo permite consultar estos datos. La edición de perfil y contraseña todavía no está conectada.' : 'This academic version is read-only. Profile and password editing are not connected yet.'}</p>
              <dl className="customer-profile-dl">
                <div><dt>{es ? 'Nombre completo' : 'Full name'}</dt><dd>{user.name}</dd></div>
                <div><dt>{es ? 'Correo electrónico' : 'Email address'}</dt><dd>{user.email}</dd></div>
                <div><dt>{es ? 'Tipo de cuenta' : 'Account type'}</dt><dd>{user.role === 'customer' ? (es ? 'Cliente' : 'Customer') : user.role}</dd></div>
                <div><dt>{es ? 'Estado' : 'Status'}</dt><dd>{user.status || 'ACTIVE'}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </>
    )}
  </section>;
}
