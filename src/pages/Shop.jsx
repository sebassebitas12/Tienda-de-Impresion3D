import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, ProductCard, Skeleton } from '../components/ui/index.js';
import { FilterChips } from '../components/ui/FilterChips.jsx';
import { useCatalog } from '../hooks/useCatalog.js';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { capturePaypalCheckout, createCatalogOrderIdempotencyKey, createPaypalCheckout, fetchMyOrders, fetchPaypalClientConfig, submitCatalogOrder, submitOrderPaymentProof } from '../services/commerceService.js';
import { isOrderableProduct, MAX_CATALOG_ORDER_QUANTITY, reconcileCart } from '../utils/cart.js';
import { matchesFacet, toggleFacetParams } from '../utils/facetFilters.js';
import { formatCRC } from '../utils/money.js';
import { ProductReviews } from '../features/products/ProductReviews.jsx';
import './shop.css';

function CatalogState({ status, retry, es }) {
  if (status === 'loading') return <div role="status" aria-label={es ? 'Cargando modelos' : 'Loading models'}><Skeleton height="180px" /></div>;
  if (status === 'error') return <ErrorState title={es ? 'No pudimos cargar los modelos' : 'Could not load models'} onRetry={retry} retryLabel={es ? 'Reintentar' : 'Retry'} />;
  return null;
}

function ProductMedia({ product, es }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const images = (product.images || []).filter(Boolean);
  const src = !failed && images[selected];
  return <div className="shop-gallery"><figure className="shop-product-media">
    {src ? <img src={src} alt={`${product.name} · ${es ? 'vista' : 'view'} ${selected + 1}`} onError={() => setFailed(true)} />
      : <div className="shop-media-unavailable" role="status">{es ? 'Esta foto no está disponible.' : 'This photo is unavailable.'}</div>}
    <figcaption>{product.source ? `${es ? 'Vista del diseño' : 'Design view'} ${selected + 1} / ${images.length}` : (es ? 'Imagen ilustrativa' : 'Illustrative image')}</figcaption>
  </figure>{images.length > 1 && <div className="shop-gallery-thumbs" role="group" aria-label={es ? 'Fotos de la pieza' : 'Product photos'}>
    {images.map((image, index) => <button type="button" key={`${image}-${index}`} aria-pressed={selected === index} aria-label={`${es ? 'Ver foto' : 'View photo'} ${index + 1}`} onClick={() => { setSelected(index); setFailed(false); }}><img src={image} alt="" loading="lazy" /></button>)}
  </div>}{product.source?.platform === 'Printables' && /^https:\/\/www\.printables\.com\/model\/\d+$/.test(product.source.url || '') && <p className="shop-source-credit"><a href={product.source.url} target="_blank" rel="noopener noreferrer">{es ? 'Diseño fuente' : 'Source design'} ↗</a> · {product.source.author} · {product.source.license}{product.source.originalAuthor && ` · ${product.source.originalAuthor}`}<br />{es ? 'Referencia para demostración educativa. Los accesorios visibles no están incluidos.' : 'Educational demonstration reference. Visible accessories are not included.'}</p>}</div>;
}

export function CatalogPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const { status, products, retry } = useCatalog();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const materials = params.getAll('material'); const categories = params.getAll('categoria'); const query = params.get('buscar') || '';
  const orderable = products.filter(isOrderableProduct);
  const categoryOptions = [...new Map(orderable.filter(product => product.category?.id && product.category?.name).map(product => [String(product.category.id), product.category.name])).entries()];
  const filtered = orderable.filter(product => matchesFacet(product.material, materials) && matchesFacet(String(product.category?.id || ''), categories) && `${product.name} ${product.description || ''} ${product.category?.name || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Diseños para fabricar bajo pedido' : 'Designed for made-to-order printing'}</span><h1>{es ? 'Elegí tu próxima pieza.' : 'Choose your next part.'}</h1><p>{es ? 'Explorá los modelos y sus opciones. Las imágenes son ilustrativas y los precios mostrados, referenciales.' : 'Explore the models and their options. Images are illustrative and displayed prices are estimates.'}</p></header>
    <CatalogState status={status} retry={retry} es={es} />
    {status === 'success' && <><label className="shop-search">{es ? 'Buscar modelo' : 'Search models'}<input type="search" value={query} onChange={event => { const next = new URLSearchParams(params); if (event.target.value) next.set('buscar', event.target.value); else next.delete('buscar'); setParams(next, { replace: true }); }} /></label>
      {categoryOptions.length > 0 && <><p className="shop-facet-label">{es ? 'Tipo de pieza' : 'Part type'}</p><FilterChips label={es ? 'Tipo de pieza' : 'Part type'} selected={categories} onToggle={value => setParams(toggleFacetParams(params, 'categoria', value))} options={[{ value: 'all', label: es ? 'Todos' : 'All' }, ...categoryOptions.map(([value, label]) => ({ value, label }))]} /></>}
      <p className="shop-facet-label">{es ? 'Material' : 'Material'}</p>
      <FilterChips label={es ? 'Materiales' : 'Materials'} selected={materials} onToggle={value => setParams(toggleFacetParams(params, 'material', value))} options={[{ value: 'all', label: es ? 'Todos' : 'All' }, ...[...new Set(orderable.map(product => product.material))].map(value => ({ value, label: value }))]} />
      <p role="status">{filtered.length} {es ? 'modelos' : 'models'}</p>
      {filtered.length ? <div className="shop-grid">{filtered.map(product => <ProductCard key={product.id} product={{ ...product, categoryName: product.category?.name }} linkAs={Link} to={`/producto/${encodeURIComponent(product.id)}${location.search}`} showPrice showMadeToOrder demoPriceLabel={es ? 'Precio referencial' : 'Reference price'} viewLabel={es ? 'Elegir pieza' : 'Choose part'} imageUnavailableLabel={es ? 'Imagen de producto próximamente' : 'Product image coming soon'} />)}</div> : <EmptyState title={es ? 'No hay modelos con esos filtros' : 'No models match these filters'} />}</>}
  </section>;
}

const FILAMENT_SWATCHES = {
  'Negro': '#171717', 'Black': '#171717',
  'Blanco': '#f1f1f1', 'White': '#f1f1f1',
  'Gris': '#64748b', 'Gray': '#64748b',
  'Rojo': '#dc2626', 'Red': '#dc2626',
  'Rojo Lava': '#ea580c', 'Lava': '#ea580c',
  'Azul': '#2563eb', 'Blue': '#2563eb',
  'Verde': '#16a34a', 'Green': '#16a34a',
  'Naranja': '#f97316', 'Orange': '#f97316',
  'Amarillo': '#eab308', 'Yellow': '#eab308',
  'Transparente': '#94a3b8', 'Natural': '#e2e8f0',
};

function ProductSelection({ product, es }) {
  const cart = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const pendingSelection = location.state?.pendingCartSelection;
  const canRestoreSelection = pendingSelection?.productId === String(product.id)
    && product.availableColors?.includes(pendingSelection.color)
    && Number.isSafeInteger(Number(pendingSelection.quantity))
    && Number(pendingSelection.quantity) >= 1
    && Number(pendingSelection.quantity) <= MAX_CATALOG_ORDER_QUANTITY;
  const [color, setColor] = useState(canRestoreSelection ? pendingSelection.color : '');
  const [quantity, setQuantity] = useState(canRestoreSelection ? String(pendingSelection.quantity) : 1);
  const [notice, setNotice] = useState('');
  const valid = (product.availableColors || []).includes(color) && Number.isSafeInteger(Number(quantity)) && Number(quantity) >= 1 && Number(quantity) <= MAX_CATALOG_ORDER_QUANTITY;
  const canShop = user?.role === 'customer' && cart.ready;
  const returnToProduct = `${location.pathname}${location.search}`;
  const cartSelectionForAuth = valid && color ? { productId: String(product.id), color, quantity: Number(quantity) } : null;
  return <form className="shop-selection" onSubmit={event => {
    event.preventDefault();
    if (!canShop) return;
    if (valid && cart.add(product.id, color, Number(quantity))) setNotice(es ? 'Pieza agregada a tu carrito.' : 'Part added to your cart.');
    else setNotice(es ? `La cantidad máxima por pieza es ${MAX_CATALOG_ORDER_QUANTITY}.` : `The maximum quantity per part is ${MAX_CATALOG_ORDER_QUANTITY}.`);
  }}>
    <span>{product.category?.name} · {product.material}</span><h1>{product.name}</h1><p>{product.description}</p><strong className="shop-price">{formatCRC(product.price)}</strong>
    {product.priceSource === 'DEMO' && (
      <p className="shop-product-demo-note">
        {es
          ? 'Precio referencial. El encargo y el pago son DEMO: no se cobra dinero, ni se confirma fabricación o fecha de entrega.'
          : 'Reference price. The order and payment are DEMO: no money is charged, and production or delivery dates are not confirmed.'}
      </p>
    )}
    <p className="shop-selection-hint">{es ? '¿Necesitás otro tamaño o modificar la pieza?' : 'Need a different size or a modified part?'} <Link to="/solicitud">{es ? 'Solicitar una versión personalizada' : 'Request a custom version'} →</Link></p>
    {product.availableColors?.length > 0 && (
      <div className="shop-color-selection">
        <span id="shop-color-legend">{es ? 'Elegí el color' : 'Choose a color'}</span>
        <div className="shop-color-chips" role="radiogroup" aria-labelledby="shop-color-legend">
          {product.availableColors.map(value => {
            const isSelected = color === value;
            const bg = FILAMENT_SWATCHES[value] || 'var(--line-strong)';
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`shop-color-chip ${isSelected ? 'is-selected' : ''}`}
                onClick={() => { setColor(value); setNotice(''); }}
                onKeyDown={event => {
                  const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
                  if (!direction) return;
                  event.preventDefault();
                  const next = (product.availableColors.indexOf(value) + direction + product.availableColors.length) % product.availableColors.length;
                  setColor(product.availableColors[next]); setNotice('');
                  event.currentTarget.parentElement.querySelectorAll('[role="radio"]')[next].focus();
                }}
              >
                <span className="shop-color-chip__dot" style={{ backgroundColor: bg }} aria-hidden="true" />
                <span>{value}</span>
              </button>
            );
          })}
        </div>
      </div>
    )}
    {product.availableColors?.length > 0 && !color && <p className="shop-selection-hint">{es ? 'Seleccioná un color para agregar la pieza.' : 'Select a color to add this part.'}</p>}
    <label>{es ? 'Cantidad' : 'Quantity'}<input required type="number" min="1" max={MAX_CATALOG_ORDER_QUANTITY} step="1" value={quantity} aria-describedby="shop-quantity-help" onChange={event => { setQuantity(event.target.value); setNotice(''); }} /></label>
    <small id="shop-quantity-help" className="shop-selection-hint">{es ? `Máximo ${MAX_CATALOG_ORDER_QUANTITY} unidades por pieza en este encargo.` : `Maximum ${MAX_CATALOG_ORDER_QUANTITY} units per part in this order.`}</small>
    {!product.availableColors?.length && <p>{es ? 'Este modelo necesita que el taller registre sus colores antes de poder pedirlo.' : 'The workshop needs to list this model’s colors before you can order it.'}</p>}
    {user?.role === 'admin' && <p role="status">{es ? 'La compra pertenece a una cuenta de cliente. Podés seguir explorando o volver a Administración.' : 'Purchases belong to customer accounts. Keep browsing or return to Admin.'} <Link to="/admin">{es ? 'Abrir Administración' : 'Open Admin'} ↗</Link></p>}
    {canShop
      ? <button className="v-button v-button--primary v-button--pill" disabled={!valid}>{es ? 'Agregar al carrito' : 'Add to cart'} ↗</button>
      : user?.role !== 'admin' && <div className="shop-cart-session-state shop-cart-session-state--guest">
        <p>{es ? 'Para agregar esta pieza necesitás iniciar sesión con una cuenta de cliente.' : 'Sign in with a customer account to add this part.'}</p>
        <div className="shop-cart-auth-actions">
          <Link className="v-button v-button--primary v-button--pill shop-cart-auth-btn" to="/login" state={{ from: returnToProduct, reason: 'catalog-customer-required', pendingCartSelection: cartSelectionForAuth }}>{es ? 'Iniciar sesión para agregar' : 'Sign in to add'} ↗</Link>
          <Link className="v-link-text" to="/registro" state={{ from: returnToProduct, reason: 'catalog-customer-required', pendingCartSelection: cartSelectionForAuth }}>{es ? 'Crear cuenta' : 'Create account'} →</Link>
        </div>
      </div>}
    {notice && user?.role === 'customer' && <p role="status">{notice} <Link to="/carrito">{es ? 'Ver carrito' : 'View cart'} →</Link></p>}
  </form>;
}

export function ProductPage() {
  const { id } = useParams(); const { language } = usePreferences(); const es = language === 'es';
  const location = useLocation();
  const { status, products, retry } = useCatalog();
  const product = products.find(item => String(item.id) === id && isOrderableProduct(item));
  return <section className="shop-page"><Link className="v-link-text" to={`/catalogo${location.search}`}>← {es ? 'Volver al catálogo' : 'Back to catalog'}</Link><CatalogState status={status} retry={retry} es={es} />
    {status === 'success' && (product ? (
      <>
        <div className="shop-product">
          <ProductMedia key={`media-${id}`} product={product} es={es} />
          <ProductSelection key={`selection-${id}`} product={product} es={es} />
        </div>
        <ProductReviews key={`reviews-${id}`} productId={id} es={es} />
      </>
    ) : <EmptyState title={es ? 'Este modelo no está publicado' : 'This model is not published'} />)}</section>;
}

function loadPaypalSdk(clientId) {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (window.__verticePaypalSdkPromise) return window.__verticePaypalSdkPromise;
  window.__verticePaypalSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({ 'client-id': clientId, currency: 'USD', intent: 'capture', components: 'buttons', 'enable-funding': 'card' });
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.onload = () => window.paypal ? resolve(window.paypal) : reject(new Error('PAYPAL_SDK_UNAVAILABLE'));
    script.onerror = () => reject(new Error('PAYPAL_SDK_UNAVAILABLE'));
    document.head.appendChild(script);
  }).catch(error => {
    window.__verticePaypalSdkPromise = null;
    throw error;
  });
  return window.__verticePaypalSdkPromise;
}

function PendingOrderCheckout({ orderId, routePayment, routeProviderToken, es, token, cart, navigate, onBack }) {
  const [order, setOrder] = useState(null);
  const [loadedKey, setLoadedKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paypalSession, setPaypalSession] = useState(null);
  const [paypalButtonStatus, setPaypalButtonStatus] = useState('idle');
  const paypalButtonHost = useRef(null);
  const sdkCaptureInProgress = useRef(false);
  const [proof, setProof] = useState({ referenceNumber: '', sinpePhone: '', proofNotes: '', proofFileName: '', proofImageDataUrl: '' });
  const [readingProof, setReadingProof] = useState(false);
  const captureRef = useRef('');
  const clearCart = cart.clear;
  const requestKey = `${orderId}:${routePayment || ''}:${routeProviderToken || ''}`;

  useEffect(() => {
    const abort = new AbortController();
    fetchMyOrders({ token, signal: abort.signal }).then(async result => {
      const current = (result.orders || []).find(item => String(item.id) === String(orderId));
      if (!current) throw Object.assign(new Error('ORDER_NOT_FOUND'), { code: 'ORDER_NOT_FOUND' });
      setOrder(current);
      if (routePayment === 'cancel') {
        setNotice(es ? 'Volviste de PayPal sin confirmar el pago. Podés retomar el checkout de Sandbox desde aquí.' : 'You returned from PayPal without confirming payment. Resume the Sandbox checkout here.');
        return;
      }
      if (routePayment !== 'return' || !routeProviderToken || captureRef.current === routeProviderToken) return;
      captureRef.current = routeProviderToken;
      setSubmitting(true);
      const captured = await capturePaypalCheckout({ orderId, paypalOrderId: routeProviderToken }, { token, signal: abort.signal });
      setOrder(captured.order);
      if (!captured.order.sourceQuoteId && !captured.order.customPrintRequestId) clearCart();
      navigate(`/pedidos/${encodeURIComponent(captured.order.id)}`, { replace: true, state: { paymentConfirmation: captured.order.paymentMode } });
    }).catch(failure => {
      if (failure.name === 'AbortError') return;
      setError(failure.code === 'PAYMENT_REQUIRES_REVIEW'
        ? (es ? 'PayPal devolvió un importe inesperado. El pedido quedó retenido para revisión; no intentes pagarlo otra vez.' : 'PayPal returned an unexpected amount. The order is on hold for review; do not try to pay again.')
        : failure.code === 'ORDER_NOT_FOUND'
          ? (es ? 'No encontramos este pedido en tu cuenta. Revisá Mis pedidos antes de continuar.' : 'This order was not found in your account. Check My orders before continuing.')
          : (es ? 'No se pudo confirmar el pago con PayPal. El pedido sigue pendiente; verificá el estado antes de volver a intentar.' : 'PayPal could not confirm payment. The order remains pending; check its status before retrying.'));
    }).finally(() => { if (!abort.signal.aborted) { setLoadedKey(requestKey); setSubmitting(false); } });
    return () => abort.abort();
  }, [orderId, routePayment, routeProviderToken, token, es, navigate, clearCart, requestKey]);

  async function startPaypal() {
    if (submitting || !order || order.status !== 'PENDING') return;
    setSubmitting(true); setError(''); setNotice('');
    try {
      if (paymentMethod === 'card') {
        const config = await fetchPaypalClientConfig({ orderId: order.id }, { token });
        if (!config.clientId) throw Object.assign(new Error(), { code: 'PAYPAL_NOT_CONFIGURED' });
        const paypal = await loadPaypalSdk(config.clientId);
        const cardEligibility = paypal.Buttons({ fundingSource: paypal.FUNDING.CARD, createOrder: () => 'eligibility-check' });
        if (!cardEligibility.isEligible()) throw Object.assign(new Error(), { code: 'CARD_NOT_AVAILABLE' });
      }
      const result = await createPaypalCheckout({ orderId: order.id }, { token });
      setOrder(current => ({ ...current, paypalCheckout: { status: 'CREATED', approvalUrl: result.approvalUrl,
        providerOrderId: result.providerOrderId, amountUsd: result.amountUsd, fxSnapshot: result.fxSnapshot } }));
      if (!result.clientId || !result.providerOrderId) throw Object.assign(new Error(), { code: 'PAYPAL_RESPONSE_INVALID' });
      setPaypalButtonStatus('loading');
      setPaypalSession({ method: paymentMethod, clientId: result.clientId, providerOrderId: result.providerOrderId });
      setNotice(es ? 'Revisá el equivalente en USD y la tasa. Confirmá el pago en la ventana segura de PayPal Sandbox.' : 'Review the USD equivalent and rate. Confirm the payment in the secure PayPal Sandbox window.');
    } catch (failure) {
      const messages = {
        PAYPAL_NOT_CONFIGURED: es ? 'PayPal Sandbox todavía no está configurado en el servidor. Podés reportar un SINPE DEMO o volver luego.' : 'PayPal Sandbox is not configured on the server yet. You can submit a SINPE DEMO proof or return later.',
        PAYPAL_CREDENTIALS_INVALID: es ? 'El servidor rechazó las credenciales Sandbox. Revisá la app REST sin compartir su Secret.' : 'The server rejected the Sandbox credentials. Check the REST app without sharing its Secret.',
        FX_PROVIDER_UNAVAILABLE: es ? 'No se obtuvo un tipo de cambio actual; el pago no se inició. Intentá más tarde.' : 'A current exchange rate was unavailable; payment was not started. Try again later.',
        CARD_NOT_AVAILABLE: es ? 'Esta cuenta Sandbox no habilita pago con tarjeta. No se inició el pago; elegí PayPal o SINPE DEMO.' : 'This Sandbox account does not enable card payments. No payment was started; choose PayPal or SINPE DEMO.',
      };
      setError(messages[failure.code] || (es ? 'No se pudo iniciar PayPal Sandbox. No se registró ningún pago; el pedido sigue pendiente.' : 'PayPal Sandbox could not start. No payment was recorded; the order remains pending.'));
    } finally { setSubmitting(false); }
  }

  useEffect(() => {
    if (!paypalSession || !paypalButtonHost.current) return undefined;
    let cancelled = false;
    const host = paypalButtonHost.current;
    host.replaceChildren();
    setPaypalButtonStatus('loading');
    loadPaypalSdk(paypalSession.clientId).then(async paypal => {
      if (cancelled) return;
      const fundingSource = paypalSession.method === 'card' ? paypal.FUNDING.CARD : paypal.FUNDING.PAYPAL;
      const buttons = paypal.Buttons({
        fundingSource,
        createOrder: () => paypalSession.providerOrderId,
        onApprove: async data => {
          if (cancelled || sdkCaptureInProgress.current) return;
          sdkCaptureInProgress.current = true;
          setSubmitting(true); setError(''); setNotice('');
          try {
            const result = await capturePaypalCheckout({ orderId, paypalOrderId: data.orderID }, { token });
            setOrder(result.order);
            if (!result.order.sourceQuoteId && !result.order.customPrintRequestId) clearCart();
            navigate(`/pedidos/${encodeURIComponent(result.order.id)}`, { replace: true, state: { paymentConfirmation: result.order.paymentMode } });
          } catch (failure) {
            setError(failure.code === 'PAYMENT_REQUIRES_REVIEW'
              ? (es ? 'PayPal devolvió un importe inesperado. El pedido quedó retenido para revisión; no intentes pagarlo otra vez.' : 'PayPal returned an unexpected amount. The order is on hold for review; do not try again.')
              : (es ? 'No pudimos confirmar el pago. Revisá el estado del pedido antes de reintentar.' : 'We could not confirm the payment. Check the order status before retrying.'));
          } finally { sdkCaptureInProgress.current = false; setSubmitting(false); }
        },
        onCancel: () => setNotice(es ? 'Cancelaste en PayPal. El pedido sigue pendiente y no se registró un pago.' : 'You cancelled in PayPal. The order remains pending and no payment was recorded.'),
        onError: () => setError(es ? 'PayPal Sandbox no pudo completar este intento. No se confirmó el pago; podés reintentar o elegir otro método.' : 'PayPal Sandbox could not complete this attempt. Payment was not confirmed; retry or choose another method.'),
      });
      if (!buttons.isEligible()) {
        if (!cancelled) setPaypalButtonStatus('unavailable');
        return;
      }
      await buttons.render(host);
      if (!cancelled) setPaypalButtonStatus('ready');
    }).catch(() => {
      if (!cancelled) {
        setPaypalButtonStatus('unavailable');
        setError(es ? 'No se pudo cargar PayPal Sandbox. El pedido sigue pendiente; probá de nuevo o usá SINPE DEMO.' : 'PayPal Sandbox could not load. The order remains pending; retry or use SINPE DEMO.');
      }
    });
    return () => { cancelled = true; host.replaceChildren(); };
  }, [paypalSession, orderId, token, es, navigate, clearCart]);

  async function sendSinpe(event) {
    event.preventDefault();
    if (submitting || !order || order.status !== 'PENDING') return;
    setSubmitting(true); setError(''); setNotice('');
    try {
      const result = await submitOrderPaymentProof({ orderId: order.id, ...proof }, { token });
      setOrder(result.order);
      setNotice(es ? 'Comprobante DEMO enviado al taller. El pedido sigue pendiente hasta que Admin lo verifique.' : 'DEMO proof sent to the workshop. The order remains pending until Admin verifies it.');
      if (!result.order.sourceQuoteId && !result.order.customPrintRequestId) cart.clear();
    } catch (failure) {
      const messages = {
        INVALID_REFERENCE: es ? 'La referencia debe tener entre 4 y 100 caracteres.' : 'Reference must be 4–100 characters.',
        INVALID_PHONE: es ? 'El teléfono SINPE debe tener entre 8 y 25 caracteres.' : 'SINPE phone must be 8–25 characters.',
        INVALID_PROOF_IMAGE: es ? 'Adjuntá una imagen PNG, JPG o WebP válida de hasta 1.5 MB.' : 'Attach a valid PNG, JPG or WebP image up to 1.5 MB.',
        PROOF_ALREADY_SUBMITTED: es ? 'Ya hay un comprobante en revisión para este pedido.' : 'A proof is already being reviewed for this order.',
        STATUS_CONFLICT: es ? 'Este pedido ya no admite el envío de un comprobante.' : 'This order can no longer accept a payment proof.',
      };
      setError(messages[failure.code] || (es ? 'No se pudo guardar el comprobante. Revisá los datos e intentá de nuevo.' : 'The proof could not be saved. Check the details and retry.'));
    } finally { setSubmitting(false); }
  }

  function selectProofImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1_500_000) {
      setError(es ? 'Elegí un comprobante PNG, JPG o WebP de máximo 1.5 MB.' : 'Choose a PNG, JPG or WebP proof image under 1.5 MB.');
      event.target.value = '';
      return;
    }
    setReadingProof(true); setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setProof(current => ({ ...current, proofFileName: file.name, proofImageDataUrl: reader.result }));
      setReadingProof(false);
    };
    reader.onerror = () => { setReadingProof(false); setError(es ? 'No se pudo leer la imagen. Probá con otro archivo.' : 'The image could not be read. Try another file.'); };
    reader.readAsDataURL(file);
  }

  const amountCrc = order?.total ?? order?.subtotalCrc ?? order?.subtotal;
  const hasUnconfirmedCharges = !Number.isFinite(order?.shipping) || !Number.isFinite(order?.taxes);
  const checkoutBreakdown = [
    ['subtotal', es ? 'Piezas' : 'Parts', order?.subtotal],
    ['shipping', es ? 'Entrega' : 'Delivery', order?.shipping],
    ['discount', es ? 'Descuento' : 'Discount', order?.discount],
    ['taxes', es ? 'Impuestos' : 'Taxes', order?.taxes],
  ].filter(([, , amount]) => Number.isFinite(amount));
  const canPay = order?.status === 'PENDING' && order?.paymentStatus !== 'PAID' && order?.paymentStatus !== 'REVIEW_REQUIRED'
    && order?.paymentProof?.status !== 'SUBMITTED';

  if (loadedKey !== requestKey) return <p role="status">{es ? 'Recuperando pedido y estado del pago…' : 'Retrieving order and payment status…'}</p>;
  if (!order) return <div className="shop-checkout-card"><p role="alert">{error}</p><Link className="v-link-text" to="/cuenta?tab=orders">{es ? 'Revisar Mis pedidos' : 'Check My orders'} ↗</Link></div>;

  return <div className="shop-checkout-layout"><section className="shop-checkout-card" aria-labelledby="checkout-order-heading">
    <span className="shop-facet-label">{order.sourceQuoteId ? (es ? 'COTIZACIÓN APROBADA' : 'APPROVED QUOTE') : (es ? 'ENCARGO DE CATÁLOGO' : 'CATALOG ORDER')}</span>
    <h2 id="checkout-order-heading">{order.scopeSnapshot?.name || (es ? `Pedido ${order.id}` : `Order ${order.id}`)}</h2>
    {order.scopeSnapshot && <p>{[order.scopeSnapshot.material, order.scopeSnapshot.dimensions, order.scopeSnapshot.quantity && `${order.scopeSnapshot.quantity} ${es ? 'unidad(es)' : 'unit(s)'}`].filter(Boolean).join(' · ')}</p>}
    {(order.orderItems || []).map(item => <div className="shop-checkout-item" key={item.id || item.productId}><span>{[item.productName || item.currentCatalogName || item.productId, item.color, item.material, `×${item.quantity}`].filter(Boolean).join(' · ')}</span><strong>{formatCRC(item.subtotal ?? item.unitPrice * item.quantity)}</strong></div>)}
    {checkoutBreakdown.length > 0 && <dl className="shop-checkout-breakdown" aria-label={es ? 'Desglose del monto' : 'Amount breakdown'}>{checkoutBreakdown.map(([key, label, amount]) => <div key={key}><dt>{label}</dt><dd>{formatCRC(amount)}</dd></div>)}</dl>}
    <div className="shop-checkout-total"><span>{hasUnconfirmedCharges ? (es ? 'Importe registrado en CRC' : 'Recorded amount in CRC') : (es ? 'Total acordado en CRC' : 'Agreed total in CRC')}</span><strong>{formatCRC(amountCrc)}</strong></div>
    {hasUnconfirmedCharges && <p className="shop-checkout-terms-note">{es ? 'El importe mostrado cubre solo los conceptos listados. Cualquier costo de entrega o impuesto que aún no esté confirmado se coordina aparte con el taller; no está incluido.' : 'The amount shown covers only the listed items. Any delivery charge or tax not yet confirmed will be arranged separately with the workshop; it is not included.'}</p>}
    <p className="shop-checkout-demo-note">{es ? 'Vértice es una demo académica. PayPal Sandbox usa saldo de prueba, no dinero real. La conversión es referencial; tu banco o PayPal podría aplicar otra tasa.' : 'Vértice is an academic demo. PayPal Sandbox uses test funds, not real money. Conversion is indicative; your bank or PayPal may apply another rate.'}</p>
    {order.paypalCheckout?.fxSnapshot && <dl className="shop-fx-snapshot"><div><dt>{es ? 'Equivalente PayPal Sandbox' : 'PayPal Sandbox equivalent'}</dt><dd>{new Intl.NumberFormat(es ? 'es-CR' : 'en-US', { style: 'currency', currency: 'USD' }).format(order.paypalCheckout.amountUsd)}</dd></div><div><dt>{es ? 'Tasa de referencia' : 'Reference rate'}</dt><dd>1 USD = {order.paypalCheckout.fxSnapshot.rate} CRC · {order.paypalCheckout.fxSnapshot.rateDate.slice(0, 10)}</dd></div><div><dt>{es ? 'Fuente' : 'Source'}</dt><dd><a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">{order.paypalCheckout.fxSnapshot.source}</a></dd></div></dl>}
    {order.paymentProof?.status === 'SUBMITTED' && <p className="shop-checkout-status" role="status">{es ? 'Comprobante SINPE enviado · pendiente de revisión del taller.' : 'SINPE proof submitted · awaiting workshop review.'}</p>}
    {order.paymentProof?.status === 'REJECTED' && <p className="shop-checkout-status shop-checkout-status--error" role="alert">{es ? `Comprobante observado: ${order.paymentProof.rejectionReason || 'revisá los datos y enviá uno nuevo.'}` : `Proof rejected: ${order.paymentProof.rejectionReason || 'check details and submit again.'}`}</p>}
    {order.status === 'PENDING' && !order.paymentProof?.status && <p className="shop-checkout-status" role="status">{es ? 'Pedido pendiente de pago · elegí un método para confirmarlo.' : 'Order awaiting payment · choose a method to confirm it.'}</p>}
    {order.paymentStatus === 'REVIEW_REQUIRED' && <p role="alert">{es ? 'El proveedor devolvió un monto distinto al esperado. El pedido requiere revisión; no vuelvas a iniciar el pago.' : 'The provider returned a different amount. The order needs review; do not start another payment.'}</p>}
    {notice && <p className="shop-checkout-status" role="status">{notice}</p>}
    {canPay && <div className="shop-payment-options">
      <fieldset className="shop-payment-methods">
        <legend>{es ? 'Elegí cómo querés pagar' : 'Choose how to pay'}</legend>
        <button type="button" className={`shop-payment-method${paymentMethod === 'paypal' ? ' is-selected' : ''}`} aria-pressed={paymentMethod === 'paypal'} disabled={order.paypalCheckout?.status === 'CREATED' && paymentMethod !== 'paypal'} onClick={() => setPaymentMethod('paypal')}>
          <strong>PayPal</strong><span>{es ? 'Cuenta Sandbox · fondos de prueba' : 'Sandbox account · test funds'}</span>
        </button>
        <button type="button" className={`shop-payment-method${paymentMethod === 'card' ? ' is-selected' : ''}`} aria-pressed={paymentMethod === 'card'} disabled={order.paypalCheckout?.status === 'CREATED' && paymentMethod !== 'card'} onClick={() => setPaymentMethod('card')}>
          <strong>{es ? 'Tarjeta de crédito o débito' : 'Credit or debit card'}</strong><span>{es ? 'Checkout seguro de PayPal Sandbox; disponibilidad según la cuenta de prueba' : 'PayPal Sandbox checkout; availability depends on the test account'}</span>
        </button>
        <button type="button" className={`shop-payment-method${paymentMethod === 'sinpe' ? ' is-selected' : ''}`} aria-pressed={paymentMethod === 'sinpe'} disabled={order.paypalCheckout?.status === 'CREATED' && paymentMethod !== 'sinpe'} onClick={() => setPaymentMethod('sinpe')}>
          <strong>SINPE Móvil · DEMO</strong><span>{es ? 'Adjuntá el comprobante para revisión manual del taller' : 'Attach proof for manual workshop review'}</span>
        </button>
      </fieldset>
      {order.paypalCheckout?.status === 'CREATED' && <p className="shop-checkout-status">{es ? 'Ya iniciaste el checkout de PayPal. Terminá o cancelá ese intento antes de cambiar de método.' : 'PayPal checkout has already started. Finish or cancel that attempt before changing payment methods.'}</p>}
      {paymentMethod !== 'sinpe' && <div className="shop-payment-provider">
        <p>{paymentMethod === 'card'
          ? (es ? 'Vas a continuar al entorno Sandbox de PayPal. Si la cuenta de prueba permite pago con tarjeta, elegí esa opción allí; este sitio no almacena datos de tarjeta.' : 'You will continue to PayPal Sandbox. If the test account allows card payments, choose that option there; this site does not store card details.')
          : (es ? 'El cobro de prueba se autoriza en PayPal Sandbox. Revisá el total y la conversión antes de aprobar.' : 'The test payment is authorized in PayPal Sandbox. Review the total and conversion before approving.')}</p>
        {!paypalSession && <button className="v-button v-button--primary v-button--pill" type="button" onClick={startPaypal} disabled={submitting}>{submitting ? (es ? 'Conectando…' : 'Connecting…') : (paymentMethod === 'card' ? (es ? 'Continuar con tarjeta en PayPal Sandbox' : 'Continue with card in PayPal Sandbox') : (es ? 'Continuar con PayPal Sandbox' : 'Continue with PayPal Sandbox'))}</button>}
        {paypalSession && <div className="shop-paypal-sdk"><div ref={paypalButtonHost} aria-label={paymentMethod === 'card' ? (es ? 'Pago con tarjeta por PayPal' : 'PayPal card payment') : (es ? 'Pago con PayPal' : 'PayPal payment')} />{paypalButtonStatus === 'loading' && <p role="status">{es ? 'Cargando checkout seguro…' : 'Loading secure checkout…'}</p>}{paypalButtonStatus === 'unavailable' && <p role="status">{paymentMethod === 'card' ? (es ? 'Esta cuenta Sandbox no habilita el pago con tarjeta. Elegí PayPal o SINPE DEMO.' : 'This Sandbox account does not enable card payments. Choose PayPal or SINPE DEMO.') : (es ? 'El botón PayPal no está disponible. Revisá conexión y configuración Sandbox.' : 'The PayPal button is unavailable. Check network and Sandbox setup.')}</p>}</div>}
      </div>}
      {paymentMethod === 'sinpe' && order.paypalCheckout?.status !== 'CREATED' && <form className="shop-sinpe-form" onSubmit={sendSinpe}>
        <h3>{es ? 'Pago reportado · SINPE Móvil DEMO' : 'Reported payment · SINPE Móvil DEMO'}</h3>
        <p>{es ? 'El taller revisa el comprobante antes de confirmar. Este formulario no consulta BAC ni verifica transferencias automáticamente.' : 'The workshop reviews the proof before confirmation. This form does not query BAC or automatically verify transfers.'}</p>
        <label>{es ? 'Número de referencia' : 'Reference number'}<input required minLength="4" maxLength="100" value={proof.referenceNumber} onChange={event => setProof(current => ({ ...current, referenceNumber: event.target.value }))} /></label>
        <label>{es ? 'Teléfono SINPE del remitente' : 'Sender’s SINPE phone'}<input required minLength="8" maxLength="25" autoComplete="tel" value={proof.sinpePhone} onChange={event => setProof(current => ({ ...current, sinpePhone: event.target.value }))} /></label>
        <label>{es ? 'Foto o captura del comprobante' : 'Proof photo or screenshot'}<input type="file" accept="image/png,image/jpeg,image/webp" required onChange={selectProofImage} disabled={submitting || readingProof} /><span>{proof.proofFileName || (es ? 'PNG, JPG o WebP · máximo 1.5 MB' : 'PNG, JPG or WebP · 1.5 MB max')}</span></label>
        {proof.proofImageDataUrl && <img className="shop-sinpe-proof-preview" src={proof.proofImageDataUrl} alt={es ? 'Vista previa del comprobante seleccionado' : 'Preview of selected payment proof'} />}
        <label>{es ? 'Nota opcional' : 'Optional note'}<textarea maxLength="500" value={proof.proofNotes} onChange={event => setProof(current => ({ ...current, proofNotes: event.target.value }))} /></label>
        <button className="v-button v-button--secondary" type="submit" disabled={submitting || readingProof || !proof.proofImageDataUrl || order.paymentProof?.status === 'SUBMITTED'}>{readingProof ? (es ? 'Leyendo imagen…' : 'Reading image…') : submitting ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar comprobante para revisión' : 'Submit proof for review')}</button>
      </form>}
    </div>}
    {error && <p className="shop-cart-error" role="alert">{error}</p>}
    <div className="shop-checkout-links"><button type="button" className="v-link-text" onClick={onBack}>{es ? 'Volver a mi selección' : 'Back to my selection'}</button><Link className="v-link-text" to={`/pedidos/${encodeURIComponent(order.id)}`}>{es ? 'Ver estado del pedido' : 'View order status'} ↗</Link></div>
  </section></div>;
}

export function CartPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const cart = useCart(); const { status, products, retry } = useCatalog();
  const { user, token } = useAuth(); const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeOrderId = searchParams.get('orderId');
  const routePayment = searchParams.get('paypal');
  const routeProviderToken = searchParams.get('token');
  const lines = reconcileCart(cart.lines, products);
  const subtotal = lines.reduce((sum, line) => sum + (line.subtotal || 0), 0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const idempotencyRef = useRef(null);
  const canConfirm = status === 'success' && lines.length > 0 && lines.every(line => line.available && line.subtotal !== null)
    && Number.isFinite(subtotal) && Number.isSafeInteger(Math.round(subtotal * 100));
  async function confirmOrder() {
    if (submittingRef.current || !canConfirm) return;
    if (!user) { navigate('/login', { state: { from: '/carrito' } }); return; }
    if (user.role !== 'customer' || !token) {
      setError(es ? 'Para confirmar un encargo necesitás una sesión activa de cliente.' : 'An active customer account is required to confirm an order.');
      return;
    }
    const fingerprint = JSON.stringify(cart.lines);
    if (idempotencyRef.current?.fingerprint !== fingerprint) {
      idempotencyRef.current = { fingerprint, key: createCatalogOrderIdempotencyKey() };
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError('');
    try {
      const result = await submitCatalogOrder({
        items: lines.map(line => ({ productId: line.productId, color: line.color, quantity: line.quantity })),
        idempotencyKey: idempotencyRef.current.key,
      }, { token });
      const next = new URLSearchParams(searchParams);
      next.set('orderId', result.order.id);
      setSearchParams(next, { replace: true });
    } catch (failure) {
      const messages = {
        PRODUCT_UNAVAILABLE: es ? 'Un modelo o color dejó de estar publicado. Actualizá el carrito antes de reintentar.' : 'A model or color is no longer published. Refresh the cart before trying again.',
        IDEMPOTENCY_CONFLICT: es ? 'El encargo anterior no se pudo confirmar con esta selección. Revisá el estado antes de volver a intentar.' : 'The earlier attempt conflicts with this selection. Check its status before retrying.',
        CUSTOMER_REQUIRED: es ? 'Tu sesión de cliente ya no está activa. Iniciá sesión y volvé a confirmar.' : 'Your customer session is no longer active. Sign in and retry.',
      };
      setError(messages[failure.code] || (es ? 'No se pudo guardar el encargo. El carrito sigue intacto; podés reintentar.' : 'The order could not be saved. Your cart is unchanged; you can retry.'));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }
  function returnToSelection() {
    const next = new URLSearchParams(searchParams);
    next.delete('orderId'); next.delete('paypal'); next.delete('token');
    setSearchParams(next, { replace: true });
    setError('');
  }
  if (routeOrderId) return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Pago de prueba · Sandbox / DEMO' : 'Test payment · Sandbox / DEMO'}</span><h1>{es ? 'Revisá y pagá tu pedido.' : 'Review and pay your order.'}</h1><p>{es ? 'La cotización se aprueba en tu cuenta; el pago ocurre aquí. Ningún pedido se confirma antes de verificar el método elegido.' : 'Quotes are approved in your account; payment happens here. No order is confirmed before the selected method is verified.'}</p></header><PendingOrderCheckout orderId={routeOrderId} routePayment={routePayment} routeProviderToken={routeProviderToken} es={es} token={token} cart={cart} navigate={navigate} onBack={returnToSelection} /></section>;
  return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Tu selección' : 'Your selection'}</span><h1>{es ? 'Carrito' : 'Cart'}</h1><p>{es ? 'Piezas para imprimir bajo pedido. Podés ajustar tu selección antes de continuar.' : 'Parts printed to order. Adjust your selection before continuing.'}</p></header>
    {!cart.ready ? <div role="status" aria-label={es ? 'Cargando tu carrito' : 'Loading your cart'}><Skeleton height="190px" /></div> : <>
    {cart.storageError && <p role="alert">{es ? 'Tu navegador no permite guardar el carrito. La selección se conserva mientras esta pestaña siga abierta.' : 'Your browser cannot save this cart. Your selection remains while this tab stays open.'}</p>}
    {!cart.lines.length ? <div className="shop-empty"><EmptyState title={es ? 'Tu próxima pieza empieza aquí.' : 'Your next part starts here.'} description={es ? 'Todavía no agregaste modelos al carrito.' : 'You have not added any models yet.'} /><Link className="v-button v-button--primary v-button--pill" to="/catalogo">{es ? 'Explorar modelos' : 'Explore models'} ↗</Link></div> : <>
      <CatalogState status={status} retry={retry} es={es} />
      {status === 'success' && <div className="shop-cart-layout"><div className="shop-cart-lines">{lines.map(line => <article className="shop-cart-line" key={JSON.stringify([line.productId, line.color])}>
        {line.product?.images?.[0] ? <div className="shop-cart-thumb"><img src={line.product.images[0]} alt={line.product?.name || line.productId} /></div> : null}
        <div className="shop-cart-info"><h2>{line.product?.name || line.productId}</h2><p className="shop-cart-meta">{line.color} · {line.product?.material}</p>
        {!line.available && <p role="alert">{es ? 'Este modelo o color ya no está publicado. Quitalo o elegí otro desde el catálogo.' : 'This model or color is no longer published. Remove it or choose another from the catalog.'}</p>}
        {line.available && <p>{formatCRC(line.product.price)} {es ? 'por unidad' : 'each'}</p>}</div>
        <div className="shop-cart-controls"><label><span className="v-sr-only">{es ? 'Cantidad de ' : 'Quantity of '}{line.product?.name || line.productId}</span><span className="shop-cart-qty-label">{es ? 'Cantidad' : 'Qty'}</span><input type="number" min="1" max={MAX_CATALOG_ORDER_QUANTITY} step="1" value={line.quantity} onChange={event => { const value = Number(event.target.value); setError(cart.update(line.productId, line.color, value) ? '' : (es ? `La cantidad debe ser un entero entre 1 y ${MAX_CATALOG_ORDER_QUANTITY}.` : `Quantity must be a whole number from 1 to ${MAX_CATALOG_ORDER_QUANTITY}.`)); }} /></label>
        <strong className="shop-cart-subtotal">{line.available ? formatCRC(line.subtotal) : '—'}</strong><button className="v-button v-button--ghost shop-cart-remove" aria-label={`${es ? 'Quitar' : 'Remove'} ${line.product?.name || line.productId}, ${line.color}`} onClick={() => cart.remove(line.productId, line.color)}>{es ? 'Quitar' : 'Remove'}</button></div></article>)}</div>
        <aside className="shop-cart-summary"><h2>{es ? 'Tu encargo' : 'Your order'}</h2><p>{es ? 'Subtotal de piezas' : 'Parts subtotal'}</p><strong className="shop-price">{formatCRC(subtotal)}</strong>
          <p className="shop-cart-fabrication-note">{es ? 'Todavía no se registra un pago. Al continuar se guarda un pedido pendiente; luego elegís PayPal Sandbox o reportás SINPE para revisión.' : 'No payment is recorded yet. Continuing saves a pending order; then choose PayPal Sandbox or submit SINPE for review.'}</p>
          {!canConfirm && <p className="shop-cart-error" role="status">{es ? 'Hay piezas o variantes no disponibles. Quitalas o elegí otra opción en la tienda para confirmar el encargo; no se incluyen en el subtotal.' : 'Some parts or variants are unavailable. Remove them or select another option in the shop to confirm; they are excluded from the subtotal.'}</p>}
          {!user && (
            <div className="shop-cart-session-state shop-cart-session-state--guest">
              <div className="shop-cart-session-badge">
                <span className="shop-cart-session-dot" />
                <span>{es ? 'Modo visitante · Sin sesión' : 'Guest mode · Signed out'}</span>
              </div>
              <p>{es ? 'Estás explorando como visitante. Para vincular y procesar tu encargo ingresá a tu cuenta o registrate gratis:' : 'You are browsing as a guest. To link and submit this order, sign in or register:'}</p>
              <div className="shop-cart-auth-actions">
                <Link to="/login" state={{ from: '/carrito' }} className="v-button v-button--ghost v-button--pill shop-cart-auth-btn">
                  {es ? 'Iniciar sesión' : 'Sign in'}
                </Link>
                <Link to="/registro" state={{ from: '/carrito' }} className="v-button v-button--ghost v-button--pill shop-cart-auth-btn">
                  {es ? 'Crear cuenta' : 'Register'}
                </Link>
              </div>
            </div>
          )}
          {user?.role === 'customer' && (
            <p className="shop-cart-owner">{es ? 'Encargo a nombre de' : 'Order for'} <strong>{user.name}</strong><Link to="/cuenta">{es ? 'Ver mi cuenta' : 'View my account'} ↗</Link></p>
          )}
          {user?.role === 'admin' && (
            <div className="shop-cart-session-state shop-cart-session-state--admin" role="status">
              <div className="shop-cart-session-badge">
                <span className="shop-cart-session-dot" />
                <span>{es ? `Sesión de taller: ${user.name}` : `Workshop admin: ${user.name}`}</span>
              </div>
              <p className="shop-cart-admin-notice">
                {es ? 'Estás conectado con rol de taller. Las órdenes de catálogo pertenecen a clientes. Para pruebas de compra, usá una cuenta de cliente o accedé a la gestión de pedidos.' : 'You are signed in with a workshop admin role. Catalog orders belong to customers. Use a customer account for test orders, or manage orders in the admin panel.'}
              </p>
              <div className="shop-cart-admin-actions">
                <Link to="/admin" className="v-button v-button--ghost v-button--pill shop-cart-auth-btn">
                  {es ? 'Gestionar pedidos en Admin' : 'Manage orders in Admin'} ↗
                </Link>
              </div>
            </div>
          )}
          {user?.role === 'admin' ? (
            <div className="shop-cart-admin-cta">
              <button className="v-button v-button--secondary v-button--pill" type="button" aria-label={es ? 'Checkout reservado para clientes' : 'Checkout reserved for customers'} disabled={true} title={es ? 'Acción reservada para cuentas de cliente' : 'Action reserved for customer accounts'}>
                {es ? 'Confirmar encargo (solo clientes)' : 'Confirm order (customers only)'}
              </button>
              <p className="shop-cart-admin-hint">
                {es ? 'Ingresá con una cuenta de cliente para comprar y recibir su comprobante DEMO.' : 'Sign in with a customer account to purchase and receive its DEMO receipt.'}
              </p>
            </div>
          ) : (
            <button className="v-button v-button--primary v-button--pill" type="button" onClick={confirmOrder} disabled={!canConfirm || submitting || user?.role !== 'customer'} aria-label={es ? `Continuar al pago ${formatCRC(subtotal)}` : `Continue to payment ${formatCRC(subtotal)}`}>
              {submitting ? (es ? 'Guardando encargo…' : 'Saving order…') : (es ? `Continuar al pago · ${formatCRC(subtotal)}` : `Continue to payment · ${formatCRC(subtotal)}`)}
            </button>
          )}
          {!user && <p className="shop-cart-guest-note">{es ? 'Iniciá sesión o creá una cuenta para vincular tu selección a tu cuenta y continuar al pago.' : 'Sign in or create an account to link your selection to your account and continue to payment.'}</p>}
          {error && <p className="shop-cart-error" role="alert">{error}</p>}
          <Link className="v-link-text" to="/catalogo">{es ? 'Seguir eligiendo piezas' : 'Keep choosing parts'} ↗</Link></aside></div>}
      </>}
    </>}
  </section>;
}
