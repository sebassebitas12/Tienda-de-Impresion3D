import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ErrorState, Skeleton } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useAdminCatalog } from './useAdminCatalog.js';
import { ImagePicker } from './ImagePicker.jsx';
import { DEMO_PROFILES } from '../../utils/quoteAutomation.js';
import { calculateProductDemoPrice } from '../../utils/productDemoPricing.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { CatalogDeleteDialog } from './CatalogDeleteDialog.jsx';
import {
  createAdminCategory, createAdminProduct, deleteAdminCategory, updateAdminCategory, updateAdminProduct,
} from '../../services/adminCatalogService.js';
import './admin.css';
import './admin-product-pricing.css';

const materials = ['ASA', 'PLA', 'PLA Silk', 'PETG', 'ABS', 'TPU'];
const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const copy = {
  es: { catalog: 'Volver al catálogo', new: 'Nuevo modelo', edit: 'Editar modelo', name: 'Nombre', slug: 'Referencia URL', description: 'Descripción', category: 'Categoría', material: 'Material FDM', price: 'Precio publicado (₡)', colors: 'Colores disponibles (separados por coma)', dimensions: 'Dimensiones', weight: 'Peso (g)', hours: 'Horas estimadas de producción', status: 'Publicación', active: 'Publicado', inactive: 'Oculto de la tienda', featured: 'Destacar en la tienda', save: 'Guardar modelo', saving: 'Guardando…', cancel: 'Cancelar', loading: 'Cargando datos', required: 'Completa los campos obligatorios.', duplicate: 'Ya existe un modelo con ese nombre o referencia.', failure: 'No pudimos guardar el modelo.', saved: 'Modelo guardado.', remove: 'Eliminar definitivamente', archive: 'Ocultar de la tienda', restore: 'Publicar en la tienda', confirmDelete: '¿Eliminar este modelo definitivamente? Solo se permite si no está ligado a pedidos.', referenced: 'Este modelo forma parte del historial de pedidos. Ocúltalo en lugar de eliminarlo.', categoriesTitle: 'Categorías del catálogo', categoriesHelp: 'Organizan las piezas visibles en la tienda.', categoryName: 'Nombre de categoría', categorySlug: 'Referencia URL', addCategory: 'Agregar categoría', saveCategory: 'Guardar categoría', editCategory: 'Editar categoría', categoryPreview: 'Así se identifica en el catálogo', categoryProducts: 'Modelos asociados', categoryUrlHelp: 'Referencia interna para organizar y reconocer la categoría.', deleteCategory: 'Eliminar', categoryUsed: 'No se puede eliminar: hay modelos asociados. Primero reasigna esos modelos.', categoryDuplicate: 'Ya existe una categoría con ese nombre o referencia.', categoryConfirm: '¿Eliminar esta categoría?', savingCategory: 'Guardando…', back: 'Volver', errorTitle: 'No pudimos cargar el catálogo', errorHint: 'Revisá JSON Server y volvé a intentar.', retry: 'Reintentar', noCategory: 'Elegí una categoría' },
  en: { catalog: 'Back to catalog', new: 'New model', edit: 'Edit model', name: 'Name', slug: 'URL reference', description: 'Description', category: 'Category', material: 'FDM material', price: 'Listed price (₡)', colors: 'Available colors (comma separated)', dimensions: 'Dimensions', weight: 'Weight (g)', hours: 'Estimated production hours', status: 'Publication', active: 'Published', inactive: 'Hidden from store', featured: 'Feature in store', save: 'Save model', saving: 'Saving…', cancel: 'Cancel', loading: 'Loading data', required: 'Complete the required fields.', duplicate: 'A model with that name or reference already exists.', failure: 'Could not save the model.', saved: 'Model saved.', remove: 'Delete permanently', archive: 'Hide from store', restore: 'Publish in store', confirmDelete: 'Delete this model permanently? This is only allowed when no orders reference it.', referenced: 'This model is in order history. Hide it instead of deleting it.', categoriesTitle: 'Catalog categories', categoriesHelp: 'Organize the pieces shown in the store.', categoryName: 'Category name', categorySlug: 'URL reference', addCategory: 'Add category', saveCategory: 'Save category', editCategory: 'Edit category', categoryPreview: 'Catalog identifier preview', categoryProducts: 'Linked models', deleteCategory: 'Delete', categoryUsed: 'Cannot delete: models use this category. Reassign them first.', categoryDuplicate: 'A category with that name or reference already exists.', categoryConfirm: 'Delete this category?', savingCategory: 'Saving…', back: 'Back', errorTitle: 'Could not load catalog', errorHint: 'Check JSON Server and try again.', retry: 'Retry', noCategory: 'Choose a category' },
};

export function AdminProductFormPage() {
  const { language } = usePreferences();
  const { token } = useAuth();
  const t = copy[language] || copy.es;
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, products, categories, retry } = useAdminCatalog();
  const existing = products.find(product => String(product.id) === id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(null);
  const [pricingProfileId, setPricingProfileId] = useState('');
  const [postProcessMinutes, setPostProcessMinutes] = useState(0);
  const [pricingPreview, setPricingPreview] = useState(null);
  const [confirmDemoPrice, setConfirmDemoPrice] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [aiError, setAiError] = useState('');
  const product = values || (existing ? {
    name: existing.name || '', slug: existing.slug || '', description: existing.description || '', categoryId: existing.categoryId || '',
    price: existing.price ?? '', material: String(existing.material || '').toUpperCase(), colors: (existing.availableColors || []).join(', '),
    dimensions: existing.dimensions || '', weightGrams: existing.weightGrams ?? '', estimatedProductionHours: existing.estimatedProductionHours ?? '',
    status: existing.status || 'ACTIVE', featured: Boolean(existing.featured), images: existing.images || [],
    priceSource: existing.priceSource || 'MANUAL', quotePricing: existing.quotePricing || null, aiProductionEstimate: existing.aiProductionEstimate || null,
  } : { name: '', slug: '', description: '', categoryId: '', price: '', material: '', colors: '', dimensions: '', weightGrams: '', estimatedProductionHours: '', status: 'DRAFT', featured: false, images: [], priceSource: 'MANUAL', quotePricing: null, aiProductionEstimate: null });
  const isEdit = Boolean(id);
  const availableCategories = categories.filter(category => String(category.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
  useEffect(() => {
    if (location.hash !== '#cotizador' || status !== 'success') return;
    const heading = document.getElementById('admin-product-pricing-title');
    heading?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    heading?.focus?.({ preventScroll: true });
  }, [location.hash, status]);
  const onChange = event => {
    const { name, value, checked, type } = event.target;
    setValues(current => {
      const next = { ...product, ...current, [name]: type === 'checkbox' ? checked : value };
      if (name === 'price') { next.priceSource = 'MANUAL'; next.quotePricing = null; }
      else if (['material', 'weightGrams', 'estimatedProductionHours'].includes(name) && next.priceSource === 'DEMO') {
        next.priceSource = 'NEEDS_RECALCULATION'; next.quotePricing = null;
      }
      if (['weightGrams', 'estimatedProductionHours'].includes(name) && next.aiProductionEstimate) next.aiProductionEstimate = { ...next.aiProductionEstimate, verifiedWithSlicer: false };
      return next;
    });
    if (name === 'price' || ['material', 'weightGrams', 'estimatedProductionHours'].includes(name)) {
      setPricingPreview(null); setConfirmDemoPrice(false);
    }
  };
  const usePricingProfile = () => {
    const profile = DEMO_PROFILES.find(item => item.id === pricingProfileId);
    if (!profile) return;
    setValues(current => ({ ...product, ...current, weightGrams: profile.weightGrams, estimatedProductionHours: profile.printHours }));
    setPostProcessMinutes(profile.postProcessMinutes);
    setPricingPreview(null); setError('');
  };
  const calculatePrice = () => {
    const quote = calculateProductDemoPrice({ material: product.material, weightGrams: product.weightGrams, printHours: product.estimatedProductionHours, postProcessMinutes });
    if (!quote) { setError(language === 'es' ? 'Elegí material y completá gramos y horas de impresión mayores que cero.' : 'Choose a material and enter weight and print hours greater than zero.'); return; }
    setPricingPreview(quote); setError('');
  };
  const completeProductWithAi = async () => {
    const name = product.name.trim();
    setAiError(''); setError(''); setAiReply('');
    if (!name) {
      const msg = language === 'es' ? 'Escribí primero el nombre del producto.' : 'Enter the product name first.';
      setAiError(msg);
      return;
    }
    setAiBusy(true);
    try {
      const result = await automationAction('/assistants/chat', { mode: 'general', task: 'catalog_product_draft', message: name, language }, { token });
      if (!result?.productDraft) throw Object.assign(new Error('ASSISTANT_INVALID_RESPONSE'), { code: 'ASSISTANT_INVALID_RESPONSE' });
      const draft = result.productDraft;
      const generatedAt = new Date().toISOString();
      const suggestedQuote = calculateProductDemoPrice({ material: draft.material, weightGrams: draft.weightGrams, printHours: draft.estimatedProductionHours });
      setValues(current => ({ ...product, ...current,
        slug: (current?.slug || product.slug || slugify(name)),
        description: draft.description,
        material: draft.material,
        colors: draft.colors.join(', '),
        categoryId: current?.categoryId || product.categoryId || draft.categoryId || '',
        dimensions: draft.dimensions || current?.dimensions || product.dimensions,
        weightGrams: draft.weightGrams ?? '',
        estimatedProductionHours: draft.estimatedProductionHours ?? '',
        aiProductionEstimate: { source: result.source || 'AI', generatedAt, estimateBasis: draft.estimateBasis, estimatedWeightGrams: draft.weightGrams, estimatedProductionHours: draft.estimatedProductionHours, verifiedWithSlicer: false },
        ...(suggestedQuote && (!isEdit || product.priceSource === 'DEMO' || product.price === '') ? { price: String(suggestedQuote.breakdown.amountCrc), priceSource: 'DEMO', quotePricing: suggestedQuote } : product.priceSource === 'DEMO' ? { priceSource: 'NEEDS_RECALCULATION', quotePricing: null } : {}),
      }));
      setPricingPreview(null); setConfirmDemoPrice(false);
      setAiReply(result.reply || (language === 'es' ? 'Ficha propuesta. Revisá cada campo antes de guardar.' : 'Draft suggested. Review each field before saving.'));
    } catch (actionError) {
      const msg = automationError(actionError.code || actionError.message, language);
      setAiError(msg);
    } finally { setAiBusy(false); }
  };
  const confirmSlicerValues = checked => setValues(current => ({ ...product, ...current, aiProductionEstimate: { ...product.aiProductionEstimate, verifiedWithSlicer: checked } }));
  const applyDemoPrice = () => {
    if (!pricingPreview) return;
    setValues(current => ({ ...product, ...current, price: String(pricingPreview.breakdown.amountCrc), priceSource: 'DEMO', quotePricing: pricingPreview }));
    setConfirmDemoPrice(false); setError('');
  };
  const save = async event => {
    event.preventDefault(); setError('');
    const slug = slugify(product.slug || product.name);
    const isDraft = product.status === 'DRAFT';
    const invalidPrice = product.price !== '' && (!Number.isFinite(Number(product.price)) || Number(product.price) < 0);
    const invalidMaterial = product.material !== '' && !materials.includes(product.material);
    if (!product.name.trim() || !slug || !product.categoryId || (!isDraft && (product.price === '' || !Number.isFinite(Number(product.price)) || Number(product.price) < 0 || !materials.includes(product.material))) || (isDraft && (invalidPrice || invalidMaterial)) || !['ACTIVE', 'INACTIVE', 'DRAFT'].includes(product.status) || [product.weightGrams, product.estimatedProductionHours].some(value => value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0))) { setError(t.required); return; }
    if (product.status === 'ACTIVE' && product.priceSource === 'DEMO' && !confirmDemoPrice) { setError(language === 'es' ? 'Confirmá que revisaste el precio DEMO antes de publicarlo.' : 'Confirm that you reviewed the DEMO price before publishing.'); return; }
    if (product.status === 'ACTIVE' && product.priceSource === 'NEEDS_RECALCULATION') { setError(language === 'es' ? 'Cambiaste datos del cálculo; volvé a calcular la sugerencia o escribí un precio manual.' : 'You changed inputs; recalculate the suggestion or enter a manual price.'); return; }
    const collision = products.some(item => String(item.id) !== id && (slugify(item.slug || '') === slug || item.name.trim().toLocaleLowerCase() === product.name.trim().toLocaleLowerCase()));
    if (collision) { setError(t.duplicate); return; }
    setBusy(true);
    const now = new Date().toISOString();
    const payload = {
      name: product.name.trim(), slug, description: product.description.trim(), categoryId: product.categoryId,
      price: product.price === '' ? null : Number(product.price), currency: 'CRC', material: product.material || null,
      availableColors: product.colors.split(',').map(color => color.trim()).filter(Boolean), dimensions: product.dimensions.trim(),
      weightGrams: product.weightGrams === '' ? null : Number(product.weightGrams),
      estimatedProductionHours: product.estimatedProductionHours === '' ? null : Number(product.estimatedProductionHours),
      status: product.status, featured: Boolean(product.featured), updatedAt: now,
      priceSource: product.priceSource || 'MANUAL', quotePricing: product.priceSource === 'DEMO' ? product.quotePricing : null,
      priceConfirmation: product.priceSource === 'DEMO' && confirmDemoPrice ? { mode: 'DEMO', confirmedAt: now } : null,
      ...(product.aiProductionEstimate ? { aiProductionEstimate: product.aiProductionEstimate } : {}),
      images: product.images,
      ...(existing ? {} : { createdAt: now }),
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
      <section className="admin-product-ai" aria-labelledby="admin-product-ai-title">
        <div><span className="admin-eyebrow">{language === 'es' ? 'ASISTENCIA DE FICHA · PROPUESTA' : 'PRODUCT DRAFT · SUGGESTION'}</span><h2 id="admin-product-ai-title">{language === 'es' ? 'Partí del nombre, revisá el resto.' : 'Start with a name, review the rest.'}</h2><p>{language === 'es' ? 'La IA sugiere descripción, material, colores y una referencia muy aproximada de peso/tiempo. No consulta stock ni mide la pieza.' : 'AI suggests a description, material, colors and a very rough weight/time reference. It does not check stock or measure the part.'}</p></div>
        <button className="admin-action-primary" type="button" onClick={completeProductWithAi} disabled={aiBusy || busy}>{aiBusy ? (language === 'es' ? 'Preparando propuesta…' : 'Preparing suggestion…') : (language === 'es' ? 'Autocompletar ficha con IA' : 'Autocomplete product with AI')}</button>
        {aiBusy && <p className="admin-product-ai__status" role="status" aria-live="polite">{language === 'es' ? 'Preparando ficha y propuesta de precio…' : 'Preparing record and suggested price…'}</p>}
        {aiError && <p className="admin-product-ai__error" role="alert">{aiError}</p>}
        {aiReply && <p className="admin-product-ai__reply" role="status">{aiReply}</p>}
        {product.aiProductionEstimate && <p className="admin-product-ai__caveat" role="note">{language === 'es' ? `Estimación IA, no medición. ${product.aiProductionEstimate.estimateBasis}` : `AI estimate, not a measurement. ${product.aiProductionEstimate.estimateBasis}`}</p>}
      </section>
      <div className="admin-catalog-form__grid">
        <label>{t.name}<input name="name" value={product.name} onChange={onChange} required autoComplete="off" /></label>
        <label>{t.slug}<input name="slug" value={product.slug} onChange={onChange} placeholder={slugify(product.name)} autoComplete="off" /></label>
        <label>{t.category}<select name="categoryId" value={product.categoryId} onChange={onChange} required><option value="">{t.noCategory}</option>{availableCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>{t.material}<select name="material" value={materials.includes(product.material) ? product.material : ''} onChange={onChange} required={product.status !== 'DRAFT'}><option value="">{language === 'es' ? 'Seleccionar material' : 'Select material'}</option>{materials.map(material => <option key={material}>{material}</option>)}</select></label>
        <label>{t.price}<input name="price" type="number" min="0" step="1" value={product.price} onChange={onChange} required={product.status !== 'DRAFT'} /></label>
        <label>{language === 'es' ? 'Colores sugeridos (confirmá disponibilidad)' : 'Suggested colors (confirm availability)'}<input name="colors" value={product.colors} onChange={onChange} /></label>
        <label>{t.dimensions}<input name="dimensions" value={product.dimensions} onChange={onChange} /></label>
        <label>{t.weight}<input name="weightGrams" type="number" min="0" step="1" value={product.weightGrams} onChange={onChange} /></label>
        <label>{t.hours}<input name="estimatedProductionHours" type="number" min="0" step="0.5" value={product.estimatedProductionHours} onChange={onChange} /></label>
        <label>{t.status}<select name="status" value={product.status} onChange={onChange}><option value="ACTIVE">{t.active}</option><option value="INACTIVE">{t.inactive}</option><option value="DRAFT">{language === 'es' ? 'Borrador · incompleto' : 'Draft · incomplete'}</option></select></label>
        <label className="admin-catalog-form__wide">{t.description}<textarea name="description" rows="4" value={product.description} onChange={onChange} /></label>
        <label className="admin-catalog-form__check"><input type="checkbox" name="featured" checked={product.featured} onChange={onChange} />{t.featured}</label>
      </div>
      <section id="cotizador" className="admin-product-pricing" aria-labelledby="admin-product-pricing-title">
        <header><span className="admin-eyebrow">PRECIO / SIMULACIÓN DE TALLER</span><h2 id="admin-product-pricing-title" tabIndex="-1">{language === 'es' ? 'Calculá una sugerencia para esta pieza.' : 'Calculate a suggested price for this part.'}</h2>
          <p>{language === 'es' ? 'Ingresá peso y tiempo del laminador o cargá un perfil análogo como punto de partida. Nunca estimamos esos datos a partir de la foto.' : 'Enter slicer weight and time, or load an analogue profile as a starting point. We never infer these values from the photo.'}</p></header>
        <div className="admin-product-pricing__controls">
          <label>{language === 'es' ? 'Referencia de cálculo · DEMO' : 'Calculation reference · DEMO'}<select value={pricingProfileId} onChange={event => setPricingProfileId(event.target.value)}><option value="">{language === 'es' ? 'Elegir perfil análogo' : 'Choose analogue profile'}</option>{DEMO_PROFILES.map(profile => <option key={profile.id} value={profile.id}>{profile.name} · DEMO</option>)}</select></label>
          <button className="admin-action-secondary" type="button" onClick={usePricingProfile} disabled={!pricingProfileId}>{language === 'es' ? 'Usar peso/tiempo análogos' : 'Use analogue weight/time'}</button>
          <label>{language === 'es' ? 'Postprocesado por unidad (min)' : 'Post-processing per unit (min)'}<input type="number" min="0" step="1" value={postProcessMinutes} onChange={event => { setPostProcessMinutes(event.target.value); setPricingPreview(null); }} /></label>
          <button className="admin-action-primary" type="button" onClick={calculatePrice}>{language === 'es' ? 'Calcular sugerencia DEMO' : 'Calculate DEMO suggestion'} ↗</button>
        </div>
        {product.aiProductionEstimate && <label className="admin-product-pricing__confirm"><input type="checkbox" checked={Boolean(product.aiProductionEstimate.verifiedWithSlicer)} onChange={event => confirmSlicerValues(event.target.checked)} />{language === 'es' ? 'Ya contrasté y actualicé los gramos y las horas con el laminador. La propuesta de IA por sí sola no sirve como dato final.' : 'I checked and updated grams and hours against the slicer. The AI estimate alone is not final data.'}</label>}
        {product.priceSource === 'NEEDS_RECALCULATION' && <p className="admin-product-pricing__warning" role="status">{language === 'es' ? 'Cambiaste material, peso u horas después del cálculo. Recalculá antes de publicar.' : 'Material, weight or time changed after the calculation. Recalculate before publishing.'}</p>}
        {pricingPreview && <div className="admin-product-pricing__result" aria-live="polite"><div><span className="admin-eyebrow">RESULTADO DEMO · CRC</span><strong>{new Intl.NumberFormat(language === 'es' ? 'es-CR' : 'en-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(pricingPreview.breakdown.amountCrc)}</strong><p>{language === 'es' ? 'Sugerencia con los gramos/horas ingresados y supuestos internos DEMO. Verificá el laminador y los costos reales antes de decidir el precio.' : 'Suggested from entered grams/hours and internal DEMO assumptions. Verify slicer output and actual costs before setting a price.'}</p></div><dl>{[['Material', 'materialCrc'], [language === 'es' ? 'Desgaste' : 'Wear', 'wearCrc'], [language === 'es' ? 'Electricidad' : 'Electricity', 'electricityCrc'], [language === 'es' ? 'Postprocesado' : 'Post-processing', 'postProcessCrc']].map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{new Intl.NumberFormat(language === 'es' ? 'es-CR' : 'en-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(pricingPreview.breakdown[key])}</dd></div>)}</dl><button className="admin-action-primary" type="button" onClick={applyDemoPrice}>{language === 'es' ? 'Aplicar sugerencia al borrador' : 'Apply suggestion to draft'}</button></div>}
        {product.priceSource === 'DEMO' && product.status === 'ACTIVE' && <label className="admin-product-pricing__confirm"><input type="checkbox" checked={confirmDemoPrice} onChange={event => setConfirmDemoPrice(event.target.checked)} />{language === 'es' ? 'Revisé esta sugerencia DEMO y decido publicarla como precio del catálogo.' : 'I reviewed this DEMO suggestion and choose to publish it as the catalog price.'}</label>}
        <p className="admin-product-pricing__footnote">{language === 'es' ? 'DEMO: tipo de cambio, filamento, desgaste, energía y mano de obra son supuestos orientativos, no una tarifa vigente del taller. Podés escribir un precio manual en el campo superior.' : 'DEMO: exchange rate, filament, wear, electricity and labor are assumptions, not current workshop rates. You can enter a manual price above.'}</p>
      </section>
      <ImagePicker images={product.images || []} language={language} disabled={busy} onChange={images => setValues(current => ({ ...product, ...current, images }))} />
      <p className="admin-catalog-form__note">{language === 'es' ? 'Se fabrica bajo pedido. Guardá como borrador mientras confirmás material, precio y especificaciones. Elegir una foto no publica el modelo.' : 'Made to order. Save as a draft while confirming material, price and specifications. Selecting a photo does not publish the model.'}</p>
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
  const [editDraft, setEditDraft] = useState({ name: '', slug: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const usedCategories = useMemo(() => new Set(products.map(product => String(product.categoryId))), [products]);
  const saveCategory = async (event, categoryId = null) => {
    event.preventDefault(); setError('');
    const currentDraft = categoryId ? editDraft : draft;
    const slug = slugify(currentDraft.slug || currentDraft.name);
    if (!currentDraft.name.trim() || !slug) { setError(t.required); return; }
    if (categories.some(item => String(item.id) !== String(categoryId || '') && (slugify(item.slug || '') === slug || item.name.trim().toLocaleLowerCase() === currentDraft.name.trim().toLocaleLowerCase()))) { setError(t.categoryDuplicate); return; }
    setBusy(true);
    try {
      const payload = { name: currentDraft.name.trim(), slug, status: categories.find(item => String(item.id) === String(categoryId))?.status || 'ACTIVE' };
      if (categoryId) await updateAdminCategory(categoryId, payload); else await createAdminCategory(payload);
      setEditing(null); setEditDraft({ name: '', slug: '' }); setDraft({ name: '', slug: '' }); retry();
    } catch { setError(t.failure); }
    finally { setBusy(false); }
  };
  const remove = async category => {
    if (usedCategories.has(String(category.id))) { setError(t.categoryUsed); return; }
    setBusy(true); setError('');
    try { await deleteAdminCategory(category.id); setDeleteTarget(null); retry(); }
    catch { setError(t.failure); }
    finally { setBusy(false); }
  };
  if (status === 'loading') return <div className="admin-catalog-form" role="status" aria-label={t.loading}><Skeleton height="240px" /></div>;
  if (status === 'error') return <ErrorState title={t.errorTitle} description={t.errorHint} onRetry={retry} retryLabel={t.retry} />;
  const cancelEdit = () => { setEditing(null); setEditDraft({ name: '', slug: '' }); setError(''); };
  return <section className="admin-catalog-form" aria-labelledby="admin-categories-title">
    <Link className="admin-request-back" to="/admin/catalogo">← {t.back}</Link>
    <header className="admin-page-heading"><div><span className="admin-eyebrow">CATÁLOGO / ORGANIZACIÓN</span><h1 id="admin-categories-title">{t.categoriesTitle}</h1><p>{t.categoriesHelp}</p></div></header>
    <form className="admin-catalog-form__surface admin-category-create" aria-label={t.addCategory} onSubmit={event => saveCategory(event)}>
      <div className="admin-category-create__heading"><span className="admin-eyebrow">{language === 'es' ? 'NUEVA EN EL CATÁLOGO' : 'ADD TO CATALOG'}</span><h2>{t.addCategory}</h2><p>{language === 'es' ? 'Definí un nombre y una referencia para agrupar modelos.' : 'Set a name and reference to group models.'}</p></div>
      <div className="admin-category-create__fields">
        <label>{t.categoryName}<input value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} required /></label>
        <label>{t.categorySlug}<input value={draft.slug || slugify(draft.name)} onChange={event => setDraft(current => ({ ...current, slug: event.target.value }))} required /></label>
        <button className="admin-action-primary" disabled={busy}>{busy ? t.savingCategory : t.addCategory}</button>
      </div>
    </form>
    {error && !editing && <p className="admin-catalog-form__error" role="alert">{error}</p>}
    <div className="admin-category-list">{categories.map((category, index) => <article className="admin-category-row" key={category.id} style={{ '--row-index': index }}>
      <div className="admin-category-row__summary"><span className="admin-eyebrow">{language === 'es' ? 'CATEGORÍA' : 'CATEGORY'} / {String(category.id).toUpperCase()}</span><strong>{category.name}</strong><small>{category.slug} · {products.filter(product => String(product.categoryId) === String(category.id)).length} {language === 'es' ? 'modelos' : 'models'}</small></div>
      <div className="admin-category-row__actions"><button className="admin-action-secondary" type="button" aria-expanded={editing === category.id} aria-controls={`category-editor-${category.id}`} onClick={() => { setEditing(editing === category.id ? null : category.id); setEditDraft({ name: category.name, slug: category.slug }); setError(''); }}>{editing === category.id ? t.cancel : (language === 'es' ? 'Editar categoría' : 'Edit category')}</button><button className="admin-action-secondary admin-category-delete" type="button" disabled={busy} onClick={() => { setError(''); if (usedCategories.has(String(category.id))) { setError(t.categoryUsed); return; } setDeleteTarget(category); }}>{t.deleteCategory}</button></div>
      {editing === category.id && <form id={`category-editor-${category.id}`} className="admin-category-editor" aria-label={`${t.editCategory}: ${category.name}`} onSubmit={event => saveCategory(event, category.id)}>
        <header><div><span className="admin-eyebrow">{language === 'es' ? 'IDENTIDAD DE CATÁLOGO' : 'CATALOG IDENTITY'}</span><h2>{t.editCategory}: {category.name}</h2></div><p>{t.categoryUrlHelp}</p></header>
        <div className="admin-category-editor__body">
          <div className="admin-category-editor__fields">
            <label>{t.categoryName}<input autoFocus value={editDraft.name} onChange={event => setEditDraft(current => ({ ...current, name: event.target.value, slug: current.slug || slugify(event.target.value) }))} required /></label>
            <label>{t.categorySlug}<input value={editDraft.slug} onChange={event => setEditDraft(current => ({ ...current, slug: event.target.value }))} required /></label>
          </div>
          <aside className="admin-category-preview" aria-live="polite"><span className="admin-eyebrow">{t.categoryPreview}</span><strong>{editDraft.name || category.name}</strong><code>{slugify(editDraft.slug || editDraft.name) || category.slug}</code><span>{t.categoryProducts}: {products.filter(product => String(product.categoryId) === String(category.id)).length}</span></aside>
        </div>
        {error && <p className="admin-catalog-form__error" role="alert">{error}</p>}
        <footer className="admin-category-editor__actions"><button className="admin-action-secondary" type="button" disabled={busy} onClick={cancelEdit}>{t.cancel}</button><button className="admin-action-primary" disabled={busy}>{busy ? t.savingCategory : t.saveCategory}</button></footer>
      </form>}
    </article>)}</div>
    {deleteTarget && <CatalogDeleteDialog category name={deleteTarget.name} language={language} busy={busy} error={error} onCancel={() => { setDeleteTarget(null); setError(''); }} onConfirm={() => remove(deleteTarget)} />}
  </section>;
}
