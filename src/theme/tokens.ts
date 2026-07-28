// Central design tokens. Re-theming the app is a matter of changing values here —
// no colors, fonts, spacing, radii, or shadows should be hardcoded in screens/components.

export const colors = {
  bg: '#f3f2f2',
  surface: '#fbfaf7',
  text: '#201f1d',

  accent: '#b68235',
  accent700: '#8a621f',
  accent300: '#cca971',
  accent100: '#efe4d1',

  neutral100: '#ece8e3',
  neutral200: '#e3ded8',
  neutral700: '#6f6a64',

  divider: '#ddd8d2',

  danger: '#a13b2b',
};

export const fonts = {
  heading: 'CormorantGaramond_600SemiBold',
  headingWeight: '600' as const,
  body: 'Lora_400Regular',
};

export const fontSizes = {
  splashWordmark: 34,
  screenTitle: 24,
  homeRowLabel: 20,
  headerTitle: 20,
  body: 16,
  cardSnippet: 14,
  cardSnippetSmall: 14,
  tag: 12,
  smallLabel: 11,
};

export const spacing = {
  screenPaddingH: 20,
  screenPaddingHSmall: 16,
  gapStacked: 16,
  gapTight: 12,
  topPadding: 54,
};

export const radii = {
  sm: 8,
  md: 14,
  pill: 999,
  circle: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#201f1d',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#201f1d',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
};

export const theme = { colors, fonts, fontSizes, spacing, radii, shadows };
export type Theme = typeof theme;
