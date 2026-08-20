/** A Bikram Sambat calendar date. Months are 1-based: Baishakh = 1 … Chaitra = 12. */
export interface BsDate {
  year: number;
  month: number;
  day: number;
}

/** Language used for month names, weekday names and digits. */
export type BikramLocale = 'en' | 'ne';

/**
 * How a JavaScript `Date` is mapped to a calendar date.
 *
 * A `Date` is an instant, a calendar date is not — the two only line up once
 * you pick a timezone. `utc: false` (the default) reads the date the way the
 * user's clock shows it; `utc: true` reads its UTC components, which is what
 * you want if you store dates as UTC-midnight instants.
 */
export interface DateOptions {
  utc?: boolean;
}

/** Which weekdays count as the weekend. 0 = Sunday … 6 = Saturday. */
export type WeekendPolicy = 'nepal' | 'saturday' | 'saturday-sunday' | readonly number[];

/** One cell in a month grid. */
export interface BsCalendarDay {
  /** BS day of month. */
  day: number;
  /** BS month this day belongs to — differs from the grid's month for padding days. */
  month: number;
  /** BS year this day belongs to. */
  year: number;
  /** Matching AD date as "YYYY-MM-DD". */
  ad: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** True when the day falls outside the grid's own month (leading/trailing padding). */
  outside: boolean;
  /** True when the day is a weekend under the active policy. */
  weekend: boolean;
  /** True when the day is today. */
  today: boolean;
}

/** A full month grid, ready to render. */
export interface BsMonthCalendar {
  year: number;
  month: number;
  /** Localised month name. */
  monthName: string;
  /** Number of days in this BS month (29-32). */
  daysInMonth: number;
  /** Weekday of day 1, 0 = Sunday. */
  startWeekday: number;
  /** Days of this month only, in order. */
  days: BsCalendarDay[];
  /** Days padded to whole weeks, 7 per row — what a grid actually renders. */
  weeks: BsCalendarDay[][];
}

/** The Nepali fiscal year, which runs Shrawan 1 to the end of Ashadh. */
export interface NepaliFiscalYear {
  /** BS year the fiscal year starts in — a stable key. */
  bsYear: number;
  /** AD date of Shrawan 1, as "YYYY-MM-DD". */
  startAd: string;
  /** AD date of the final day of Ashadh, as "YYYY-MM-DD". */
  endAd: string;
  /** e.g. "2083/84". */
  label: string;
}
