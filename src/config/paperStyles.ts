import { colors } from '../theme/tokens';

// Note paper styles — 4 flat paper colors + 1 photo-background mode, as a swatch
// config array rather than hardcoded divs. EditorScreen just maps over this.
export type PaperStyleId = 'bg' | 'accent' | 'neutral' | 'cream' | 'photo';

export type PaperStyleConfig = {
  id: PaperStyleId;
  swatchColor: string;
  isPhoto?: boolean;
};

export const paperStyles: PaperStyleConfig[] = [
  { id: 'bg', swatchColor: colors.bg },
  { id: 'accent', swatchColor: colors.accent100 },
  { id: 'neutral', swatchColor: colors.neutral200 },
  { id: 'cream', swatchColor: colors.neutral100 },
  { id: 'photo', swatchColor: colors.neutral200, isPhoto: true },
];

export function paperBackgroundColor(id: PaperStyleId): string {
  switch (id) {
    case 'accent':
      return colors.accent100;
    case 'neutral':
      return colors.neutral200;
    case 'cream':
      return colors.neutral100;
    default:
      return colors.bg;
  }
}
