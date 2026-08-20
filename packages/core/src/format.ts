/**
 * Formatting and parsing of BS dates, using dayjs-style tokens so the pattern
 * strings look familiar.
 */
import { bsWeekday, daysInBsMonth, isValidBsDate } from './convert';
import { BikramRangeError } from './errors';
import { getLocale, toLatinDigits } from './locale';
import type { BikramLocale, BsDate } from './types';

export interface FormatOptions {
  locale?: BikramLocale;
}

/**
 * Supported tokens:
 *
 * | Token  | Output                        |
 * |--------|-------------------------------|
 * | `YYYY` | 2083                          |
 * | `YY`   | 83                            |
 * | `MMMM` | Shrawan / साउन                |
 * | `MMM`  | Shr / साउन                    |
 * | `MM`   | 04                            |
 * | `M`    | 4                             |
 * | `DD`   | 05                            |
 * | `D`    | 5                             |
 * | `dddd` | Sunday / आइतबार               |
 * | `ddd`  | Sun / आइत                     |
 * | `dd`   | S / आ                         |
 * | `d`    | 0-6                           |
 *
 * Wrap literal text in square brackets to keep it out of the substitution,
 * e.g. `'[BS] YYYY'`.
 */
const TOKEN = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d/g;

const DEFAULT_PATTERN = 'YYYY MMMM DD';

/**
 * Format a BS date.
 *
 * @example
 * formatBs({ year: 2083, month: 4, day: 5 })                        // "2083 Shrawan 05"
 * formatBs(bs, 'DD/MM/YYYY')                                        // "05/04/2083"
 * formatBs(bs, 'YYYY MMMM DD, dddd', { locale: 'ne' })              // "२०८३ साउन ०५, आइतबार"
 */
export function formatBs(bs: BsDate, pattern: string = DEFAULT_PATTERN, options: FormatOptions = {}): string {
  if (!isValidBsDate(bs)) {
    throw new BikramRangeError(
      `Cannot format an invalid BS date: ${JSON.stringify(bs)}.`,
      'INVALID_DATE',
    );
  }
  const strings = getLocale(options.locale);
  const weekday = bsWeekday(bs);

  const out = pattern.replace(TOKEN, (token, literal?: string) => {
    if (literal !== undefined) return literal;
    switch (token) {
      case 'YYYY': return pad(bs.year, 4);
      case 'YY': return pad(bs.year % 100, 2);
      case 'MMMM': return strings.months[bs.month - 1]!;
      case 'MMM': return strings.monthsShort[bs.month - 1]!;
      case 'MM': return pad(bs.month, 2);
      case 'M': return String(bs.month);
      case 'DD': return pad(bs.day, 2);
      case 'D': return String(bs.day);
      case 'dddd': return strings.weekdays[weekday]!;
      case 'ddd': return strings.weekdaysShort[weekday]!;
      case 'dd': return strings.weekdaysMin[weekday]!;
      case 'd': return String(weekday);
      default: return token;
    }
  });

  // Localise digits last, so month/weekday names are never touched.
  return options.locale === 'ne' ? strings.digits(out) : out;
}

/**
 * Parse a numeric BS date string. Accepts ASCII or Nepali digits and any of
 * `-`, `/`, `.` or space as separators. Field order is given by `pattern`,
 * which defaults to year-month-day.
 *
 * Returns `null` rather than throwing, so it can drive a text input directly.
 *
 * @example
 * parseBs('2083-04-05')                    // { year: 2083, month: 4, day: 5 }
 * parseBs('०५/०४/२०८३', 'DD/MM/YYYY')      // { year: 2083, month: 4, day: 5 }
 * parseBs('nonsense')                      // null
 */
export function parseBs(input: string, pattern: string = 'YYYY-MM-DD'): BsDate | null {
  if (typeof input !== 'string') return null;
  const numbers = toLatinDigits(input).match(/\d+/g);
  if (!numbers || numbers.length < 3) return null;

  const order = (pattern.match(/YYYY|YY|MM?|DD?/g) ?? [])
    .map((token) => token.charAt(0))
    .filter((field, index, all) => all.indexOf(field) === index);

  const fields = order.length === 3 ? order : ['Y', 'M', 'D'];
  const parts: Record<string, number> = {};
  fields.forEach((field, index) => {
    parts[field] = Number(numbers[index]);
  });

  let year = parts['Y']!;
  // Two-digit years are read as 20xx — the BS range starts at 1975, so a bare
  // "83" can only sensibly mean 2083.
  if (year < 100) year += 2000;

  const bs: BsDate = { year, month: parts['M']!, day: parts['D']! };
  return isValidBsDate(bs) ? bs : null;
}

/** Human-readable range hint, handy for validation messages. */
export function describeBsMonth(year: number, month: number, locale: BikramLocale = 'en'): string {
  const strings = getLocale(locale);
  return `${strings.months[month - 1]} ${year} (${daysInBsMonth(year, month)} days)`;
}

function pad(value: number, width: number): string {
  return String(value).padStart(width, '0');
}
