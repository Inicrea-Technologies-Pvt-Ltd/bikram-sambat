/** Nepali fiscal year helpers. The fiscal year runs Shrawan 1 to the end of Ashadh. */
import { bsToAdIso, daysInBsMonth } from './convert';
import type { BsDate, NepaliFiscalYear } from './types';

/** BS month index of Shrawan — the first month of the fiscal year. */
export const SHRAWAN = 4;

/** BS month index of Ashadh — the last month of the fiscal year. */
export const ASHADH = 3;

/**
 * The fiscal year containing a BS date.
 *
 * @example
 * getNepaliFiscalYear({ year: 2083, month: 5, day: 4 }).label   // "2083/84"
 * getNepaliFiscalYear({ year: 2083, month: 2, day: 4 }).label   // "2082/83"
 */
export function getNepaliFiscalYear(bs: BsDate): NepaliFiscalYear {
  const bsYear = bs.month >= SHRAWAN ? bs.year : bs.year - 1;
  const endYear = bsYear + 1;
  return {
    bsYear,
    startAd: bsToAdIso({ year: bsYear, month: SHRAWAN, day: 1 }),
    endAd: bsToAdIso({
      year: endYear,
      month: ASHADH,
      day: daysInBsMonth(endYear, ASHADH),
    }),
    label: `${bsYear}/${String(endYear % 100).padStart(2, '0')}`,
  };
}

/** True when `bs` falls inside the fiscal year starting in `bsYear`. */
export function isInFiscalYear(bs: BsDate, bsYear: number): boolean {
  return getNepaliFiscalYear(bs).bsYear === bsYear;
}
