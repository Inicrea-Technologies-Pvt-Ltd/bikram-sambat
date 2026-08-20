import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { adToBs, bsToAdIso, daysInBsMonth } from '@inicrea/bikram-sambat-core';
import { BikramCalendar, BikramDateConverter, BikramDatePicker, lightTheme } from '../src/index';

const SELECTED = { year: 2083, month: 4, day: 5 }; // AD 2026-07-21
const SELECTED_AD = '2026-07-21';

const dayTestId = (ad: string) => `bikram-day-${ad}`;

describe('BikramCalendar (React Native)', () => {
  it('renders the caption and a whole number of week rows', () => {
    render(<BikramCalendar month={SELECTED} testID="cal" />);
    expect(screen.getByText('Shrawan 2083')).toBeInTheDocument();
    const days = screen.getAllByTestId(/^bikram-day-/);
    expect(days.length % 7).toBe(0);
  });

  it('reports both calendars when a day is pressed', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BikramCalendar month={SELECTED} onSelect={onSelect} />);

    await user.click(screen.getByTestId(dayTestId(SELECTED_AD)));

    expect(onSelect).toHaveBeenCalledWith(SELECTED, { ad: SELECTED_AD });
  });

  it('marks the selected day', () => {
    render(<BikramCalendar month={SELECTED} selected={SELECTED} />);
    expect(screen.getByTestId(dayTestId(SELECTED_AD))).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates months', async () => {
    const user = userEvent.setup();
    render(<BikramCalendar defaultMonth={SELECTED} />);

    await user.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('Bhadra 2083')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('Shrawan 2083')).toBeInTheDocument();
  });

  it('disables navigation at both ends of the supported range', () => {
    const { unmount } = render(<BikramCalendar defaultMonth={{ year: 1975, month: 1, day: 1 }} />);
    expect(screen.getByLabelText('Previous month')).toBeDisabled();
    unmount();

    render(<BikramCalendar defaultMonth={{ year: 2100, month: 12, day: 1 }} />);
    expect(screen.getByLabelText('Next month')).toBeDisabled();
  });

  it('disables days outside min/max', () => {
    render(
      <BikramCalendar
        month={SELECTED}
        min={{ year: 2083, month: 4, day: 5 }}
        max={{ year: 2083, month: 4, day: 10 }}
      />,
    );
    expect(screen.getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 4 })))).toBeDisabled();
    expect(screen.getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 5 })))).toBeEnabled();
    expect(screen.getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 11 })))).toBeDisabled();
  });

  it('renders Nepali names and digits', () => {
    render(<BikramCalendar month={SELECTED} locale="ne" />);
    expect(screen.getByText('साउन २०८३')).toBeInTheDocument();
  });

  it('accepts a partial theme without losing the rest of the palette', () => {
    expect(() =>
      render(<BikramCalendar month={SELECTED} theme={{ accent: '#b91c1c' }} colorScheme="dark" />),
    ).not.toThrow();
    expect(lightTheme.accent).toBe('#2563eb');
  });

  it('covers the whole month', () => {
    render(<BikramCalendar month={SELECTED} showOutsideDays={false} />);
    const length = daysInBsMonth(2083, 4);
    for (let day = 1; day <= length; day++) {
      expect(screen.getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day })))).toBeInTheDocument();
    }
  });
});

describe('BikramDatePicker (React Native)', () => {
  it('shows the formatted BS value on the field', () => {
    render(<BikramDatePicker value={SELECTED_AD} />);
    expect(screen.getByTestId('bikram-picker-field')).toHaveTextContent('2083 Shrawan 05');
  });

  it('shows the placeholder when empty', () => {
    render(<BikramDatePicker value={null} placeholder="Pick a date" />);
    expect(screen.getByTestId('bikram-picker-field')).toHaveTextContent('Pick a date');
  });

  it('opens a modal and returns an AD string', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker value={SELECTED_AD} onChange={onChange} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('bikram-picker-field'));

    const modal = screen.getByTestId('modal');
    const target = bsToAdIso({ year: 2083, month: 4, day: 10 });
    await user.click(within(modal).getByTestId(dayTestId(target)));

    expect(onChange).toHaveBeenCalledWith(target, {
      ad: target,
      bs: { year: 2083, month: 4, day: 10 },
    });
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('returns a BS string when asked to', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDatePicker valueFormat="BS" value="2083-04-05" onChange={onChange} />);

    await user.click(screen.getByTestId('bikram-picker-field'));
    await user.click(
      within(screen.getByTestId('modal')).getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 10 }))),
    );

    expect(onChange.mock.calls[0]![0]).toBe('2083-04-10');
  });

  it('closes when the backdrop is pressed', async () => {
    const user = userEvent.setup();
    render(<BikramDatePicker value={SELECTED_AD} />);

    await user.click(screen.getByTestId('bikram-picker-field'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Close calendar'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<BikramDatePicker value={SELECTED_AD} disabled />);
    await user.click(screen.getByTestId('bikram-picker-field'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    function Host() {
      const [value, setValue] = useState(SELECTED_AD);
      return <BikramDatePicker value={value} onChange={setValue} />;
    }
    render(<Host />);

    await user.click(screen.getByTestId('bikram-picker-field'));
    await user.click(
      within(screen.getByTestId('modal')).getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 12 }))),
    );

    expect(screen.getByTestId('bikram-picker-field')).toHaveTextContent('2083 Shrawan 12');
  });

  it('honours min and max', async () => {
    const user = userEvent.setup();
    render(<BikramDatePicker value={SELECTED_AD} min={SELECTED_AD} max={bsToAdIso({ year: 2083, month: 4, day: 8 })} />);

    await user.click(screen.getByTestId('bikram-picker-field'));
    const modal = screen.getByTestId('modal');
    expect(within(modal).getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 4 })))).toBeDisabled();
    expect(within(modal).getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 9 })))).toBeDisabled();
    expect(within(modal).getByTestId(dayTestId(bsToAdIso({ year: 2083, month: 4, day: 8 })))).toBeEnabled();
  });
});

describe('BikramDateConverter (React Native)', () => {
  it('fills both fields from the initial value', () => {
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);
    expect(screen.getByTestId('bikram-converter-bs')).toHaveValue('2083-04-05');
    expect(screen.getByTestId('bikram-converter-ad')).toHaveValue(SELECTED_AD);
  });

  it('converts BS to AD', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const bs = screen.getByTestId('bikram-converter-bs');
    await user.clear(bs);
    await user.type(bs, '2083-01-01');

    expect(screen.getByTestId('bikram-converter-ad')).toHaveValue(
      bsToAdIso({ year: 2083, month: 1, day: 1 }),
    );
  });

  it('converts AD to BS', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const ad = screen.getByTestId('bikram-converter-ad');
    await user.clear(ad);
    await user.type(ad, '2026-04-14');

    const expected = adToBs('2026-04-14');
    expect(screen.getByTestId('bikram-converter-bs')).toHaveValue(
      `${expected.year}-${String(expected.month).padStart(2, '0')}-${String(expected.day).padStart(2, '0')}`,
    );
  });

  it('explains an out-of-range AD date', async () => {
    const user = userEvent.setup();
    render(<BikramDateConverter defaultValue={SELECTED_AD} />);

    const ad = screen.getByTestId('bikram-converter-ad');
    await user.clear(ad);
    await user.type(ad, '1850-01-01');

    expect(screen.getByTestId('bikram-converter-status')).toHaveTextContent(
      /between 1918-04-13 and 2044-04-12/,
    );
  });

  it('reports the settled value to onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BikramDateConverter defaultValue={SELECTED_AD} onChange={onChange} />);

    const ad = screen.getByTestId('bikram-converter-ad');
    await user.clear(ad);
    await user.type(ad, '2026-04-14');

    expect(onChange).toHaveBeenLastCalledWith({ ad: '2026-04-14', bs: adToBs('2026-04-14') });
  });
});
