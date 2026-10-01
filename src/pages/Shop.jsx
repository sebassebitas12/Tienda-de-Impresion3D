import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, ProductCard, Skeleton } from '../components/ui/index.js';
import { FilterChips } from '../components/ui/FilterChips.jsx';
import { useCatalog } from '../hooks/useCatalog.js';
import { useCart } from '../hooks/useCart.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { isOrderableProduct, reconcileCart } from '../utils/cart.js';
import { matchesFacet, toggleFacetParams } from '../utils/facetFilters.js';
import { formatCRC } from '../utils/money.js';
import './shop.css';

function CatalogState({ status, retry, es }) {
  if (status === 'loading') return <div role="status" aria-label={es ? 'Cargando modelos' : 'Loading models'}><Skeleton height="180px" /></div>;
  if (status === 'error') return <ErrorState title={es ? 'No pudimos cargar los modelos' : 'Could not load models'} onRetry={retry} retryLabel={es ? 'Reintentar' : 'Retry'} />;
  return null;
}

function ProductMedia({ product, es }) {
  const [failed, setFailed] = useState(false);
  const src = !failed && product.images?.[0];
  return <figure className="shop-product-media"><img src={src || '/images/producto-temporal.png'} alt={src ? product.name : (es ? 'Imagen de producto próximamente' : 'Product image coming soon')} onError={() => setFailed(true)} /><figcaption>{es ? 'Fabricado bajo pedido' : 'Made to order'} · {product.material}</figcaption></figure>;
}

export function CatalogPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const { status, products, retry } = useCatalog();
  const [params, setParams] = useSearchParams();
  const materials = params.getAll('material'); const query = params.get('buscar') || '';
  const orderable = products.filter(isOrderableProduct);
  const filtered = orderable.filter(product => matchesFacet(product.material, materials) && `${product.name} ${product.description || ''} ${product.category?.name || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Fabricado para vos' : 'Made for you'}</span><h1>{es ? 'Elegí tu próxima pieza.' : 'Choose your next piece.'}</h1><p>{es ? 'Modelos que imprimimos bajo pedido. Elegí la pieza, el color y la cantidad.' : 'Models printed to order. Choose a part, color and quantity.'}</p></header>
    <CatalogState status={status} retry={retry} es={es} />
    {status === 'success' && <><label className="shop-search">{es ? 'Buscar modelo' : 'Search models'}<input type="search" value={query} onChange={event => { const next = new URLSearchParams(params); if (event.target.value) next.set('buscar', event.target.value); else next.delete('buscar'); setParams(next, { replace: true }); }} /></label>
      <FilterChips label={es ? 'Materiales' : 'Materials'} selected={materials} onToggle={value => setParams(toggleFacetParams(params, 'material', value))} options={[{ value: 'all', label: es ? 'Todos' : 'All' }, ...[...new Set(orderable.map(product => product.material))].map(value => ({ value, label: value }))]} />
      <p role="status">{filtered.length} {es ? 'modelos' : 'models'}</p>
      {filtered.length ? <div className="shop-grid">{filtered.map(product => <ProductCard key={product.id} product={{ ...product, categoryName: product.category?.name }} linkAs={Link} to={`/producto/${encodeURIComponent(product.id)}`} showPrice showMadeToOrder viewLabel={es ? 'Elegir pieza' : 'Choose part'} imageUnavailableLabel={es ? 'Imagen de producto próximamente' : 'Product image coming soon'} />)}</div> : <EmptyState title={es ? 'No hay modelos con esos filtros' : 'No models match these filters'} />}</>}
  </section>;
}

function ProductSelection({ product, es }) {
  const cart = useCart();
  const [color, setColor] = useState(''); const [quantity, setQuantity] = useState(1); const [notice, setNotice] = useState('');
  const valid = (product.availableColors || []).includes(color) && Number.isSafeInteger(Number(quantity)) && Number(quantity) >= 1;
  return <form className="shop-selection" onSubmit={event => { event.preventDefault(); if (valid && cart.add(product.id, color, Number(quantity))) setNotice(es ? 'Pieza agregada a tu carrito.' : 'Part added to your cart.'); }}>
    <span>{product.category?.name} · {product.material}</span><h1>{product.name}</h1><p>{product.description}</p><strong className="shop-price">{formatCRC(product.price)}</strong>
    <p>{es ? 'Se fabrica bajo pedido. La entrega se coordina después de confirmar el encargo.' : 'Made to order. Delivery is arranged after confirming the job.'}</p>
    <label>{es ? 'Color' : 'Color'}<select required value={color} onChange={event => { setColor(event.target.value); setNotice(''); }}><option value="">{es ? 'Elegí un color' : 'Choose a color'}</option>{product.availableColors?.map(value => <option key={value}>{value}</option>)}</select></label>
    <label>{es ? 'Cantidad' : 'Quantity'}<input required type="number" min="1" step="1" value={quantity} onChange={event => { setQuantity(event.target.value); setNotice(''); }} /></label>
    {!product.availableColors?.length && <p>{es ? 'Este modelo necesita que el taller registre sus colores antes de poder pedirlo.' : 'The workshop needs to list this model’s colors before you can order it.'}</p>}
    <button className="v-button v-button--primary v-button--pill" disabled={!valid}>{es ? 'Agregar al carrito' : 'Add to cart'} ↗</button>
    {notice && <p role="status">{notice} <Link to="/carrito">{es ? 'Ver carrito' : 'View cart'} →</Link></p>}
  </form>;
}

export function ProductPage() {
  const { id } = useParams(); const { language } = usePreferences(); const es = language === 'es';
  const { status, products, retry } = useCatalog();
  const product = products.find(item => String(item.id) === id && isOrderableProduct(item));
  return <section className="shop-page"><Link className="v-link-text" to="/catalogo">← {es ? 'Volver al catálogo' : 'Back to catalog'}</Link><CatalogState status={status} retry={retry} es={es} />
    {status === 'success' && (product ? <div className="shop-product"><ProductMedia key={id} product={product} es={es} /><ProductSelection key={id} product={product} es={es} /></div> : <EmptyState title={es ? 'Este modelo no está publicado' : 'This model is not published'} />)}</section>;
}

export function CartPage() {
  const { language } = usePreferences(); const es = language === 'es';
  const cart = useCart(); const { status, products, retry } = useCatalog();
  const lines = reconcileCart(cart.lines, products);
  const subtotal = lines.reduce((sum, line) => sum + (line.subtotal || 0), 0);
  const [error, setError] = useState('');
  return <section className="shop-page"><header className="shop-heading"><span>{es ? 'Tu selección' : 'Your selection'}</span><h1>{es ? 'Carrito' : 'Cart'}</h1><p>{es ? 'Piezas para imprimir bajo pedido. Podés ajustar tu selección antes de continuar.' : 'Parts printed to order. Adjust your selection before continuing.'}</p></header>
    {cart.storageError && <p role="alert">{es ? 'Tu navegador no permite guardar el carrito. La selección se conserva mientras esta pestaña siga abierta.' : 'Your browser cannot save this cart. Your selection remains while this tab stays open.'}</p>}
    {!cart.lines.length ? <div className="shop-empty"><EmptyState title={es ? 'Tu próxima pieza empieza aquí.' : 'Your next part starts here.'} description={es ? 'Todavía no agregaste modelos al carrito.' : 'You have not added any models yet.'} /><Link className="v-button v-button--primary v-button--pill" to="/catalogo">{es ? 'Explorar modelos' : 'Explore models'} ↗</Link></div> : <>
      <CatalogState status={status} retry={retry} es={es} />
      {status === 'success' && <div className="shop-cart-layout"><div className="shop-cart-lines">{lines.map(line => <article className="shop-cart-line" key={JSON.stringify([line.productId, line.color])}><div><h2>{line.product?.name || line.productId}</h2><p>{line.color} · {line.product?.material}</p>
        {!line.available && <p role="alert">{es ? 'Este modelo o color ya no está publicado. Quitalo o elegí otro desde el catálogo.' : 'This model or color is no longer published. Remove it or choose another from the catalog.'}</p>}
        {line.available && <p>{formatCRC(line.product.price)} {es ? 'por unidad' : 'each'}</p>}</div>
        <label>{es ? 'Cantidad de ' : 'Quantity of '}{line.product?.name || line.productId}<input type="number" min="1" step="1" value={line.quantity} onChange={event => { const value = Number(event.target.value); setError(cart.update(line.productId, line.color, value) ? '' : (es ? 'La cantidad debe ser un número entero mayor que cero.' : 'Quantity must be a positive whole number.')); }} /></label>
        <strong>{line.available ? formatCRC(line.subtotal) : '—'}</strong><button className="v-button v-button--ghost" aria-label={`${es ? 'Quitar' : 'Remove'} ${line.product?.name || line.productId}, ${line.color}`} onClick={() => cart.remove(line.productId, line.color)}>{es ? 'Quitar' : 'Remove'}</button></article>)}</div>
        <aside className="shop-cart-summary"><h2>{es ? 'Resumen de piezas' : 'Parts summary'}</h2><p>{es ? 'Subtotal de piezas publicadas' : 'Published parts subtotal'}</p><strong className="shop-price">{formatCRC(subtotal)}</strong><p>{es ? 'Este subtotal no incluye entrega. El pago en línea todavía no está habilitado.' : 'This subtotal excludes delivery. Online payment is not available yet.'}</p>
          <Link className="v-link-text" to="/catalogo">{es ? 'Seguir eligiendo piezas' : 'Keep choosing parts'} ↗</Link></aside></div>}
      {error && <p role="alert">{error}</p>}</>}
  </section>;
}
