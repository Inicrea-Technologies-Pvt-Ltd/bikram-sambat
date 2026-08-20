import { describe, expect, it } from 'vitest';
import {
  bsMonthName,
  describeBsMonth,
  formatBs,
  parseBs,
  toLatinDigits,
  toNepaliDigits,
} from '../src/index';

const BS = { year: 2083, month: 4, day: 5 }; // Shrawan 5, 2083 => 2026-07-21, a Tuesday

describe('formatBs', () => {
  it('uses a readable default pattern', () => {
    expect(formatBs(BS)).toBe('2083 Shrawan 05');
  });

  it('substitutes every token', () => {
    expect(formatBs(BS, 'YYYY|YY|MMMM|MMM|MM|M|DD|D')).toBe('2083|83|Shrawan|Shr|04|4|05|5');
  });

  it('formats weekday tokens', () => {
    expect(formatBs(BS, 'dddd')).toBe('Tuesday');
    expect(formatBs(BS, 'ddd')).toBe('Tue');
    expect(formatBs(BS, 'dd')).toBe('T');
    expect(formatBs(BS, 'd')).toBe('2');
  });

  it('keeps bracketed text literal', () => {
    expect(formatBs(BS, '[BS] YYYY [year]')).toBe('BS 2083 year');
    expect(formatBs(BS, '[YYYY]')).toBe('YYYY');
  });

  it('translates names and digits together in Nepali', () => {
    expect(formatBs(BS, 'YYYY MMMM DD', { locale: 'ne' })).toBe('२०८३ साउन ०५');
    expect(formatBs(BS, 'dddd', { locale: 'ne' })).toBe('मङ्गलबार');
  });

  it('leaves Nepali month names untouched by digit conversion', () => {
    const output = formatBs(BS, 'MMMM', { locale: 'ne' });
    expect(output).toBe('साउन');
  });

  it('refuses to format an invalid date', () => {
    expect(() => formatBs({ year: 2083, month: 13, day: 1 })).toThrow(/invalid BS date/i);
  });
});

describe('parseBs', () => {
  it('parses the default year-month-day order', () => {
    expect(parseBs('2083-04-05')).toEqual(BS);
    expect(parseBs('2083/04/05')).toEqual(BS);
    expect(parseBs('2083.04.05')).toEqual(BS);
    expect(parseBs('2083 04 05')).toEqual(BS);
  });

  it('honours a different field order', () => {
    expect(parseBs('05/04/2083', 'DD/MM/YYYY')).toEqual(BS);
    expect(parseBs('04-05-2083', 'MM-DD-YYYY')).toEqual(BS);
  });

  it('accepts Nepali digits', () => {
    expect(parseBs('२०८३-०४-०५')).toEqual(BS);
    expect(parseBs('०५/०४/२०८३', 'DD/MM/YYYY')).toEqual(BS);
  });

  it('expands two-digit years into the 2000s', () => {
    expect(parseBs('83-04-05', 'YY-MM-DD')).toEqual(BS);
  });

  it('returns null instead of throwing on bad input', () => {
    expect(parseBs('nonsense')).toBeNull();
    expect(parseBs('2083-04')).toBeNull();
    expect(parseBs('2083-13-05')).toBeNull();
    expect(parseBs('2083-04-32')).toBeNull();
    expect(parseBs('1900-01-01')).toBeNull();
    expect(parseBs('')).toBeNull();
  });

  it('round-trips with formatBs', () => {
    for (const pattern of ['YYYY-MM-DD', 'DD/MM/YYYY']) {
      expect(parseBs(formatBs(BS, pattern), pattern)).toEqual(BS);
    }
  });
});

describe('digits', () => {
  it('converts both ways', () => {
    expect(toNepaliDigits('2083-04-05')).toBe('२०८३-०४-०५');
    expect(toNepaliDigits(2083)).toBe('२०८३');
    expect(toLatinDigits('२०८३-०४-०५')).toBe('2083-04-05');
    expect(toLatinDigits(toNepaliDigits('1234567890'))).toBe('1234567890');
  });

  it('leaves non-digits alone', () => {
    expect(toNepaliDigits('Shrawan 5')).toBe('Shrawan ५');
    expect(toLatinDigits('साउन ५')).toBe('साउन 5');
  });
});

describe('names', () => {
  it('resolves month names per locale', () => {
    expect(bsMonthName(1)).toBe('Baishakh');
    expect(bsMonthName(12)).toBe('Chaitra');
    expect(bsMonthName(1, 'ne')).toBe('बैशाख');
    expect(bsMonthName(99)).toBe('');
  });

  it('describes a month with its length', () => {
    expect(describeBsMonth(2083, 4)).toMatch(/^Shrawan 2083 \(\d{2} days\)$/);
  });
});
