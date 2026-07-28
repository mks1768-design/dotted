import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PaperDecoration } from '../config/paperStyles';
import { colors, paperRuleGap } from '../theme/tokens';

const LINE_GAP = 26;

/** The ruled lines alone, to lay inside any paper-stock surface (home rows,
 * note cards, board pins). Sizes itself to its parent and never takes touches,
 * so whatever is rendered after it stays interactive and sits on top. */
export function PaperRules({ gap = paperRuleGap }: { gap?: number }) {
  const [height, setHeight] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);
  const count = Math.max(0, Math.ceil(height / gap) - 1);

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} onLayout={onLayout}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.paperRule, { top: (i + 1) * gap }]} />
      ))}
    </View>
  );
}

/** Notebook-style horizontal rules behind the editor's flat-color body text,
 * with an optional dot-character watermark for the character paper styles. */
export function RuledPaper({ tint, decoration }: { tint: string; decoration?: PaperDecoration }) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout);
  const count = Math.ceil(layout.height / LINE_GAP);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: tint, pointerEvents: 'none' }]} onLayout={onLayout}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.line, { top: (i + 1) * LINE_GAP }]} />
      ))}
      {decoration && layout.width > 0 && <DotWatermark decoration={decoration} width={layout.width} height={layout.height} />}
    </View>
  );
}

function DotWatermark({ decoration, width, height }: { decoration: PaperDecoration; width: number; height: number }) {
  if (decoration === 'scatter') {
    const dots = [
      { cx: width * 0.82, cy: height * 0.12, r: 5 },
      { cx: width * 0.9, cy: height * 0.24, r: 3 },
      { cx: width * 0.7, cy: height * 0.62, r: 4 },
      { cx: width * 0.14, cy: height * 0.78, r: 6 },
      { cx: width * 0.25, cy: height * 0.68, r: 3 },
    ];
    return (
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {dots.map((d, i) => (
          <Circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={colors.text} opacity={0.1} />
        ))}
      </Svg>
    );
  }
  // 'dot' — a single large, quiet mark low in the corner.
  const r = Math.min(width, height) * 0.22;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Circle cx={width - r * 0.6} cy={height - r * 0.6} r={r} fill={colors.text} opacity={0.06} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  paperRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.paperRule,
  },
});
