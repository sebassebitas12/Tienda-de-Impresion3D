import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { formatCRC } from '../../utils/money.js';
import { CATALOG_MATERIALS, filterAdminCatalog, summarizeAdminCatalog } from '../../utils/adminCatalog.js';
import { useAdminCatalog } from './useAdminCatalog.js';
import { AdminCatalogMutationError, deleteAdminProduct, getAdminCatalogReferences, updateAdminProduct } from '../../services/adminCatalogService.js';
import './admin.css';
import { FilterChips } from '../../components/ui/FilterChips.jsx';
import { toggleFacetParams } from '../../utils/facetFilters.js';

const words = {
  es: {
    title: 'Catálogo del taller', intro: 'Revisá las piezas que se muestran en la tienda.', source: 'Modelos · JSON Server',
    loading: 'Cargando catálogo', error: 'No pudimos cargar el catálogo', errorHint: 'Revisá que JSON Server esté activo y volvé a intentar.', retry: 'Reintentar',
    all: 'Todos', search: 'Buscar modelo', searchHint: 'Nombre, referencia, material o categoría', results: count => `${count} modelos`,
    noMatch: 'No hay modelos con esos filtros.', noProducts: 'Todavía no hay modelos registrados.', imageFallback: 'Sin foto',
    product: 'Modelo', category: 'Categoría', material: 'Material', price: 'Precio publicado', publication: 'Publicación',
    featured: 'Destacado', regular: 'Catálogo', detail: 'Ficha del modelo', back: 'Volver al catálogo',
    description: 'Descripción', colors: 'Colores registrados', dimensions: 'Dimensiones', weight: 'Peso registrado', production: 'Producción estimada',
    madeToOrder: 'Se fabrica después de recibir el pedido. Este panel no registra inventario ni promete entrega inmediata.',
    imageUnavailable: 'Este modelo no tiene una imagen registrada.', notFound: 'No encontramos este modelo.',
    legacyMaterial: 'Material fuera de la capacidad vigente (FDM): ASA, PLA, PETG, ABS y TPU. Revisá este registro antes de mostrarlo en tienda.',
    legacyStatus: status => `Publicación registrada como «${status}». No hay una acción de cambio de estado definida.`,
  },
  en: {
    title: 'Workshop catalog', intro: 'Review the parts shown in the store.', source: 'Models · JSON Server',
    loading: 'Loading catalog', error: 'Could not load the catalog', errorHint: 'Check that JSON Server is running and try again.', retry: 'Retry',
    all: 'All', search: 'Search models', searchHint: 'Name, reference, material or category', results: count => `${count} models`,
    noMatch: 'No models match these filters.', noProducts: 'No models have been recorded yet.', imageFallback: 'No photo',
    product: 'Model', category: 'Category', material: 'Material', price: 'Listed price', publication: 'Publication',
    featured: 'Featured', regular: 'Catalog', detail: 'Model details', back: 'Back to catalog',
    description: 'Description', colors: 'Recorded colors', dimensions: 'Dimensions', weight: 'Recorded weight', production: 'Estimated production',
    madeToOrder: 'Made after an order is received. This panel does not track inventory or promise immediate delivery.',
    imageUnavailable: 'No image is recorded for this model.', notFound: 'We could not find this model.',
    legacyMaterial: 'Material is outside the current FDM capabilities: ASA, PLA, PETG, ABS and TPU. Review this record before showing it in the store.',
    legacyStatus: status => `Publication is recorded as “${status}”. No status change action is defined.`,
  },
};

function ProductImage({ product, label, className = 'admin-catalog-detail__image' }) {
  const image = product.images?.[0];
  const [failedImage, setFailedImage] = useState(false);
  if (!image || failedImage) return <div className={`${className} admin-catalog-detail__image-fallback`}>{label}</div>;
  return <img key={image} className={className} src={image} alt="" onError={() => setFailedImage(true)} />;
}

export function AdminCatalogPage() {
  const { language } = usePreferences();
  const text = words[language];
  const { status, products, retry } = useAdminCatalog();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const location = useLocation();
  const publication = params.getAll('estado');
  const material = params.getAll('material');
  const counts = useMemo(() => summarizeAdminCatalog(products), [products]);
  const filtered = filterAdminCatalog(products, { query, status: publication, material });
  const updateFilter = (key, value) => {
    setParams(toggleFacetParams(params, key, value));
  };

  return <section className="admin-catalog" aria-labelledby="admin-catalog-title" aria-busy={status === 'loading'}>
    <header className="admin-page-heading"><div><span className="admin-eyebrow">{text.source}</span><h1 id="admin-catalog-title">{text.title}</h1><p>{text.intro}</p></div><div className="admin-catalog__header-actions"><Link className="admin-action-secondary" to="/admin/catalogo/categorias">{language === 'es' ? 'Categorías' : 'Categories'}</Link><Link className="admin-action-primary" to="/admin/catalogo/nuevo">{language === 'es' ? '+ Nuevo modelo' : '+ New model'}</Link></div>
      {status === 'success' && <span className="admin-orders__total"><strong>{products.length}</strong><span>{text.results(products.length)}</span></span>}</header>
    {location.state?.notice && <p className="admin-catalog-form__success" role="status">{location.state.notice}</p>}
    {status === 'loading' && <div className="admin-orders__loading" role="status" aria-label={text.loading}>{[1, 2, 3].map(index => <Skeleton key={index} height="72px" />)}</div>}
    {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
    {status === 'success' && <>
      {counts.needsReview > 0 && <p className="admin-catalog__review-note" role="status">{counts.needsReview} {language === 'es' ? 'registro(s) usan un material fuera de la capacidad vigente.' : 'record(s) use a material outside current capabilities.'}</p>}
      <div className="admin-catalog__controls">
        <label className="admin-request-search"><span>{text.search}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={text.searchHint} /></label>
        <div className="admin-filter-facet"><span>{text.publication}</span><FilterChips label={text.publication} selected={publication} onToggle={value => updateFilter('estado', value)} options={[{ value: 'all', label: text.all }, ...Object.keys(counts.statuses).sort().map(value => ({ value, label: value === 'ACTIVE' ? (language === 'es' ? 'Publicados' : 'Published') : value === 'INACTIVE' ? (language === 'es' ? 'Ocultos' : 'Hidden') : value, count: counts.statuses[value] }))]} /></div>
        <div className="admin-filter-facet"><span>{text.material}</span><FilterChips label={text.material} selected={material} onToggle={value => updateFilter('material', value)} options={[{ value: 'all', label: text.all }, ...Object.keys(counts.materials).sort().map(value => ({ value, label: value, count: counts.materials[value] }))]} /></div>
      </div>
      <p className="admin-orders__results" role="status" aria-live="polite">{text.results(filtered.length)}</p>
      {filtered.length === 0 ? <EmptyState title={query || publication !== 'all' || material !== 'all' ? text.noMatch : text.noProducts} /> : <div className="admin-catalog__list" aria-label={text.title}>
        {filtered.map((product, index) => <Link className="admin-catalog-row" key={product.id} to={`/admin/catalogo/${encodeURIComponent(product.id)}`} style={{ '--row-index': index }}>
          <ProductImage product={product} label={text.imageFallback} className="admin-catalog-row__image" />
          <span className="admin-catalog-row__main"><strong>{product.name}</strong><small>{product.category?.name || product.slug || product.id}</small></span>
          <span className="admin-catalog-row__material">{product.material || '—'}</span>
          <span className="admin-catalog-row__price">{formatCRC(product.price) || '—'}</span>
          <span className="admin-catalog-row__status" data-status={product.status}>{product.status || '—'}<small>{product.featured ? text.featured : text.regular}</small></span>
          <span className="admin-catalog-row__arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>}
    </>}
  </section>;
}

export function AdminCatalogDetailPage() {
  const { language } = usePreferences();
  const text = words[language];
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { status, products, retry } = useAdminCatalog();
  const [mutationError, setMutationError] = useState('');
  const [busy, setBusy] = useState(false);
  const product = products.find(item => String(item.id) === id);
  const hasSupportedMaterial = product && CATALOG_MATERIALS.has(String(product.material || '').toUpperCase());

  return <section className="admin-catalog-detail" aria-labelledby="admin-catalog-detail-title" aria-busy={status === 'loading'}>
    <Link className="admin-request-back" to="/admin/catalogo">← {text.back}</Link>
    {status === 'loading' && <div className="admin-orders__loading" role="status" aria-label={text.loading}><Skeleton height="240px" /></div>}
    {status === 'error' && <ErrorState title={text.error} description={text.errorHint} onRetry={retry} retryLabel={text.retry} />}
    {status === 'success' && !product && <EmptyState title={text.notFound} />}
    {status === 'success' && product && <>
      <header className="admin-catalog-detail__heading"><div><span className="admin-eyebrow">{text.detail} / {product.id}</span><h1 id="admin-catalog-detail-title">{product.name}</h1><p>{product.category?.name || product.slug}</p></div><div className="admin-catalog-detail__actions"><span className="admin-catalog-row__status" data-status={product.status}>{product.status || '—'}<small>{product.featured ? text.featured : text.regular}</small></span><Link className="admin-action-primary" to={`/admin/catalogo/${encodeURIComponent(product.id)}/editar`}>{language === 'es' ? 'Editar' : 'Edit'}</Link><button className="admin-action-secondary" disabled={busy} onClick={async () => { setBusy(true); setMutationError(''); try { await updateAdminProduct(product.id, { status: String(product.status).toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE', updatedAt: new Date().toISOString() }); retry(); } catch (error) { setMutationError(error instanceof AdminCatalogMutationError ? error.message : text.error); } finally { setBusy(false); } }}>{String(product.status).toUpperCase() === 'ACTIVE' ? (language === 'es' ? 'Ocultar' : 'Hide') : (language === 'es' ? 'Publicar' : 'Publish')}</button><button className="admin-action-secondary" disabled={busy} onClick={async () => { setBusy(true); setMutationError(''); try { const refs = await getAdminCatalogReferences(); if (refs.some(item => String(item.productId) === String(product.id))) { setMutationError(language === 'es' ? 'Este modelo forma parte del historial de pedidos. Ocúltalo en lugar de eliminarlo.' : 'This model is in order history. Hide it instead of deleting it.'); return; } if (window.confirm(language === 'es' ? '¿Eliminar este modelo definitivamente?' : 'Permanently delete this model?')) { await deleteAdminProduct(product.id); navigate('/admin/catalogo', { replace: true }); } } catch (error) { setMutationError(error instanceof AdminCatalogMutationError ? error.message : text.error); } finally { setBusy(false); } }}>{language === 'es' ? 'Eliminar' : 'Delete'}</button></div></header>
      {mutationError && <p className="admin-catalog-form__error" role="alert">{mutationError}</p>}
      {!hasSupportedMaterial && <aside className="admin-legacy-strip admin-catalog-detail__warning" role="status"><span className="admin-legacy-strip__mark" aria-hidden="true">!</span><p>{text.legacyMaterial}</p></aside>}
      <div className="admin-catalog-detail__layout"><ProductImage product={product} label={text.imageUnavailable} />
        <div className="admin-catalog-detail__content"><p className="admin-catalog-detail__description">{product.description || '—'}</p>
          <dl className="admin-catalog-detail__specs"><div><dt>{text.material}</dt><dd>{product.material || '—'}</dd></div><div><dt>{text.price}</dt><dd>{formatCRC(product.price) || '—'}</dd></div>
            <div><dt>{text.colors}</dt><dd>{product.availableColors?.join(', ') || '—'}</dd></div><div><dt>{text.dimensions}</dt><dd>{product.dimensions || '—'}</dd></div>
            <div><dt>{text.weight}</dt><dd>{product.weightGrams == null ? '—' : `${product.weightGrams} g`}</dd></div><div><dt>{text.production}</dt><dd>{product.estimatedProductionHours == null ? '—' : `${product.estimatedProductionHours} h`}</dd></div></dl>
          <p className="admin-catalog-detail__note">{text.madeToOrder}</p>
        </div>
      </div>
    </>}
  </section>;
}
