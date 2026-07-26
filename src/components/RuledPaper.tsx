import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

const LINE_GAP = 26;

/** Notebook-style horizontal rules behind the editor's flat-color body text. */
export function RuledPaper({ tint }: { tint: string }) {
  const [height, setHeight] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);
  const count = Math.ceil(height / LINE_GAP);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: tint, pointerEvents: 'none' }]} onLayout={onLayout}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.line, { top: (i + 1) * LINE_GAP }]} />
      ))}
    </View>
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
});
