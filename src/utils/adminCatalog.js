import { matchesFacet } from './facetFilters.js';
export const CATALOG_MATERIALS = new Set(['ASA', 'PLA', 'PETG', 'ABS', 'TPU']);

export function buildAdminCatalog({ products = [], categories = [] } = {}) {
  const categoriesById = new Map(categories.map(category => [String(category.id), category]));
  return [...products]
    .map(product => ({ ...product, category: categoriesById.get(String(product.categoryId)) || null }))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'));
}

export function filterAdminCatalog(products = [], { query = '', status = 'all', material = 'all' } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return products.filter(product => {
    const matchesStatus = matchesFacet(String(product.status || '').toUpperCase(), status);
    const matchesMaterial = matchesFacet(String(product.material || '').toUpperCase(), material);
    const searchable = [product.id, product.name, product.slug, product.description, product.material,
      product.status, product.category?.name, ...(product.availableColors || [])]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return matchesStatus && matchesMaterial && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function summarizeAdminCatalog(products = []) {
  return products.reduce((counts, product) => {
    counts.all += 1;
    const status = String(product.status || 'UNSPECIFIED').toUpperCase();
    counts.statuses[status] = (counts.statuses[status] || 0) + 1;
    const material = String(product.material || 'UNSPECIFIED').toUpperCase();
    counts.materials[material] = (counts.materials[material] || 0) + 1;
    if (!CATALOG_MATERIALS.has(material)) counts.needsReview += 1;
    return counts;
  }, { all: 0, needsReview: 0, statuses: {}, materials: {} });
}
