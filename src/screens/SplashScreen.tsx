import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, shadows } from '../theme/tokens';

// One driving value (0→1) over the whole dot entrance: rolls in zoomed-in
// from the left, then — instead of a single hard "stamp" — settles with a
// few real bouncing-ball hops of decreasing height, squashing on each
// landing and stretching at each arc's peak (classic squash & stretch,
// what makes a bounce read as physical rather than a mechanical tween).
const TOTAL_MS = 1300;
const ROLL_FRACTION = 0.538; // 700ms of the 1300ms total

// t: 0 through end of roll, then three decreasing bounces, then settled.
const T = [0, 0.538, 0.588, 0.638, 0.688, 0.738, 0.773, 0.807, 0.842, 0.877, 0.9, 0.923, 0.946, 0.969, 1.0];
const BOUNCE_Y = [0, 0, -11.3, -16, -11.3, 0, -4.95, -7, -4.95, 0, -2.12, -3, -2.12, 0, 0];
const SQUASH_Y = [1, 1, 1.05, 1.08, 1.05, 0.78, 1.03, 1.05, 1.02, 0.87, 1.02, 1.03, 1.01, 0.94, 1];
const SQUASH_X = [1, 1, 0.97, 0.95, 0.97, 1.15, 0.99, 0.97, 0.99, 1.08, 0.99, 0.98, 0.995, 1.04, 1];

const ROLL_T = [0, 0.135, 0.27, 0.405, ROLL_FRACTION, 1.0];
const ROLL_X = [-150, -110, -72, -38, -15, 0];
const ROLL_ROTATE = ['0deg', '160deg', '320deg', '480deg', '620deg', '780deg'];
const ROLL_ZOOM = [2.8, 2.2, 1.7, 1.25, 1.0, 1.0];

const WORD_DELAY = 1220;
const WORD_DURATION = 550;

export function SplashScreen() {
  const { skipSplash } = useNotes();
  const t = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordTranslate = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: TOTAL_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(WORD_DELAY),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(wordTranslate, { toValue: 0, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    ]).start();
  }, [t, wordOpacity, wordTranslate]);

  const translateX = t.interpolate({ inputRange: ROLL_T, outputRange: ROLL_X });
  const rotate = t.interpolate({ inputRange: ROLL_T, outputRange: ROLL_ROTATE });
  const zoomScale = t.interpolate({ inputRange: ROLL_T, outputRange: ROLL_ZOOM });
  const translateY = t.interpolate({ inputRange: T, outputRange: BOUNCE_Y });
  const squashY = t.interpolate({ inputRange: T, outputRange: SQUASH_Y });
  const squashX = t.interpolate({ inputRange: T, outputRange: SQUASH_X });

  return (
    <Pressable style={styles.container} onPress={skipSplash} accessibilityRole="button" accessibilityLabel="Skip splash">
      <Animated.View
        style={[
          styles.dot,
          { transform: [{ translateX }, { translateY }, { rotate }, { scale: zoomScale }, { scaleY: squashY }, { scaleX: squashX }] },
        ]}
      />
      <Animated.Text style={[styles.wordmark, { opacity: wordOpacity, transform: [{ translateY: wordTranslate }] }]}>dotted</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    backgroundColor: colors.bg,
  },
  dot: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.text,
    ...shadows.md,
  },
  wordmark: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.splashWordmark,
    color: colors.text,
    letterSpacing: 0.3,
  },
});
