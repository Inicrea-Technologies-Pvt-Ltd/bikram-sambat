/* tslint:disable */
/* eslint-disable */

/**
 * Bikram Sambat date
 */
export class BsDate {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    day: number;
    month: BsMonth;
    year: number;
}

/**
 * Bikram Sambat month enumeration
 */
export enum BsMonth {
    Baisakh = 1,
    Jestha = 2,
    Ashadh = 3,
    Shrawan = 4,
    Bhadra = 5,
    Ashwin = 6,
    Kartik = 7,
    Mangsir = 8,
    Poush = 9,
    Magh = 10,
    Falgun = 11,
    Chaitra = 12,
}

/**
 * Calendar version identifier
 */
export class CalendarVersion {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    is_official: boolean;
    version: string;
}

/**
 * Combined astronomical information for a day
 */
export class DailyAstroInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    is_overridden: boolean;
    karana: Karana;
    moon_sign: ZodiacSign;
    nakshatra: Nakshatra;
    sun_sign: ZodiacSign;
    tithi: Tithi;
    yoga: Yoga;
}

/**
 * Event instance - a single occurrence of an event
 */
export class EventInstance {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * BS date of occurrence
     */
    bs_date: BsDate;
    /**
     * Calendar version used to generate this instance
     */
    calendar_version: CalendarVersion;
    /**
     * Unique identifier for this instance
     */
    id: string;
    /**
     * Whether this instance departs from a naive reading of the rule. Currently
     * set only for calendar-intrinsic day-clamping (a non-existent target day
     * forced onto the last valid day of the month).
     */
    is_exception: boolean;
    /**
     * The intended (un-clamped) BS date when `is_exception` is set because the
     * calendar clamped the rule's target day; `None` otherwise.
     */
    get original_date(): BsDate | undefined;
    /**
     * The intended (un-clamped) BS date when `is_exception` is set because the
     * calendar clamped the rule's target day; `None` otherwise.
     */
    set original_date(value: BsDate | null | undefined);
    /**
     * Parent event ID if this is a recurring instance
     */
    get parent_event_id(): string | undefined;
    /**
     * Parent event ID if this is a recurring instance
     */
    set parent_event_id(value: string | null | undefined);
    /**
     * Optional tithi if this is a tithi-based event
     */
    get tithi(): Tithi | undefined;
    /**
     * Optional tithi if this is a tithi-based event
     */
    set tithi(value: Tithi | null | undefined);
    /**
     * Event title/description
     */
    title: string;
}

/**
 * Karana - half of a tithi; 60 half-tithis per lunar month mapped onto 11
 * karanas (7 movable repeating eight times, 4 fixed). One of the five angas.
 */
export enum Karana {
    Bava = 0,
    Balava = 1,
    Kaulava = 2,
    Taitila = 3,
    Gara = 4,
    Vanija = 5,
    Vishti = 6,
    Shakuni = 7,
    Chatushpada = 8,
    Naga = 9,
    Kimstughna = 10,
}

/**
 * Supported languages for calendar output
 */
export enum Language {
    English = 0,
    Nepali = 1,
}

export class Location {
    free(): void;
    [Symbol.dispose](): void;
    constructor(latitude: number, longitude: number, name: string, timezone_offset_mins: number);
    follow_nepal_social_calendar: boolean;
    latitude: number;
    longitude: number;
    name: string;
    timezone_offset_mins: number;
}

export class MonthCalendar {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    days_in_month: number;
    month: number;
    start_day_of_week: number;
    year: number;
    readonly days: Array<any>;
}

/**
 * Nakshatra (Lunar Mansion) - 27 divisions of the ecliptic
 */
export enum Nakshatra {
    Ashwini = 0,
    Bharani = 1,
    Krittika = 2,
    Rohini = 3,
    Mrigashira = 4,
    Ardra = 5,
    Punarvasu = 6,
    Pushya = 7,
    Ashlesha = 8,
    Magha = 9,
    PurvaPhalguni = 10,
    UttaraPhalguni = 11,
    Hasta = 12,
    Chitra = 13,
    Swati = 14,
    Vishakha = 15,
    Anuradha = 16,
    Jyeshtha = 17,
    Mula = 18,
    PurvaAshadha = 19,
    UttaraAshadha = 20,
    Shravana = 21,
    Dhanishtha = 22,
    Shatabhisha = 23,
    PurvaBhadrapada = 24,
    UttaraBhadrapada = 25,
    Revati = 26,
}

/**
 * Paksha (lunar fortnight) - waxing or waning moon phase
 */
export enum Paksha {
    /**
     * Shukla Paksha - waxing moon (bright fortnight)
     */
    Shukla = 0,
    /**
     * Krishna Paksha - waning moon (dark fortnight)
     */
    Krishna = 1,
}

/**
 * Tithi - lunar day in Hindu calendar
 */
export enum Tithi {
    ShuklaPratipada = 0,
    ShuklaDwitiya = 1,
    ShuklaTritiya = 2,
    ShuklaChaturthi = 3,
    ShuklaPanchami = 4,
    ShuklaShashti = 5,
    ShuklaSaptami = 6,
    ShuklaAshtami = 7,
    ShuklaNavami = 8,
    ShuklaDashami = 9,
    ShuklaEkadashi = 10,
    ShuklaDwadashi = 11,
    ShuklaTrayodashi = 12,
    ShuklaChaturdashi = 13,
    Purnima = 14,
    KrishnaPratipada = 15,
    KrishnaDwitiya = 16,
    KrishnaTritiya = 17,
    KrishnaChaturthi = 18,
    KrishnaPanchami = 19,
    KrishnaShashti = 20,
    KrishnaSaptami = 21,
    KrishnaAshtami = 22,
    KrishnaNavami = 23,
    KrishnaDashami = 24,
    KrishnaEkadashi = 25,
    KrishnaDwadashi = 26,
    KrishnaTrayodashi = 27,
    KrishnaChaturdashi = 28,
    Amavasya = 29,
}

export class WasmCalendarDay {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    bs_day: number;
    bs_month: number;
    bs_year: number;
    day_of_week: number;
    gregorian_date: string;
    holiday_name: string;
    is_holiday: boolean;
    is_overridden: boolean;
    is_weekend: boolean;
    karana: Karana;
    moon_sign: ZodiacSign;
    nakshatra: Nakshatra;
    sun_sign: ZodiacSign;
    tithi: Tithi;
    yoga: Yoga;
}

export class WasmDailyAstroInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    is_overridden: boolean;
    karana: Karana;
    moon_sign: ZodiacSign;
    nakshatra: Nakshatra;
    sun_sign: ZodiacSign;
    sunrise: string;
    sunset: string;
    tithi: Tithi;
    yoga: Yoga;
}

/**
 * Yoga - one of 27 divisions of the combined sun + moon sidereal longitude.
 *
 * Yoga index = floor(((sun_long + moon_long) mod 360°) / 13°20′) + 1.
 * One of the five angas (limbs) of the panchanga.
 */
export enum Yoga {
    Vishkambha = 0,
    Priti = 1,
    Ayushman = 2,
    Saubhagya = 3,
    Shobhana = 4,
    Atiganda = 5,
    Sukarman = 6,
    Dhriti = 7,
    Shula = 8,
    Ganda = 9,
    Vriddhi = 10,
    Dhruva = 11,
    Vyaghata = 12,
    Harshana = 13,
    Vajra = 14,
    Siddhi = 15,
    Vyatipata = 16,
    Variyan = 17,
    Parigha = 18,
    Shiva = 19,
    Siddha = 20,
    Sadhya = 21,
    Shubha = 22,
    Shukla = 23,
    Brahma = 24,
    Indra = 25,
    Vaidhriti = 26,
}

/**
 * Zodiac Sign (Rashi) in Hindu Astrology
 */
export enum ZodiacSign {
    Mesh = 0,
    Vrishabh = 1,
    Mithun = 2,
    Karka = 3,
    Simha = 4,
    Kanya = 5,
    Tula = 6,
    Vrishchik = 7,
    Dhanu = 8,
    Makar = 9,
    Kumbha = 10,
    Meen = 11,
}

export function bs_to_gregorian(year: number, month: number, day: number): string;

export function get_daily_astro_info_with_location(year: number, month: number, day: number, location: Location): WasmDailyAstroInfo;

/**
 * Expand event instances across a multi-month BS range in a SINGLE pass.
 *
 * Unlike [`get_month_events`], which is bounded to one BS month, this walks the
 * whole `(from_year, from_month) ..= (to_year, to_month)` window in one call.
 * This matters for cross-month recurrence semantics — notably `X-TAKE=FIRST`,
 * which keeps only the first qualifying tithi occurrence *per BS year*. Calling
 * month-by-month would reset that per-year state every month and defeat it, so
 * callers that need take-first (festivals like Bijaya Dashami spanning
 * Ashwin/Kartik) MUST use this range API rather than looping `get_month_events`.
 */
export function get_events_in_range(from_year: number, from_month: number, to_year: number, to_month: number, events_json: string, location: Location): Array<any>;

export function get_karana_name(karana: Karana, lang: Language): string;

export function get_month_calendar_with_location(year: number, month: number, location: Location): MonthCalendar;

export function get_month_events(year: number, month: number, events_json: string, location: Location): Array<any>;

export function get_nakshatra_name(nakshatra: Nakshatra, lang: Language): string;

export function get_sunrise_with_location(year: number, month: number, day: number, location: Location): string;

export function get_sunset_with_location(year: number, month: number, day: number, location: Location): string;

export function get_tithi(year: number, month: number, day: number): Tithi;

export function get_tithi_name(tithi: Tithi, lang: Language): string;

export function get_yoga_name(yoga: Yoga, lang: Language): string;

export function get_zodiac_name(zodiac: ZodiacSign, lang: Language): string;

export function gregorian_to_bs(year: number, month: number, day: number): BsDate;

/**
 * The last BS year for which government/festival holiday data exists. Beyond
 * this year `WasmCalendarDay.is_holiday` is always false (no data, not "no
 * holidays") — surface it to users as "holidays not yet published". Weekends
 * (`is_weekend`) remain correct for all years regardless of this boundary.
 */
export function holidays_verified_through_bs(): number;

/**
 * The last BS year for which tithi output is officially verified against the
 * Nepali Panchanga almanac. Instances beyond this year are astronomically
 * computed (provisional) and may change once the official calendar is released.
 * Consumers use this to decide which pushed instances need later recomputation.
 */
export function tithi_verified_through_bs(): number;
