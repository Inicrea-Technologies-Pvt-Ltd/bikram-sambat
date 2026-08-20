import { useCallback, useMemo, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  bsToAdIso,
  formatBs,
  todayBs,
  type BikramLocale,
  type BsCalendarDay,
  type BsDate,
  type WeekendPolicy,
} from '@inicrea/bikram-sambat-core';
import { useBikramCalendar } from './useBikramCalendar';
import { createStyles, resolveTheme, type BikramTheme } from './theme';

export interface BikramCalendarProps {
  selected?: BsDate | null;
  /** Fired when a day is tapped. `detail.ad` is the matching AD "YYYY-MM-DD". */
  onSelect?: (date: BsDate, detail: { ad: string }) => void;
  month?: BsDate;
  defaultMonth?: BsDate;
  onMonthChange?: (month: BsDate) => void;
  locale?: BikramLocale;
  weekStartsOn?: number;
  weekend?: WeekendPolicy;
  min?: BsDate | null;
  max?: BsDate | null;
  isDateDisabled?: (day: BsCalendarDay) => boolean;
  /** Extra content inside a day cell: a holiday dot, for instance. */
  dayContent?: (day: BsCalendarDay) => ReactNode;
  showOutsideDays?: boolean;
  showFooter?: boolean;
  /** Partial theme override. */
  theme?: Partial<BikramTheme>;
  /** Pick the built-in light or dark palette before applying `theme`. */
  colorScheme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * A Bikram Sambat month grid built from React Native primitives, no
 * WebAssembly and no native modules, so it runs on Hermes as-is.
 */
export function BikramCalendar({
  selected,
  onSelect,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  locale = 'en',
  weekStartsOn = 0,
  weekend,
  min,
  max,
  isDateDisabled,
  dayContent,
  showOutsideDays = true,
  showFooter = true,
  theme,
  colorScheme = 'light',
  style,
  testID,
}: BikramCalendarProps) {
  const palette = useMemo(() => resolveTheme(theme, colorScheme), [theme, colorScheme]);
  const styles = useMemo(() => createStyles(palette), [palette]);

  const {
    month,
    calendar,
    weekdayLabels,
    goToMonth,
    goToNextMonth,
    goToPreviousMonth,
    canGoNextMonth,
    canGoPreviousMonth,
    isDayDisabled,
    isDaySelected,
  } = useBikramCalendar({
    selected,
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    locale,
    weekStartsOn,
    weekend,
    min,
    max,
    isDateDisabled,
  });

  const caption = useMemo(
    () => formatBs({ ...month, day: 1 }, 'MMMM YYYY', { locale }),
    [month.year, month.month, locale],
  );

  const today = useMemo(() => {
    try {
      return todayBs();
    } catch {
      return null;
    }
  }, []);

  const handleSelect = useCallback(
    (day: BsCalendarDay) => {
      onSelect?.({ year: day.year, month: day.month, day: day.day }, { ad: day.ad });
    },
    [onSelect],
  );

  return (
    <View style={[styles.calendar, style]} testID={testID}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityState={{ disabled: !canGoPreviousMonth }}
          disabled={!canGoPreviousMonth}
          onPress={goToPreviousMonth}
          style={({ pressed }) => [
            styles.navButton,
            !canGoPreviousMonth && styles.navButtonDisabled,
            pressed && styles.dayCellPressed,
          ]}
        >
          <Text style={styles.navLabel}>‹</Text>
        </Pressable>

        <Text style={styles.caption} accessibilityRole="header">
          {caption}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          accessibilityState={{ disabled: !canGoNextMonth }}
          disabled={!canGoNextMonth}
          onPress={goToNextMonth}
          style={({ pressed }) => [
            styles.navButton,
            !canGoNextMonth && styles.navButtonDisabled,
            pressed && styles.dayCellPressed,
          ]}
        >
          <Text style={styles.navLabel}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {weekdayLabels.map((label, index) => (
          <View key={`${label}-${index}`} style={styles.weekdayCell}>
            <Text style={styles.weekdayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {calendar.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day) => {
            const date: BsDate = { year: day.year, month: day.month, day: day.day };
            const disabled = isDayDisabled(day);
            const isSelected = isDaySelected(day);
            const hidden = day.outside && !showOutsideDays;

            if (hidden) {
              return <View key={day.ad} style={styles.dayCell} />;
            }

            return (
              <Pressable
                key={day.ad}
                testID={`bikram-day-${day.ad}`}
                accessibilityRole="button"
                accessibilityState={{ disabled, selected: isSelected }}
                accessibilityLabel={`${formatBs(date, 'D MMMM YYYY', { locale })} (${day.ad})`}
                disabled={disabled}
                onPress={() => handleSelect(day)}
                style={({ pressed }) => [
                  styles.dayCell,
                  day.today && !isSelected && styles.dayCellToday,
                  isSelected && styles.dayCellSelected,
                  pressed && !isSelected && styles.dayCellPressed,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    day.weekend && !isSelected && styles.dayLabelWeekend,
                    day.outside && styles.dayLabelOutside,
                    disabled && styles.dayLabelDisabled,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  {formatBs(date, 'D', { locale })}
                </Text>
                {dayContent?.(day)}
              </Pressable>
            );
          })}
        </View>
      ))}

      {showFooter && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{selected ? `AD ${bsToAdIso(selected)}` : ''}</Text>
          {today && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go to today"
              onPress={() => {
                goToMonth(today);
                onSelect?.(today, { ad: bsToAdIso(today) });
              }}
            >
              <Text style={styles.footerAction}>Today</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
