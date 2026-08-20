import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  adToBs,
  bsToAdIso,
  formatBs,
  isValidBsDate,
  parseBs,
  type BikramLocale,
  type BsCalendarDay,
  type BsDate,
  type WeekendPolicy,
} from '@inicrea/bikram-sambat-core';
import { BikramCalendar } from './BikramCalendar';
import { createStyles, resolveTheme, type BikramTheme } from './theme';

export type BikramValueFormat = 'AD' | 'BS';

export interface BikramDatePickerProps {
  /** Selected date as "YYYY-MM-DD", AD unless `valueFormat` says BS. */
  value?: string | null;
  onChange?: (value: string, detail: { ad: string; bs: BsDate }) => void;
  valueFormat?: BikramValueFormat;
  /** Display pattern for the field. Defaults to "YYYY MMMM DD". */
  format?: string;
  locale?: BikramLocale;
  placeholder?: string;
  disabled?: boolean;
  min?: string | null;
  max?: string | null;
  weekStartsOn?: number;
  weekend?: WeekendPolicy;
  isDateDisabled?: (day: BsCalendarDay) => boolean;
  dayContent?: (day: BsCalendarDay) => React.ReactNode;
  theme?: Partial<BikramTheme>;
  colorScheme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A tappable field that opens a Bikram Sambat calendar in a modal.
 *
 * @example
 * const [date, setDate] = useState('2026-08-20');
 * <BikramDatePicker value={date} onChange={setDate} />
 */
export function BikramDatePicker({
  value,
  onChange,
  valueFormat = 'AD',
  format = 'YYYY MMMM DD',
  locale = 'en',
  placeholder = 'Select a date',
  disabled = false,
  min,
  max,
  weekStartsOn = 0,
  weekend,
  isDateDisabled,
  dayContent,
  theme,
  colorScheme = 'light',
  style,
  testID,
  onOpenChange,
}: BikramDatePickerProps) {
  const palette = useMemo(() => resolveTheme(theme, colorScheme), [theme, colorScheme]);
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => toBsDate(value, valueFormat), [value, valueFormat]);
  const minDate = useMemo(() => toBsDate(min, valueFormat), [min, valueFormat]);
  const maxDate = useMemo(() => toBsDate(max, valueFormat), [max, valueFormat]);

  const label = selected ? formatBs(selected, format, { locale }) : placeholder;

  const changeOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const handleSelect = useCallback(
    (date: BsDate) => {
      const ad = bsToAdIso(date);
      onChange?.(valueFormat === 'BS' ? formatBs(date, 'YYYY-MM-DD') : ad, { ad, bs: date });
      changeOpen(false);
    },
    [onChange, valueFormat, changeOpen],
  );

  return (
    <View style={style} testID={testID}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={selected ? `Selected date ${label}` : placeholder}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => changeOpen(true)}
        testID={testID ? `${testID}-field` : 'bikram-picker-field'}
        style={({ pressed }) => [
          styles.field,
          disabled && styles.fieldDisabled,
          pressed && styles.dayCellPressed,
        ]}
      >
        <Text style={[styles.fieldText, !selected && styles.fieldPlaceholder]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.footerAction}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => changeOpen(false)}
      >
        {/* Tapping the backdrop dismisses; the inner View swallows the press so
            a tap on the calendar itself does not close the modal. */}
        <Pressable
          style={styles.backdrop}
          accessibilityLabel="Close calendar"
          onPress={() => changeOpen(false)}
        >
          <Pressable onPress={() => {}} accessibilityRole="none">
            <BikramCalendar
              selected={selected}
              onSelect={handleSelect}
              defaultMonth={selected ?? undefined}
              locale={locale}
              weekStartsOn={weekStartsOn}
              weekend={weekend}
              min={minDate}
              max={maxDate}
              isDateDisabled={isDateDisabled}
              dayContent={dayContent}
              theme={theme}
              colorScheme={colorScheme}
              testID={testID ? `${testID}-calendar` : 'bikram-picker-calendar'}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function toBsDate(value: string | null | undefined, format: BikramValueFormat): BsDate | null {
  if (!value) return null;
  try {
    if (format === 'BS') {
      const parsed = parseBs(value, 'YYYY-MM-DD');
      return parsed && isValidBsDate(parsed) ? parsed : null;
    }
    return adToBs(value);
  } catch {
    return null;
  }
}
