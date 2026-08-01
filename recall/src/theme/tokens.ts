// Central design tokens. Re-theming the app is a matter of changing values
// here — no colors, spacing, radii, or shadows should be hardcoded in
// screens/components.
//
// Unlike a paper/desk metaphor, this app reads as a game board: saturated
// primary for action, a warm gold for XP, orange for streak, and clear
// green/red feedback for right/wrong answers.
export const colors = {
  bg: '#f5f3ff',
  surface: '#ffffff',
  text: '#231942',
  textMuted: '#6f6790',

  primary: '#6c4fe0',
  primary700: '#4d33b3',
  primaryLight: '#e7e1fb',

  success: '#2fb673',
  successLight: '#dcf5e8',
  danger: '#f2545b',
  dangerLight: '#fde3e4',

  streak: '#ff9d2e',
  xp: '#f2b705',

  border: '#e2ddf5',
  neutral200: '#efeafc',

  onPrimary: '#ffffff',
};

export const fontSizes = {
  screenTitle: 26,
  sectionTitle: 18,
  body: 16,
  cardFront: 22,
  label: 13,
  smallLabel: 12,
};

export const spacing = {
  screenPaddingH: 20,
  gapStacked: 16,
  gapTight: 10,
  topPadding: 16,
  // Apple HIG asks for 44pt of tappable area on every control (Material asks 48dp).
  tapTarget: 44,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#231942',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#231942',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
};

export const theme = { colors, fontSizes, spacing, radii, shadows };
export type Theme = typeof theme;
