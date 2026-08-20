# Contributing

Thanks for taking a look. This is a small codebase with one unusual rule, so
it is worth reading the first section before changing anything.

## The calendar data is generated — never edit it by hand

`packages/core/src/data.ts` is the whole calendar: 126 BS years packed into
1,512 characters. It is **generated** by `tools/generate-data/generate.cjs`
from the [Yorion engine](https://github.com/Yorion-io/yorion_engine), which is
vendored under `tools/generate-data/vendor` as a build-time input only and is
never published.

Nepali month lengths run 29–32 days with no formula behind them, so the table
is the only source of truth — and a single wrong year silently corrupts every
date after it. Hand-editing is how that happens.

```bash
pnpm gendata   # regenerate data.ts and the golden fixtures
pnpm verify    # compare the built core against the engine, all 46,022 days
```

CI runs both and fails if the committed table does not match what the generator
produces, so a hand-edit cannot reach a release.

To move to a newer engine, replace the files in `tools/generate-data/vendor`
(from the engine's `wasm-assets-*.tar.gz`, nodejs target), then run `pnpm gendata`
and commit the diff. Review that diff carefully: a change there is a change to
every date the library returns.

## Getting set up

Requires Node 18+ and pnpm 9.

```bash
pnpm install
pnpm build       # all three packages
pnpm test        # 741 tests
pnpm typecheck
pnpm site        # rebuild docs/index.html from site/index.html
```

## Layout

```
packages/core            conversion, formatting, grids, fiscal years
packages/react           web components
packages/react-native    native components
site/ + docs/            demo page source, and its built self-contained output
tools/generate-data      the generator and the exhaustive verifier
```

## Things worth knowing before you change them

- **`useBikramCalendar` exists twice**, once in `packages/react` and once in
  `packages/react-native`. This is deliberate: it is pure React glue with no DOM
  references, and keeping a copy in each package means a React Native app never
  has to carry `react-dom` as a peer dependency. If you change one, change both.
  The calendar maths that must never drift lives in `core` and is shared.

- **`packages/react-native/test/react-native-stub.tsx`** renders React Native
  primitives as DOM elements so the components can be tested in jsdom. It stubs
  React Native's *surface*, not its behaviour — these tests prove our logic is
  correct, not that React Native renders it a particular way. Type checking runs
  against the real `react-native` types, not the stub.

- **The `"use client"` directive** in `packages/react` is added by
  `scripts/add-use-client.mjs` after the bundle is built. A tsup `banner` is
  stripped during bundling, so the post-build step is load-bearing for Next.js
  App Router users.

- **Timezones.** `"YYYY-MM-DD"` strings are the canonical interchange format.
  A `Date` is an instant and a calendar date is not; anything converting between
  them takes an explicit `utc` option. Please keep it that way — defaulting to
  UTC is how apps in Kathmandu end up showing yesterday.

## Reporting a date bug

Include the exact input, what you got, and what you expected, in both calendars.
`pnpm verify` covers every date in range against the engine, so a genuine
conversion bug is most likely in formatting, parsing, grid construction, or
timezone handling rather than in the table.

## Licence

By contributing you agree that your work is licensed under the MIT licence.
