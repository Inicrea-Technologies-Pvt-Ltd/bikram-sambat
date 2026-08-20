/** Month grids: the shape a date picker actually renders. */
import {
  addBsDays,
  bsToAdIso,
  bsWeekday,
  daysInBsMonth,
  isSameBsDay,
  todayBs,
} from './convert';
import { TWO_DAY_WEEKEND_FROM_AD } from './data';
import { getLocale } from './locale';
import type {
  BikramLocale,
  BsCalendarDay,
  BsDate,
  BsMonthCalendar,
  WeekendPolicy,
} from './types';

export interface MonthCalendarOptions {
  /** Language for the month name. Defaults to English. */
  locale?: BikramLocale;
  /** Which weekday a row starts on. 0 = Sunday (the Nepali convention, and the default). */
  weekStartsOn?: number;
  /** Which days count as weekend. Defaults to Nepal's actual policy over time. */
  weekend?: WeekendPolicy;
  /** Override "today", mostly so tests are not clock-dependent. */
  today?: BsDate | null;
}

/**
 * Resolve a weekend policy to a predicate.
 *
 * `'nepal'` is history-aware: Saturday has always been the weekend, and Sunday
 * joined it on {@link TWO_DAY_WEEKEND_FROM_AD}. A fixed list is wrong for any
 * grid that spans that date, which is why it is the default.
 */
function weekendPredicate(policy: WeekendPolicy = 'nepal'): (weekday: number, ad: string) => boolean {
  if (policy === 'nepal') {
    return (weekday, ad) => weekday === 6 || (weekday === 0 && ad >= TWO_DAY_WEEKEND_FROM_AD);
  }
  if (policy === 'saturday') return (weekday) => weekday === 6;
  if (policy === 'saturday-sunday') return (weekday) => weekday === 0 || weekday === 6;
  const days = new Set(policy);
  return (weekday) => days.has(weekday);
}

/**
 * Build a renderable grid for one BS month.
 *
 * `days` holds just this month; `weeks` pads to whole rows with the
 * neighbouring months' days (each flagged `outside`), which is what most
 * calendar UIs want.
 *
 * @example
 * const cal = getBsMonthCalendar(2083, 4);
 * cal.weeks.map(week => week.map(day => day.day));
 */
export function getBsMonthCalendar(
  year: number,
  month: number,
  options: MonthCalendarOptions = {},
): BsMonthCalendar {
  const { locale = 'en', weekStartsOn = 0, weekend, today: todayOverride } = options;
  const isWeekend = weekendPredicate(weekend);
  const strings = getLocale(locale);
  const daysInMonth = daysInBsMonth(year, month);
  const startWeekday = bsWeekday({ year, month, day: 1 });

  // `today` is resolved once; a null override switches the flag off entirely.
  const today = todayOverride === null ? null : (todayOverride ?? safeToday());

  const build = (bs: BsDate, outside: boolean): BsCalendarDay => {
    const ad = bsToAdIso(bs);
    const weekday = bsWeekday(bs);
    return {
      day: bs.day,
      month: bs.month,
      year: bs.year,
      ad,
      weekday,
      outside,
      weekend: isWeekend(weekday, ad),
      today: isSameBsDay(bs, today),
    };
  };

  const days: BsCalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(build({ year, month, day }, false));
  }

  // Pad the leading gap, then trail to a whole number of rows.
  const lead = (startWeekday - weekStartsOn + 7) % 7;
  const cells: BsCalendarDay[] = [];
  const first: BsDate = { year, month, day: 1 };
  for (let i = lead; i > 0; i--) {
    cells.push(padCell(first, -i, build));
  }
  cells.push(...days);
  const last: BsDate = { year, month, day: daysInMonth };
  const trail = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= trail; i++) {
    cells.push(padCell(last, i, build));
  }

  const weeks: BsCalendarDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return {
    year,
    month,
    monthName: strings.months[month - 1] ?? '',
    daysInMonth,
    startWeekday,
    days,
    weeks,
  };
}

/**
 * A padding cell `offset` days from `anchor`. At the very edges of the
 * supported range there is no neighbouring day to show, so the anchor is
 * reused and flagged `outside`, better a duplicate than a thrown error in
 * the middle of a render.
 */
function padCell(
  anchor: BsDate,
  offset: number,
  build: (bs: BsDate, outside: boolean) => BsCalendarDay,
): BsCalendarDay {
  try {
    return build(addBsDays(anchor, offset), true);
  } catch {
    return { ...build(anchor, true), outside: true };
  }
}

/** Today, or null when the clock sits outside the supported range. */
function safeToday(): BsDate | null {
  try {
    return todayBs();
  } catch {
    return null;
  }
}

/** Localised weekday header labels, rotated for `weekStartsOn`. */
export function getWeekdayLabels(
  locale: BikramLocale = 'en',
  weekStartsOn = 0,
  width: 'full' | 'short' | 'min' = 'short',
): string[] {
  const strings = getLocale(locale);
  const source =
    width === 'full' ? strings.weekdays : width === 'min' ? strings.weekdaysMin : strings.weekdaysShort;
  return Array.from({ length: 7 }, (_, i) => source[(i + weekStartsOn) % 7]!);
}
