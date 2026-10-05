import { createHash, randomUUID } from 'node:crypto';
import { calculateProductDemoPrice } from '../src/utils/productDemoPricing.js';
import { CATALOG_MATERIALS } from '../src/utils/adminCatalog.js';

const slugify = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fields = {
  products: ['name', 'description', 'categoryId', 'material', 'availableColors', 'dimensions', 'weightGrams', 'estimatedProductionHours', 'price', 'status', 'featured'],
  categories: ['name', 'description', 'status'],
};

export function prepareAdminCatalogAction(input, data, now = new Date().toISOString()) {
  const { entity, operation, recordId } = input || {};
  if (!fields[entity] || !['CREATE', 'UPDATE', 'DELETE'].includes(operation)) return { error: 'INVALID_CATALOG_ACTION' };
  const collection = data[entity] || [];
  const current = collection.find(record => String(record.id) === String(recordId));
  if (operation !== 'CREATE' && !current) return { error: 'CATALOG_RECORD_NOT_FOUND' };
  let changes;
  try { changes = typeof input.changesJson === 'string' ? JSON.parse(input.changesJson) : input.changes || {}; }
  catch { return { error: 'INVALID_CATALOG_ACTION' }; }
  if (!changes || Array.isArray(changes) || typeof changes !== 'object' || Object.keys(changes).some(key => !fields[entity].includes(key))) return { error: 'INVALID_CATALOG_FIELDS' };
  if (operation === 'DELETE') {
    if (entity === 'categories' && (data.products || []).some(p => String(p.categoryId) === String(recordId))) return { error: 'CATEGORY_IN_USE' };
    if (entity === 'products' && ([...(data.orderItems || []), ...(data.orders || []).flatMap(o => o.orderItems || [])].some(i => String(i.productId) === String(recordId)))) return { error: 'PRODUCT_IN_USE' };
    return { actionId: randomUUID(), entity, operation, recordId: String(recordId), expectedFingerprint: fingerprint(current), changes: {}, name: current.name, preview: [{ field: 'Eliminar', before: current.name, after: null }] };
  }
  const value = { ...(current || {}), ...changes };
  if (typeof value.name !== 'string' || !value.name.trim() || value.name.length > 160) return { error: 'CATALOG_NAME_REQUIRED' };
  value.name = value.name.trim(); value.slug = slugify(value.name);
  if (!value.slug || collection.some(row => String(row.id) !== String(recordId || '') && (slugify(row.slug || row.name) === value.slug || row.name?.toLowerCase() === value.name.toLowerCase()))) return { error: 'CATALOG_DUPLICATE' };
  value.status ||= entity === 'products' ? 'DRAFT' : 'ACTIVE';
  if (!['ACTIVE', 'DRAFT', 'INACTIVE'].includes(value.status)) return { error: 'INVALID_CATALOG_STATUS' };
  if (value.description !== undefined && (typeof value.description !== 'string' || value.description.length > 2000)) return { error: 'INVALID_CATALOG_FIELDS' };
  if (entity === 'products') {
    if (!(data.categories || []).some(c => String(c.id) === String(value.categoryId) && c.status !== 'INACTIVE')) return { error: 'CATALOG_CATEGORY_REQUIRED' };
    if (value.material && !CATALOG_MATERIALS.has(String(value.material).toUpperCase())) return { error: 'MATERIAL_UNSUPPORTED' };
    if (value.material) value.material = String(value.material).toUpperCase() === 'PLA SILK' ? 'PLA Silk' : String(value.material).toUpperCase();
    if (value.availableColors !== undefined && (!Array.isArray(value.availableColors) || value.availableColors.length > 12 || value.availableColors.some(c => typeof c !== 'string' || !c.trim() || c.length > 48))) return { error: 'INVALID_CATALOG_FIELDS' };
    if (value.dimensions !== undefined && (typeof value.dimensions !== 'string' || value.dimensions.length > 200)) return { error: 'INVALID_CATALOG_FIELDS' };
    if (value.featured !== undefined && typeof value.featured !== 'boolean') return { error: 'INVALID_CATALOG_FIELDS' };
    for (const key of ['price', 'weightGrams', 'estimatedProductionHours']) if (value[key] != null && (!Number.isFinite(value[key]) || value[key] < 0 || value[key] > 1_000_000)) return { error: 'INVALID_CATALOG_NUMBER' };
    const recalculates = operation === 'CREATE' || ['material', 'weightGrams', 'estimatedProductionHours'].some(key => key in changes);
    if (recalculates && !('price' in changes)) {
      const quote = calculateProductDemoPrice({ material: value.material, weightGrams: value.weightGrams, printHours: value.estimatedProductionHours });
      if (quote) { value.price = quote.breakdown.amountCrc; value.priceSource = 'DEMO'; value.quotePricing = quote; }
      else if (current?.priceSource === 'DEMO') return { error: 'CATALOG_PRICING_REQUIRED' };
    } else if ('price' in changes) { value.priceSource = 'MANUAL'; value.quotePricing = null; }
    if (value.status === 'ACTIVE' && (!value.material || !Number.isFinite(value.price) || value.price <= 0 || !value.availableColors?.length)) return { error: 'CATALOG_PUBLICATION_INCOMPLETE' };
    value.currency = 'CRC'; value.images ||= []; value.availableColors ||= [];
    if (value.priceSource === 'DEMO') value.priceConfirmation = { mode: 'DEMO', confirmedAt: now };
  }
  const changed = Object.fromEntries(Object.entries(value).filter(([key, v]) => key !== 'id' && JSON.stringify(v) !== JSON.stringify(current?.[key])));
  return { actionId: randomUUID(), entity, operation, recordId: current ? String(current.id) : null,
    expectedFingerprint: current ? fingerprint(current) : null, changes: changed, name: value.name,
    preview: Object.entries(changed).filter(([key]) => !['images', 'quotePricing', 'priceConfirmation', 'currency'].includes(key)).map(([field, after]) => ({ field, before: current?.[field] ?? null, after })) };
}

export function applyAdminCatalogAction(action, data, actor, now = new Date().toISOString()) {
  if (actor?.role !== 'admin' || actor.status !== 'ACTIVE') return { error: 'ADMIN_REQUIRED' };
  if (!action || typeof action.actionId !== 'string' || !/^[a-f0-9-]{36}$/.test(action.actionId)) return { error: 'INVALID_CATALOG_ACTION' };
  const previous = (data.activityLog || []).find(event => event.aiActionId === action.actionId);
  if (previous) return previous.actorId === String(actor.id) ? { result: previous.result, alreadyApplied: true } : { error: 'ADMIN_REQUIRED' };
  const current = data[action.entity]?.find(record => String(record.id) === String(action.recordId));
  if (action.operation !== 'CREATE' && (!current || fingerprint(current) !== action.expectedFingerprint)) return { error: 'STATUS_CONFLICT' };
  // Revalidate only editable inputs; derived fields are recalculated at confirmation.
  const editable = Object.fromEntries(Object.entries(action.changes || {}).filter(([key]) => fields[action.entity]?.includes(key)));
  if (action.changes?.priceSource === 'DEMO') delete editable.price;
  const validated = prepareAdminCatalogAction({ ...action, changesJson: undefined, changes: editable }, data, now);
  if (validated.error) return validated;
  const collection = data[action.entity];
  let record;
  if (action.operation === 'DELETE') collection.splice(collection.indexOf(current), 1);
  else if (action.operation === 'CREATE') {
    record = { ...validated.changes, id: randomUUID(), createdAt: now, updatedAt: now };
    collection.push(record);
  } else { Object.assign(current, validated.changes, { updatedAt: now }); record = current; }
  const result = { operation: action.operation, entity: action.entity, recordId: record?.id || action.recordId,
    name: validated.name, path: `/admin/${action.entity === 'products' ? 'catalogo' : 'catalogo/categorias'}` };
  data.activityLog ||= [];
  data.activityLog.push({ id: randomUUID(), entity: action.entity === 'products' ? 'product' : 'category', entityId: String(result.recordId), actorId: String(actor.id), action: `AI_CATALOG_${action.operation}`, occurredAt: now, aiActionId: action.actionId, result });
  return { result, record };
}
