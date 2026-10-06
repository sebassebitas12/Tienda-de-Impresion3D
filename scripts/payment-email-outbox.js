const ELIGIBLE_PAYMENT_MODES = new Set(['PAYPAL_SANDBOX', 'SINPE_MANUAL']);
const TERMINAL_EMAIL_STATUSES = new Set(['SENT', 'FAILED', 'UNKNOWN']);
const EMAIL_TRANSITIONS = {
  PENDING: new Set(['SENDING']),
  SENDING: TERMINAL_EMAIL_STATUSES,
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  return structuredClone(value);
}

function normalizedTimestamp(value) {
  if (!(typeof value === 'string' || value instanceof Date)) return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function orderIdentity(order) {
  if (!isRecord(order)) return { error: 'INVALID_ORDER' };
  if (order.status !== 'CONFIRMED' || order.paymentStatus !== 'PAID'
    || !ELIGIBLE_PAYMENT_MODES.has(order.paymentMode)) {
    return { error: 'PAYMENT_NOT_ELIGIBLE' };
  }

  const orderId = typeof order.id === 'string' ? order.id.trim() : '';
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(orderId)) return { error: 'INVALID_ORDER_ID' };
  const paidAt = normalizedTimestamp(order.paidAt);
  if (!paidAt) return { error: 'INVALID_PAID_AT' };

  return {
    orderId,
    paidAt,
    paymentMode: order.paymentMode,
    deliveryKey: `payment-email:${encodeURIComponent(orderId)}:${encodeURIComponent(paidAt)}`,
  };
}

function normalizedEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim();
  if (!email || email.length > 254 || containsControlCharacters(email) || /\s/.test(email)) return null;

  const separator = email.lastIndexOf('@');
  if (separator < 1 || separator !== email.indexOf('@')) return null;
  const local = email.slice(0, separator);
  const domain = email.slice(separator + 1).toLowerCase();
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) return null;

  const labels = domain.split('.');
  if (labels.length < 2 || labels.some(label => !label || label.length > 63
    || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;
  const topLevelDomain = labels.at(-1);
  if (!/^[a-z]{2,63}$/.test(topLevelDomain)) return null;
  if (domain === 'example' || domain.startsWith('example.') || domain.endsWith('.example')
    || ['test', 'invalid', 'localhost'].includes(topLevelDomain)) return null;

  return `${local}@${domain}`;
}

function validCrcAmount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function containsControlCharacters(value) {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 31 || (codePoint >= 127 && codePoint <= 159)) return true;
  }
  return false;
}

function replaceControlCharacters(value) {
  let result = '';
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    result += codePoint <= 31 || (codePoint >= 127 && codePoint <= 159) ? ' ' : character;
  }
  return result;
}

function safeLineDescription(value) {
  if (typeof value !== 'string') return '';
  return replaceControlCharacters(value.normalize('NFKC')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function safeOrderLines(order) {
  if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
    const lines = [];
    for (const item of order.orderItems) {
      if (!isRecord(item)) return { error: 'INVALID_ORDER_LINES' };
      const description = safeLineDescription(item.productName || item.name || item.title);
      if (!description || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
        return { error: 'INVALID_ORDER_LINES' };
      }
      lines.push({ description, quantity: item.quantity });
    }
    return { lines };
  }

  const scope = order.scopeSnapshot;
  const description = isRecord(scope)
    ? safeLineDescription(scope.name || scope.description)
    : '';
  if (!description) return { error: 'INVALID_ORDER_LINES' };
  const quantity = Number.isSafeInteger(scope.quantity) && scope.quantity > 0 ? scope.quantity : null;
  return { lines: [{ description, quantity }] };
}

function crcTotal(order) {
  if (order.currency !== 'CRC') return { error: 'INVALID_CURRENCY' };
  const total = order.totalCrc ?? order.total ?? order.subtotalCrc ?? order.subtotal;
  return validCrcAmount(total) ? { totalCrc: total } : { error: 'INVALID_TOTAL_CRC' };
}

/**
 * Build the fixed-recipient, plain-data payload for a verified payment email.
 * On success returns { to, bcc, orderId, totalCrc, currency, paidAt,
 * paymentMode, deliveryKey, lines, summary }; otherwise returns { error }.
 */
export function buildPaymentEmailPayload({ order, customer, workshopEmail } = {}) {
  const identity = orderIdentity(order);
  if (identity.error) return { error: identity.error };

  const to = normalizedEmail(customer?.email);
  if (!to) return { error: 'INVALID_CUSTOMER_EMAIL' };
  const bcc = normalizedEmail(workshopEmail);
  if (!bcc) return { error: 'INVALID_WORKSHOP_EMAIL' };

  const amount = crcTotal(order);
  if (amount.error) return amount;
  const orderLines = safeOrderLines(order);
  if (orderLines.error) return orderLines;

  const lines = orderLines.lines;
  const summary = lines.length === 1
    ? lines[0].description
    : `${lines.length} líneas de pedido`;

  return {
    to,
    bcc,
    orderId: identity.orderId,
    totalCrc: amount.totalCrc,
    currency: 'CRC',
    paidAt: identity.paidAt,
    paymentMode: identity.paymentMode,
    deliveryKey: identity.deliveryKey,
    lines,
    summary,
  };
}

/**
 * Create one PENDING email intent on an eligible paid order. `now` is the
 * intent creation time; the unique delivery key is derived from order id +
 * paidAt so retries cannot create a second intent for the same payment.
 */
export function createPaymentEmailIntent(order, now) {
  const identity = orderIdentity(order);
  if (identity.error) return { error: identity.error };
  if (order.paymentEmail != null) return { error: 'PAYMENT_EMAIL_ALREADY_EXISTS' };

  const createdAt = normalizedTimestamp(now);
  if (!createdAt) return { error: 'INVALID_CREATED_AT' };

  try {
    const next = clone(order);
    next.paymentEmail = {
      status: 'PENDING',
      deliveryKey: identity.deliveryKey,
      orderId: identity.orderId,
      paidAt: identity.paidAt,
      paymentMode: identity.paymentMode,
      createdAt,
    };
    return next;
  } catch {
    return { error: 'INVALID_ORDER' };
  }
}

/** Apply exactly one legal outbox state transition without mutating the order. */
export function updatePaymentEmail(order, status, details) {
  if (!isRecord(order) || !isRecord(order.paymentEmail)) return { error: 'PAYMENT_EMAIL_INTENT_REQUIRED' };
  const currentStatus = order.paymentEmail.status;
  if (!EMAIL_TRANSITIONS[currentStatus]?.has(status)) return { error: 'INVALID_PAYMENT_EMAIL_TRANSITION' };
  if (details !== undefined && details !== null && !isRecord(details)) return { error: 'INVALID_PAYMENT_EMAIL_DETAILS' };

  try {
    const next = clone(order);
    const metadata = details == null
      ? next.paymentEmail.metadata
      : { ...(next.paymentEmail.metadata || {}), ...clone(details) };
    next.paymentEmail = {
      ...next.paymentEmail,
      status,
      ...(metadata ? { metadata } : {}),
    };
    return next;
  } catch {
    return { error: 'INVALID_PAYMENT_EMAIL_DETAILS' };
  }
}
