# Changelog

All notable changes to this project are documented here. The three packages
share a version number and are released together.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — unreleased

First release.

### Added

**`@inicrea/bikram-sambat-core`**

- BS ↔ AD conversion across BS 1975-01-01 – 2100-12-30 (AD 1918-04-13 – 2044-04-12),
  from a calendar table generated from the [Yorion engine](https://github.com/Yorion-io/yorion_engine)
  and verified against it for all 46,022 days in both directions.
- `adToBs`, `bsToAd`, `bsToAdIso`, `todayBs`, `bsWeekday`, with an explicit
  `utc` option rather than an implicit timezone assumption.
- Formatting and parsing with dayjs-style tokens, in English and Nepali,
  including Devanagari numerals (`formatBs`, `parseBs`, `toNepaliDigits`).
- Month grids for calendar UIs (`getBsMonthCalendar`, `getWeekdayLabels`),
  with a history-aware weekend policy: Nepal's move to a two-day weekend on
  2026-04-12 (BS 2082-12-29) is modelled, so a grid spanning that date changes
  behaviour mid-month.
- Date arithmetic with day-clamping (`addBsDays`, `addBsMonths`, `addBsYears`,
  `diffBsDays`, `compareBs`, `clampBs`, `startOfBsMonth`, `endOfBsMonth`).
- Nepali fiscal year helpers (`getNepaliFiscalYear`, `isInFiscalYear`).
- `BikramRangeError` with an `OUT_OF_RANGE` / `INVALID_DATE` code, so
  out-of-range input fails loudly instead of returning a wrong date.
- Zero runtime dependencies; no WebAssembly.

**`@inicrea/bikram-sambat-react`**

- `<BikramDatePicker />`, `<BikramCalendar />` and `<BikramDateConverter />`.
- `useBikramCalendar()` for building a custom UI on the same state.
- Keyboard-navigable grid with a roving tab stop: arrow keys move a day,
  PageUp/PageDown a month, Home/End to the month edges, Escape closes.
- Themeable through CSS custom properties, with dark mode via
  `prefers-color-scheme`.
- Ships the `"use client"` directive, so it works in the Next.js App Router
  without a wrapper.

**`@inicrea/bikram-sambat-react-native`**

- The same three components on React Native primitives, plus
  `useBikramCalendar()`.
- No WebAssembly and no native modules — Hermes has no WASM support, so the
  pure-TypeScript core is what makes React Native possible at all. Nothing to
  link, and Expo Go works unmodified.
- Theming through a partial `theme` object, with `lightTheme` / `darkTheme`
  presets and `createStyles()` for full control.

[0.1.0]: https://github.com/Inicrea-Technologies-Pvt-Ltd/bikram-sambat/releases/tag/v0.1.0
