// Central design tokens. Re-theming the app is a matter of changing values here —
// no colors, fonts, spacing, radii, or shadows should be hardcoded in screens/components.

// Text and control colors are tuned to clear WCAG AA (4.5:1) on every surface
// they actually sit on — including the accent100 tint used for tags and pressed
// rows, which the older, lighter values only reached ~4.3:1 against.
export const colors = {
  bg: '#f3f2f2',
  surface: '#fbfaf7',
  text: '#201f1d',

  accent: '#b68235',
  accent700: '#7f5a1d',
  accent300: '#cca971',
  accent100: '#efe4d1',

  neutral100: '#ece8e3',
  neutral200: '#e3ded8',
  neutral700: '#65605b',

  // `divider` is decorative hairline only. Anything that outlines an interactive
  // control (text fields, toggles) uses `border`, which clears the 3:1 that
  // WCAG 1.4.11 requires to identify a component boundary — divider is ~1.3:1.
  divider: '#ddd8d2',
  border: '#85827e',

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
  // Apple HIG asks for 44pt of tappable area on every control (Material asks 48dp).
  // Controls are sized to this directly rather than grown with `hitSlop`, which
  // react-native-web ignores — on web the slop would silently do nothing.
  tapTarget: 44,
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
