/**
 * BS ↔ AD conversion.
 *
 * Nepali month lengths vary between 29 and 32 days with no closed-form rule,
 * so everything here works off the generated table in `data.ts`: count days
 * from a known epoch, then walk the table. All arithmetic is on whole days
 * against UTC midnights, so there is no floating-point or DST drift.
 */
import {
  EPOCH_AD_ISO,
  EPOCH_AD_UTC,
  MAX_AD_ISO,
  MAX_BS_YEAR,
  MIN_BS_YEAR,
  MONTH_DAYS_ENCODED,
} from './data';
import { BikramRangeError } from './errors';
import type { BsDate, DateOptions } from './types';

export const MS_PER_DAY = 86_400_000;

/** Month lengths as `[year][month-1]`, decoded once from the packed table. */
const MONTH_DAYS: number[][] = (() => {
  const years: number[][] = [];
  for (let i = 0; i < MONTH_DAYS_ENCODED.length; i += 12) {
    const months: number[] = [];
    for (let m = 0; m < 12; m++) {
      months.push(MONTH_DAYS_ENCODED.charCodeAt(i + m) - 48 + 29);
    }
    years.push(months);
  }
  return years;
})();

/** Days from the epoch to Baishakh 1 of each covered year. */
const YEAR_START_OFFSET: number[] = (() => {
  const offsets: number[] = new Array(MONTH_DAYS.length);
  let total = 0;
  for (let i = 0; i < MONTH_DAYS.length; i++) {
    offsets[i] = total;
    const months = MONTH_DAYS[i]!;
    for (let m = 0; m < 12; m++) total += months[m]!;
  }
  return offsets;
})();

/** Total days covered by the table, one past the last representable day. */
const TOTAL_DAYS =
  YEAR_START_OFFSET[YEAR_START_OFFSET.length - 1]! +
  MONTH_DAYS[MONTH_DAYS.length - 1]!.reduce((a, b) => a + b, 0);

/** Earliest supported BS date. */
export const MIN_BS_DATE: Readonly<BsDate> = Object.freeze({
  year: MIN_BS_YEAR,
  month: 1,
  day: 1,
});

/** Latest supported BS date. */
export const MAX_BS_DATE: Readonly<BsDate> = Object.freeze({
  year: MAX_BS_YEAR,
  month: 12,
  day: MONTH_DAYS[MONTH_DAYS.length - 1]![11]!,
});

export { MIN_BS_YEAR, MAX_BS_YEAR, EPOCH_AD_ISO, MAX_AD_ISO };

/** Number of days in a BS month. Throws if the year/month is out of range. */
export function daysInBsMonth(year: number, month: number): number {
  assertBsYearMonth(year, month);
  return MONTH_DAYS[year - MIN_BS_YEAR]![month - 1]!;
}

/** Number of days in a BS year (365 or 366, occasionally other values). */
export function daysInBsYear(year: number): number {
  assertBsYearMonth(year, 1);
  return MONTH_DAYS[year - MIN_BS_YEAR]!.reduce((a, b) => a + b, 0);
}

/** True when `bs` is a real date inside the supported range. */
export function isValidBsDate(bs: Partial<BsDate> | null | undefined): bs is BsDate {
  if (!bs) return false;
  const { year, month, day } = bs;
  if (!isInt(year) || !isInt(month) || !isInt(day)) return false;
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  return day <= MONTH_DAYS[year - MIN_BS_YEAR]![month - 1]!;
}

/** Days elapsed since the epoch for a BS date. */
function bsToDayIndex(bs: BsDate): number {
  // Widened so the failure branch can still read the offending fields, a
  // `bs is BsDate` guard would otherwise narrow `bs` to `never` here.
  const candidate: Partial<BsDate> = bs;
  if (!isValidBsDate(candidate)) {
    const { year, month, day } = candidate;
    const outOfRange =
      typeof year !== 'number' || year < MIN_BS_YEAR || year > MAX_BS_YEAR;
    throw new BikramRangeError(
      `Not a valid BS date: ${year}-${month}-${day}. ` +
        `Supported range is BS ${MIN_BS_YEAR}-01-01 to ${MAX_BS_YEAR}-12-${MAX_BS_DATE.day}.`,
      outOfRange ? 'OUT_OF_RANGE' : 'INVALID_DATE',
    );
  }
  const months = MONTH_DAYS[bs.year - MIN_BS_YEAR]!;
  let days = YEAR_START_OFFSET[bs.year - MIN_BS_YEAR]!;
  for (let m = 0; m < bs.month - 1; m++) days += months[m]!;
  return days + bs.day - 1;
}

/** BS date for a day index, by binary search over the year offsets. */
function dayIndexToBs(index: number): BsDate {
  if (!Number.isFinite(index) || index < 0 || index >= TOTAL_DAYS) {
    throw new BikramRangeError(
      `AD date is outside the supported range (${EPOCH_AD_ISO} to ${MAX_AD_ISO}).`,
      'OUT_OF_RANGE',
    );
  }
  let lo = 0;
  let hi = YEAR_START_OFFSET.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (YEAR_START_OFFSET[mid]! <= index) lo = mid;
    else hi = mid - 1;
  }
  let rest = index - YEAR_START_OFFSET[lo]!;
  const months = MONTH_DAYS[lo]!;
  let month = 0;
  while (rest >= months[month]!) rest -= months[month++]!;
  return { year: lo + MIN_BS_YEAR, month: month + 1, day: rest + 1 };
}

// ---------------------------------------------------------------------------
// AD helpers. "YYYY-MM-DD" is the canonical interchange format here: it names a
// calendar date without dragging a timezone along, which is what a date picker
// actually deals in.
// ---------------------------------------------------------------------------

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/;

/** Parse "YYYY-MM-DD" (or the date half of an ISO datetime) into UTC parts. */
function parseIsoDate(iso: string): { y: number; m: number; d: number } {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) {
    throw new BikramRangeError(`Expected an ISO date like "2026-08-20", got "${iso}".`, 'INVALID_DATE');
  }
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

const pad = (n: number, width = 2): string => String(n).padStart(width, '0');

/** Format AD year/month/day as "YYYY-MM-DD". */
export function toIsoDate(y: number, m: number, d: number): string {
  return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
}

/**
 * Read the calendar date out of a `Date`, an ISO string, or BS-like parts.
 * A `Date` is read in local time unless `utc` is set. See {@link DateOptions}.
 */
function adPartsOf(input: Date | string, options?: DateOptions): { y: number; m: number; d: number } {
  if (typeof input === 'string') return parseIsoDate(input);
  if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
    throw new BikramRangeError('Expected a valid Date or an ISO date string.', 'INVALID_DATE');
  }
  return options?.utc
    ? { y: input.getUTCFullYear(), m: input.getUTCMonth() + 1, d: input.getUTCDate() }
    : { y: input.getFullYear(), m: input.getMonth() + 1, d: input.getDate() };
}

/** Days between an AD calendar date and the epoch. */
function adToDayIndex(y: number, m: number, d: number): number {
  // Date.UTC maps years 0-99 into 1900-1999; sidestep that so a stray low year
  // is reported as out of range rather than silently shifted by 1900.
  const utcMs = y >= 0 && y <= 99 ? lowYearUtc(y, m, d) : Date.UTC(y, m - 1, d);
  return Math.round((utcMs - EPOCH_AD_UTC) / MS_PER_DAY);
}

function lowYearUtc(y: number, m: number, d: number): number {
  const date = new Date(Date.UTC(2000, m - 1, d));
  date.setUTCFullYear(y);
  return date.getTime();
}

// ---------------------------------------------------------------------------
// Public conversion API
// ---------------------------------------------------------------------------

/**
 * AD → BS.
 *
 * Accepts an ISO date string ("2026-08-20") or a `Date`. A `Date` is read in
 * local time by default; pass `{ utc: true }` if you store UTC-midnight dates.
 *
 * @example
 * adToBs('2026-08-20')            // { year: 2083, month: 5, day: 4 }
 * adToBs(new Date())              // today, in the user's own timezone
 * adToBs(record.createdAt, { utc: true })
 */
export function adToBs(input: Date | string, options?: DateOptions): BsDate {
  const { y, m, d } = adPartsOf(input, options);
  return dayIndexToBs(adToDayIndex(y, m, d));
}

/**
 * BS → AD, as "YYYY-MM-DD". Prefer this over {@link bsToAd} when you are
 * storing or transmitting the value: a calendar date has no timezone, and an
 * ISO string keeps it that way.
 *
 * @example
 * bsToAdIso({ year: 2083, month: 5, day: 4 })   // "2026-08-20"
 * bsToAdIso(2083, 5, 4)                          // "2026-08-20"
 */
export function bsToAdIso(bs: BsDate): string;
export function bsToAdIso(year: number, month: number, day: number): string;
export function bsToAdIso(a: BsDate | number, b?: number, c?: number): string {
  const bs = typeof a === 'number' ? { year: a, month: b!, day: c! } : a;
  const ms = EPOCH_AD_UTC + bsToDayIndex(bs) * MS_PER_DAY;
  const date = new Date(ms);
  return toIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/**
 * BS → AD as a `Date` at midnight. Local midnight by default, matching
 * {@link adToBs}; pass `{ utc: true }` for UTC midnight.
 */
export function bsToAd(bs: BsDate, options?: DateOptions): Date;
export function bsToAd(year: number, month: number, day: number, options?: DateOptions): Date;
export function bsToAd(
  a: BsDate | number,
  b?: number | DateOptions,
  c?: number,
  d?: DateOptions,
): Date {
  const isParts = typeof a === 'number';
  const bs = isParts ? { year: a, month: b as number, day: c! } : a;
  const options = (isParts ? d : (b as DateOptions | undefined)) ?? {};
  const iso = bsToAdIso(bs);
  const { y, m, day } = { y: Number(iso.slice(0, 4)), m: Number(iso.slice(5, 7)), day: Number(iso.slice(8, 10)) };
  return options.utc ? new Date(Date.UTC(y, m - 1, day)) : new Date(y, m - 1, day);
}

/** Today's date in BS. Reads the local clock unless `{ utc: true }`. */
export function todayBs(options?: DateOptions): BsDate {
  return adToBs(new Date(), options);
}

/** Weekday of a BS date. 0 = Sunday … 6 = Saturday. */
export function bsWeekday(bs: BsDate): number {
  // AD 1918-04-13 (BS 1975-01-01) was a Saturday, hence the +6 offset.
  return (bsToDayIndex(bs) + 6) % 7;
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

/** Add (or subtract, with a negative `days`) whole days to a BS date. */
export function addBsDays(bs: BsDate, days: number): BsDate {
  return dayIndexToBs(bsToDayIndex(bs) + Math.trunc(days));
}

/**
 * Add whole months, clamping the day to the target month's length, so
 * Falgun 30 plus one month lands on the last day of Chaitra, not past it.
 */
export function addBsMonths(bs: BsDate, months: number): BsDate {
  const total = (bs.year * 12 + (bs.month - 1)) + Math.trunc(months);
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  assertBsYearMonth(year, month);
  const day = Math.min(bs.day, MONTH_DAYS[year - MIN_BS_YEAR]![month - 1]!);
  return { year, month, day };
}

/** Add whole years, clamping the day the same way {@link addBsMonths} does. */
export function addBsYears(bs: BsDate, years: number): BsDate {
  return addBsMonths(bs, Math.trunc(years) * 12);
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function diffBsDays(from: BsDate, to: BsDate): number {
  return bsToDayIndex(to) - bsToDayIndex(from);
}

/** Negative when `a` is earlier than `b`, positive when later, 0 when equal. */
export function compareBs(a: BsDate, b: BsDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

/** True when both dates name the same day. */
export function isSameBsDay(a: BsDate | null | undefined, b: BsDate | null | undefined): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/** First day of the BS month containing `bs`. */
export function startOfBsMonth(bs: BsDate): BsDate {
  return { year: bs.year, month: bs.month, day: 1 };
}

/** Last day of the BS month containing `bs`. */
export function endOfBsMonth(bs: BsDate): BsDate {
  return { year: bs.year, month: bs.month, day: daysInBsMonth(bs.year, bs.month) };
}

/** Clamp a BS date into `[min, max]` (either bound optional). */
export function clampBs(bs: BsDate, min?: BsDate | null, max?: BsDate | null): BsDate {
  if (min && compareBs(bs, min) < 0) return { ...min };
  if (max && compareBs(bs, max) > 0) return { ...max };
  return { ...bs };
}

// ---------------------------------------------------------------------------

function isInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function assertBsYearMonth(year: number, month: number): void {
  if (!isInt(year) || year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new BikramRangeError(
      `BS year ${year} is outside the supported range ${MIN_BS_YEAR}-${MAX_BS_YEAR}.`,
      'OUT_OF_RANGE',
    );
  }
  if (!isInt(month) || month < 1 || month > 12) {
    throw new BikramRangeError(`BS month must be 1-12, got ${month}.`, 'INVALID_DATE');
  }
}
