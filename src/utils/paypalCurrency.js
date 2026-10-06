import { isMoney } from './money.js';

const MAX_SAFE_CENTS = BigInt(Number.MAX_SAFE_INTEGER);

function decimalParts(value) {
  const [mantissa, exponentText] = value.toString().toLowerCase().split('e');
  const exponent = Number(exponentText || 0);
  const [whole, fraction = ''] = mantissa.split('.');
  const digits = `${whole}${fraction}`;
  let scale = fraction.length - exponent;
  let coefficient = BigInt(digits);

  if (scale < 0) {
    coefficient *= 10n ** BigInt(-scale);
    scale = 0;
  }

  return { coefficient, scale };
}

function roundCrcToUsdCents(amountCrc, rateCrcPerUsd) {
  const amount = decimalParts(amountCrc);
  const rate = decimalParts(rateCrcPerUsd);
  const numerator = amount.coefficient * 100n * (10n ** BigInt(rate.scale));
  const denominator = rate.coefficient * (10n ** BigInt(amount.scale));
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  const cents = quotient + (remainder * 2n >= denominator ? 1n : 0n);

  if (cents > MAX_SAFE_CENTS) return null;
  return Number(cents);
}

function isIsoUtcDate(value) {
  if (typeof value !== 'string') return false;
  const dateText = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z)?$/.test(dateText)) return false;

  const parsed = new Date(dateText);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateText.slice(0, 10)) return false;
  if (!dateText.includes('T')) return true;

  return parsed.toISOString().slice(0, 19) === dateText.slice(0, 19);
}

/**
 * Converts CRC to USD using only the caller-supplied CRC-per-USD FX quote.
 * Returns null when an input is invalid or the amount cannot be represented
 * as a safe integer number of USD cents.
 */
export function convertCrcToUsd(amountCrc, fxQuote) {
  const { rate, rateDate, source } = fxQuote || {};
  if (!isMoney(amountCrc)
    || typeof rate !== 'number'
    || !Number.isFinite(rate)
    || rate <= 0
    || !isIsoUtcDate(rateDate)
    || typeof source !== 'string'
    || !source.trim()) return null;

  const amountUsdCents = roundCrcToUsdCents(amountCrc, rate);
  if (amountUsdCents === null) return null;

  return Object.freeze({
    amountCrc,
    currencyCrc: 'CRC',
    amountUsd: amountUsdCents / 100,
    currencyUsd: 'USD',
    rate,
    rateDate: rateDate.trim(),
    source: source.trim(),
  });
}
