# @inicrea/bikram-sambat-react-native

Bikram Sambat (Nepali) **date picker**, **calendar** and **date converter** for
React Native.

**No WebAssembly, no native modules, nothing to link.** Hermes has no WASM
support, so WASM-backed Nepali date libraries are web-only; this one is plain
JavaScript and works in Expo Go, bare React Native, iOS and Android alike.

```bash
npm install @inicrea/bikram-sambat-react-native
```

```tsx
import { useState } from 'react';
import { BikramDatePicker } from '@inicrea/bikram-sambat-react-native';

export function JoinDate() {
  const [date, setDate] = useState('2026-08-20'); // AD "YYYY-MM-DD"
  return <BikramDatePicker value={date} onChange={setDate} />;
}
```

Requires React Native ≥ 0.70 and React ≥ 18. No `pod install`, no config plugin.

## Values are plain strings

`value` and `onChange` speak `"YYYY-MM-DD"`. AD by default; switch with
`valueFormat="BS"`.

```tsx
<BikramDatePicker
  value={date}
  onChange={(value, { ad, bs }) => {
    value;  // '2026-08-20'   — matches valueFormat
    ad;     // '2026-08-20'   — always AD
    bs;     // { year: 2083, month: 5, day: 4 }
  }}
/>
```

## Components

### `<BikramDatePicker />`

A tappable field that opens the calendar in a `Modal`. Tapping the backdrop
dismisses it; Android's back button is handled through `onRequestClose`.

| Prop | Default | |
| --- | --- | --- |
| `value` / `onChange` | — | `"YYYY-MM-DD"` in and out |
| `valueFormat` | `'AD'` | `'AD'` or `'BS'` |
| `format` | `'YYYY MMMM DD'` | display pattern for the field |
| `locale` | `'en'` | `'en'` or `'ne'` |
| `min` / `max` | — | bounds |
| `theme` | — | partial palette override |
| `colorScheme` | `'light'` | base palette |
| `weekStartsOn` | `0` | 0 = Sunday |
| `weekend` | `'nepal'` | history-aware weekend policy |
| `isDateDisabled`, `dayContent`, `disabled`, `placeholder`, `style`, `testID`, `onOpenChange` | | |

### `<BikramCalendar />`

The month grid on its own, for inline calendars and bottom sheets.

### `<BikramDateConverter />`

Two `TextInput`s wired together — type BS, get AD, and the other way round.

```tsx
<BikramDateConverter defaultValue="2026-08-20" onChange={({ ad, bs }) => {}} />
```

### `useBikramCalendar()`

The state behind the components with no UI, for building your own layout —
month navigation, the day grid, and which days are selectable.

## Theming

Pass a partial `theme`; anything you leave out comes from the base palette.

```tsx
import { BikramDatePicker, darkTheme } from '@inicrea/bikram-sambat-react-native';

<BikramDatePicker
  colorScheme="dark"
  theme={{ accent: '#b91c1c', radius: 12, daySize: 44, fontFamily: 'Inter' }}
/>
```

Fields: `accent`, `accentContrast`, `background`, `foreground`, `muted`,
`border`, `weekend`, `radius`, `daySize`, `fontFamily`. To follow the OS theme,
pass `colorScheme={useColorScheme() ?? 'light'}` from React Native.

For full control, `createStyles(theme)` returns the `StyleSheet` the components
use, so you can build a matching design of your own.

## Holidays

Not bundled — they change by government notice each year. Supply your own
through `dayContent` and `isDateDisabled`:

```tsx
<BikramDatePicker
  dayContent={(day) => (holidays[day.ad] ? <View style={styles.dot} /> : null)}
  isDateDisabled={(day) => day.weekend}
/>
```

Weekends are handled for you, including Nepal's move to a two-day weekend on
2026-04-12.

## Accessibility

Every day is a `Pressable` with `accessibilityRole="button"` and a label
carrying both calendars — *"5 Shrawan 2083 (2026-07-21)"* — plus
`accessibilityState` for selected and disabled days. Screen-reader users hear
the AD date alongside the BS one.

## Licence

MIT © Inicrea Technologies. Calendar data derived from the Yorion engine
(MIT OR Apache-2.0) — see [NOTICE](./NOTICE).
