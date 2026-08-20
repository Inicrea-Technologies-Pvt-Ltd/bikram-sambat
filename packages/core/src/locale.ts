/** Month names, weekday names and digits, in English and Nepali. */
import type { BikramLocale } from './types';

/** Baishakh … Chaitra, indexed 0-11. */
export const BS_MONTHS_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
] as const;

export const BS_MONTHS_SHORT_EN = [
  'Bai', 'Jes', 'Asa', 'Shr', 'Bha', 'Asw',
  'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha',
] as const;

export const BS_MONTHS_NE = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत',
] as const;

/** Sunday-first, matching `Date.prototype.getDay()`. */
export const WEEKDAYS_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

export const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAYS_MIN_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export const WEEKDAYS_NE = [
  'आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार',
] as const;

export const WEEKDAYS_SHORT_NE = ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि'] as const;
export const WEEKDAYS_MIN_NE = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'] as const;

const NE_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const;

/** Rewrite ASCII digits as Nepali (Devanagari) numerals. */
export function toNepaliDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]!);
}

/** Rewrite Nepali (Devanagari) numerals as ASCII digits. */
export function toLatinDigits(value: string): string {
  return value.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));
}

/** Everything one locale needs, resolved in one place. */
export interface LocaleStrings {
  months: readonly string[];
  monthsShort: readonly string[];
  weekdays: readonly string[];
  weekdaysShort: readonly string[];
  weekdaysMin: readonly string[];
  digits: (value: string | number) => string;
}

const EN: LocaleStrings = {
  months: BS_MONTHS_EN,
  monthsShort: BS_MONTHS_SHORT_EN,
  weekdays: WEEKDAYS_EN,
  weekdaysShort: WEEKDAYS_SHORT_EN,
  weekdaysMin: WEEKDAYS_MIN_EN,
  digits: String,
};

const NE: LocaleStrings = {
  months: BS_MONTHS_NE,
  // Nepali month names are already short; there is no separate abbreviation.
  monthsShort: BS_MONTHS_NE,
  weekdays: WEEKDAYS_NE,
  weekdaysShort: WEEKDAYS_SHORT_NE,
  weekdaysMin: WEEKDAYS_MIN_NE,
  digits: toNepaliDigits,
};

/** Resolve a locale tag to its strings. Unknown tags fall back to English. */
export function getLocale(locale: BikramLocale = 'en'): LocaleStrings {
  return locale === 'ne' ? NE : EN;
}

/** Localised BS month name. `month` is 1-based. */
export function bsMonthName(month: number, locale: BikramLocale = 'en'): string {
  const strings = getLocale(locale);
  return strings.months[month - 1] ?? '';
}
