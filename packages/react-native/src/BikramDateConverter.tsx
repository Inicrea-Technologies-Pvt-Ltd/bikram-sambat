import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  MAX_AD_ISO,
  EPOCH_AD_ISO,
  adToBs,
  bsToAdIso,
  formatBs,
  parseBs,
  todayBs,
  type BikramLocale,
  type BsDate,
} from '@inicrea/bikram-sambat-core';
import { createStyles, resolveTheme, type BikramTheme } from './theme';

export interface BikramDateConverterProps {
  /** Date the tool starts on: an AD "YYYY-MM-DD" string or a BS date. */
  defaultValue?: string | BsDate;
  locale?: BikramLocale;
  onChange?: (detail: { ad: string; bs: BsDate }) => void;
  theme?: Partial<BikramTheme>;
  colorScheme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  labels?: Partial<{ bs: string; ad: string; today: string }>;
  testID?: string;
}

/**
 * Two-way BS ⇄ AD converter. Type into either field and the other follows.
 *
 * @example
 * <BikramDateConverter defaultValue="2026-08-20" />
 */
export function BikramDateConverter({
  defaultValue,
  locale = 'en',
  onChange,
  theme,
  colorScheme = 'light',
  style,
  labels = {},
  testID,
}: BikramDateConverterProps) {
  const palette = useMemo(() => resolveTheme(theme, colorScheme), [theme, colorScheme]);
  const styles = useMemo(() => createStyles(palette), [palette]);

  const initial = useMemo(() => resolveInitial(defaultValue), [defaultValue]);
  const [date, setDate] = useState<BsDate>(initial);
  const [bsText, setBsText] = useState(() => formatBs(initial, 'YYYY-MM-DD'));
  const [adText, setAdText] = useState(() => bsToAdIso(initial));
  const [error, setError] = useState<string | null>(null);

  const settle = useCallback(
    (next: BsDate) => {
      setDate(next);
      setError(null);
      onChange?.({ ad: bsToAdIso(next), bs: next });
    },
    [onChange],
  );

  const handleBs = useCallback(
    (text: string) => {
      setBsText(text);
      const parsed = parseBs(text, 'YYYY-MM-DD');
      if (!parsed) {
        setError(text.trim() ? 'Not a valid BS date.' : null);
        return;
      }
      setAdText(bsToAdIso(parsed));
      settle(parsed);
    },
    [settle],
  );

  const handleAd = useCallback(
    (text: string) => {
      setAdText(text);
      try {
        const parsed = adToBs(text);
        setBsText(formatBs(parsed, 'YYYY-MM-DD'));
        settle(parsed);
      } catch {
        setError(text.trim() ? `Enter an AD date between ${EPOCH_AD_ISO} and ${MAX_AD_ISO}.` : null);
      }
    },
    [settle],
  );

  const goToToday = useCallback(() => {
    const today = safeToday();
    setBsText(formatBs(today, 'YYYY-MM-DD'));
    setAdText(bsToAdIso(today));
    settle(today);
  }, [settle]);

  return (
    <View style={[styles.converter, style]} testID={testID}>
      <View>
        <Text style={styles.converterLabel}>{labels.bs ?? 'Bikram Sambat (BS)'}</Text>
        <TextInput
          testID="bikram-converter-bs"
          accessibilityLabel="Bikram Sambat date"
          style={styles.input}
          value={bsText}
          onChangeText={handleBs}
          placeholder="2083-04-05"
          placeholderTextColor={palette.muted}
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View>
        <Text style={styles.converterLabel}>{labels.ad ?? 'Gregorian (AD)'}</Text>
        <TextInput
          testID="bikram-converter-ad"
          accessibilityLabel="Gregorian date"
          style={styles.input}
          value={adText}
          onChangeText={handleAd}
          placeholder="2026-07-21"
          placeholderTextColor={palette.muted}
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.footer}>
        {error ? (
          <Text style={styles.errorText} testID="bikram-converter-status">
            {error}
          </Text>
        ) : (
          <Text style={styles.statusText} testID="bikram-converter-status">
            {formatBs(date, 'YYYY MMMM DD, dddd', { locale })}
          </Text>
        )}
        <Pressable accessibilityRole="button" onPress={goToToday}>
          <Text style={styles.footerAction}>{labels.today ?? 'Today'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function resolveInitial(value?: string | BsDate): BsDate {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return adToBs(value);
    } catch {
      const parsed = parseBs(value, 'YYYY-MM-DD');
      if (parsed) return parsed;
    }
  }
  return safeToday();
}

function safeToday(): BsDate {
  try {
    return todayBs();
  } catch {
    return adToBs(EPOCH_AD_ISO);
  }
}
