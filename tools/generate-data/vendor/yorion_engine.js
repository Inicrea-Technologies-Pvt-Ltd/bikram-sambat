/* @ts-self-types="./yorion_engine.d.ts" */

/**
 * Bikram Sambat date
 */
class BsDate {
    static __wrap(ptr) {
        const obj = Object.create(BsDate.prototype);
        obj.__wbg_ptr = ptr;
        BsDateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BsDateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bsdate_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get day() {
        const ret = wasm.__wbg_get_bsdate_day(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {BsMonth}
     */
    get month() {
        const ret = wasm.__wbg_get_bsdate_month(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get year() {
        const ret = wasm.__wbg_get_bsdate_year(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set day(arg0) {
        wasm.__wbg_set_bsdate_day(this.__wbg_ptr, arg0);
    }
    /**
     * @param {BsMonth} arg0
     */
    set month(arg0) {
        wasm.__wbg_set_bsdate_month(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set year(arg0) {
        wasm.__wbg_set_bsdate_year(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) BsDate.prototype[Symbol.dispose] = BsDate.prototype.free;
exports.BsDate = BsDate;

/**
 * Bikram Sambat month enumeration
 * @enum {1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}
 */
const BsMonth = Object.freeze({
    Baisakh: 1, "1": "Baisakh",
    Jestha: 2, "2": "Jestha",
    Ashadh: 3, "3": "Ashadh",
    Shrawan: 4, "4": "Shrawan",
    Bhadra: 5, "5": "Bhadra",
    Ashwin: 6, "6": "Ashwin",
    Kartik: 7, "7": "Kartik",
    Mangsir: 8, "8": "Mangsir",
    Poush: 9, "9": "Poush",
    Magh: 10, "10": "Magh",
    Falgun: 11, "11": "Falgun",
    Chaitra: 12, "12": "Chaitra",
});
exports.BsMonth = BsMonth;

/**
 * Calendar version identifier
 */
class CalendarVersion {
    static __wrap(ptr) {
        const obj = Object.create(CalendarVersion.prototype);
        obj.__wbg_ptr = ptr;
        CalendarVersionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CalendarVersionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_calendarversion_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get is_official() {
        const ret = wasm.__wbg_get_calendarversion_is_official(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_calendarversion_version(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {boolean} arg0
     */
    set is_official(arg0) {
        wasm.__wbg_set_calendarversion_is_official(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_calendarversion_version(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) CalendarVersion.prototype[Symbol.dispose] = CalendarVersion.prototype.free;
exports.CalendarVersion = CalendarVersion;

/**
 * Combined astronomical information for a day
 */
class DailyAstroInfo {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DailyAstroInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dailyastroinfo_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get is_overridden() {
        const ret = wasm.__wbg_get_dailyastroinfo_is_overridden(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Karana}
     */
    get karana() {
        const ret = wasm.__wbg_get_dailyastroinfo_karana(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get moon_sign() {
        const ret = wasm.__wbg_get_dailyastroinfo_moon_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Nakshatra}
     */
    get nakshatra() {
        const ret = wasm.__wbg_get_dailyastroinfo_nakshatra(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get sun_sign() {
        const ret = wasm.__wbg_get_dailyastroinfo_sun_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Tithi}
     */
    get tithi() {
        const ret = wasm.__wbg_get_dailyastroinfo_tithi(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Yoga}
     */
    get yoga() {
        const ret = wasm.__wbg_get_dailyastroinfo_yoga(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} arg0
     */
    set is_overridden(arg0) {
        wasm.__wbg_set_dailyastroinfo_is_overridden(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Karana} arg0
     */
    set karana(arg0) {
        wasm.__wbg_set_dailyastroinfo_karana(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set moon_sign(arg0) {
        wasm.__wbg_set_dailyastroinfo_moon_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Nakshatra} arg0
     */
    set nakshatra(arg0) {
        wasm.__wbg_set_dailyastroinfo_nakshatra(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set sun_sign(arg0) {
        wasm.__wbg_set_dailyastroinfo_sun_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Tithi} arg0
     */
    set tithi(arg0) {
        wasm.__wbg_set_dailyastroinfo_tithi(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Yoga} arg0
     */
    set yoga(arg0) {
        wasm.__wbg_set_dailyastroinfo_yoga(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) DailyAstroInfo.prototype[Symbol.dispose] = DailyAstroInfo.prototype.free;
exports.DailyAstroInfo = DailyAstroInfo;

/**
 * Event instance - a single occurrence of an event
 */
class EventInstance {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventInstanceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventinstance_free(ptr, 0);
    }
    /**
     * BS date of occurrence
     * @returns {BsDate}
     */
    get bs_date() {
        const ret = wasm.__wbg_get_eventinstance_bs_date(this.__wbg_ptr);
        return BsDate.__wrap(ret);
    }
    /**
     * Calendar version used to generate this instance
     * @returns {CalendarVersion}
     */
    get calendar_version() {
        const ret = wasm.__wbg_get_eventinstance_calendar_version(this.__wbg_ptr);
        return CalendarVersion.__wrap(ret);
    }
    /**
     * Unique identifier for this instance
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eventinstance_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Whether this instance departs from a naive reading of the rule. Currently
     * set only for calendar-intrinsic day-clamping (a non-existent target day
     * forced onto the last valid day of the month).
     * @returns {boolean}
     */
    get is_exception() {
        const ret = wasm.__wbg_get_eventinstance_is_exception(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * The intended (un-clamped) BS date when `is_exception` is set because the
     * calendar clamped the rule's target day; `None` otherwise.
     * @returns {BsDate | undefined}
     */
    get original_date() {
        const ret = wasm.__wbg_get_eventinstance_original_date(this.__wbg_ptr);
        return ret === 0 ? undefined : BsDate.__wrap(ret);
    }
    /**
     * Parent event ID if this is a recurring instance
     * @returns {string | undefined}
     */
    get parent_event_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eventinstance_parent_event_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Optional tithi if this is a tithi-based event
     * @returns {Tithi | undefined}
     */
    get tithi() {
        const ret = wasm.__wbg_get_eventinstance_tithi(this.__wbg_ptr);
        return ret === 30 ? undefined : ret;
    }
    /**
     * Event title/description
     * @returns {string}
     */
    get title() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eventinstance_title(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * BS date of occurrence
     * @param {BsDate} arg0
     */
    set bs_date(arg0) {
        _assertClass(arg0, BsDate);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_eventinstance_bs_date(this.__wbg_ptr, ptr0);
    }
    /**
     * Calendar version used to generate this instance
     * @param {CalendarVersion} arg0
     */
    set calendar_version(arg0) {
        _assertClass(arg0, CalendarVersion);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_eventinstance_calendar_version(this.__wbg_ptr, ptr0);
    }
    /**
     * Unique identifier for this instance
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventinstance_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Whether this instance departs from a naive reading of the rule. Currently
     * set only for calendar-intrinsic day-clamping (a non-existent target day
     * forced onto the last valid day of the month).
     * @param {boolean} arg0
     */
    set is_exception(arg0) {
        wasm.__wbg_set_eventinstance_is_exception(this.__wbg_ptr, arg0);
    }
    /**
     * The intended (un-clamped) BS date when `is_exception` is set because the
     * calendar clamped the rule's target day; `None` otherwise.
     * @param {BsDate | null} [arg0]
     */
    set original_date(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, BsDate);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_eventinstance_original_date(this.__wbg_ptr, ptr0);
    }
    /**
     * Parent event ID if this is a recurring instance
     * @param {string | null} [arg0]
     */
    set parent_event_id(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventinstance_parent_event_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Optional tithi if this is a tithi-based event
     * @param {Tithi | null} [arg0]
     */
    set tithi(arg0) {
        wasm.__wbg_set_eventinstance_tithi(this.__wbg_ptr, isLikeNone(arg0) ? 30 : arg0);
    }
    /**
     * Event title/description
     * @param {string} arg0
     */
    set title(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eventinstance_title(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) EventInstance.prototype[Symbol.dispose] = EventInstance.prototype.free;
exports.EventInstance = EventInstance;

/**
 * Karana - half of a tithi; 60 half-tithis per lunar month mapped onto 11
 * karanas (7 movable repeating eight times, 4 fixed). One of the five angas.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}
 */
const Karana = Object.freeze({
    Bava: 0, "0": "Bava",
    Balava: 1, "1": "Balava",
    Kaulava: 2, "2": "Kaulava",
    Taitila: 3, "3": "Taitila",
    Gara: 4, "4": "Gara",
    Vanija: 5, "5": "Vanija",
    Vishti: 6, "6": "Vishti",
    Shakuni: 7, "7": "Shakuni",
    Chatushpada: 8, "8": "Chatushpada",
    Naga: 9, "9": "Naga",
    Kimstughna: 10, "10": "Kimstughna",
});
exports.Karana = Karana;

/**
 * Supported languages for calendar output
 * @enum {0 | 1}
 */
const Language = Object.freeze({
    English: 0, "0": "English",
    Nepali: 1, "1": "Nepali",
});
exports.Language = Language;

class Location {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LocationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_location_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get follow_nepal_social_calendar() {
        const ret = wasm.__wbg_get_location_follow_nepal_social_calendar(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get latitude() {
        const ret = wasm.__wbg_get_location_latitude(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get longitude() {
        const ret = wasm.__wbg_get_location_longitude(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_location_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get timezone_offset_mins() {
        const ret = wasm.__wbg_get_location_timezone_offset_mins(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} latitude
     * @param {number} longitude
     * @param {string} name
     * @param {number} timezone_offset_mins
     */
    constructor(latitude, longitude, name, timezone_offset_mins) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.location_new_wasm(latitude, longitude, ptr0, len0, timezone_offset_mins);
        this.__wbg_ptr = ret;
        LocationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} arg0
     */
    set follow_nepal_social_calendar(arg0) {
        wasm.__wbg_set_location_follow_nepal_social_calendar(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set latitude(arg0) {
        wasm.__wbg_set_location_latitude(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set longitude(arg0) {
        wasm.__wbg_set_location_longitude(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_location_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set timezone_offset_mins(arg0) {
        wasm.__wbg_set_location_timezone_offset_mins(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Location.prototype[Symbol.dispose] = Location.prototype.free;
exports.Location = Location;

class MonthCalendar {
    static __wrap(ptr) {
        const obj = Object.create(MonthCalendar.prototype);
        obj.__wbg_ptr = ptr;
        MonthCalendarFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MonthCalendarFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_monthcalendar_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get days_in_month() {
        const ret = wasm.__wbg_get_monthcalendar_days_in_month(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get month() {
        const ret = wasm.__wbg_get_monthcalendar_month(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get start_day_of_week() {
        const ret = wasm.__wbg_get_monthcalendar_start_day_of_week(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get year() {
        const ret = wasm.__wbg_get_monthcalendar_year(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get days() {
        const ret = wasm.monthcalendar_days(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @param {number} arg0
     */
    set days_in_month(arg0) {
        wasm.__wbg_set_monthcalendar_days_in_month(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set month(arg0) {
        wasm.__wbg_set_monthcalendar_month(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set start_day_of_week(arg0) {
        wasm.__wbg_set_monthcalendar_start_day_of_week(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set year(arg0) {
        wasm.__wbg_set_monthcalendar_year(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) MonthCalendar.prototype[Symbol.dispose] = MonthCalendar.prototype.free;
exports.MonthCalendar = MonthCalendar;

/**
 * Nakshatra (Lunar Mansion) - 27 divisions of the ecliptic
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26}
 */
const Nakshatra = Object.freeze({
    Ashwini: 0, "0": "Ashwini",
    Bharani: 1, "1": "Bharani",
    Krittika: 2, "2": "Krittika",
    Rohini: 3, "3": "Rohini",
    Mrigashira: 4, "4": "Mrigashira",
    Ardra: 5, "5": "Ardra",
    Punarvasu: 6, "6": "Punarvasu",
    Pushya: 7, "7": "Pushya",
    Ashlesha: 8, "8": "Ashlesha",
    Magha: 9, "9": "Magha",
    PurvaPhalguni: 10, "10": "PurvaPhalguni",
    UttaraPhalguni: 11, "11": "UttaraPhalguni",
    Hasta: 12, "12": "Hasta",
    Chitra: 13, "13": "Chitra",
    Swati: 14, "14": "Swati",
    Vishakha: 15, "15": "Vishakha",
    Anuradha: 16, "16": "Anuradha",
    Jyeshtha: 17, "17": "Jyeshtha",
    Mula: 18, "18": "Mula",
    PurvaAshadha: 19, "19": "PurvaAshadha",
    UttaraAshadha: 20, "20": "UttaraAshadha",
    Shravana: 21, "21": "Shravana",
    Dhanishtha: 22, "22": "Dhanishtha",
    Shatabhisha: 23, "23": "Shatabhisha",
    PurvaBhadrapada: 24, "24": "PurvaBhadrapada",
    UttaraBhadrapada: 25, "25": "UttaraBhadrapada",
    Revati: 26, "26": "Revati",
});
exports.Nakshatra = Nakshatra;

/**
 * Paksha (lunar fortnight) - waxing or waning moon phase
 * @enum {0 | 1}
 */
const Paksha = Object.freeze({
    /**
     * Shukla Paksha - waxing moon (bright fortnight)
     */
    Shukla: 0, "0": "Shukla",
    /**
     * Krishna Paksha - waning moon (dark fortnight)
     */
    Krishna: 1, "1": "Krishna",
});
exports.Paksha = Paksha;

/**
 * Tithi - lunar day in Hindu calendar
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29}
 */
const Tithi = Object.freeze({
    ShuklaPratipada: 0, "0": "ShuklaPratipada",
    ShuklaDwitiya: 1, "1": "ShuklaDwitiya",
    ShuklaTritiya: 2, "2": "ShuklaTritiya",
    ShuklaChaturthi: 3, "3": "ShuklaChaturthi",
    ShuklaPanchami: 4, "4": "ShuklaPanchami",
    ShuklaShashti: 5, "5": "ShuklaShashti",
    ShuklaSaptami: 6, "6": "ShuklaSaptami",
    ShuklaAshtami: 7, "7": "ShuklaAshtami",
    ShuklaNavami: 8, "8": "ShuklaNavami",
    ShuklaDashami: 9, "9": "ShuklaDashami",
    ShuklaEkadashi: 10, "10": "ShuklaEkadashi",
    ShuklaDwadashi: 11, "11": "ShuklaDwadashi",
    ShuklaTrayodashi: 12, "12": "ShuklaTrayodashi",
    ShuklaChaturdashi: 13, "13": "ShuklaChaturdashi",
    Purnima: 14, "14": "Purnima",
    KrishnaPratipada: 15, "15": "KrishnaPratipada",
    KrishnaDwitiya: 16, "16": "KrishnaDwitiya",
    KrishnaTritiya: 17, "17": "KrishnaTritiya",
    KrishnaChaturthi: 18, "18": "KrishnaChaturthi",
    KrishnaPanchami: 19, "19": "KrishnaPanchami",
    KrishnaShashti: 20, "20": "KrishnaShashti",
    KrishnaSaptami: 21, "21": "KrishnaSaptami",
    KrishnaAshtami: 22, "22": "KrishnaAshtami",
    KrishnaNavami: 23, "23": "KrishnaNavami",
    KrishnaDashami: 24, "24": "KrishnaDashami",
    KrishnaEkadashi: 25, "25": "KrishnaEkadashi",
    KrishnaDwadashi: 26, "26": "KrishnaDwadashi",
    KrishnaTrayodashi: 27, "27": "KrishnaTrayodashi",
    KrishnaChaturdashi: 28, "28": "KrishnaChaturdashi",
    Amavasya: 29, "29": "Amavasya",
});
exports.Tithi = Tithi;

class WasmCalendarDay {
    static __wrap(ptr) {
        const obj = Object.create(WasmCalendarDay.prototype);
        obj.__wbg_ptr = ptr;
        WasmCalendarDayFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmCalendarDayFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmcalendarday_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get bs_day() {
        const ret = wasm.__wbg_get_wasmcalendarday_bs_day(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get bs_month() {
        const ret = wasm.__wbg_get_wasmcalendarday_bs_month(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get bs_year() {
        const ret = wasm.__wbg_get_wasmcalendarday_bs_year(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get day_of_week() {
        const ret = wasm.__wbg_get_wasmcalendarday_day_of_week(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get gregorian_date() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_wasmcalendarday_gregorian_date(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get holiday_name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_wasmcalendarday_holiday_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get is_holiday() {
        const ret = wasm.__wbg_get_wasmcalendarday_is_holiday(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get is_overridden() {
        const ret = wasm.__wbg_get_wasmcalendarday_is_overridden(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get is_weekend() {
        const ret = wasm.__wbg_get_wasmcalendarday_is_weekend(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Karana}
     */
    get karana() {
        const ret = wasm.__wbg_get_wasmcalendarday_karana(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get moon_sign() {
        const ret = wasm.__wbg_get_wasmcalendarday_moon_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Nakshatra}
     */
    get nakshatra() {
        const ret = wasm.__wbg_get_wasmcalendarday_nakshatra(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get sun_sign() {
        const ret = wasm.__wbg_get_wasmcalendarday_sun_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Tithi}
     */
    get tithi() {
        const ret = wasm.__wbg_get_wasmcalendarday_tithi(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Yoga}
     */
    get yoga() {
        const ret = wasm.__wbg_get_wasmcalendarday_yoga(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set bs_day(arg0) {
        wasm.__wbg_set_wasmcalendarday_bs_day(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set bs_month(arg0) {
        wasm.__wbg_set_wasmcalendarday_bs_month(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set bs_year(arg0) {
        wasm.__wbg_set_wasmcalendarday_bs_year(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set day_of_week(arg0) {
        wasm.__wbg_set_wasmcalendarday_day_of_week(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set gregorian_date(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_wasmcalendarday_gregorian_date(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set holiday_name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_wasmcalendarday_holiday_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set is_holiday(arg0) {
        wasm.__wbg_set_wasmcalendarday_is_holiday(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set is_overridden(arg0) {
        wasm.__wbg_set_wasmcalendarday_is_overridden(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set is_weekend(arg0) {
        wasm.__wbg_set_wasmcalendarday_is_weekend(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Karana} arg0
     */
    set karana(arg0) {
        wasm.__wbg_set_wasmcalendarday_karana(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set moon_sign(arg0) {
        wasm.__wbg_set_wasmcalendarday_moon_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Nakshatra} arg0
     */
    set nakshatra(arg0) {
        wasm.__wbg_set_wasmcalendarday_nakshatra(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set sun_sign(arg0) {
        wasm.__wbg_set_wasmcalendarday_sun_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Tithi} arg0
     */
    set tithi(arg0) {
        wasm.__wbg_set_wasmcalendarday_tithi(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Yoga} arg0
     */
    set yoga(arg0) {
        wasm.__wbg_set_wasmcalendarday_yoga(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) WasmCalendarDay.prototype[Symbol.dispose] = WasmCalendarDay.prototype.free;
exports.WasmCalendarDay = WasmCalendarDay;

class WasmDailyAstroInfo {
    static __wrap(ptr) {
        const obj = Object.create(WasmDailyAstroInfo.prototype);
        obj.__wbg_ptr = ptr;
        WasmDailyAstroInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmDailyAstroInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmdailyastroinfo_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get is_overridden() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_is_overridden(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Karana}
     */
    get karana() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_karana(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get moon_sign() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_moon_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Nakshatra}
     */
    get nakshatra() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_nakshatra(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ZodiacSign}
     */
    get sun_sign() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_sun_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get sunrise() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_wasmdailyastroinfo_sunrise(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get sunset() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_wasmdailyastroinfo_sunset(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Tithi}
     */
    get tithi() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_tithi(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Yoga}
     */
    get yoga() {
        const ret = wasm.__wbg_get_wasmdailyastroinfo_yoga(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} arg0
     */
    set is_overridden(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_is_overridden(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Karana} arg0
     */
    set karana(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_karana(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set moon_sign(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_moon_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Nakshatra} arg0
     */
    set nakshatra(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_nakshatra(this.__wbg_ptr, arg0);
    }
    /**
     * @param {ZodiacSign} arg0
     */
    set sun_sign(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_sun_sign(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set sunrise(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_wasmdailyastroinfo_sunrise(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set sunset(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_wasmdailyastroinfo_sunset(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Tithi} arg0
     */
    set tithi(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_tithi(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Yoga} arg0
     */
    set yoga(arg0) {
        wasm.__wbg_set_wasmdailyastroinfo_yoga(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) WasmDailyAstroInfo.prototype[Symbol.dispose] = WasmDailyAstroInfo.prototype.free;
exports.WasmDailyAstroInfo = WasmDailyAstroInfo;

/**
 * Yoga - one of 27 divisions of the combined sun + moon sidereal longitude.
 *
 * Yoga index = floor(((sun_long + moon_long) mod 360°) / 13°20′) + 1.
 * One of the five angas (limbs) of the panchanga.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26}
 */
const Yoga = Object.freeze({
    Vishkambha: 0, "0": "Vishkambha",
    Priti: 1, "1": "Priti",
    Ayushman: 2, "2": "Ayushman",
    Saubhagya: 3, "3": "Saubhagya",
    Shobhana: 4, "4": "Shobhana",
    Atiganda: 5, "5": "Atiganda",
    Sukarman: 6, "6": "Sukarman",
    Dhriti: 7, "7": "Dhriti",
    Shula: 8, "8": "Shula",
    Ganda: 9, "9": "Ganda",
    Vriddhi: 10, "10": "Vriddhi",
    Dhruva: 11, "11": "Dhruva",
    Vyaghata: 12, "12": "Vyaghata",
    Harshana: 13, "13": "Harshana",
    Vajra: 14, "14": "Vajra",
    Siddhi: 15, "15": "Siddhi",
    Vyatipata: 16, "16": "Vyatipata",
    Variyan: 17, "17": "Variyan",
    Parigha: 18, "18": "Parigha",
    Shiva: 19, "19": "Shiva",
    Siddha: 20, "20": "Siddha",
    Sadhya: 21, "21": "Sadhya",
    Shubha: 22, "22": "Shubha",
    Shukla: 23, "23": "Shukla",
    Brahma: 24, "24": "Brahma",
    Indra: 25, "25": "Indra",
    Vaidhriti: 26, "26": "Vaidhriti",
});
exports.Yoga = Yoga;

/**
 * Zodiac Sign (Rashi) in Hindu Astrology
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11}
 */
const ZodiacSign = Object.freeze({
    Mesh: 0, "0": "Mesh",
    Vrishabh: 1, "1": "Vrishabh",
    Mithun: 2, "2": "Mithun",
    Karka: 3, "3": "Karka",
    Simha: 4, "4": "Simha",
    Kanya: 5, "5": "Kanya",
    Tula: 6, "6": "Tula",
    Vrishchik: 7, "7": "Vrishchik",
    Dhanu: 8, "8": "Dhanu",
    Makar: 9, "9": "Makar",
    Kumbha: 10, "10": "Kumbha",
    Meen: 11, "11": "Meen",
});
exports.ZodiacSign = ZodiacSign;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function bs_to_gregorian(year, month, day) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bs_to_gregorian(retptr, year, month, day);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
    }
}
exports.bs_to_gregorian = bs_to_gregorian;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {Location} location
 * @returns {WasmDailyAstroInfo}
 */
function get_daily_astro_info_with_location(year, month, day, location) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(location, Location);
        wasm.get_daily_astro_info_with_location(retptr, year, month, day, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return WasmDailyAstroInfo.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.get_daily_astro_info_with_location = get_daily_astro_info_with_location;

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
 * @param {number} from_year
 * @param {number} from_month
 * @param {number} to_year
 * @param {number} to_month
 * @param {string} events_json
 * @param {Location} location
 * @returns {Array<any>}
 */
function get_events_in_range(from_year, from_month, to_year, to_month, events_json, location) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(events_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(location, Location);
        wasm.get_events_in_range(retptr, from_year, from_month, to_year, to_month, ptr0, len0, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.get_events_in_range = get_events_in_range;

/**
 * @param {Karana} karana
 * @param {Language} lang
 * @returns {string}
 */
function get_karana_name(karana, lang) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_karana_name(retptr, karana, lang);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}
exports.get_karana_name = get_karana_name;

/**
 * @param {number} year
 * @param {number} month
 * @param {Location} location
 * @returns {MonthCalendar}
 */
function get_month_calendar_with_location(year, month, location) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(location, Location);
        wasm.get_month_calendar_with_location(retptr, year, month, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return MonthCalendar.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.get_month_calendar_with_location = get_month_calendar_with_location;

/**
 * @param {number} year
 * @param {number} month
 * @param {string} events_json
 * @param {Location} location
 * @returns {Array<any>}
 */
function get_month_events(year, month, events_json, location) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(events_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(location, Location);
        wasm.get_month_events(retptr, year, month, ptr0, len0, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.get_month_events = get_month_events;

/**
 * @param {Nakshatra} nakshatra
 * @param {Language} lang
 * @returns {string}
 */
function get_nakshatra_name(nakshatra, lang) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_nakshatra_name(retptr, nakshatra, lang);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}
exports.get_nakshatra_name = get_nakshatra_name;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {Location} location
 * @returns {string}
 */
function get_sunrise_with_location(year, month, day, location) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(location, Location);
        wasm.get_sunrise_with_location(retptr, year, month, day, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
    }
}
exports.get_sunrise_with_location = get_sunrise_with_location;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {Location} location
 * @returns {string}
 */
function get_sunset_with_location(year, month, day, location) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(location, Location);
        wasm.get_sunset_with_location(retptr, year, month, day, location.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
    }
}
exports.get_sunset_with_location = get_sunset_with_location;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {Tithi}
 */
function get_tithi(year, month, day) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_tithi(retptr, year, month, day);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.get_tithi = get_tithi;

/**
 * @param {Tithi} tithi
 * @param {Language} lang
 * @returns {string}
 */
function get_tithi_name(tithi, lang) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_tithi_name(retptr, tithi, lang);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}
exports.get_tithi_name = get_tithi_name;

/**
 * @param {Yoga} yoga
 * @param {Language} lang
 * @returns {string}
 */
function get_yoga_name(yoga, lang) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_yoga_name(retptr, yoga, lang);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}
exports.get_yoga_name = get_yoga_name;

/**
 * @param {ZodiacSign} zodiac
 * @param {Language} lang
 * @returns {string}
 */
function get_zodiac_name(zodiac, lang) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_zodiac_name(retptr, zodiac, lang);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}
exports.get_zodiac_name = get_zodiac_name;

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {BsDate}
 */
function gregorian_to_bs(year, month, day) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.gregorian_to_bs(retptr, year, month, day);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return BsDate.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
exports.gregorian_to_bs = gregorian_to_bs;

/**
 * The last BS year for which government/festival holiday data exists. Beyond
 * this year `WasmCalendarDay.is_holiday` is always false (no data, not "no
 * holidays") — surface it to users as "holidays not yet published". Weekends
 * (`is_weekend`) remain correct for all years regardless of this boundary.
 * @returns {number}
 */
function holidays_verified_through_bs() {
    const ret = wasm.holidays_verified_through_bs();
    return ret;
}
exports.holidays_verified_through_bs = holidays_verified_through_bs;

/**
 * The last BS year for which tithi output is officially verified against the
 * Nepali Panchanga almanac. Instances beyond this year are astronomically
 * computed (provisional) and may change once the official calendar is released.
 * Consumers use this to decide which pushed instances need later recomputation.
 * @returns {number}
 */
function tithi_verified_through_bs() {
    const ret = wasm.tithi_verified_through_bs();
    return ret;
}
exports.tithi_verified_through_bs = tithi_verified_through_bs;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_1506f2235d1bdba0: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_getTimezoneOffset_08e2892156231088: function(arg0) {
            const ret = getObject(arg0).getTimezoneOffset();
            return ret;
        },
        __wbg_new_6d75fd236f920a62: function(arg0) {
            const ret = new Date(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_new_ce1ab61c1c2b300d: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_new_d90091b82fdf5b91: function() {
            const ret = new Array();
            return addHeapObject(ret);
        },
        __wbg_new_with_year_month_day_hr_min_sec_c556132f181b08c9: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            const ret = new Date(arg0 >>> 0, arg1, arg2, arg3, arg4, arg5);
            return addHeapObject(ret);
        },
        __wbg_push_a6822215aa43e71c: function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        },
        __wbg_wasmcalendarday_new: function(arg0) {
            const ret = WasmCalendarDay.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./yorion_engine_bg.js": import0,
    };
}

const BsDateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_bsdate_free(ptr, 1));
const CalendarVersionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_calendarversion_free(ptr, 1));
const DailyAstroInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dailyastroinfo_free(ptr, 1));
const EventInstanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventinstance_free(ptr, 1));
const LocationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_location_free(ptr, 1));
const MonthCalendarFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_monthcalendar_free(ptr, 1));
const WasmCalendarDayFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmcalendarday_free(ptr, 1));
const WasmDailyAstroInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmdailyastroinfo_free(ptr, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

let heap = new Array(1024).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function decodeText(ptr, len) {
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

const wasmPath = `${__dirname}/yorion_engine_bg.wasm`;
const wasmBytes = require('fs').readFileSync(wasmPath);
const wasmModule = new WebAssembly.Module(wasmBytes);
let wasmInstance = new WebAssembly.Instance(wasmModule, __wbg_get_imports());
let wasm = wasmInstance.exports;
