import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';

// Every icon in the app is one of these named, swappable components — never
// raw inline SVG in a screen. Each "dot" icon redraws the prototype's hand-drawn
// dot-as-character illustrations (jumping at a bookshelf, holding a magnifier,
// as a pencil tip, with sparkles) as a real vector asset.

export type IconProps = {
  size?: number;
  color?: string;
  accentColor?: string;
  bgColor?: string;
};

/** The recurring dot mark itself — the app's logo, reused at every size. */
export function DotMark({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      <Circle cx={13} cy={13} r={13} fill={color} />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 20, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="12 19 5 12 12 5" />
    </Svg>
  );
}

export function SettingsIcon({ size = 18, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function ShareIcon({ size = 16, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="18" cy="5" r="3" />
      <Circle cx="6" cy="12" r="3" />
      <Circle cx="18" cy="19" r="3" />
      <Line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <Line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </Svg>
  );
}

export function BoardIcon({ size = 16, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="7" height="11" rx="1.5" />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="14" width="7" height="7" rx="1.5" />
      <Rect x="3" y="18" width="7" height="3" rx="1.5" />
    </Svg>
  );
}

export function ListIcon({ size = 16, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="8" y1="6" x2="21" y2="6" />
      <Line x1="8" y1="12" x2="21" y2="12" />
      <Line x1="8" y1="18" x2="21" y2="18" />
      <Line x1="3" y1="6" x2="3.01" y2="6" />
      <Line x1="3" y1="12" x2="3.01" y2="12" />
      <Line x1="3" y1="18" x2="3.01" y2="18" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, color = colors.neutral700 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 6 15 12 9 18" />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = colors.bg }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function CloseIcon({ size = 15, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

export function EditIcon({ size = 16, color = colors.bg }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Svg>
  );
}

export function PhotoIcon({ size = 11, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="5" width="18" height="14" rx="2" />
      <Circle cx="9" cy="11" r="2" />
      <Path d="M21 16l-5-5-9 9" />
    </Svg>
  );
}

export function BookIcon({ size = 16, color = colors.bg }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </Svg>
  );
}

export function CameraBadgeIcon({ size = 17, color = colors.bg }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="7" width="18" height="13" rx="2" />
      <Path d="M8 7l1.4-2.2A2 2 0 0 1 11.1 4h1.8a2 2 0 0 1 1.7 .8L16 7" />
      <Circle cx="12" cy="13.5" r="3.5" />
    </Svg>
  );
}

export function CheckIcon({ size = 15, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function CopyIcon({ size = 15, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="9" y="9" width="12" height="12" rx="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

/** STORE: a dot jumping above a small bookshelf. */
export function DotBookshelfIcon({ size = 52, color = colors.text, bgColor = colors.bg, accentColor = colors.accent700 }: IconProps) {
  const h = (size / 52) * 48;
  return (
    <Svg width={size} height={h} viewBox="0 0 52 48">
      <Line x1="4" y1="38" x2="48" y2="38" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x="7" y="24" width="6" height="14" rx="1" fill="none" stroke={color} strokeWidth={1.6} />
      <Rect x="16" y="18" width="6" height="20" rx="1" fill="none" stroke={color} strokeWidth={1.6} />
      <Rect x="25" y="28" width="6" height="10" rx="1" fill="none" stroke={color} strokeWidth={1.6} />
      <Rect x="34" y="14" width="6" height="24" rx="1" fill="none" stroke={color} strokeWidth={1.6} />
      <Line x1="19" y1="18" x2="19" y2="22" stroke={accentColor} strokeWidth={1.6} />
      <Circle cx="22" cy="7" r="5" fill={color} />
      <Circle cx="20" cy="5.5" r="1.3" fill={bgColor} opacity={0.5} />
    </Svg>
  );
}

/** EXPLANATION: a dot as the handle-end of a magnifying glass. */
export function DotMagnifierIcon({ size = 52, color = colors.text, bgColor = colors.bg }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Circle cx="11" cy="33" r="9" fill={color} />
      <Circle cx="8" cy="30" r="1.8" fill={bgColor} opacity={0.5} />
      <Line x1="17" y1="27" x2="30" y2="14" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      <Circle cx="37" cy="9" r="9" fill="none" stroke={color} strokeWidth={3} />
      <Path d="M32 5 A 6 6 0 0 1 40 4" fill="none" stroke={color} strokeWidth={1.4} opacity={0.45} strokeLinecap="round" />
    </Svg>
  );
}

/** WRITE: a dot as the pencil tip / period at the end of a curved pen stroke. */
export function DotPencilIcon({ size = 56, color = colors.text }: IconProps) {
  const h = (size / 56) * 44;
  return (
    <Svg width={size} height={h} viewBox="0 0 56 44">
      <Path d="M4 12 L14 22 L6 26 Z" fill={color} />
      <Path d="M13 21 Q 24 16 38 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Circle cx="46" cy="25.5" r="4" fill={color} />
    </Svg>
  );
}

/** IMPROVE: a dot with 3 small gold sparkles around it. */
export function DotSparklesIcon({ size = 52, color = colors.text, bgColor = colors.bg, accentColor = colors.accent700 }: IconProps) {
  const h = (size / 52) * 48;
  return (
    <Svg width={size} height={h} viewBox="0 0 52 48">
      <Circle cx="14" cy="28" r="9" fill={color} />
      <Circle cx="11" cy="25" r="1.8" fill={bgColor} opacity={0.5} />
      <Path d="M35 6l2 5.6L43 14l-6 2.4L35 22l-2-5.6L27 14l6-2.4L35 6z" fill={accentColor} />
      <Path d="M45 24l1 3L49 28l-3 1-1 3-1-3-3-1 3-1z" fill={accentColor} />
      <Path d="M27 32l0.8 2.3L30 35l-2.2 0.8L27 38l-0.8-2.2L24 35l2.2-0.7z" fill={accentColor} />
    </Svg>
  );
}

/** Improve screen hero: a dot mid-rewrite — a rough line becoming a smooth one. */
export function DotRewriteHero({ size = 120, color = colors.text, bgColor = colors.bg, accentColor = colors.accent700 }: IconProps) {
  const h = (size / 120) * 64;
  return (
    <Svg width={size} height={h} viewBox="0 0 120 64">
      <Circle cx="26" cy="38" r="14" fill={color} />
      <Circle cx="20" cy="32" r="2.6" fill={bgColor} opacity={0.5} />
      <Path d="M56 12 Q 74 8 92 16" fill="none" stroke={colors.divider} strokeWidth={3} strokeLinecap="round" />
      <Path d="M56 34 Q 76 28 96 34" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Path d="M58 3l1.6 4.4L64 9l-4.4 1.6L58 15l-1.6-4.4L52 9l4.4-1.6L58 3z" fill={accentColor} />
      <Path d="M100 24l1 2.8L104 28l-2.8 1L100 32l-1-2.8L96 28l2.8-1z" fill={accentColor} />
    </Svg>
  );
}

/** Scan screen hero: a dot holding a magnifying glass. */
export function DotMagnifierHero({ size = 96, color = colors.text, bgColor = colors.bg }: IconProps) {
  const h = (size / 96) * 88;
  return (
    <Svg width={size} height={h} viewBox="0 0 96 88">
      <Circle cx="22" cy="66" r="14" fill={color} />
      <Circle cx="16" cy="60" r="2.6" fill={bgColor} opacity={0.5} />
      <Line x1="32" y1="56" x2="56" y2="32" stroke={color} strokeWidth={5} strokeLinecap="round" />
      <Circle cx="68" cy="20" r="16" fill="none" stroke={color} strokeWidth={4} />
      <Path d="M60 12 A 11 11 0 0 1 74 10" fill="none" stroke={color} strokeWidth={2} opacity={0.4} strokeLinecap="round" />
    </Svg>
  );
}

/** Empty-notes-list illustration: bookshelf with a jumping dot. */
export function BookshelfEmptyIcon({ size = 84, color = colors.text, bgColor = colors.bg, dividerColor = colors.divider }: IconProps & { dividerColor?: string }) {
  const h = (size / 84) * 56;
  return (
    <Svg width={size} height={h} viewBox="0 0 84 56">
      <Line x1="8" y1="46" x2="76" y2="46" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x="14" y="28" width="8" height="18" rx="1" fill="none" stroke={dividerColor} strokeWidth={1.6} />
      <Rect x="27" y="20" width="8" height="26" rx="1" fill="none" stroke={dividerColor} strokeWidth={1.6} />
      <Rect x="40" y="32" width="8" height="14" rx="1" fill="none" stroke={dividerColor} strokeWidth={1.6} />
      <Rect x="53" y="24" width="8" height="22" rx="1" fill="none" stroke={dividerColor} strokeWidth={1.6} />
      <Circle cx="31" cy="9" r="6" fill={color} />
      <Circle cx="28.5" cy="7" r="1.4" fill={bgColor} opacity={0.5} />
    </Svg>
  );
}
