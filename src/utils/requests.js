import { isMoney } from './money.js';

export const requestStatusLabels = {
  PENDING_QUOTE: 'Pendiente de cotización',
  IN_REVIEW: 'En revisión',
  QUOTED: 'Cotización emitida',
  AWAITING_APPROVAL: 'Pendiente de aprobación',
  APPROVED: 'Aprobado',
  PAID: 'Pagado',
  REJECTED: 'Rechazado',
  EXPIRED: 'Cotización caducada',
  CANCELLED: 'Cancelado',
};

export function hasQuotedAmount(request) {
  return ['QUOTED', 'AWAITING_APPROVAL', 'APPROVED', 'PAID'].includes(request?.status) &&
    isMoney(request?.quotedPrice);
}

export function isQuoteExpired(request, now = Date.now()) {
  const expiration = Date.parse(request?.quoteValidUntil);
  return request?.status === 'EXPIRED' || (Number.isFinite(expiration) && expiration <= now);
}

export function canPayQuote(request, now = Date.now()) {
  return request?.status === 'APPROVED' && hasQuotedAmount(request) &&
    Number.isFinite(Date.parse(request?.quoteValidUntil)) && !isQuoteExpired(request, now);
}
