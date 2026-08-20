/**
 * @inicrea/bikram-sambat-core: Bikram Sambat (Nepali calendar) conversion.
 *
 * Pure TypeScript, zero runtime dependencies, and no WebAssembly, so it runs
 * the same in Node, browsers, edge runtimes and React Native (Hermes).
 *
 * The calendar tables are generated from the Yorion engine
 * (https://github.com/Yorion-io/yorion_engine, MIT OR Apache-2.0) at build
 * time and verified against it day by day across the whole supported range.
 */
export type {
  BikramLocale,
  BsCalendarDay,
  BsDate,
  BsMonthCalendar,
  DateOptions,
  NepaliFiscalYear,
  WeekendPolicy,
} from './types';

export { BikramRangeError } from './errors';

export {
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
  isSameBsDay,
  isValidBsDate,
  startOfBsMonth,
  toIsoDate,
  todayBs,
} from './convert';

export { TWO_DAY_WEEKEND_FROM_AD, TWO_DAY_WEEKEND_FROM_BS } from './data';

export {
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  BS_MONTHS_SHORT_EN,
  WEEKDAYS_EN,
  WEEKDAYS_MIN_EN,
  WEEKDAYS_NE,
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NE,
  bsMonthName,
  getLocale,
  toLatinDigits,
  toNepaliDigits,
} from './locale';

export type { FormatOptions } from './format';
export { describeBsMonth, formatBs, parseBs } from './format';

export type { MonthCalendarOptions } from './month';
export { getBsMonthCalendar, getWeekdayLabels } from './month';

export { ASHADH, SHRAWAN, getNepaliFiscalYear, isInFiscalYear } from './fiscal';
