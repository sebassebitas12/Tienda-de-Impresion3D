const label = '(?:largo|longitud|ancho|alto|profundidad|di[aá]metro(?:\\s+m[aá]ximo)?|espesor|grosor|length|width|height|depth|diameter|thickness|ø)';
const unit = '(mm|cm|m|in(?:ch(?:es)?)?|pulg(?:ada)?s?)';
const value = '(\\d+(?:[.,]\\d+)?)';
const segmentPattern = new RegExp(`^\\s*(?:${label}\\s*)?${value}\\s*${unit}?\\s*(?:(?:de\\s*)?${label})?\\s*$`, 'i');
const separators = /[,;]|[x×*]|\\by\\b|\\bby\\b/i;
const unitToMm = { mm: 1, cm: 10, m: 1000, in: 25.4, inch: 25.4, inches: 25.4, pulgada: 25.4, pulgadas: 25.4, pulg: 25.4, pulgs: 25.4 };

/** Parse dimensions without inventing units. A final unit may apply to a list such as "15 × 8 × 4 cm". */
export function parseQuoteDimensions(input, defaultUnit = '') {
  if (typeof input !== 'string') return { valid: false, exceedsK1C: false };
  const text = input.trim();
  if (!text) return { valid: true, empty: true, exceedsK1C: false };
  if (text.length > 200) return { valid: false, exceedsK1C: false };

  const parts = text.split(separators).map(part => part.trim());
  if (!parts.length || parts.some(part => !part)) return { valid: false, exceedsK1C: false };
  const parsed = parts.map(part => {
    const match = segmentPattern.exec(part);
    if (!match) return null;
    const amount = Number(match[1].replace(',', '.'));
    const rawUnit = match[2]?.toLowerCase().replace(/\s+/g, '');
    return Number.isFinite(amount) && amount > 0 ? { amount, unit: rawUnit || '' } : null;
  });
  if (parsed.some(part => !part)) return { valid: false, exceedsK1C: false };

  const inheritedUnit = [...parsed].reverse().find(part => part.unit)?.unit || String(defaultUnit).toLowerCase();
  if (!inheritedUnit) return { valid: false, exceedsK1C: false };
  if (!Object.hasOwn(unitToMm, inheritedUnit)) return { valid: false, exceedsK1C: false };
  const mmValues = parsed.map(part => part.amount * unitToMm[part.unit || inheritedUnit]);
  if (mmValues.some(amount => !Number.isFinite(amount) || amount <= 0)) return { valid: false, exceedsK1C: false };

  // Official Creality K1C build envelope: 220 × 220 × 250 mm. Oversize requests remain sendable;
  // the workshop may evaluate splitting/reorientation instead of silently rejecting the idea.
  const largestFirst = [...mmValues].sort((a, b) => b - a);
  const exceedsK1C = largestFirst.length > 3
    || largestFirst[0] > 250
    || (largestFirst[1] || 0) > 220
    || (largestFirst[2] || 0) > 220;
  return { valid: true, empty: false, exceedsK1C, millimeters: mmValues, hasExplicitUnits: parsed.some(part => part.unit) };
}

/** Empty is valid when size is not known; entered dimensions must be measurable and have units. */
export function isValidQuoteDimensions(input, defaultUnit = '') {
  return parseQuoteDimensions(input, defaultUnit).valid;
}
