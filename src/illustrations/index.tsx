import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors, forest } from '../theme/tokens';

// Flat scene illustrations — the dot character out in a stylized forest.
// Deliberately bolder and simpler than the line-drawn marks in ../icons:
// big filled shapes, no outlines, layered depth. The icons are the app's
// signage; these are its scenery.

/** Rounded-triangle conifer — the workhorse tree. */
function Pine({ x, base, s = 1, fill }: { x: number; base: number; s?: number; fill: string }) {
  const w = 16 * s;
  const h = 42 * s;
  const top = base - h;
  const canopyBase = base - 7 * s;
  return (
    <G>
      <Rect x={x - 2.4 * s} y={base - 13 * s} width={4.8 * s} height={13 * s} rx={2.4 * s} fill={forest.trunk} />
      <Path
        d={
          `M${x} ${top} ` +
          `C ${x + w} ${top + h * 0.62}, ${x + w * 0.8} ${canopyBase}, ${x} ${canopyBase} ` +
          `C ${x - w * 0.8} ${canopyBase}, ${x - w} ${top + h * 0.62}, ${x} ${top} Z`
        }
        fill={fill}
      />
    </G>
  );
}

/** Cluster-of-circles broadleaf, optionally carrying a couple of gold berries. */
function Broadleaf({
  x,
  base,
  s = 1,
  fill,
  berries,
}: {
  x: number;
  base: number;
  s?: number;
  fill: string;
  berries?: boolean;
}) {
  const r = 13 * s;
  const cy = base - 16 * s - r * 0.45;
  return (
    <G>
      <Rect x={x - 2.6 * s} y={base - 17 * s} width={5.2 * s} height={17 * s} rx={2.6 * s} fill={forest.trunk} />
      <Circle cx={x - r * 0.76} cy={cy + r * 0.44} r={r * 0.68} fill={fill} />
      <Circle cx={x + r * 0.76} cy={cy + r * 0.4} r={r * 0.72} fill={fill} />
      <Circle cx={x} cy={cy} r={r} fill={fill} />
      {berries && (
        <G>
          <Circle cx={x - r * 0.42} cy={cy - r * 0.12} r={2.1 * s} fill={colors.accent} />
          <Circle cx={x + r * 0.52} cy={cy + r * 0.34} r={1.8 * s} fill={colors.accent} />
        </G>
      )}
    </G>
  );
}

/** A tuft of grass — three quick blades. */
function Grass({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <Path
      d={
        `M${x} ${base} q ${-1.5 * s} ${-4 * s} ${-4 * s} ${-6 * s} ` +
        `M${x} ${base} q 0 ${-5 * s} 0 ${-7.5 * s} ` +
        `M${x} ${base} q ${1.5 * s} ${-4 * s} ${4 * s} ${-6 * s}`
      }
      fill="none"
      stroke={forest.leafDeep}
      strokeWidth={1.6 * s}
      strokeLinecap="round"
      opacity={0.5}
    />
  );
}

/** The dot, up close and unmistakably a face: two eyes and a smile. */
function DotCharacter({ cx, base, r }: { cx: number; base: number; r: number }) {
  const cy = base - r;
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={colors.text} />
      <Circle cx={cx - r * 0.34} cy={cy - r * 0.14} r={r * 0.15} fill={colors.bg} />
      <Circle cx={cx + r * 0.34} cy={cy - r * 0.14} r={r * 0.15} fill={colors.bg} />
      <Path
        d={`M${cx - r * 0.33} ${cy + r * 0.24} Q ${cx} ${cy + r * 0.66} ${cx + r * 0.33} ${cy + r * 0.24}`}
        fill="none"
        stroke={colors.bg}
        strokeWidth={r * 0.11}
        strokeLinecap="round"
      />
    </G>
  );
}

/**
 * Wide scenic band for the bottom of Home. Composed bottom-heavy on purpose:
 * rendered with preserveAspectRatio="xMidYMax slice" it fills the width and
 * crops from the top, so it reads as a horizon no matter the screen size.
 */
export function ForestScene({ height = 168 }: { height?: number | string }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 320 150" preserveAspectRatio="xMidYMax slice">
      {/* Rolling ground, back to front */}
      <Path d="M0 104 Q 48 78 104 98 Q 150 114 196 94 Q 250 72 320 100 L320 150 L0 150 Z" fill={forest.hillBack} />
      <Path d="M0 122 Q 70 108 140 120 Q 220 133 320 118 L320 150 L0 150 Z" fill={forest.hillMid} />

      {/* Distant treeline, sitting on the back hill */}
      <Pine x={30} base={101} s={0.62} fill={forest.leafMid} />
      <Broadleaf x={66} base={100} s={0.5} fill={forest.leafLight} />
      <Pine x={250} base={94} s={0.55} fill={forest.leafMid} />
      <Pine x={276} base={99} s={0.68} fill={forest.leafLight} />
      <Broadleaf x={303} base={101} s={0.52} fill={forest.leafMid} />

      {/* Front ground */}
      <Path d="M0 134 Q 80 126 160 132 Q 240 138 320 130 L320 150 L0 150 Z" fill={forest.ground} />

      {/* Framing trees, big and dark so the middle stays open */}
      <Pine x={28} base={137} s={1.35} fill={forest.leafDeep} />
      <Broadleaf x={66} base={139} s={0.85} fill={forest.leafMid} berries />
      <Broadleaf x={288} base={138} s={1.15} fill={forest.leafDeep} berries />
      <Pine x={252} base={140} s={0.8} fill={forest.leafMid} />

      {/* The dot, standing in the clearing */}
      <DotCharacter cx={160} base={136} r={19} />

      <Grass x={112} base={141} s={1} />
      <Grass x={205} base={140} s={0.85} />
      <Grass x={186} base={146} s={0.7} />
    </Svg>
  );
}

/**
 * Compact square-ish scene for empty states — the same clearing, framed
 * tighter so it works at icon scale.
 */
export function ForestGrove({ width = 190 }: { width?: number }) {
  const h = (width / 190) * 130;
  return (
    <Svg width={width} height={h} viewBox="0 0 190 130">
      <Path d="M0 88 Q 40 68 92 84 Q 140 96 190 80 L190 130 L0 130 Z" fill={forest.hillBack} />
      <Path d="M0 104 Q 55 92 110 102 Q 155 110 190 100 L190 130 L0 130 Z" fill={forest.hillMid} />

      <Pine x={22} base={87} s={0.5} fill={forest.leafMid} />
      <Broadleaf x={168} base={86} s={0.48} fill={forest.leafLight} />

      <Path d="M0 114 Q 60 107 118 112 Q 158 115 190 110 L190 130 L0 130 Z" fill={forest.ground} />

      <Pine x={26} base={117} s={1.05} fill={forest.leafDeep} />
      <Broadleaf x={162} base={118} s={0.9} fill={forest.leafDeep} berries />
      <Broadleaf x={58} base={119} s={0.6} fill={forest.leafMid} />

      <DotCharacter cx={104} base={116} r={16} />

      <Grass x={78} base={121} s={0.8} />
      <Grass x={132} base={120} s={0.7} />
    </Svg>
  );
}
