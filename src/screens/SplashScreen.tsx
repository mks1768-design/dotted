import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, shadows } from '../theme/tokens';

// One driving value (0→1) over the whole dot entrance: rolls in at its
// actual size (no zoom), drawing a line behind it as it travels — like a
// pen stroke with the dot as its own trailing period — then arrives with a
// few real bouncing-ball hops of decreasing height, landing back on that
// same line each time. Squash on landing, stretch at each arc's peak
// (classic squash & stretch — what makes a bounce read as physical).
const TOTAL_MS = 1300;
const ROLL_FRACTION = 0.538; // 700ms of the 1300ms total
const ROLL_DISTANCE = 150;

// t: 0 through end of roll, then three decreasing bounces, then settled.
const T = [0, 0.538, 0.588, 0.638, 0.688, 0.738, 0.773, 0.807, 0.842, 0.877, 0.9, 0.923, 0.946, 0.969, 1.0];
const BOUNCE_Y = [0, 0, -11.3, -16, -11.3, 0, -4.95, -7, -4.95, 0, -2.12, -3, -2.12, 0, 0];
const SQUASH_Y = [1, 1, 1.05, 1.08, 1.05, 0.78, 1.03, 1.05, 1.02, 0.87, 1.02, 1.03, 1.01, 0.94, 1];
const SQUASH_X = [1, 1, 0.97, 0.95, 0.97, 1.15, 0.99, 0.97, 0.99, 1.08, 0.99, 0.98, 0.995, 1.04, 1];

const ROLL_T = [0, 0.135, 0.27, 0.405, ROLL_FRACTION, 1.0];
const ROLL_X = [-ROLL_DISTANCE, -110, -72, -38, -15, 0];
const ROLL_ROTATE = ['0deg', '160deg', '320deg', '480deg', '620deg', '780deg'];
// The line's right edge trails the dot's own travel exactly (dot's offset + full distance).
const LINE_WIDTH = ROLL_X.map((x) => x + ROLL_DISTANCE);

const WORD_DELAY = 1220;
const WORD_DURATION = 550;

export function SplashScreen() {
  const { skipSplash } = useNotes();
  // useNativeDriver: false — the trailing line animates `width`, which the
  // native driver can't touch, so it has to share a JS-driven clock with
  // the dot's transform-based properties to stay in lockstep.
  const t = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordTranslate = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: TOTAL_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.sequence([
      Animated.delay(WORD_DELAY),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: false }),
        Animated.timing(wordTranslate, { toValue: 0, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: false }),
      ]),
    ]).start();
  }, [t, wordOpacity, wordTranslate]);

  const translateX = t.interpolate({ inputRange: ROLL_T, outputRange: ROLL_X });
  const rotate = t.interpolate({ inputRange: ROLL_T, outputRange: ROLL_ROTATE });
  const lineWidth = t.interpolate({ inputRange: ROLL_T, outputRange: LINE_WIDTH });
  const translateY = t.interpolate({ inputRange: T, outputRange: BOUNCE_Y });
  const squashY = t.interpolate({ inputRange: T, outputRange: SQUASH_Y });
  const squashX = t.interpolate({ inputRange: T, outputRange: SQUASH_X });

  return (
    <Pressable style={styles.container} onPress={skipSplash} accessibilityRole="button" accessibilityLabel="Skip splash">
      <View style={styles.stage}>
        <Animated.View style={[styles.line, { width: lineWidth, transform: [{ translateX: -ROLL_DISTANCE }] }]} />
        <Animated.View
          style={[styles.dotWrapper, { transform: [{ translateX }, { translateY }, { rotate }, { scaleY: squashY }, { scaleX: squashX }] }]}
        >
          <View style={styles.dot} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.wordmark, { opacity: wordOpacity, transform: [{ translateY: wordTranslate }] }]}>dotted</Animated.Text>
    </Pressable>
  );
}

const DOT_SIZE = 88;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    backgroundColor: colors.bg,
  },
  stage: {
    width: '100%',
    height: DOT_SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotWrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -DOT_SIZE / 2,
    marginTop: -DOT_SIZE / 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.text,
    ...shadows.md,
  },
  line: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginTop: DOT_SIZE / 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.divider,
  },
  wordmark: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.splashWordmark,
    color: colors.text,
    letterSpacing: 0.3,
  },
});
