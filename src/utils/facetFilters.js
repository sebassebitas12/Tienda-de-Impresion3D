export function selectedValues(value) {
  return [...new Set((Array.isArray(value) ? value : [value]).filter(item => item && item !== 'all'))];
}

export function matchesFacet(value, selected) {
  const values = selectedValues(selected);
  return values.length === 0 || values.includes(value);
}

export function toggleFacetParams(params, key, value) {
  const next = new URLSearchParams(params);
  const selected = selectedValues(next.getAll(key));
  next.delete(key);
  if (value !== 'all') {
    const values = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    values.forEach(item => next.append(key, item));
  }
  return next;
}
