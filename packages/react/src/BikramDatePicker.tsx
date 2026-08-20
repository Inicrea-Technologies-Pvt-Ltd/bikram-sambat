import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  adToBs,
  bsToAdIso,
  formatBs,
  isValidBsDate,
  parseBs,
  type BikramLocale,
  type BsCalendarDay,
  type BsDate,
  type WeekendPolicy,
} from '@inicrea/bikram-sambat-core';
import { BikramCalendar, type BikramCalendarClassNames } from './BikramCalendar';
import { cx } from './utils';

/** Which calendar the `value` string is expressed in. */
export type BikramValueFormat = 'AD' | 'BS';

export interface BikramDatePickerProps {
  /**
   * Selected date as "YYYY-MM-DD" — AD by default, BS when `valueFormat` is
   * `'BS'`. Empty string or null means nothing is selected.
   */
  value?: string | null;
  /**
   * Fired on selection. `value` matches `valueFormat`; `detail` carries both
   * calendars so you never have to convert at the call site.
   */
  onChange?: (value: string, detail: { ad: string; bs: BsDate | null }) => void;
  /** Which calendar `value` and `onChange` speak. Defaults to AD, the safer thing to store. */
  valueFormat?: BikramValueFormat;
  /** Display pattern for the trigger. Defaults to "YYYY MMMM DD". */
  format?: string;
  locale?: BikramLocale;
  placeholder?: string;
  disabled?: boolean;
  /** Name for a hidden input, so the picker works inside an uncontrolled form. */
  name?: string;
  id?: string;
  required?: boolean;
  /** Earliest selectable date, as "YYYY-MM-DD" in `valueFormat`'s calendar. */
  min?: string | null;
  /** Latest selectable date, same format as `min`. */
  max?: string | null;
  weekStartsOn?: number;
  weekend?: WeekendPolicy;
  isDateDisabled?: (day: BsCalendarDay) => boolean;
  dayContent?: (day: BsCalendarDay) => React.ReactNode;
  dayTitle?: (day: BsCalendarDay) => string | undefined;
  /** Let the user type a date as well as pick one. Defaults to true. */
  editable?: boolean;
  /** Close the popover after a selection. Defaults to true. */
  closeOnSelect?: boolean;
  className?: string;
  classNames?: BikramCalendarClassNames & { input?: string; popover?: string };
  'aria-label'?: string;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A Bikram Sambat date picker: a text input you can type into, plus a popover
 * calendar. Values move in and out as plain "YYYY-MM-DD" strings.
 *
 * @example
 * const [date, setDate] = useState('2026-08-20');
 * <BikramDatePicker value={date} onChange={setDate} />
 *
 * @example Store BS instead of AD
 * <BikramDatePicker valueFormat="BS" value={bs} onChange={setBs} />
 */
export function BikramDatePicker({
  value,
  onChange,
  valueFormat = 'AD',
  format = 'YYYY MMMM DD',
  locale = 'en',
  placeholder = 'Select a date',
  disabled = false,
  name,
  id,
  required,
  min,
  max,
  weekStartsOn = 0,
  weekend,
  isDateDisabled,
  dayContent,
  dayTitle,
  editable = true,
  closeOnSelect = true,
  className,
  classNames = {},
  'aria-label': ariaLabel,
  onOpenChange,
}: BikramDatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? `bikram-input-${generatedId}`;
  const popoverId = `bikram-popover-${generatedId}`;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => toBsDate(value, valueFormat), [value, valueFormat]);
  const minDate = useMemo(() => toBsDate(min, valueFormat), [min, valueFormat]);
  const maxDate = useMemo(() => toBsDate(max, valueFormat), [max, valueFormat]);

  const displayValue = useMemo(() => {
    if (draft !== null) return draft;
    return selected ? formatBs(selected, format, { locale }) : '';
  }, [draft, selected, format, locale]);

  const changeOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  // Close on an outside click or Escape, returning focus to the input.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        changeOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        changeOpen(false);
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, changeOpen]);

  const emit = useCallback(
    (date: BsDate) => {
      const ad = bsToAdIso(date);
      const out = valueFormat === 'BS' ? formatBs(date, 'YYYY-MM-DD') : ad;
      onChange?.(out, { ad, bs: date });
    },
    [onChange, valueFormat],
  );

  const handleSelect = useCallback(
    (date: BsDate) => {
      setDraft(null);
      emit(date);
      if (closeOnSelect) {
        changeOpen(false);
        inputRef.current?.focus();
      }
    },
    [emit, closeOnSelect, changeOpen],
  );

  // Typed input is held as a draft until it parses, so partial text is not
  // fought by reformatting on every keystroke.
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setDraft(text);
      if (text.trim() === '') {
        onChange?.('', { ad: '', bs: null });
        return;
      }
      const parsed = parseBs(text, 'YYYY-MM-DD');
      if (parsed) emit(parsed);
    },
    [emit, onChange],
  );

  const handleBlur = useCallback(() => setDraft(null), []);

  const hiddenValue = useMemo(() => {
    if (!selected) return '';
    return valueFormat === 'BS' ? formatBs(selected, 'YYYY-MM-DD') : bsToAdIso(selected);
  }, [selected, valueFormat]);

  return (
    <div ref={rootRef} className={cx('bikram-picker', className)}>
      {name && <input type="hidden" name={name} value={hiddenValue} required={required} readOnly />}

      <div className="bikram-picker__control">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={cx('bikram-picker__input', classNames.input)}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!editable}
          autoComplete="off"
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onChange={handleInput}
          onBlur={handleBlur}
          onClick={() => !editable && !disabled && changeOpen(!open)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && !open) {
              event.preventDefault();
              changeOpen(true);
            }
          }}
        />
        <button
          type="button"
          className="bikram-picker__trigger"
          disabled={disabled}
          aria-label={open ? 'Close calendar' : 'Open calendar'}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => changeOpen(!open)}
        >
          <CalendarIcon />
        </button>
      </div>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-label="Choose a date"
          className={cx('bikram-picker__popover', classNames.popover)}
        >
          <BikramCalendar
            autoFocus
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? undefined}
            locale={locale}
            weekStartsOn={weekStartsOn}
            weekend={weekend}
            min={minDate}
            max={maxDate}
            isDateDisabled={isDateDisabled}
            dayContent={dayContent}
            dayTitle={dayTitle}
            classNames={classNames}
          />
        </div>
      )}
    </div>
  );
}

/** Read a "YYYY-MM-DD" string in either calendar into a BS date. */
function toBsDate(value: string | null | undefined, format: BikramValueFormat): BsDate | null {
  if (!value) return null;
  try {
    if (format === 'BS') {
      const parsed = parseBs(value, 'YYYY-MM-DD');
      return parsed && isValidBsDate(parsed) ? parsed : null;
    }
    return adToBs(value);
  } catch {
    return null;
  }
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
