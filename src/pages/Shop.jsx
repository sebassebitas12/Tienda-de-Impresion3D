import { useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, ProductCard, Skeleton } from '../components/ui/index.js';
import { FilterChips } from '../components/ui/FilterChips.jsx';
import { useCatalog } from '../hooks/useCatalog.js';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { createCatalogOrderIdempotencyKey, submitCatalogOrder } from '../services/commerceService.js';
import { isOrderableProduct, reconcileCart } from '../utils/cart.js';
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
    <figcaption>{es ? 'Fabricado bajo pedido' : 'Made to order'} · {product.material}</figcaption>
  </figure>{images.length > 1 && <div className="shop-gallery-thumbs" role="group" aria-label={es ? 'Fotos de la pieza' : 'Product photos'}>
    {images.map((image, index) => <button type="button" key={`${image}-${index}`} aria-pressed={selected === index} aria-label={`${es ? 'Ver foto' : 'View photo'} ${index + 1}`} onClick={() => { setSelected(index); setFailed(false); }}><img src={image} alt="" loading="lazy" /></button>)}
  </div>}</div>;
}

export function CatalogPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const { status, products, retry } = useCatalog();
  const [params, setParams] = useSearchParams();
  const materials = params.getAll('material'); const categories = params.getAll('categoria'); const query = params.get('buscar') || '';
  const orderable = products.filter(isOrderableProduct);
  const categoryOptions = [...new Map(orderable.filter(product => product.category?.id && product.category?.name).map(product => [String(product.category.id), product.category.name])).entries()];
  const filtered = orderable.filter(product => matchesFacet(product.material, materials) && matchesFacet(String(product.category?.id || ''), categories) && `${product.name} ${product.description || ''} ${product.category?.name || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Fabricado para vos' : 'Made for you'}</span><h1>{es ? 'Elegí tu próxima pieza.' : 'Choose your next piece.'}</h1><p>{es ? 'Modelos que imprimimos bajo pedido. Elegí la pieza, el color y la cantidad.' : 'Models printed to order. Choose a part, color and quantity.'}</p></header>
    <CatalogState status={status} retry={retry} es={es} />
    {status === 'success' && <><label className="shop-search">{es ? 'Buscar modelo' : 'Search models'}<input type="search" value={query} onChange={event => { const next = new URLSearchParams(params); if (event.target.value) next.set('buscar', event.target.value); else next.delete('buscar'); setParams(next, { replace: true }); }} /></label>
      {categoryOptions.length > 0 && <><p className="shop-facet-label">{es ? 'Tipo de pieza' : 'Part type'}</p><FilterChips label={es ? 'Tipo de pieza' : 'Part type'} selected={categories} onToggle={value => setParams(toggleFacetParams(params, 'categoria', value))} options={[{ value: 'all', label: es ? 'Todos' : 'All' }, ...categoryOptions.map(([value, label]) => ({ value, label }))]} /></>}
      <p className="shop-facet-label">{es ? 'Material' : 'Material'}</p>
      <FilterChips label={es ? 'Materiales' : 'Materials'} selected={materials} onToggle={value => setParams(toggleFacetParams(params, 'material', value))} options={[{ value: 'all', label: es ? 'Todos' : 'All' }, ...[...new Set(orderable.map(product => product.material))].map(value => ({ value, label: value }))]} />
      <p role="status">{filtered.length} {es ? 'modelos' : 'models'}</p>
      {filtered.length ? <div className="shop-grid">{filtered.map(product => <ProductCard key={product.id} product={{ ...product, categoryName: product.category?.name }} linkAs={Link} to={`/producto/${encodeURIComponent(product.id)}`} showPrice showMadeToOrder viewLabel={es ? 'Elegir pieza' : 'Choose part'} imageUnavailableLabel={es ? 'Imagen de producto próximamente' : 'Product image coming soon'} />)}</div> : <EmptyState title={es ? 'No hay modelos con esos filtros' : 'No models match these filters'} />}</>}
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
  const [color, setColor] = useState(''); const [quantity, setQuantity] = useState(1); const [notice, setNotice] = useState('');
  const valid = (product.availableColors || []).includes(color) && Number.isSafeInteger(Number(quantity)) && Number(quantity) >= 1;
  const canShop = !user || user.role === 'customer';
  return <form className="shop-selection" onSubmit={event => { event.preventDefault(); if (valid && cart.add(product.id, color, Number(quantity))) setNotice(es ? 'Pieza agregada a tu carrito.' : 'Part added to your cart.'); }}>
    <span>{product.category?.name} · {product.material}</span><h1>{product.name}</h1><p>{product.description}</p><strong className="shop-price">{formatCRC(product.price)}</strong>
    {product.priceSource === 'DEMO' && (
      <p className="shop-product-demo-note">
        {es
          ? 'Estimación académica referencial: precio y tiempos calculados por perfil análogo FDM; parámetros no certificados por laminador de producción.'
          : 'Benchmark academic estimate: price and print times calculated via analogue FDM profile; parameters not certified by a production slicer.'}
      </p>
    )}
    <p>{es ? 'Se fabrica bajo pedido. La entrega se coordina después de confirmar el encargo.' : 'Made to order. Delivery is arranged after confirming the job.'}</p>
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
    <label>{es ? 'Cantidad' : 'Quantity'}<input required type="number" min="1" step="1" value={quantity} onChange={event => { setQuantity(event.target.value); setNotice(''); }} /></label>
    {!product.availableColors?.length && <p>{es ? 'Este modelo necesita que el taller registre sus colores antes de poder pedirlo.' : 'The workshop needs to list this model’s colors before you can order it.'}</p>}
    {user?.role === 'admin' && <p role="status">{es ? 'El carrito y los encargos están disponibles para cuentas de cliente.' : 'The cart and orders are available to customer accounts.'}</p>}
    <button className="v-button v-button--primary v-button--pill" disabled={!valid || !canShop}>{es ? 'Agregar al carrito' : 'Add to cart'} ↗</button>
    {notice && (user?.role === 'customer'
      ? <p role="status">{notice} <Link to="/carrito">{es ? 'Ver carrito' : 'View cart'} →</Link></p>
      : <div role="status" className="shop-cart-guest-notice shop-cart-session-state shop-cart-session-state--guest">
        <p>{cart.storageError
          ? (es ? 'La selección se mantiene mientras esta pestaña esté abierta. Iniciá sesión o creá una cuenta para ver el carrito y continuar.' : 'Your selection remains while this tab stays open. Sign in or create an account to view the cart and continue.')
          : (es ? 'La pieza quedó guardada en este navegador. Iniciá sesión o creá una cuenta para ver el carrito y continuar.' : 'This part is saved in this browser. Sign in or create an account to view the cart and continue.')}</p>
        <p><Link to="/login" state={{ from: '/carrito' }}>{es ? 'Iniciar sesión' : 'Sign in'} →</Link><span aria-hidden="true"> · </span><Link to="/registro" state={{ from: '/carrito' }}>{es ? 'Crear cuenta' : 'Create account'} →</Link></p>
      </div>)}
  </form>;
}

export function ProductPage() {
  const { id } = useParams(); const { language } = usePreferences(); const es = language === 'es';
  const { status, products, retry } = useCatalog();
  const product = products.find(item => String(item.id) === id && isOrderableProduct(item));
  return <section className="shop-page"><Link className="v-link-text" to="/catalogo">← {es ? 'Volver al catálogo' : 'Back to catalog'}</Link><CatalogState status={status} retry={retry} es={es} />
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

export function CartPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const cart = useCart(); const { status, products, retry } = useCatalog();
  const { user, token } = useAuth(); const navigate = useNavigate();
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
      cart.clear();
      idempotencyRef.current = null;
      navigate('/cuenta', { state: { orderConfirmation: { id: result.order.id, subtotalCrc: result.order.subtotalCrc } } });
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
        <div className="shop-cart-controls"><label><span className="v-sr-only">{es ? 'Cantidad de ' : 'Quantity of '}{line.product?.name || line.productId}</span><span className="shop-cart-qty-label">{es ? 'Cantidad' : 'Qty'}</span><input type="number" min="1" step="1" value={line.quantity} onChange={event => { const value = Number(event.target.value); setError(cart.update(line.productId, line.color, value) ? '' : (es ? 'La cantidad debe ser un número entero mayor que cero.' : 'Quantity must be a positive whole number.')); }} /></label>
        <strong className="shop-cart-subtotal">{line.available ? formatCRC(line.subtotal) : '—'}</strong><button className="v-button v-button--ghost shop-cart-remove" aria-label={`${es ? 'Quitar' : 'Remove'} ${line.product?.name || line.productId}, ${line.color}`} onClick={() => cart.remove(line.productId, line.color)}>{es ? 'Quitar' : 'Remove'}</button></div></article>)}</div>
        <aside className="shop-cart-summary"><h2>{es ? 'Tu encargo' : 'Your order'}</h2><p>{es ? 'Subtotal de piezas' : 'Parts subtotal'}</p><strong className="shop-price">{formatCRC(subtotal)}</strong>
          <p className="shop-cart-fabrication-note">{es ? 'Confirmar registra tu encargo; no cobra ni inicia producción. El taller debe verificar el pago y confirmar entrega, costos adicionales y fecha. Este subtotal corresponde únicamente a las piezas.' : 'Confirmation records your order; it does not charge you or start production. The workshop must verify payment and confirm delivery, additional costs and date. This subtotal covers parts only.'}</p>
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
              <button className="v-button v-button--secondary v-button--pill" type="button" onClick={confirmOrder} aria-label={es ? 'Confirmar encargo' : 'Confirm order'} disabled={true} title={es ? 'Acción reservada para cuentas de cliente' : 'Action reserved for customer accounts'}>
                {es ? 'Confirmar encargo (Solo clientes)' : 'Confirm order (Customers only)'}
              </button>
              <p className="shop-cart-admin-hint">
                {es ? 'Ingresá con una cuenta de cliente para confirmar un encargo.' : 'Sign in with a customer account to confirm an order.'}
              </p>
            </div>
          ) : (
            <button className="v-button v-button--primary v-button--pill" type="button" onClick={confirmOrder} disabled={!canConfirm || submitting} aria-label={es ? 'Confirmar encargo' : 'Confirm order'}>
              {submitting ? (es ? 'Guardando encargo…' : 'Saving order…') : (es ? 'Confirmar encargo' : 'Confirm order')}
            </button>
          )}
          {!user && <p className="shop-cart-guest-note">{es ? 'Al pulsar Confirmar encargo se te solicitará iniciar sesión para continuar.' : 'Clicking Confirm order will prompt you to sign in to continue.'}</p>}
          {error && <p className="shop-cart-error" role="alert">{error}</p>}
          <Link className="v-link-text" to="/catalogo">{es ? 'Seguir eligiendo piezas' : 'Keep choosing parts'} ↗</Link></aside></div>}
      </>}
    </>}
  </section>;
}
