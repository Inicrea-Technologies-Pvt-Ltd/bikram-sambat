import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { adToBs, bsToAdIso, daysInBsMonth } from '@inicrea/bikram-sambat-core';
import { BikramCalendar, BikramDateConverter, BikramDatePicker } from '../src/index';

const SELECTED = { year: 2083, month: 4, day: 5 }; // AD 2026-07-21
const SELECTED_AD = '2026-07-21';

/**
 * Accessible name matcher for one day cell. Anchored, because an unanchored
 * `/5 Shrawan 2083/` also matches 15 and 25.
 */
const dayName = (day: number) => new RegExp(`^${day} Shrawan 2083 `);

describe('BikramCalendar', () => {
  it('renders the month caption and the right number of days', () => {
    render(<BikramCalendar month={SELECTED} />);
    expect(screen.getByText('Shrawan 2083')).toBeInTheDocument();
    const days = screen.getAllByRole('button').filter((b) => b.hasAttribute('data-date'));
    // Padding days are rendered too, so the count is a whole number of weeks.
    expect(days.length % 7).toBe(0);
  });

  it('reports both calendars when a day is chosen', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BikramCalendar month={SELECTED} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: dayName(5) }));

    expect(onSelect).toHaveBeenCalledWith(SELECTED, { ad: SELECTED_AD });
  });

  it('marks the selected day', () => {
    render(<BikramCalendar month={SELECTED} selected={SELECTED} />);
    const day = screen.getByRole('button', { name: dayName(5) });
    expect(day).toHaveClass('bikram__day--selected');
    expect(day.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates months and stops at the end of the supported range', async () => {
    const user = userEvent.setup();
    render(<BikramCalendar defaultMonth={{ year: 2100, month: 12, day: 1 }} />);
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('Falgun 2100')).toBeInTheDocument();
  });

  it('stops at the start of the supported range', () => {
    render(<BikramCalendar defaultMonth={{ year: 1975, month: 1, day: 1 }} />);
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeEnabled();
  });

  it('moves focus with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<BikramCalendar month={SELECTED} selected={SELECTED} />);

    const start = screen.getByRole('button', { name: dayName(5) });
    start.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: dayName(6) })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: dayName(13) })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: dayName(1) })).toHaveFocus();

    await user.keyboard('{End}');
    const last = daysInBsMonth(2083, 4);
    expect(screen.getByRole('button', { name: dayName(last) })).toHaveFocus();
  });

  it('keeps exactly one day in the tab order', () => {
    render(<BikramCalendar month={SELECTED} selected={SELECTED} />);
    const days = screen.getAllByRole('button').filter((b) => b.hasAttribute('data-date'));
    expect(days.filter((day) => day.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('disables days outside min/max', () => {
    render(
      <BikramCalendar
        month={SELECTED}
        min={{ year: 2083, month: 4, day: 5 }}
        max={{ year: 2083, month: 4, day: 10 }}
      />,
    );
    expect(screen.getByRole('button', { name: dayName(4) })).toBeDisabled();
    expect(screen.getByRole('button', { name: dayName(5) })).toBeEnabled();
    expect(screen.getByRole('button', { name: dayName(10) })).toBeEnabled();
    expect(screen.getByRole('button', { name: dayName(11) })).toBeDisabled();
  });

  it('supports a custom disable predicate', () => {
    // Saturdays in Shrawan 2083 are the 2nd, 9th, 16th, 23rd and 30th.
    render(<BikramCalendar month={SELECTED} isDateDisabled={(day) => day.weekday === 6} />);
    expect(screen.getByRole('button', { name: dayName(2) })).toBeDisabled();
    expect(screen.getByRole('button', { name: dayName(9) })).toBeDisabled();
    expect(screen.getByRole('button', { name: dayName(4) })).toBeEnabled();
  });

  it('renders Nepali names and digits', () => {
    render(<BikramCalendar month={SELECTED} locale="ne" />);
    expect(screen.getByText('साउन २०८३')).toBeInTheDocument();
    expect(screen.getByText('आइत')).toBeInTheDocument();
  });

  it('exposes holiday text through dayTitle', () => {
    render(
      <BikramCalendar
        month={SELECTED}
        dayTitle={(day) => (day.day === 5 && !day.outside ? 'Test Holiday' : undefined)}
      />,
    );
    expect(screen.getByRole('button', { name: dayName(5) })).toHaveAttribute('title', 'Test Holiday');
  });
});

describe('BikramDatePicker', () => {
  it('shows the formatted BS value for an AD input', () => {
    render(<BikramDatePicker value={SELECTED_AD} />);
    expect(screen.getByRole('textbox')).toHaveValue('2083 Shrawan 05');
  });

  it('opens the calendar and returns an AD string by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker value={SELECTED_AD} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: dayName(10) }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [value, detail] = onChange.mock.calls[0]!;
    expect(value).toBe(bsToAdIso({ year: 2083, month: 4, day: 10 }));
    expect(detail.bs).toEqual({ year: 2083, month: 4, day: 10 });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('returns a BS string when asked to', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker valueFormat="BS" value="2083-04-05" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: dayName(10) }));

    expect(onChange.mock.calls[0]![0]).toBe('2083-04-10');
  });

  it('closes on Escape and on an outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BikramDatePicker value={SELECTED_AD} />
        <button type="button">outside</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('accepts a typed BS date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), '2083-04-05');

    expect(onChange).toHaveBeenLastCalledWith(SELECTED_AD, {
      ad: SELECTED_AD,
      bs: SELECTED,
    });
  });

  it('reports a cleared input without inventing a date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker value={SELECTED_AD} onChange={onChange} />);

    await user.clear(screen.getByRole('textbox'));

    expect(onChange).toHaveBeenLastCalledWith('', { ad: '', bs: null });
  });

  it('submits an AD value through a hidden input', () => {
    render(<BikramDatePicker name="joined_on" value={SELECTED_AD} />);
    const hidden = document.querySelector('input[name="joined_on"]') as HTMLInputElement;
    expect(hidden.value).toBe(SELECTED_AD);
  });

  it('wires aria attributes to the popover', async () => {
    const user = userEvent.setup();
    render(<BikramDatePicker value={SELECTED_AD} aria-label="Joining date" />);
    const input = screen.getByRole('textbox', { name: 'Joining date' });

    expect(input).toHaveAttribute('aria-expanded', 'false');
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('dialog').id);
  });

  it('opens with ArrowDown from the input', async () => {
    const user = userEvent.setup();
    render(<BikramDatePicker value={SELECTED_AD} />);
    screen.getByRole('textbox').focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    function Host() {
      const [value, setValue] = useState(SELECTED_AD);
      return <BikramDatePicker value={value} onChange={setValue} />;
    }
    render(<Host />);

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: dayName(12) }));

    expect(screen.getByRole('textbox')).toHaveValue('2083 Shrawan 12');
  });
});

describe('BikramDateConverter', () => {
  it('fills both sides from the initial value', () => {
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);
    expect(screen.getByLabelText(/Bikram Sambat/)).toHaveValue('2083-04-05');
    expect(screen.getByLabelText(/Gregorian/)).toHaveValue(SELECTED_AD);
  });

  it('converts BS to AD as you type', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const bs = screen.getByLabelText(/Bikram Sambat/);
    await user.clear(bs);
    await user.type(bs, '2083-01-01');

    expect(screen.getByLabelText(/Gregorian/)).toHaveValue(bsToAdIso({ year: 2083, month: 1, day: 1 }));
  });

  it('converts AD to BS as you type', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const ad = screen.getByLabelText(/Gregorian/);
    await user.clear(ad);
    await user.type(ad, '2026-04-14');

    const expected = adToBs('2026-04-14');
    expect(screen.getByLabelText(/Bikram Sambat/)).toHaveValue(
      `${expected.year}-${String(expected.month).padStart(2, '0')}-${String(expected.day).padStart(2, '0')}`,
    );
  });

  it('explains an out-of-range AD date instead of silently failing', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const ad = screen.getByLabelText(/Gregorian/);
    await user.clear(ad);
    await user.type(ad, '1850-01-01');

    expect(screen.getByRole('status')).toHaveTextContent(/between 1918-04-13 and 2044-04-12/);
  });

  it('rejects an impossible BS date', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const bs = screen.getByLabelText(/Bikram Sambat/);
    await user.clear(bs);
    await user.type(bs, '2083-13-01');

    expect(screen.getByRole('status')).toHaveTextContent('Not a valid BS date.');
  });

  it('shows the long form with the weekday', () => {
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);
    expect(screen.getByRole('status')).toHaveTextContent('2083 Shrawan 05, Tuesday');
  });
});
