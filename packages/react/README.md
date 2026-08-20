# @inicrea/bikram-sambat-react

Bikram Sambat (Nepali) **date picker**, **calendar** and **date converter** for
React. Accessible, themeable with CSS variables, and no dependencies beyond
`@inicrea/bikram-sambat-core`.

```bash
npm install @inicrea/bikram-sambat-react
```

```tsx
import { useState } from 'react';
import { BikramDatePicker } from '@inicrea/bikram-sambat-react';
import '@inicrea/bikram-sambat-react/styles.css';

function JoinDate() {
  const [date, setDate] = useState('2026-08-20'); // AD "YYYY-MM-DD"
  return <BikramDatePicker value={date} onChange={setDate} />;
}
```

Works in Next.js App Router as-is — the bundle carries the `"use client"`
directive.

## Values are plain strings

`value` and `onChange` speak `"YYYY-MM-DD"`. AD by default, because that is the
safer thing to put in a database; switch with `valueFormat="BS"`.

```tsx
<BikramDatePicker
  value={date}
  onChange={(value, { ad, bs }) => {
    value;  // '2026-08-20'          — matches valueFormat
    ad;     // '2026-08-20'          — always AD
    bs;     // { year: 2083, month: 5, day: 4 }
  }}
/>

<BikramDatePicker valueFormat="BS" value="2083-05-04" onChange={setBs} />
```

Clearing the input calls `onChange('', { ad: '', bs: null })`.

## Components

### `<BikramDatePicker />`

A text input you can type into, plus a popover calendar.

| Prop | Default | |
| --- | --- | --- |
| `value` | — | `"YYYY-MM-DD"` or `null` |
| `onChange` | — | `(value, { ad, bs }) => void` |
| `valueFormat` | `'AD'` | `'AD'` or `'BS'` |
| `format` | `'YYYY MMMM DD'` | display pattern for the input |
| `locale` | `'en'` | `'en'` or `'ne'` |
| `min` / `max` | — | bounds, in `valueFormat`'s calendar |
| `editable` | `true` | allow typing as well as picking |
| `closeOnSelect` | `true` | |
| `name` | — | renders a hidden input for plain HTML form posts |
| `weekStartsOn` | `0` | 0 = Sunday |
| `weekend` | `'nepal'` | see below |
| `isDateDisabled` | — | `(day) => boolean` |
| `dayTitle` / `dayContent` | — | per-day tooltip / extra content |
| `disabled`, `placeholder`, `id`, `required`, `className`, `classNames`, `aria-label`, `onOpenChange` | | |

### `<BikramCalendar />`

The month grid on its own, for inline calendars. Takes the same day-level props
plus `selected`, `onSelect`, `month` / `defaultMonth` / `onMonthChange`,
`showOutsideDays` and `showFooter`.

### `<BikramDateConverter />`

The conversion tool as a drop-in component — type into either side, the other
follows.

```tsx
<BikramDateConverter defaultValue="2026-08-20" onChange={({ ad, bs }) => {}} />
```

### `useBikramCalendar()`

The state behind the components, with no markup — month navigation, the day
grid, and which days are selectable. Use it to build your own UI.

```tsx
const { calendar, month, goToNextMonth, canGoNextMonth, isDayDisabled } =
  useBikramCalendar({ selected, min, max });

calendar.weeks.map((week) => week.map((day) => day.day));
```

## Accessibility

- The grid is a `role="grid"` with a **roving tab stop**, so it is one stop in
  the page's tab order rather than 35.
- **Arrow keys** move a day, **PageUp/PageDown** a month, **Home/End** to the
  month's edges, **Escape** closes the popover and returns focus to the input,
  **ArrowDown** from the input opens it.
- Every day button has an accessible name carrying both calendars, e.g.
  *"5 Shrawan 2083 (2026-07-21)"*.
- Selection is announced through `aria-selected`; today through
  `aria-current="date"`.

## Theming

The stylesheet is driven entirely by CSS custom properties — override variables
rather than fighting specificity.

```css
.bikram, .bikram-picker, .bikram-converter {
  --bikram-accent: #b91c1c;
  --bikram-radius: 12px;
  --bikram-day-size: 2.5rem;
}
```

Available: `--bikram-accent`, `--bikram-accent-contrast`, `--bikram-bg`,
`--bikram-fg`, `--bikram-muted`, `--bikram-border`, `--bikram-hover`,
`--bikram-weekend`, `--bikram-radius`, `--bikram-day-size`, `--bikram-font`,
`--bikram-shadow`. Dark mode follows `prefers-color-scheme`; set the variables
under your own selector to take manual control.

For structural changes, pass `classNames` (`root`, `header`, `nav`, `caption`,
`grid`, `weekdays`, `weekday`, `week`, `day`, `footer`, `input`, `popover`) — or
skip the stylesheet entirely and style the `bikram__*` classes yourself.

## Holidays

Nepali public holidays change by government notice each year, so none are
bundled. Plug your own in:

```tsx
<BikramDatePicker
  dayTitle={(day) => holidays[day.ad]}
  dayContent={(day) => (holidays[day.ad] ? <span className="dot" /> : null)}
  isDateDisabled={(day) => day.weekend || day.ad in holidays}
/>
```

Weekends are handled for you, including Nepal's move to a two-day weekend on
2026-04-12 — see the [core README](../core/README.md#weekends-change-over-time).

## Licence

MIT © Inicrea Technologies. Calendar data derived from the Yorion engine
(MIT OR Apache-2.0) — see [NOTICE](./NOTICE).
