import { describe, expect, it } from 'vitest';
import {
  TWO_DAY_WEEKEND_FROM_AD,
  adToBs,
  daysInBsMonth,
  getBsMonthCalendar,
  getNepaliFiscalYear,
  getWeekdayLabels,
  isInFiscalYear,
} from '../src/index';

describe('getBsMonthCalendar', () => {
  it('describes the month', () => {
    const calendar = getBsMonthCalendar(2083, 4);
    expect(calendar.year).toBe(2083);
    expect(calendar.month).toBe(4);
    expect(calendar.monthName).toBe('Shrawan');
    expect(calendar.daysInMonth).toBe(daysInBsMonth(2083, 4));
    expect(calendar.days).toHaveLength(calendar.daysInMonth);
  });

  it('numbers its own days 1..n with no padding', () => {
    const calendar = getBsMonthCalendar(2083, 4);
    expect(calendar.days.map((d) => d.day)).toEqual(
      Array.from({ length: calendar.daysInMonth }, (_, i) => i + 1),
    );
    expect(calendar.days.every((d) => !d.outside)).toBe(true);
  });

  it('pads weeks to exactly 7 cells with contiguous AD dates', () => {
    const calendar = getBsMonthCalendar(2083, 4);
    expect(calendar.weeks.every((week) => week.length === 7)).toBe(true);
    const flat = calendar.weeks.flat();
    for (let i = 1; i < flat.length; i++) {
      const previous = Date.parse(flat[i - 1]!.ad + 'T00:00:00Z');
      const current = Date.parse(flat[i]!.ad + 'T00:00:00Z');
      expect(current - previous).toBe(86_400_000);
    }
  });

  it('starts the first row on the requested weekday', () => {
    for (const weekStartsOn of [0, 1, 6]) {
      const calendar = getBsMonthCalendar(2083, 4, { weekStartsOn });
      expect(calendar.weeks[0]![0]!.weekday).toBe(weekStartsOn);
    }
  });

  it('flags padding days as outside the month', () => {
    const calendar = getBsMonthCalendar(2083, 4);
    for (const cell of calendar.weeks.flat()) {
      expect(cell.outside).toBe(cell.month !== 4);
    }
  });

  it('localises the month name', () => {
    expect(getBsMonthCalendar(2083, 4, { locale: 'ne' }).monthName).toBe('साउन');
  });

  it('does not throw at either edge of the supported range', () => {
    expect(() => getBsMonthCalendar(1975, 1)).not.toThrow();
    expect(() => getBsMonthCalendar(2100, 12)).not.toThrow();
    expect(getBsMonthCalendar(1975, 1).weeks.every((w) => w.length === 7)).toBe(true);
    expect(getBsMonthCalendar(2100, 12).weeks.every((w) => w.length === 7)).toBe(true);
  });

  it('marks today only when it is today', () => {
    const today = { year: 2083, month: 4, day: 5 };
    const calendar = getBsMonthCalendar(2083, 4, { today });
    expect(calendar.days.filter((d) => d.today).map((d) => d.day)).toEqual([5]);
    expect(getBsMonthCalendar(2083, 4, { today: null }).days.some((d) => d.today)).toBe(false);
  });
});

describe('weekend policy', () => {
  const cutoverBs = adToBs(TWO_DAY_WEEKEND_FROM_AD);

  it('treats Saturday as weekend everywhere', () => {
    for (const [year, month] of [[2000, 1], [2050, 6], [2083, 4]] as const) {
      const calendar = getBsMonthCalendar(year, month);
      expect(calendar.days.filter((d) => d.weekday === 6).every((d) => d.weekend)).toBe(true);
    }
  });

  it('excludes Sunday before the two-day weekend began', () => {
    const calendar = getBsMonthCalendar(2080, 1);
    expect(calendar.days.filter((d) => d.weekday === 0).some((d) => d.weekend)).toBe(false);
  });

  it('includes Sunday after the two-day weekend began', () => {
    const calendar = getBsMonthCalendar(2083, 1);
    expect(calendar.days.filter((d) => d.weekday === 0).every((d) => d.weekend)).toBe(true);
  });

  it('switches mid-month on the exact cutover day', () => {
    const calendar = getBsMonthCalendar(cutoverBs.year, cutoverBs.month);
    const sundays = calendar.days.filter((d) => d.weekday === 0);
    expect(sundays.some((d) => d.weekend)).toBe(true);
    expect(sundays.some((d) => !d.weekend)).toBe(true);
    for (const sunday of sundays) {
      expect(sunday.weekend, sunday.ad).toBe(sunday.ad >= TWO_DAY_WEEKEND_FROM_AD);
    }
  });

  it('honours explicit policies', () => {
    const saturdayOnly = getBsMonthCalendar(2083, 1, { weekend: 'saturday' });
    expect(saturdayOnly.days.filter((d) => d.weekday === 0).some((d) => d.weekend)).toBe(false);

    const both = getBsMonthCalendar(2080, 1, { weekend: 'saturday-sunday' });
    expect(both.days.filter((d) => d.weekday === 0).every((d) => d.weekend)).toBe(true);

    const fridayOnly = getBsMonthCalendar(2083, 1, { weekend: [5] });
    expect(fridayOnly.days.filter((d) => d.weekend).every((d) => d.weekday === 5)).toBe(true);
  });
});

describe('getWeekdayLabels', () => {
  it('rotates for the starting weekday', () => {
    expect(getWeekdayLabels()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(getWeekdayLabels('en', 1)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(getWeekdayLabels('ne')[0]).toBe('आइत');
    expect(getWeekdayLabels('en', 0, 'full')[0]).toBe('Sunday');
    expect(getWeekdayLabels('en', 0, 'min')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });
});

describe('Nepali fiscal year', () => {
  it('starts in Shrawan', () => {
    const fiscal = getNepaliFiscalYear({ year: 2083, month: 5, day: 4 });
    expect(fiscal.bsYear).toBe(2083);
    expect(fiscal.label).toBe('2083/84');
    expect(adToBs(fiscal.startAd)).toEqual({ year: 2083, month: 4, day: 1 });
  });

  it('puts pre-Shrawan months in the previous fiscal year', () => {
    expect(getNepaliFiscalYear({ year: 2083, month: 3, day: 31 }).bsYear).toBe(2082);
    expect(getNepaliFiscalYear({ year: 2083, month: 4, day: 1 }).bsYear).toBe(2083);
  });

  it('ends on the last day of Ashadh', () => {
    const fiscal = getNepaliFiscalYear({ year: 2083, month: 5, day: 4 });
    const end = adToBs(fiscal.endAd);
    expect(end).toEqual({ year: 2084, month: 3, day: daysInBsMonth(2084, 3) });
  });

  it('runs start to end with no gap between consecutive years', () => {
    const current = getNepaliFiscalYear({ year: 2083, month: 5, day: 1 });
    const next = getNepaliFiscalYear({ year: 2084, month: 5, day: 1 });
    const gap = Date.parse(next.startAd + 'T00:00:00Z') - Date.parse(current.endAd + 'T00:00:00Z');
    expect(gap).toBe(86_400_000);
  });

  it('answers membership', () => {
    expect(isInFiscalYear({ year: 2083, month: 5, day: 1 }, 2083)).toBe(true);
    expect(isInFiscalYear({ year: 2083, month: 2, day: 1 }, 2083)).toBe(false);
  });
});
