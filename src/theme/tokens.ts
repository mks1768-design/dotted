// Central design tokens. Re-theming the app is a matter of changing values here —
// no colors, fonts, spacing, radii, or shadows should be hardcoded in screens/components.

// The palette is built on one idea: `bg` is the desk, everything else is paper
// lying on it. That's why the ground is the darkest of the light tones — a sheet
// of paper has to read as lifted off it, not flush with it.
//
// Text and control colors clear WCAG AA (4.5:1) on every stock they can land on
// (surface, accent100, neutral100, neutral200 and the desk itself), so switching
// a note's paper style can never drop its text below the bar.
export const colors = {
  bg: '#e9e3da',
  surface: '#fcfaf5',
  text: '#241f19',

  accent: '#b68235',
  accent700: '#7f5a1d',
  accent300: '#cca971',
  accent100: '#f0e6d3',

  neutral100: '#f5efe1',
  neutral200: '#eae7e0',
  neutral700: '#6b6357',

  // `divider` is decorative hairline only. Anything that outlines an interactive
  // control (text fields, toggles) uses `border`, which clears the 3:1 that
  // WCAG 1.4.11 requires to identify a component boundary — divider is ~1.3:1.
  divider: '#d6cec1',
  border: '#807a6f',

  // The ruled lines printed on a sheet. Kept as an alpha so it reads correctly
  // on whichever paper stock it's drawn over.
  paperRule: 'rgba(36, 31, 25, 0.055)',

  // Translucent layers. `scrim*` darkens what's beneath (dialog backdrops, the
  // gradient under a caption on a photo); `paperVeil*` lays frosted paper over a
  // photo so dark-on-light controls stay readable on any image.
  scrim: 'rgba(36, 31, 25, 0.45)',
  scrimDeep: 'rgba(36, 31, 25, 0.72)',
  paperVeil: 'rgba(252, 250, 245, 0.86)',
  paperVeilSoft: 'rgba(252, 250, 245, 0.72)',
  paperVeilStrong: 'rgba(252, 250, 245, 0.92)',
  /** Text and icons drawn straight onto a photo. */
  onPhoto: '#ffffff',

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
  // Sheets of paper have barely-there corners — anything rounder stops reading
  // as paper and starts reading as a UI panel.
  paper: 3,
  sm: 8,
  md: 14,
  pill: 999,
  circle: 999,
};

/** Vertical rhythm of the ruled lines printed on paper surfaces. */
export const paperRuleGap = 22;

export const shadows = {
  sm: {
    shadowColor: '#241f19',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#241f19',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  // A sheet resting on the desk: one tight contact shadow to pin the edge down,
  // and a wider soft one for the lift.
  paper: {
    shadowColor: '#241f19',
    shadowOpacity: 0.13,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
};

export const theme = { colors, fonts, fontSizes, spacing, radii, shadows };
export type Theme = typeof theme;
