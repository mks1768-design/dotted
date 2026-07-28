import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors, library } from '../theme/tokens';

// Flat scene illustrations — the dot character in a stylized library.
// Deliberately bolder and simpler than the line-drawn marks in ../icons:
// big filled shapes, no outlines, layered depth. The icons are the app's
// signage; these are its scenery.

/** One book, standing upright or leaning, with a thin spine highlight. */
function Book({
  x,
  base,
  w,
  h,
  color,
  tilt = 0,
}: {
  x: number;
  base: number;
  w: number;
  h: number;
  color: string;
  tilt?: number;
}) {
  return (
    <G transform={`translate(${x} ${base}) rotate(${tilt})`}>
      <Rect x={-w / 2} y={-h} width={w} height={h} rx={1} fill={color} />
      <Rect x={-w / 2 + w * 0.26} y={-h} width={Math.max(1, w * 0.16)} height={h} fill="#ffffff" opacity={0.16} />
    </G>
  );
}

/** A book lying flat, as the top of a short stack. */
function FlatBook({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return <Rect x={x - w / 2} y={y} width={w} height={h} rx={1.2} fill={color} />;
}

/** A small potted plant — the library's stand-in for the forest's grass tufts. */
function Plant({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  const potW = 12 * s;
  const potH = 9 * s;
  return (
    <G>
      <Path d={`M${x - potW / 2} ${base - potH} h ${potW} l -1.6 ${potH} h -${potW - 3.2} Z`} fill={library.plantPot} />
      <Path
        d={`M${x} ${base - potH} q ${-2 * s} ${-11 * s} ${-8 * s} ${-14 * s} q ${5 * s} ${-1 * s} ${8 * s} ${5 * s} q ${1 * s} ${-8 * s} ${1 * s} ${-13 * s} q ${3 * s} ${5 * s} ${2 * s} ${13 * s} q ${4 * s} ${-5 * s} ${8 * s} ${-3 * s} q ${-4 * s} ${4 * s} ${-3 * s} ${12 * s} Z`}
        fill={library.plantLeaf}
      />
    </G>
  );
}

/** The dot, standing quietly — no face for now, just the mark itself. */
function DotCharacter({ cx, base, r, face = false }: { cx: number; base: number; r: number; face?: boolean }) {
  const cy = base - r;
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={colors.text} />
      {face && (
        <G>
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
      )}
    </G>
  );
}

/** One shelf's worth of books — hand-placed, not looped, so the row reads as tidied-but-lived-in. */
function ShelfRow({ y, books }: { y: number; books: { x: number; w: number; h: number; color: string; tilt?: number }[] }) {
  return (
    <G>
      {books.map((b, i) => (
        <Book key={i} x={b.x} base={y} w={b.w} h={b.h} color={b.color} tilt={b.tilt} />
      ))}
    </G>
  );
}

const B = library.books;

/**
 * Wide scenic band for the bottom of Home. Composed bottom-heavy on purpose:
 * rendered with preserveAspectRatio="xMidYMax slice" it fills the width and
 * crops from the top, so it reads as a nook no matter the screen size.
 */
export function LibraryScene({ height = 168 }: { height?: number | string }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 320 150" preserveAspectRatio="xMidYMax slice">
      <Rect x={0} y={0} width={320} height={150} fill={library.wall} />

      {/* Shelf unit */}
      <Rect x={14} y={12} width={292} height={98} rx={6} fill={library.shelfFrame} />
      <Rect x={20} y={18} width={280} height={86} fill={library.shelfBack} />
      <Rect x={16} y={46} width={288} height={4} fill={library.shelfBoard} />
      <Rect x={16} y={76} width={288} height={4} fill={library.shelfBoard} />

      {/* Row 1 */}
      <ShelfRow
        y={45}
        books={[
          { x: 30, w: 8, h: 22, color: B[0] },
          { x: 40, w: 7, h: 25, color: B[1] },
          { x: 49, w: 9, h: 20, color: B[2] },
          { x: 60, w: 7, h: 24, color: B[3], tilt: 6 },
          { x: 90, w: 8, h: 26, color: B[4] },
          { x: 99, w: 8, h: 26, color: B[4] },
          { x: 108, w: 8, h: 22, color: B[5] },
          { x: 220, w: 9, h: 24, color: B[2] },
          { x: 230, w: 7, h: 21, color: B[0] },
          { x: 239, w: 8, h: 25, color: B[3] },
          { x: 270, w: 8, h: 20, color: B[5], tilt: -5 },
          { x: 280, w: 9, h: 24, color: B[1] },
          { x: 291, w: 7, h: 22, color: B[4] },
        ]}
      />

      {/* Row 2 */}
      <ShelfRow
        y={75}
        books={[
          { x: 32, w: 9, h: 24, color: B[3] },
          { x: 42, w: 8, h: 21, color: B[5] },
          { x: 52, w: 7, h: 25, color: B[0], tilt: -6 },
          { x: 150, w: 8, h: 23, color: B[2] },
          { x: 160, w: 8, h: 26, color: B[1] },
          { x: 169, w: 9, h: 20, color: B[4] },
          { x: 178, w: 7, h: 24, color: B[0] },
          { x: 250, w: 8, h: 22, color: B[5] },
          { x: 260, w: 9, h: 25, color: B[3] },
          { x: 270, w: 7, h: 20, color: B[2] },
        ]}
      />
      <FlatBook x={210} y={70} w={26} h={5} color={B[1]} />
      <FlatBook x={210} y={65} w={20} h={5} color={B[4]} />

      {/* Row 3 (foreground, bigger) */}
      <ShelfRow
        y={103}
        books={[
          { x: 34, w: 10, h: 26, color: B[1] },
          { x: 45, w: 9, h: 29, color: B[2] },
          { x: 56, w: 10, h: 24, color: B[0], tilt: 5 },
          { x: 130, w: 9, h: 27, color: B[3] },
          { x: 140, w: 10, h: 23, color: B[5] },
          { x: 151, w: 9, h: 28, color: B[4] },
          { x: 245, w: 10, h: 25, color: B[2] },
          { x: 256, w: 9, h: 29, color: B[0] },
          { x: 267, w: 10, h: 23, color: B[3], tilt: -5 },
        ]}
      />

      {/* Floor + rug */}
      <Rect x={0} y={110} width={320} height={40} fill={library.wall} />
      <Path d="M50 122 Q 160 112 270 122 L 270 146 Q 160 154 50 146 Z" fill={library.rug} />
      <Path d="M58 128 Q 160 121 262 128" fill="none" stroke={library.rugAccent} strokeWidth={2} opacity={0.55} />
      <Path d="M58 138 Q 160 145 262 138" fill="none" stroke={library.rugAccent} strokeWidth={2} opacity={0.55} />

      <Plant x={286} base={140} s={1.1} />
      <Plant x={38} base={139} s={0.85} />

      {/* The dot, standing on the rug */}
      <DotCharacter cx={160} base={136} r={18} />
    </Svg>
  );
}

/**
 * Compact square-ish scene for empty states — the same reading nook, framed
 * tighter so it works at icon scale.
 */
export function LibraryNook({ width = 190 }: { width?: number }) {
  const h = (width / 190) * 130;
  return (
    <Svg width={width} height={h} viewBox="0 0 190 130">
      <Rect x={0} y={0} width={190} height={130} fill={library.wall} />

      <Rect x={10} y={10} width={170} height={78} rx={5} fill={library.shelfFrame} />
      <Rect x={15} y={15} width={160} height={68} fill={library.shelfBack} />
      <Rect x={12} y={35} width={166} height={3.4} fill={library.shelfBoard} />
      <Rect x={12} y={60} width={166} height={3.4} fill={library.shelfBoard} />

      <ShelfRow
        y={34}
        books={[
          { x: 24, w: 6, h: 16, color: B[0] },
          { x: 32, w: 6, h: 18, color: B[1] },
          { x: 40, w: 5, h: 14, color: B[2] },
          { x: 130, w: 6, h: 17, color: B[3] },
          { x: 139, w: 6, h: 15, color: B[4] },
          { x: 148, w: 5, h: 18, color: B[5], tilt: -5 },
        ]}
      />
      <ShelfRow
        y={59}
        books={[
          { x: 26, w: 6, h: 17, color: B[4] },
          { x: 35, w: 5, h: 14, color: B[5] },
          { x: 100, w: 6, h: 18, color: B[2] },
          { x: 109, w: 6, h: 15, color: B[0] },
          { x: 150, w: 6, h: 17, color: B[1] },
          { x: 159, w: 5, h: 14, color: B[3] },
        ]}
      />
      <ShelfRow
        y={84}
        books={[
          { x: 22, w: 7, h: 19, color: B[1] },
          { x: 31, w: 6, h: 16, color: B[3], tilt: 5 },
          { x: 160, w: 7, h: 20, color: B[0] },
          { x: 170, w: 6, h: 17, color: B[4] },
        ]}
      />

      <Rect x={0} y={92} width={190} height={38} fill={library.wall} />
      <Path d="M30 100 Q 95 92 160 100 L 160 120 Q 95 127 30 120 Z" fill={library.rug} />

      <Plant x={170} base={119} s={0.75} />

      <DotCharacter cx={95} base={116} r={15} />
    </Svg>
  );
}
