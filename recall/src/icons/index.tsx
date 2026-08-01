import React from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { colors } from '../theme/tokens';

export type IconProps = {
  size?: number;
  color?: string;
};

export function ChevronLeftIcon({ size = 22, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function PlusIcon({ size = 22, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function CheckIcon({ size = 22, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function XIcon({ size = 22, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <Path d="M10 11v6" />
      <Path d="M14 11v6" />
      <Path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Svg>
  );
}

/** Filled when the heart is still available, outlined once it's lost. */
export function HeartIcon({ size = 22, color = colors.danger, filled = true }: IconProps & { filled?: boolean }) {
  const d = 'M12 21s-7.5-4.6-10-9.1C.6 8.6 2.3 5 6 5c2 0 3.5 1.1 4 2.6C10.5 6.1 12 5 14 5c3.7 0 5.4 3.6 4 6.9C19.5 16.4 12 21 12 21z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  );
}

export function FlameIcon({ size = 20, color = colors.streak }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M12 2c1 3-2 4.2-2 7a2 2 0 0 0 4 0c1.5 1 2 2.8 2 4.2A6 6 0 1 1 8.5 9.4C10 8.4 11.3 6 12 2z" />
    </Svg>
  );
}

export function BoltIcon({ size = 18, color = colors.xp }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </Svg>
  );
}

const GEAR_PATH =
  'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z';

/** Outline when inactive, solid when the tab is selected — see tab bar. */
export function GearIcon({ size = 20, color = colors.text, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" fill={filled ? colors.surface : 'none'} />
      <Path d={GEAR_PATH} />
    </Svg>
  );
}

export function CardsIcon({ size = 28, color = colors.primary, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <Path d="M8 3.5h9a2 2 0 0 1 2 2V17" fill="none" />
      <Circle cx="12" cy="12" r="2.5" fill={filled ? colors.surface : 'none'} />
    </Svg>
  );
}

/** Outline when inactive, solid when the tab is selected — see tab bar. */
export function HomeIcon({ size = 22, color = colors.text, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <Path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6.5h-5V21H5a1 1 0 0 1-1-1z" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 11.5 12 4l8 7.5" />
      <Path d="M5.5 10v10a1 1 0 0 0 1 1H17.5a1 1 0 0 0 1-1V10" />
      <Path d="M9.5 21v-6.5h5V21" />
    </Svg>
  );
}
