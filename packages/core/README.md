# @inicrea/bikram-sambat-core

Bikram Sambat (Nepali calendar) date conversion for JavaScript. Pure TypeScript,
**zero runtime dependencies**, no WebAssembly — so it runs identically in Node,
browsers, edge runtimes and React Native (Hermes).

```bash
npm install @inicrea/bikram-sambat-core
```

## Why trust the dates

The calendar table is **generated** from the
[Yorion engine](https://github.com/Yorion-io/yorion_engine) (Rust, MIT OR
Apache-2.0) rather than transcribed by hand, then verified against it for
**all 46,022 days from BS 1975 to BS 2100** — both directions, plus weekdays and
month lengths. Nepali months run 29–32 days with no underlying formula, so a
single mistyped year silently corrupts every later date; generating removes that
whole class of bug.

The engine runs at build time only and is never shipped in this package.

## Supported range

| | From | To |
| --- | --- | --- |
| BS | 1975-01-01 | 2100-12-30 |
| AD | 1918-04-13 | 2044-04-12 |

Outside that range you get a `BikramRangeError` — never a wrong date.

## Conversion

```ts
import { adToBs, bsToAd, bsToAdIso, todayBs } from '@inicrea/bikram-sambat-core';

adToBs('2026-08-20');                          // { year: 2083, month: 5, day: 4 }
bsToAdIso({ year: 2083, month: 5, day: 4 });   // '2026-08-20'
bsToAdIso(2083, 5, 4);                         // same, positional
todayBs();                                     // today, in the user's timezone
```

### Dates and timezones

A `Date` is an instant; a calendar date is not. The two only line up once you
pick a timezone, which is why **"YYYY-MM-DD" strings are the canonical
interchange format here**.

```ts
adToBs(new Date());                     // uses the LOCAL calendar date (default)
adToBs(record.createdAt, { utc: true }); // uses UTC components
bsToAd(bs);                              // Date at local midnight
bsToAd(bs, { utc: true });               // Date at UTC midnight
```

Reading a `Date` in UTC when your users are in Kathmandu (UTC+05:45) is how apps
end up showing yesterday's date between midnight and 05:45. The default here is
local; be explicit when you mean UTC.

## Formatting

dayjs-style tokens, English or Nepali.

```ts
import { formatBs, parseBs, toNepaliDigits } from '@inicrea/bikram-sambat-core';

formatBs(bs);                                        // '2083 Shrawan 05'
formatBs(bs, 'DD/MM/YYYY');                          // '05/04/2083'
formatBs(bs, 'YYYY MMMM DD, dddd', { locale: 'ne' }); // '२०८३ साउन ०५, मङ्गलबार'
formatBs(bs, '[BS] YYYY');                           // 'BS 2083'  (brackets are literal)

parseBs('2083-04-05');                    // { year: 2083, month: 4, day: 5 }
parseBs('०५/०४/२०८३', 'DD/MM/YYYY');       // Nepali digits are fine
parseBs('nonsense');                      // null — never throws

toNepaliDigits('2083-04-05');             // '२०८३-०४-०५'
```

| Token | Output | | Token | Output |
| --- | --- | --- | --- | --- |
| `YYYY` `YY` | 2083, 83 | | `dddd` | Tuesday / मङ्गलबार |
| `MMMM` `MMM` | Shrawan, Shr | | `ddd` | Tue / मङ्गल |
| `MM` `M` | 04, 4 | | `dd` | T / मं |
| `DD` `D` | 05, 5 | | `d` | 0–6 |

## Month grids

Everything a date picker needs, including padding to whole weeks.

```ts
import { getBsMonthCalendar, getWeekdayLabels } from '@inicrea/bikram-sambat-core';

const calendar = getBsMonthCalendar(2083, 4, { locale: 'en', weekStartsOn: 0 });

calendar.monthName;    // 'Shrawan'
calendar.daysInMonth;  // 31
calendar.days;         // this month only
calendar.weeks;        // rows of 7, padded with neighbouring days

getWeekdayLabels('ne'); // ['आइत', 'सोम', 'मङ्गल', ...]
```

Each day carries `{ day, month, year, ad, weekday, outside, weekend, today }`.

### Weekends change over time

Nepal moved from a Saturday-only weekend to Saturday **and** Sunday on
**2026-04-12 (BS 2082-12-29)**. The default `'nepal'` policy models that, so a
grid spanning the changeover switches behaviour mid-month — which is correct,
and what a fixed `[0, 6]` list gets wrong.

```ts
getBsMonthCalendar(2083, 1, { weekend: 'nepal' });            // default
getBsMonthCalendar(2083, 1, { weekend: 'saturday' });          // force one-day
getBsMonthCalendar(2083, 1, { weekend: 'saturday-sunday' });   // force two-day
getBsMonthCalendar(2083, 1, { weekend: [5, 6] });              // your own policy
```

Holidays are deliberately not bundled — they change by government notice every
year. Supply your own and render them through the components' `dayTitle` /
`dayContent` props.

## Arithmetic

```ts
addBsDays(bs, 15);           // crosses months and years correctly
addBsMonths(bs, 1);          // clamps the day into the shorter month
addBsYears(bs, -1);
diffBsDays(from, to);        // whole days, negative when `to` is earlier
compareBs(a, b);             // sort comparator
isSameBsDay(a, b);
startOfBsMonth(bs); endOfBsMonth(bs);
clampBs(bs, min, max);
daysInBsMonth(2083, 4);      // 31
daysInBsYear(2083);
bsWeekday(bs);               // 0 = Sunday
isValidBsDate(bs);           // type guard, never throws
```

## Nepali fiscal year

Shrawan 1 to the last day of Ashadh.

```ts
import { getNepaliFiscalYear } from '@inicrea/bikram-sambat-core';

getNepaliFiscalYear({ year: 2083, month: 5, day: 4 });
// { bsYear: 2083, startAd: '2026-07-17', endAd: '2027-07-16', label: '2083/84' }
```

## Errors

```ts
import { BikramRangeError } from '@inicrea/bikram-sambat-core';

try {
  adToBs('1850-01-01');
} catch (error) {
  if (error instanceof BikramRangeError) {
    error.code; // 'OUT_OF_RANGE' | 'INVALID_DATE'
  }
}
```

## Licence

MIT © Inicrea Technologies. Calendar data derived from the Yorion engine
(MIT OR Apache-2.0) — see [NOTICE](./NOTICE).
