import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  MAX_AD_ISO,
  EPOCH_AD_ISO,
  adToBs,
  bsToAdIso,
  formatBs,
  parseBs,
  todayBs,
  type BikramLocale,
  type BsDate,
} from '@inicrea/bikram-sambat-core';
import { cx } from './utils';

export interface BikramDateConverterProps {
  /** Date the tool starts on. Accepts an AD "YYYY-MM-DD" string or a BS date. */
  defaultValue?: string | BsDate;
  locale?: BikramLocale;
  /** Fired whenever the date changes, in either direction. */
  onChange?: (detail: { ad: string; bs: BsDate }) => void;
  /** Show the extra detail row (weekday, days in month, fiscal year). Defaults to true. */
  showDetails?: boolean;
  className?: string;
  labels?: Partial<{ bs: string; ad: string; today: string; swap: string }>;
}

/**
 * A two-way BS ⇄ AD conversion tool. Type into either side and the other
 * follows. This is the "date converter" widget as a drop-in component rather
 * than something each app rebuilds.
 *
 * @example
 * <BikramDateConverter defaultValue="2026-08-20" />
 */
export function BikramDateConverter({
  defaultValue,
  locale = 'en',
  onChange,
  showDetails = true,
  className,
  labels = {},
}: BikramDateConverterProps) {
  const id = useId();
  const initial = useMemo(() => resolveInitial(defaultValue), [defaultValue]);

  const [date, setDate] = useState<BsDate>(initial);
  const [bsText, setBsText] = useState(() => formatBs(initial, 'YYYY-MM-DD'));
  const [adText, setAdText] = useState(() => bsToAdIso(initial));
  const [error, setError] = useState<string | null>(null);

  const commit = useCallback(
    (next: BsDate) => {
      setDate(next);
      setBsText(formatBs(next, 'YYYY-MM-DD'));
      setAdText(bsToAdIso(next));
      setError(null);
    },
    [],
  );

  const handleBs = useCallback((text: string) => {
    setBsText(text);
    const parsed = parseBs(text, 'YYYY-MM-DD');
    if (!parsed) {
      setError(text.trim() ? 'Not a valid BS date.' : null);
      return;
    }
    setDate(parsed);
    setAdText(bsToAdIso(parsed));
    setError(null);
  }, []);

  const handleAd = useCallback((text: string) => {
    setAdText(text);
    try {
      const parsed = adToBs(text);
      setDate(parsed);
      setBsText(formatBs(parsed, 'YYYY-MM-DD'));
      setError(null);
    } catch {
      setError(text.trim() ? `Enter an AD date between ${EPOCH_AD_ISO} and ${MAX_AD_ISO}.` : null);
    }
  }, []);

  // Report the settled value, not every keystroke of a half-typed date.
  useEffect(() => {
    if (!error) onChange?.({ ad: bsToAdIso(date), bs: date });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date.year, date.month, date.day]);

  const details = useMemo(() => {
    if (!showDetails || error) return null;
    return {
      weekdayBs: formatBs(date, 'dddd', { locale }),
      longBs: formatBs(date, 'YYYY MMMM DD, dddd', { locale }),
      ad: bsToAdIso(date),
    };
  }, [date, locale, showDetails, error]);

  return (
    <div className={cx('bikram-converter', className)}>
      <div className="bikram-converter__fields">
        <label className="bikram-converter__field" htmlFor={`${id}-bs`}>
          <span className="bikram-converter__label">{labels.bs ?? 'Bikram Sambat (BS)'}</span>
          <input
            id={`${id}-bs`}
            className="bikram-converter__input"
            value={bsText}
            inputMode="numeric"
            placeholder="2083-04-05"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => handleBs(event.target.value)}
          />
        </label>

        <div className="bikram-converter__arrow" aria-hidden="true">⇄</div>

        <label className="bikram-converter__field" htmlFor={`${id}-ad`}>
          <span className="bikram-converter__label">{labels.ad ?? 'Gregorian (AD)'}</span>
          <input
            id={`${id}-ad`}
            className="bikram-converter__input"
            value={adText}
            inputMode="numeric"
            placeholder="2026-07-21"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => handleAd(event.target.value)}
          />
        </label>
      </div>

      <div className="bikram-converter__actions">
        <button type="button" className="bikram-converter__button" onClick={() => commit(safeToday())}>
          {labels.today ?? 'Today'}
        </button>
      </div>

      <p className="bikram-converter__status" role="status" aria-live="polite">
        {error ? (
          <span className="bikram-converter__error">{error}</span>
        ) : details ? (
          <>
            <strong>{details.longBs}</strong>
            <span className="bikram-converter__sep"> · </span>
            <span>AD {details.ad}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}

function resolveInitial(value?: string | BsDate): BsDate {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return adToBs(value);
    } catch {
      const parsed = parseBs(value, 'YYYY-MM-DD');
      if (parsed) return parsed;
    }
  }
  return safeToday();
}

function safeToday(): BsDate {
  try {
    return todayBs();
  } catch {
    return adToBs(EPOCH_AD_ISO);
  }
}
