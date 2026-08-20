import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  addBsDays,
  bsToAdIso,
  compareBs,
  endOfBsMonth,
  formatBs,
  isSameBsDay,
  startOfBsMonth,
  todayBs,
  type BikramLocale,
  type BsCalendarDay,
  type BsDate,
  type WeekendPolicy,
} from '@inicrea/bikram-sambat-core';
import { useBikramCalendar } from './useBikramCalendar';
import { cx } from './utils';

export interface BikramCalendarClassNames {
  root?: string;
  header?: string;
  nav?: string;
  caption?: string;
  grid?: string;
  weekdays?: string;
  weekday?: string;
  week?: string;
  day?: string;
  footer?: string;
}

export interface BikramCalendarProps {
  /** Selected date. */
  selected?: BsDate | null;
  /** Fired when a day is chosen. `detail.ad` is the matching AD date as "YYYY-MM-DD". */
  onSelect?: (date: BsDate, detail: { ad: string }) => void;
  /** Controlled visible month. */
  month?: BsDate;
  /** Month shown first when uncontrolled. */
  defaultMonth?: BsDate;
  onMonthChange?: (month: BsDate) => void;
  locale?: BikramLocale;
  /** 0 = Sunday (default, and the Nepali convention). */
  weekStartsOn?: number;
  weekend?: WeekendPolicy;
  min?: BsDate | null;
  max?: BsDate | null;
  isDateDisabled?: (day: BsCalendarDay) => boolean;
  /** Render extra content inside a day cell: a holiday dot, for instance. */
  dayContent?: (day: BsCalendarDay) => ReactNode;
  /** Tooltip for a day cell. A natural place to surface holiday names. */
  dayTitle?: (day: BsCalendarDay) => string | undefined;
  /** Show the neighbouring months' padding days. Defaults to true. */
  showOutsideDays?: boolean;
  /** Show the footer with the AD equivalent and a "Today" shortcut. Defaults to true. */
  showFooter?: boolean;
  /** Focus the calendar when it mounts, used by the picker popover. */
  autoFocus?: boolean;
  className?: string;
  classNames?: BikramCalendarClassNames;
  /** Accessible label for the grid. */
  'aria-label'?: string;
}

/**
 * A BS month grid. Standalone and fully keyboard-navigable, arrow keys move a
 * day at a time, PageUp/PageDown a month, Home/End to the month's edges.
 */
export function BikramCalendar({
  selected,
  onSelect,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  locale = 'en',
  weekStartsOn = 0,
  weekend,
  min,
  max,
  isDateDisabled,
  dayContent,
  dayTitle,
  showOutsideDays = true,
  showFooter = true,
  autoFocus = false,
  className,
  classNames = {},
  'aria-label': ariaLabel,
}: BikramCalendarProps) {
  const calendarState = useBikramCalendar({
    selected,
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    locale,
    weekStartsOn,
    weekend,
    min,
    max,
    isDateDisabled,
  });

  const {
    month,
    calendar,
    weekdayLabels,
    goToMonth,
    goToNextMonth,
    goToPreviousMonth,
    canGoNextMonth,
    canGoPreviousMonth,
    isDayDisabled,
    isDaySelected,
  } = calendarState;

  // The day that owns the tab stop. Keeping exactly one keeps the grid a single
  // stop in the page's tab order, which is what a grid widget should be.
  const [focusedDate, setFocusedDate] = useState<BsDate>(
    () => selected ?? clampIntoMonth(month, min, max),
  );
  const gridRef = useRef<HTMLDivElement>(null);
  // AD date of a day waiting to receive DOM focus. Held across renders because
  // a month change means the target button does not exist yet on this pass.
  const pendingFocusRef = useRef<string | null>(null);

  // Follow the selection, and keep the tab stop inside the visible month.
  useEffect(() => {
    if (selected) setFocusedDate(selected);
  }, [selected?.year, selected?.month, selected?.day]);

  useEffect(() => {
    setFocusedDate((current) =>
      current.year === month.year && current.month === month.month
        ? current
        : clampIntoMonth(month, min, max),
    );
  }, [month.year, month.month]);

  useEffect(() => {
    if (autoFocus) pendingFocusRef.current = bsToAdIso(focusedDate);
    // Runs once: the popover asks for focus when it opens, not on every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Moves DOM focus after the commit that renders the target day.
  useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    const button = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`);
    if (button) {
      pendingFocusRef.current = null;
      button.focus();
    }
  });

  /** Move the tab stop, pulling the visible month along if it crossed a boundary. */
  const moveFocus = useCallback(
    (next: BsDate) => {
      const bounded = boundedDate(next, min, max);
      if (!bounded) return;
      setFocusedDate(bounded);
      if (bounded.year !== month.year || bounded.month !== month.month) {
        goToMonth(bounded);
      }
      pendingFocusRef.current = bsToAdIso(bounded);
    },
    [goToMonth, month.year, month.month, min, max],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const shift = (days: number) => {
        event.preventDefault();
        moveFocus(safeAddDays(focusedDate, days));
      };
      switch (event.key) {
        case 'ArrowLeft': return shift(-1);
        case 'ArrowRight': return shift(1);
        case 'ArrowUp': return shift(-7);
        case 'ArrowDown': return shift(7);
        case 'Home':
          event.preventDefault();
          return moveFocus(startOfBsMonth(focusedDate));
        case 'End':
          event.preventDefault();
          return moveFocus(endOfBsMonth(focusedDate));
        case 'PageUp':
          event.preventDefault();
          return moveFocus(safeAddDays(focusedDate, -daysInPreviousMonth(focusedDate)));
        case 'PageDown':
          event.preventDefault();
          return moveFocus(safeAddDays(focusedDate, daysInCurrentMonth(focusedDate)));
        default:
          return undefined;
      }
    },
    [focusedDate, moveFocus],
  );

  const handleSelect = useCallback(
    (day: BsCalendarDay) => {
      const date: BsDate = { year: day.year, month: day.month, day: day.day };
      setFocusedDate(date);
      onSelect?.(date, { ad: day.ad });
    },
    [onSelect],
  );

  const caption = useMemo(
    () => formatBs({ ...month, day: 1 }, 'MMMM YYYY', { locale }),
    [month.year, month.month, locale],
  );

  const today = useMemo(() => {
    try {
      return todayBs();
    } catch {
      return null;
    }
  }, []);

  const selectedAd = selected ? bsToAdIso(selected) : null;

  return (
    <div className={cx('bikram', className, classNames.root)}>
      <div className={cx('bikram__header', classNames.header)}>
        <button
          type="button"
          className={cx('bikram__nav', classNames.nav)}
          onClick={goToPreviousMonth}
          disabled={!canGoPreviousMonth}
          aria-label="Previous month"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className={cx('bikram__caption', classNames.caption)} aria-live="polite">
          {caption}
        </div>
        <button
          type="button"
          className={cx('bikram__nav', classNames.nav)}
          onClick={goToNextMonth}
          disabled={!canGoNextMonth}
          aria-label="Next month"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={ariaLabel ?? `${caption}. Bikram Sambat calendar`}
        className={cx('bikram__grid', classNames.grid)}
        onKeyDown={handleKeyDown}
      >
        <div role="row" className={cx('bikram__weekdays', classNames.weekdays)}>
          {weekdayLabels.map((label, index) => (
            <div
              key={`${label}-${index}`}
              role="columnheader"
              className={cx('bikram__weekday', classNames.weekday)}
            >
              {label}
            </div>
          ))}
        </div>

        {calendar.weeks.map((week, weekIndex) => (
          <div role="row" key={weekIndex} className={cx('bikram__week', classNames.week)}>
            {week.map((day) => {
              const date: BsDate = { year: day.year, month: day.month, day: day.day };
              const disabled = isDayDisabled(day);
              const isSelected = isDaySelected(day);
              const isFocused = isSameBsDay(date, focusedDate);
              const hidden = day.outside && !showOutsideDays;

              return (
                <div role="gridcell" key={day.ad} aria-selected={isSelected}>
                  <button
                    type="button"
                    data-date={day.ad}
                    data-focused={isFocused}
                    className={cx(
                      'bikram__day',
                      classNames.day,
                      day.outside && 'bikram__day--outside',
                      day.weekend && 'bikram__day--weekend',
                      day.today && 'bikram__day--today',
                      isSelected && 'bikram__day--selected',
                    )}
                    style={hidden ? { visibility: 'hidden' } : undefined}
                    tabIndex={isFocused ? 0 : -1}
                    disabled={disabled || hidden}
                    aria-current={day.today ? 'date' : undefined}
                    aria-label={`${formatBs(date, 'D MMMM YYYY', { locale })} (${day.ad})`}
                    title={dayTitle?.(day)}
                    onClick={() => handleSelect(day)}
                    onFocus={() =>
                      // Programmatic focus lands here too; bail out when the
                      // day is already current so we do not re-render on a
                      // fresh object identity every time.
                      setFocusedDate((current) => (isSameBsDay(current, date) ? current : date))
                    }
                  >
                    {formatBs(date, 'D', { locale })}
                    {dayContent?.(day)}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showFooter && (
        <div className={cx('bikram__footer', classNames.footer)}>
          <span className="bikram__ad">{selectedAd ? `AD ${selectedAd}` : ''}</span>
          {today && (
            <button
              type="button"
              className="bikram__today"
              onClick={() => {
                goToMonth(today);
                setFocusedDate(today);
                onSelect?.(today, { ad: bsToAdIso(today) });
              }}
            >
              Today
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function safeAddDays(date: BsDate, days: number): BsDate {
  try {
    return addBsDays(date, days);
  } catch {
    return date;
  }
}

function daysInCurrentMonth(date: BsDate): number {
  return endOfBsMonth(date).day;
}

function daysInPreviousMonth(date: BsDate): number {
  try {
    return endOfBsMonth(addBsDays(startOfBsMonth(date), -1)).day;
  } catch {
    return 30;
  }
}

/** A sensible landing day when the month changes: keep it inside min/max. */
function clampIntoMonth(month: BsDate, min?: BsDate | null, max?: BsDate | null): BsDate {
  const first = startOfBsMonth(month);
  if (min && compareBs(first, min) < 0 && min.year === month.year && min.month === month.month) {
    return min;
  }
  const last = endOfBsMonth(month);
  if (max && compareBs(last, max) > 0 && max.year === month.year && max.month === month.month) {
    return max;
  }
  return first;
}

/** Clamp into the selectable range, or null when there is nowhere valid to go. */
function boundedDate(date: BsDate, min?: BsDate | null, max?: BsDate | null): BsDate | null {
  if (min && compareBs(date, min) < 0) return null;
  if (max && compareBs(date, max) > 0) return null;
  return date;
}
