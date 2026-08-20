# Bikram Sambat for JavaScript

Nepali calendar conversion and date pickers that work everywhere (Node, browsers,
edge runtimes and React Native) with the calendar data verified day-by-day against
a Rust calendar engine.

| Package | What it is | Size |
| --- | --- | --- |
| [`@inicrea/bikram-sambat-core`](packages/core) | Conversion, formatting, month grids, fiscal years. Pure TypeScript, zero dependencies. | 4.9 kB gzipped |
| [`@inicrea/bikram-sambat-react`](packages/react) | Date picker, calendar and converter for React. | 5.5 kB + core |
| [`@inicrea/bikram-sambat-react-native`](packages/react-native) | The same three components for React Native. | 4.6 kB + core |

Sizes are gzipped ESM builds; the UI packages exclude `core`, which they depend
on, and exclude `react`/`react-native` themselves.

**Live demo and docs: [inicrea-technologies-pvt-ltd.github.io/bikram-sambat](https://inicrea-technologies-pvt-ltd.github.io/bikram-sambat/)**

A working BS ⇄ AD converter and patro calendar, running the real package in
your browser.

```bash
npm install @inicrea/bikram-sambat-react
```

```tsx
import { BikramDatePicker } from '@inicrea/bikram-sambat-react';
import '@inicrea/bikram-sambat-react/styles.css';

<BikramDatePicker value={date} onChange={setDate} />;
```

## Why another Nepali date library

**The calendar data is derived, not transcribed.** Nepali month lengths vary
between 29 and 32 days with no formula behind them, so every JavaScript library
carries a hand-maintained table, and a typo in one year silently corrupts every
date after it. Ours is generated from the
[Yorion engine](https://github.com/Yorion-io/yorion_engine) (Rust, MIT OR
Apache-2.0) and then checked against it **every single day from BS 1975 to
2100, all 46,022 of them**, in both directions, including weekdays and month
lengths. `pnpm verify` re-runs that sweep.

**It runs on React Native.** Hermes has no WebAssembly, so WASM-backed
converters are web-only. The core here is plain TypeScript with no
dependencies, no native modules and nothing to link. It works in Expo Go.

**Weekends are handled as history, not a constant.** Nepal moved from a
one-day weekend to Saturday *and* Sunday on **2026-04-12 (BS 2082-12-29)**. A
grid spanning that date has to change behaviour mid-month, and this one does.

**Timezones are made explicit.** A `Date` is an instant; a calendar date is not.
Converting `new Date()` using UTC components is how apps in Kathmandu end up
showing yesterday. Here the ISO string helpers are the canonical path and `Date`
conversion takes an explicit `utc` option.

## Supported range

BS **1975-01-01 → 2100-12-30**, i.e. AD **1918-04-13 → 2044-04-12**. Anything
outside throws a `BikramRangeError` with a `code` of `OUT_OF_RANGE` or
`INVALID_DATE`, never a silently wrong date.

## Quick reference

```ts
import { adToBs, bsToAdIso, formatBs, getBsMonthCalendar } from '@inicrea/bikram-sambat-core';

adToBs('2026-08-20');                              // { year: 2083, month: 5, day: 4 }
bsToAdIso({ year: 2083, month: 5, day: 4 });       // '2026-08-20'
formatBs(bs, 'YYYY MMMM DD', { locale: 'ne' });    // '२०८३ भदौ ०४'
getBsMonthCalendar(2083, 5).weeks;                 // 7-column grid, ready to render
```

Full API in each package's README:
[core](packages/core/README.md) ·
[react](packages/react/README.md) ·
[react-native](packages/react-native/README.md)

## Demo

`docs/index.html` is a single self-contained page holding a live BS ⇄ AD
converter and a patro calendar. It inlines the built core, so it demonstrates the real
package rather than a copy. Serve `docs/` anywhere static (GitHub Pages works
with no configuration):

```bash
pnpm build && pnpm site
```

## Repository layout

```
packages/core            the calendar itself
packages/react           web components
packages/react-native    native components
site/ + docs/            demo page source and its built, self-contained output
tools/generate-data      build-time generator + exhaustive verifier
```

The Yorion engine lives in `tools/generate-data/vendor` as a **build-time
devDependency only**. It is never shipped inside a published package.

## Development

```bash
pnpm install
pnpm build          # build all three packages
pnpm test           # unit suites (692 core + 27 react + 22 react-native)
pnpm typecheck
pnpm gendata        # regenerate calendar tables from the Yorion engine
pnpm verify         # exhaustive day-by-day check against the engine
pnpm site           # rebuild docs/index.html from site/index.html
```

## Licence

MIT © Inicrea Technologies. Calendar data derived from the Yorion engine
(MIT OR Apache-2.0). See [NOTICE](NOTICE).
