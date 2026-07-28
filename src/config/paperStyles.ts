import { colors } from '../theme/tokens';

// Note paper styles — flat paper colors, two dot-character backgrounds, and a
// photo-background mode — as a swatch config array rather than hardcoded divs.
// EditorScreen and PaperPickerScreen just map over this.
export type PaperStyleId = 'bg' | 'accent' | 'neutral' | 'cream' | 'dotQuiet' | 'dotScatter' | 'photo';

export type PaperDecoration = 'dot' | 'scatter';

export type PaperStyleConfig = {
  id: PaperStyleId;
  label: string;
  swatchColor: string;
  isPhoto?: boolean;
  decoration?: PaperDecoration;
};

export const paperStyles: PaperStyleConfig[] = [
  { id: 'bg', label: 'Plain', swatchColor: colors.bg },
  { id: 'accent', label: 'Warm', swatchColor: colors.accent100 },
  { id: 'neutral', label: 'Stone', swatchColor: colors.neutral200 },
  { id: 'cream', label: 'Cream', swatchColor: colors.neutral100 },
  { id: 'dotQuiet', label: 'Quiet dot', swatchColor: colors.bg, decoration: 'dot' },
  { id: 'dotScatter', label: 'Scattered dots', swatchColor: colors.bg, decoration: 'scatter' },
  { id: 'photo', label: 'Photo', swatchColor: colors.neutral200, isPhoto: true },
];

export function paperStyleFor(id: PaperStyleId): PaperStyleConfig {
  return paperStyles.find((p) => p.id === id) ?? paperStyles[0];
}

export function paperBackgroundColor(id: PaperStyleId): string {
  return paperStyleFor(id).swatchColor;
}

export function paperDecorationFor(id: PaperStyleId): PaperDecoration | undefined {
  return paperStyleFor(id).decoration;
}
