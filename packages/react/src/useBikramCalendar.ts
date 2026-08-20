import { useCallback, useMemo, useState } from 'react';
import {
  addBsMonths,
  clampBs,
  compareBs,
  bsMonthName,
  endOfBsMonth,
  getBsMonthCalendar,
  getWeekdayLabels,
  MAX_BS_DATE,
  MAX_BS_YEAR,
  MIN_BS_DATE,
  MIN_BS_YEAR,
  todayBs,
  type BikramLocale,
  type BsCalendarDay,
  type BsDate,
  type BsMonthCalendar,
  type WeekendPolicy,
} from '@inicrea/bikram-sambat-core';

export interface UseBikramCalendarOptions {
  /** Selected date, used to decide which month opens first. */
  selected?: BsDate | null;
  /** Month shown on first render when uncontrolled. Defaults to the selection, else today. */
  defaultMonth?: BsDate;
  /** Controlled visible month, pass with `onMonthChange` to drive navigation yourself. */
  month?: BsDate;
  onMonthChange?: (month: BsDate) => void;
  locale?: BikramLocale;
  weekStartsOn?: number;
  weekend?: WeekendPolicy;
  /** Earliest selectable date. */
  min?: BsDate | null;
  /** Latest selectable date. */
  max?: BsDate | null;
  /** Extra per-day disabling on top of `min`/`max`. */
  isDateDisabled?: (day: BsCalendarDay) => boolean;
}

export interface UseBikramCalendarResult {
  /** The month currently on screen. */
  month: BsDate;
  calendar: BsMonthCalendar;
  weekdayLabels: string[];
  /** Years offered by a year dropdown, within the supported range. */
  years: number[];
  /** Months offered by a month dropdown. */
  months: Array<{ value: number; label: string }>;
  goToMonth: (month: BsDate) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextYear: () => void;
  goToPreviousYear: () => void;
  goToToday: () => void;
  canGoNextMonth: boolean;
  canGoPreviousMonth: boolean;
  isDayDisabled: (day: BsCalendarDay) => boolean;
  isDaySelected: (day: BsCalendarDay) => boolean;
}

/**
 * Calendar state without any markup, month navigation, the day grid, and
 * which days are selectable. Use it when you want your own UI; the bundled
 * components are built on exactly this.
 */
export function useBikramCalendar(options: UseBikramCalendarOptions = {}): UseBikramCalendarResult {
  const {
    selected,
    defaultMonth,
    month: controlledMonth,
    onMonthChange,
    locale = 'en',
    weekStartsOn = 0,
    weekend,
    min,
    max,
    isDateDisabled,
  } = options;

  const fallbackMonth = useMemo<BsDate>(() => {
    const base = defaultMonth ?? selected ?? safeToday();
    return clampToRange({ ...base, day: 1 }, min, max);
  }, [defaultMonth, selected, min, max]);

  const [uncontrolledMonth, setUncontrolledMonth] = useState<BsDate>(fallbackMonth);
  const month = controlledMonth ?? uncontrolledMonth;

  const goToMonth = useCallback(
    (next: BsDate) => {
      const normalised = clampToRange({ ...next, day: 1 }, min, max);
      if (controlledMonth === undefined) setUncontrolledMonth(normalised);
      onMonthChange?.(normalised);
    },
    [controlledMonth, onMonthChange, min, max],
  );

  const shift = useCallback(
    (months: number) => {
      try {
        goToMonth(addBsMonths(month, months));
      } catch {
        // Already at the edge of the supported range, nothing to do.
      }
    },
    [goToMonth, month],
  );

  const calendar = useMemo(
    () => getBsMonthCalendar(month.year, month.month, { locale, weekStartsOn, weekend }),
    [month.year, month.month, locale, weekStartsOn, weekend],
  );

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn, 'short'),
    [locale, weekStartsOn],
  );

  const years = useMemo(() => {
    const first = Math.max(MIN_BS_YEAR, min?.year ?? MIN_BS_YEAR);
    const last = Math.min(MAX_BS_YEAR, max?.year ?? MAX_BS_YEAR);
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
  }, [min?.year, max?.year]);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: bsMonthName(i + 1, locale) })),
    [locale],
  );

  const isDayDisabled = useCallback(
    (day: BsCalendarDay): boolean => {
      const date: BsDate = { year: day.year, month: day.month, day: day.day };
      if (min && compareBs(date, min) < 0) return true;
      if (max && compareBs(date, max) > 0) return true;
      return isDateDisabled?.(day) ?? false;
    },
    [min, max, isDateDisabled],
  );

  const isDaySelected = useCallback(
    (day: BsCalendarDay): boolean =>
      !!selected &&
      selected.year === day.year &&
      selected.month === day.month &&
      selected.day === day.day,
    [selected],
  );

  // A month is reachable when it still holds at least one selectable day, and
  // when it exists at all. BS 2100 Chaitra has no month after it.
  const previousMonth = tryAddMonths(month, -1);
  const nextMonth = tryAddMonths(month, 1);
  const canGoPreviousMonth =
    previousMonth !== null && compareBs(endOfBsMonth(previousMonth), lowerBound(min)) >= 0;
  const canGoNextMonth =
    nextMonth !== null && compareBs(nextMonth, upperBound(max)) <= 0;

  return {
    month,
    calendar,
    weekdayLabels,
    years,
    months,
    goToMonth,
    goToNextMonth: useCallback(() => shift(1), [shift]),
    goToPreviousMonth: useCallback(() => shift(-1), [shift]),
    goToNextYear: useCallback(() => shift(12), [shift]),
    goToPreviousYear: useCallback(() => shift(-12), [shift]),
    goToToday: useCallback(() => goToMonth(safeToday()), [goToMonth]),
    canGoNextMonth,
    canGoPreviousMonth,
    isDayDisabled,
    isDaySelected,
  };
}

/** Month start `months` away, or null when that falls outside the range. */
function tryAddMonths(month: BsDate, months: number): BsDate | null {
  try {
    return addBsMonths({ ...month, day: 1 }, months);
  } catch {
    return null;
  }
}

/** Today, or the nearest supported date if the clock sits outside the range. */
function safeToday(): BsDate {
  try {
    return todayBs();
  } catch {
    return { ...MIN_BS_DATE };
  }
}

function lowerBound(min?: BsDate | null): BsDate {
  return min ?? MIN_BS_DATE;
}

function upperBound(max?: BsDate | null): BsDate {
  return max ?? MAX_BS_DATE;
}

function clampToRange(date: BsDate, min?: BsDate | null, max?: BsDate | null): BsDate {
  const clamped = clampBs(date, lowerBound(min), upperBound(max));
  // Navigation works in whole months, so keep the day pinned to the 1st.
  return { year: clamped.year, month: clamped.month, day: 1 };
}
