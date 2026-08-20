import { describe, expect, it } from 'vitest';
import fixtures from './fixtures.json';
import {
  BikramRangeError,
  MAX_AD_ISO,
  MAX_BS_DATE,
  MAX_BS_YEAR,
  MIN_BS_DATE,
  MIN_BS_YEAR,
  EPOCH_AD_ISO,
  addBsDays,
  addBsMonths,
  addBsYears,
  adToBs,
  bsToAd,
  bsToAdIso,
  bsWeekday,
  clampBs,
  compareBs,
  daysInBsMonth,
  daysInBsYear,
  diffBsDays,
  endOfBsMonth,
  isValidBsDate,
  startOfBsMonth,
} from '../src/index';

describe('golden fixtures from the Yorion engine', () => {
  it('covers the whole supported range', () => {
    expect(fixtures.range.minBsYear).toBe(MIN_BS_YEAR);
    expect(fixtures.range.maxBsYear).toBe(MAX_BS_YEAR);
    expect(fixtures.range.epochAd).toBe(EPOCH_AD_ISO);
    expect(fixtures.range.maxAd).toBe(MAX_AD_ISO);
    expect(fixtures.pairs.length).toBeGreaterThan(500);
  });

  it.each(fixtures.pairs.map((p) => [p.bs.join('-'), p.bs, p.ad] as const))(
    'BS %s converts both ways',
    (_label, bs, ad) => {
      const [year, month, day] = bs as [number, number, number];
      expect(bsToAdIso({ year, month, day })).toBe(ad);
      expect(adToBs(ad as string)).toEqual({ year, month, day });
    },
  );
});

describe('range boundaries', () => {
  it('maps the epoch exactly', () => {
    expect(bsToAdIso(MIN_BS_DATE)).toBe(EPOCH_AD_ISO);
    expect(adToBs(EPOCH_AD_ISO)).toEqual({ year: MIN_BS_YEAR, month: 1, day: 1 });
  });

  it('maps the final day exactly', () => {
    expect(bsToAdIso(MAX_BS_DATE)).toBe(MAX_AD_ISO);
    expect(adToBs(MAX_AD_ISO)).toEqual(MAX_BS_DATE);
  });

  it('rejects the day before the epoch', () => {
    expect(() => adToBs('1918-04-12')).toThrow(BikramRangeError);
    expect(() => adToBs('1918-04-12')).toThrow(/outside the supported range/);
  });

  it('rejects the day after the end', () => {
    expect(() => adToBs('2044-04-13')).toThrow(BikramRangeError);
  });

  it('reports a machine-readable code', () => {
    try {
      adToBs('1900-01-01');
      throw new Error('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BikramRangeError);
      expect((error as BikramRangeError).code).toBe('OUT_OF_RANGE');
    }
  });

  it('rejects BS days that do not exist in their month', () => {
    const length = daysInBsMonth(2083, 4);
    expect(() => bsToAdIso({ year: 2083, month: 4, day: length + 1 })).toThrow(BikramRangeError);
  });
});

describe('month and year lengths', () => {
  it('keeps every month between 29 and 32 days', () => {
    for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) {
      for (let month = 1; month <= 12; month++) {
        const length = daysInBsMonth(year, month);
        expect(length, `BS ${year}/${month}`).toBeGreaterThanOrEqual(29);
        expect(length, `BS ${year}/${month}`).toBeLessThanOrEqual(32);
      }
    }
  });

  it('keeps every year near a solar year', () => {
    for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) {
      const length = daysInBsYear(year);
      expect(length, `BS ${year}`).toBeGreaterThanOrEqual(363);
      expect(length, `BS ${year}`).toBeLessThanOrEqual(367);
    }
  });

  it('sums to the full AD span', () => {
    let total = 0;
    for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) total += daysInBsYear(year);
    expect(total).toBe(fixtures.totalDays);
  });
});

describe('day-by-day continuity', () => {
  it('advances one day at a time across the entire range without a gap', () => {
    // Walks all 46,022 days: every step must move the AD date forward exactly
    // one day and land on a valid BS date. Catches any table seam.
    let bs = { ...MIN_BS_DATE };
    let previousAd = Date.parse(bsToAdIso(bs) + 'T00:00:00Z');
    let steps = 0;
    while (compareBs(bs, MAX_BS_DATE) < 0) {
      bs = addBsDays(bs, 1);
      const ad = Date.parse(bsToAdIso(bs) + 'T00:00:00Z');
      expect(ad - previousAd).toBe(86_400_000);
      expect(isValidBsDate(bs)).toBe(true);
      previousAd = ad;
      steps++;
    }
    expect(steps).toBe(fixtures.totalDays - 1);
  });
});

describe('weekdays', () => {
  it('agrees with the AD weekday for every fixture', () => {
    for (const pair of fixtures.pairs) {
      const [year, month, day] = pair.bs as [number, number, number];
      const adWeekday = new Date(pair.ad + 'T00:00:00Z').getUTCDay();
      expect(bsWeekday({ year, month, day }), pair.ad).toBe(adWeekday);
    }
  });
});

describe('Date input and timezone handling', () => {
  it('reads local calendar components by default', () => {
    const local = new Date(2026, 7, 20, 23, 30); // 20 Aug 2026, local
    expect(adToBs(local)).toEqual(adToBs('2026-08-20'));
  });

  it('reads UTC components when asked', () => {
    const instant = new Date('2026-08-20T00:00:00.000Z');
    expect(adToBs(instant, { utc: true })).toEqual(adToBs('2026-08-20'));
  });

  it('round-trips a Date through both directions', () => {
    const bs = { year: 2083, month: 5, day: 4 };
    expect(adToBs(bsToAd(bs))).toEqual(bs);
    expect(adToBs(bsToAd(bs, { utc: true }), { utc: true })).toEqual(bs);
  });

  it('accepts a full ISO datetime and uses its date half', () => {
    expect(adToBs('2026-08-20T17:45:00.000Z')).toEqual(adToBs('2026-08-20'));
  });

  it('rejects junk input', () => {
    expect(() => adToBs('not a date')).toThrow(BikramRangeError);
    expect(() => adToBs(new Date('nope'))).toThrow(BikramRangeError);
  });
});

describe('arithmetic', () => {
  it('adds and subtracts days symmetrically', () => {
    const bs = { year: 2083, month: 4, day: 5 };
    expect(addBsDays(addBsDays(bs, 100), -100)).toEqual(bs);
  });

  it('crosses a year boundary correctly', () => {
    const lastDay = { year: 2082, month: 12, day: daysInBsMonth(2082, 12) };
    expect(addBsDays(lastDay, 1)).toEqual({ year: 2083, month: 1, day: 1 });
    expect(addBsDays({ year: 2083, month: 1, day: 1 }, -1)).toEqual(lastDay);
  });

  it('clamps the day when adding months', () => {
    // Find a 32-day month followed by a shorter one.
    let found = false;
    for (let month = 1; month < 12 && !found; month++) {
      const length = daysInBsMonth(2083, month);
      const nextLength = daysInBsMonth(2083, month + 1);
      if (length > nextLength) {
        const result = addBsMonths({ year: 2083, month, day: length }, 1);
        expect(result).toEqual({ year: 2083, month: month + 1, day: nextLength });
        found = true;
      }
    }
    expect(found, 'expected at least one shrinking month pair in BS 2083').toBe(true);
  });

  it('adds years with clamping', () => {
    const bs = { year: 2080, month: 1, day: 1 };
    expect(addBsYears(bs, 3)).toEqual({ year: 2083, month: 1, day: 1 });
  });

  it('measures differences', () => {
    const a = { year: 2083, month: 1, day: 1 };
    expect(diffBsDays(a, addBsDays(a, 45))).toBe(45);
    expect(diffBsDays(addBsDays(a, 45), a)).toBe(-45);
    expect(diffBsDays(a, a)).toBe(0);
  });

  it('orders dates', () => {
    expect(compareBs({ year: 2083, month: 1, day: 1 }, { year: 2083, month: 1, day: 2 })).toBeLessThan(0);
    expect(compareBs({ year: 2084, month: 1, day: 1 }, { year: 2083, month: 12, day: 1 })).toBeGreaterThan(0);
    expect(compareBs({ year: 2083, month: 5, day: 4 }, { year: 2083, month: 5, day: 4 })).toBe(0);
  });

  it('finds month bounds', () => {
    const bs = { year: 2083, month: 4, day: 17 };
    expect(startOfBsMonth(bs)).toEqual({ year: 2083, month: 4, day: 1 });
    expect(endOfBsMonth(bs)).toEqual({ year: 2083, month: 4, day: daysInBsMonth(2083, 4) });
  });

  it('clamps into a range', () => {
    const min = { year: 2083, month: 1, day: 1 };
    const max = { year: 2083, month: 12, day: 1 };
    expect(clampBs({ year: 2080, month: 5, day: 5 }, min, max)).toEqual(min);
    expect(clampBs({ year: 2090, month: 5, day: 5 }, min, max)).toEqual(max);
    expect(clampBs({ year: 2083, month: 5, day: 5 }, min, max)).toEqual({ year: 2083, month: 5, day: 5 });
  });
});

describe('validation', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(isValidBsDate({ year: 2083, month: 4, day: 1 })).toBe(true);
    expect(isValidBsDate({ year: 2083, month: 13, day: 1 })).toBe(false);
    expect(isValidBsDate({ year: 2083, month: 0, day: 1 })).toBe(false);
    expect(isValidBsDate({ year: 2083, month: 4, day: 0 })).toBe(false);
    expect(isValidBsDate({ year: 1900, month: 1, day: 1 })).toBe(false);
    expect(isValidBsDate({ year: 2083, month: 4, day: 1.5 })).toBe(false);
    expect(isValidBsDate(null)).toBe(false);
    expect(isValidBsDate(undefined)).toBe(false);
    expect(isValidBsDate({})).toBe(false);
  });
});
