import { describe, expect, it } from '@jest/globals';
import { convertCrcToUsd } from '../src/utils/paypalCurrency.js';

const validQuote = {
  rate: 500,
  rateDate: '2026-10-05',
  source: 'Caller-provided rate',
};

describe('convertCrcToUsd', () => {
  it('converts CRC to USD and preserves the supplied, dated rate and source', () => {
    expect(convertCrcToUsd(1000, validQuote)).toEqual({
      amountCrc: 1000,
      currencyCrc: 'CRC',
      amountUsd: 2,
      currencyUsd: 'USD',
      rate: 500,
      rateDate: '2026-10-05',
      source: 'Caller-provided rate',
    });
  });

  it('rounds to the nearest cent with exact decimal half-up behavior', () => {
    expect(convertCrcToUsd(1, { ...validQuote, rate: 200 }).amountUsd).toBe(0.01);
    expect(convertCrcToUsd(1, { ...validQuote, rate: 400 }).amountUsd).toBe(0);
    expect(convertCrcToUsd(100.5, { ...validQuote, rate: 100 }).amountUsd).toBe(1.01);
  });

  it('accepts zero CRC and rounds it to zero USD', () => {
    const result = convertCrcToUsd(0, validQuote);

    expect(result.amountUsd).toBe(0);
  });

  it('accepts ISO dates and UTC timestamps, but rejects invalid or non-UTC dates', () => {
    expect(convertCrcToUsd(1000, { ...validQuote, rateDate: '2026-10-05T18:30:00Z' })).not.toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, rateDate: '2026-10-05T18:30:00.125Z' })).not.toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, rateDate: '2026-02-30' })).toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, rateDate: '2026-10-05T18:30:00-06:00' })).toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, rateDate: '   ' })).toBeNull();
  });

  it('returns null for invalid amounts, rates, or sources', () => {
    const invalidAmounts = [-1, '1000', Number.NaN, Number.POSITIVE_INFINITY];
    invalidAmounts.forEach(amount => expect(convertCrcToUsd(amount, validQuote)).toBeNull());

    const invalidRates = [0, -500, Number.NaN, '500'];
    invalidRates.forEach(rate => expect(convertCrcToUsd(1000, { ...validQuote, rate })).toBeNull());

    expect(convertCrcToUsd(1000, { ...validQuote, source: '' })).toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, source: '   ' })).toBeNull();
    expect(convertCrcToUsd(1000, { ...validQuote, source: null })).toBeNull();
    expect(convertCrcToUsd(1000)).toBeNull();
  });

  it('rejects a converted amount whose cents exceed the safe integer range', () => {
    expect(convertCrcToUsd(Number.MAX_VALUE, { ...validQuote, rate: Number.MIN_VALUE })).toBeNull();
  });

  it('returns a frozen snapshot that remains JSON-serializable', () => {
    const snapshot = convertCrcToUsd(1000, { ...validQuote, rateDate: '  2026-10-05  ', source: '  Hacienda  ' });

    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(snapshot.rateDate).toBe('2026-10-05');
    expect(snapshot.source).toBe('Hacienda');
    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
  });
});
