export function isMoney(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function formatCRC(amount) {
  if (!isMoney(amount)) return null;
  return new Intl.NumberFormat('es-CR', {
    style: 'currency', currency: 'CRC', minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount);
}

export function productSubtotal(quantity, unitPrice) {
  if (!Number.isInteger(quantity) || quantity < 1 || !isMoney(unitPrice)) return null;
  return Math.round(quantity * unitPrice * 100) / 100;
}
