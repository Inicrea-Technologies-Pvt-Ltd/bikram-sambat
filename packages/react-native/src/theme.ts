import { StyleSheet } from 'react-native';

/** Colours and metrics the components draw with. Override any subset. */
export interface BikramTheme {
  accent: string;
  accentContrast: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  weekend: string;
  radius: number;
  daySize: number;
  fontFamily?: string;
}

export const lightTheme: BikramTheme = {
  accent: '#2563eb',
  accentContrast: '#ffffff',
  background: '#ffffff',
  foreground: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb',
  weekend: '#dc2626',
  radius: 8,
  daySize: 40,
};

export const darkTheme: BikramTheme = {
  ...lightTheme,
  background: '#111827',
  foreground: '#f9fafb',
  muted: '#9ca3af',
  border: '#374151',
  weekend: '#f87171',
};

export function resolveTheme(theme?: Partial<BikramTheme>, scheme: 'light' | 'dark' = 'light'): BikramTheme {
  return { ...(scheme === 'dark' ? darkTheme : lightTheme), ...theme };
}

/**
 * Styles that depend on the theme. Built per theme object rather than once at
 * module load, so a custom theme is honoured.
 */
export function createStyles(theme: BikramTheme) {
  return StyleSheet.create({
    calendar: {
      backgroundColor: theme.background,
      borderRadius: theme.radius + 4,
      padding: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    caption: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '600',
      color: theme.foreground,
      fontFamily: theme.fontFamily,
    },
    navButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navButtonDisabled: { opacity: 0.4 },
    navLabel: { fontSize: 18, lineHeight: 20, color: theme.foreground },
    weekRow: { flexDirection: 'row' },
    weekdayCell: {
      width: theme.daySize,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
    },
    weekdayLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.muted,
      fontFamily: theme.fontFamily,
    },
    dayCell: {
      width: theme.daySize,
      height: theme.daySize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius,
    },
    dayCellSelected: { backgroundColor: theme.accent },
    dayCellToday: { borderWidth: 1, borderColor: theme.accent },
    dayCellPressed: { opacity: 0.6 },
    dayLabel: { fontSize: 13, color: theme.foreground, fontFamily: theme.fontFamily },
    dayLabelSelected: { color: theme.accentContrast, fontWeight: '600' },
    dayLabelWeekend: { color: theme.weekend },
    dayLabelOutside: { opacity: 0.35 },
    dayLabelDisabled: { opacity: 0.3 },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerText: { fontSize: 12, color: theme.muted, fontFamily: theme.fontFamily },
    footerAction: { fontSize: 12, fontWeight: '600', color: theme.accent, fontFamily: theme.fontFamily },

    field: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: theme.radius,
      backgroundColor: theme.background,
    },
    fieldDisabled: { opacity: 0.6 },
    fieldText: { fontSize: 15, color: theme.foreground, fontFamily: theme.fontFamily },
    fieldPlaceholder: { color: theme.muted },

    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 24,
    },

    converter: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: theme.radius + 4,
      padding: 16,
      gap: 12,
    },
    converterLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.muted,
      marginBottom: 4,
      fontFamily: theme.fontFamily,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.foreground,
      fontFamily: theme.fontFamily,
    },
    statusText: { fontSize: 13, color: theme.muted, fontFamily: theme.fontFamily },
    errorText: { fontSize: 13, color: theme.weekend, fontFamily: theme.fontFamily },
  });
}

export type BikramStyles = ReturnType<typeof createStyles>;
