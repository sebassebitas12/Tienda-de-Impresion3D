import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAdminCatalog } from './useAdminCatalog.js';
import {
  createAdminCategory, createAdminProduct, deleteAdminCategory, updateAdminCategory, updateAdminProduct,
} from '../../services/adminCatalogService.js';
import './admin.css';

const materials = ['ASA', 'PLA', 'PETG', 'ABS', 'TPU'];
const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const copy = {
  es: { catalog: 'Volver al catálogo', new: 'Nuevo modelo', edit: 'Editar modelo', name: 'Nombre', slug: 'Referencia URL', description: 'Descripción', category: 'Categoría', material: 'Material FDM', price: 'Precio publicado (₡)', colors: 'Colores disponibles (separados por coma)', dimensions: 'Dimensiones', weight: 'Peso (g)', hours: 'Horas estimadas de producción', status: 'Publicación', active: 'Publicado', inactive: 'Oculto de la tienda', featured: 'Destacar en la tienda', save: 'Guardar modelo', saving: 'Guardando…', cancel: 'Cancelar', loading: 'Cargando datos', required: 'Completa los campos obligatorios.', duplicate: 'Ya existe un modelo con ese nombre o referencia.', failure: 'No pudimos guardar el modelo.', saved: 'Modelo guardado.', remove: 'Eliminar definitivamente', archive: 'Ocultar de la tienda', restore: 'Publicar en la tienda', confirmDelete: '¿Eliminar este modelo definitivamente? Solo se permite si no está ligado a pedidos.', referenced: 'Este modelo forma parte del historial de pedidos. Ocúltalo en lugar de eliminarlo.', categoriesTitle: 'Categorías del catálogo', categoriesHelp: 'Organizan las piezas visibles en la tienda.', categoryName: 'Nombre de categoría', categorySlug: 'Referencia URL', addCategory: 'Agregar categoría', saveCategory: 'Guardar', deleteCategory: 'Eliminar', categoryUsed: 'No se puede eliminar: hay modelos asociados. Primero reasigna esos modelos.', categoryDuplicate: 'Ya existe una categoría con ese nombre o referencia.', categoryConfirm: '¿Eliminar esta categoría?', savingCategory: 'Guardando…', back: 'Volver', errorTitle: 'No pudimos cargar el catálogo', errorHint: 'Revisá JSON Server y volvé a intentar.', retry: 'Reintentar', noCategory: 'Elegí una categoría' },
  en: { catalog: 'Back to catalog', new: 'New model', edit: 'Edit model', name: 'Name', slug: 'URL reference', description: 'Description', category: 'Category', material: 'FDM material', price: 'Listed price (₡)', colors: 'Available colors (comma separated)', dimensions: 'Dimensions', weight: 'Weight (g)', hours: 'Estimated production hours', status: 'Publication', active: 'Published', inactive: 'Hidden from store', featured: 'Feature in store', save: 'Save model', saving: 'Saving…', cancel: 'Cancel', loading: 'Loading data', required: 'Complete the required fields.', duplicate: 'A model with that name or reference already exists.', failure: 'Could not save the model.', saved: 'Model saved.', remove: 'Delete permanently', archive: 'Hide from store', restore: 'Publish in store', confirmDelete: 'Delete this model permanently? This is only allowed when no orders reference it.', referenced: 'This model is in order history. Hide it instead of deleting it.', categoriesTitle: 'Catalog categories', categoriesHelp: 'Organize the pieces shown in the store.', categoryName: 'Category name', categorySlug: 'URL reference', addCategory: 'Add category', saveCategory: 'Save', deleteCategory: 'Delete', categoryUsed: 'Cannot delete: models use this category. Reassign them first.', categoryDuplicate: 'A category with that name or reference already exists.', categoryConfirm: 'Delete this category?', savingCategory: 'Saving…', back: 'Back', errorTitle: 'Could not load catalog', errorHint: 'Check JSON Server and try again.', retry: 'Retry', noCategory: 'Choose a category' },
};

export function AdminProductFormPage() {
  const { language } = usePreferences();
  const t = copy[language] || copy.es;
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, products, categories, retry } = useAdminCatalog();
  const existing = products.find(product => String(product.id) === id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(null);
  const product = values || (existing ? {
    name: existing.name || '', slug: existing.slug || '', description: existing.description || '', categoryId: existing.categoryId || '',
    price: existing.price ?? '', material: String(existing.material || '').toUpperCase(), colors: (existing.availableColors || []).join(', '),
    dimensions: existing.dimensions || '', weightGrams: existing.weightGrams ?? '', estimatedProductionHours: existing.estimatedProductionHours ?? '',
    status: existing.status || 'ACTIVE', featured: Boolean(existing.featured),
  } : { name: '', slug: '', description: '', categoryId: '', price: '', material: 'PLA', colors: '', dimensions: '', weightGrams: '', estimatedProductionHours: '', status: 'ACTIVE', featured: false });
  const isEdit = Boolean(id);
  const availableCategories = categories.filter(category => String(category.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
  const onChange = event => {
    const { name, value, checked, type } = event.target;
    setValues(current => ({ ...product, ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  const save = async event => {
    event.preventDefault(); setError('');
    const slug = slugify(product.slug || product.name);
    if (!product.name.trim() || !slug || !product.categoryId || product.price === '' || !Number.isFinite(Number(product.price)) || Number(product.price) < 0 || !materials.includes(product.material) || !['ACTIVE', 'INACTIVE'].includes(product.status) || [product.weightGrams, product.estimatedProductionHours].some(value => value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0))) { setError(t.required); return; }
    const collision = products.some(item => String(item.id) !== id && (slugify(item.slug || '') === slug || item.name.trim().toLocaleLowerCase() === product.name.trim().toLocaleLowerCase()));
    if (collision) { setError(t.duplicate); return; }
    setBusy(true);
    const now = new Date().toISOString();
    const payload = {
      name: product.name.trim(), slug, description: product.description.trim(), categoryId: product.categoryId,
      price: Number(product.price), currency: 'CRC', material: product.material,
      availableColors: product.colors.split(',').map(color => color.trim()).filter(Boolean), dimensions: product.dimensions.trim(),
      weightGrams: product.weightGrams === '' ? null : Number(product.weightGrams),
      estimatedProductionHours: product.estimatedProductionHours === '' ? null : Number(product.estimatedProductionHours),
      status: product.status, featured: Boolean(product.featured), updatedAt: now,
      ...(existing ? {} : { images: [], createdAt: now }),
    };
    try {
      if (isEdit) await updateAdminProduct(id, payload);
      else await createAdminProduct(payload);
      navigate('/admin/catalogo', { state: { notice: t.saved } });
    } catch { setError(t.failure); }
    finally { setBusy(false); }
  };

  if (status === 'loading') return <div className="admin-catalog-form" role="status" aria-label={t.loading}><Skeleton height="72px" /><Skeleton height="320px" /></div>;
  if (status === 'error') return <ErrorState title={t.errorTitle} description={t.errorHint} onRetry={retry} retryLabel={t.retry} />;
  if (isEdit && !existing && status === 'success') return <ErrorState title={t.errorTitle} description={t.errorHint} onRetry={retry} retryLabel={t.retry} />;

  return <section className="admin-catalog-form" aria-labelledby="admin-product-form-title">
    <Link className="admin-request-back" to="/admin/catalogo">← {t.catalog}</Link>
    <header className="admin-page-heading"><div><span className="admin-eyebrow">{isEdit ? `PRODUCTO / ${id}` : 'NUEVO PRODUCTO'}</span><h1 id="admin-product-form-title">{isEdit ? t.edit : t.new}</h1></div></header>
    <form className="admin-catalog-form__surface" onSubmit={save} noValidate>
      <div className="admin-catalog-form__grid">
        <label>{t.name}<input name="name" value={product.name} onChange={onChange} required autoComplete="off" /></label>
        <label>{t.slug}<input name="slug" value={product.slug} onChange={onChange} placeholder={slugify(product.name)} autoComplete="off" /></label>
        <label>{t.category}<select name="categoryId" value={product.categoryId} onChange={onChange} required><option value="">{t.noCategory}</option>{availableCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>{t.material}<select name="material" value={materials.includes(product.material) ? product.material : ''} onChange={onChange} required><option value="">{language === 'es' ? 'Seleccionar material' : 'Select material'}</option>{materials.map(material => <option key={material}>{material}</option>)}</select></label>
        <label>{t.price}<input name="price" type="number" min="0" step="1" value={product.price} onChange={onChange} required /></label>
        <label>{t.colors}<input name="colors" value={product.colors} onChange={onChange} /></label>
        <label>{t.dimensions}<input name="dimensions" value={product.dimensions} onChange={onChange} /></label>
        <label>{t.weight}<input name="weightGrams" type="number" min="0" step="1" value={product.weightGrams} onChange={onChange} /></label>
        <label>{t.hours}<input name="estimatedProductionHours" type="number" min="0" step="0.5" value={product.estimatedProductionHours} onChange={onChange} /></label>
        <label>{t.status}<select name="status" value={product.status} onChange={onChange}><option value="ACTIVE">{t.active}</option><option value="INACTIVE">{t.inactive}</option></select></label>
        <label className="admin-catalog-form__wide">{t.description}<textarea name="description" rows="4" value={product.description} onChange={onChange} /></label>
        <label className="admin-catalog-form__check"><input type="checkbox" name="featured" checked={product.featured} onChange={onChange} />{t.featured}</label>
      </div>
      <p className="admin-catalog-form__note">{language === 'es' ? 'Se fabrica bajo pedido. Las imágenes existentes se conservan; la carga se habilitará cuando el taller tenga almacenamiento configurado.' : 'Made to order. Existing images are preserved; uploads will be enabled when storage is configured.'}</p>
      {error && <p className="admin-catalog-form__error" role="alert">{error}</p>}
      <div className="admin-catalog-form__actions"><Link className="admin-action-secondary" to="/admin/catalogo">{t.cancel}</Link><button className="admin-action-primary" type="submit" disabled={busy}>{busy ? t.saving : t.save}</button></div>
    </form>
  </section>;
}

export function AdminCategoriesPage() {
  const { language } = usePreferences();
  const t = copy[language] || copy.es;
  const { status, categories, products, retry } = useAdminCatalog();
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ name: '', slug: '' });
  const usedCategories = useMemo(() => new Set(products.map(product => String(product.categoryId))), [products]);
  const submit = async event => {
    event.preventDefault(); setError('');
    const slug = slugify(draft.slug || draft.name);
    if (!draft.name.trim() || !slug) { setError(t.required); return; }
    if (categories.some(item => String(item.id) !== String(editing || '') && (slugify(item.slug || '') === slug || item.name.trim().toLocaleLowerCase() === draft.name.trim().toLocaleLowerCase()))) { setError(t.categoryDuplicate); return; }
    setBusy(true);
    try {
      const payload = { name: draft.name.trim(), slug, status: categories.find(item => String(item.id) === String(editing))?.status || 'ACTIVE' };
      if (editing) await updateAdminCategory(editing, payload); else await createAdminCategory(payload);
      setEditing(null); setDraft({ name: '', slug: '' }); retry();
    } catch { setError(t.failure); }
    finally { setBusy(false); }
  };
  const remove = async category => {
    if (usedCategories.has(String(category.id))) { setError(t.categoryUsed); return; }
    if (!window.confirm(t.categoryConfirm)) return;
    setBusy(true); setError('');
    try { await deleteAdminCategory(category.id); retry(); }
    catch { setError(t.failure); }
    finally { setBusy(false); }
  };
  if (status === 'loading') return <div className="admin-catalog-form" role="status" aria-label={t.loading}><Skeleton height="240px" /></div>;
  if (status === 'error') return <ErrorState title={t.errorTitle} description={t.errorHint} onRetry={retry} retryLabel={t.retry} />;
  return <section className="admin-catalog-form" aria-labelledby="admin-categories-title">
    <Link className="admin-request-back" to="/admin/catalogo">← {t.back}</Link>
    <header className="admin-page-heading"><div><span className="admin-eyebrow">CATÁLOGO / ORGANIZACIÓN</span><h1 id="admin-categories-title">{t.categoriesTitle}</h1><p>{t.categoriesHelp}</p></div></header>
    <form className="admin-catalog-form__surface admin-category-form" onSubmit={submit}>
      <label>{t.categoryName}<input value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value, slug: current.slug || slugify(event.target.value) }))} required /></label>
      <label>{t.categorySlug}<input value={draft.slug} onChange={event => setDraft(current => ({ ...current, slug: event.target.value }))} required /></label>
      <button className="admin-action-primary" disabled={busy}>{busy ? t.savingCategory : editing ? t.saveCategory : t.addCategory}</button>
      {editing && <button className="admin-action-secondary" type="button" onClick={() => { setEditing(null); setDraft({ name: '', slug: '' }); }}>{t.cancel}</button>}
    </form>
    {error && <p className="admin-catalog-form__error" role="alert">{error}</p>}
    <div className="admin-category-list">{categories.map(category => <article className="admin-category-row" key={category.id}>
      <div><strong>{category.name}</strong><small>{category.slug} · {products.filter(product => String(product.categoryId) === String(category.id)).length} {language === 'es' ? 'modelos' : 'models'}</small></div>
      <div><button className="admin-action-secondary" type="button" onClick={() => { setEditing(category.id); setDraft({ name: category.name, slug: category.slug }); }}>{language === 'es' ? 'Editar' : 'Edit'}</button><button className="admin-action-secondary" type="button" disabled={busy} onClick={() => remove(category)}>{t.deleteCategory}</button></div>
    </article>)}</div>
  </section>;
}
