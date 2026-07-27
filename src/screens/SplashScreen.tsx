import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, shadows } from '../theme/tokens';

const ROLL_DISTANCE = 130;
const ROLL_DURATION = 1050;
const STAMP_DURATION = 260;
const WORD_DELAY = ROLL_DURATION + 60;
const WORD_DURATION = 550;

export function SplashScreen() {
  const { skipSplash } = useNotes();
  const rollAnim = useRef(new Animated.Value(0)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordTranslate = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.sequence([
      // The dot starts zoomed in close, rolls in from the left, and shrinks
      // down to its resting size as it travels — arriving like a period
      // stamped at the end of a line.
      Animated.timing(rollAnim, {
        toValue: 1,
        duration: ROLL_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(stampAnim, {
        toValue: 1,
        duration: STAMP_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(WORD_DELAY),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(wordTranslate, { toValue: 0, duration: WORD_DURATION, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    ]).start();
  }, [rollAnim, stampAnim, wordOpacity, wordTranslate]);

  const translateX = rollAnim.interpolate({ inputRange: [0, 1], outputRange: [-ROLL_DISTANCE, 0] });
  const rotate = rollAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  const zoomScale = rollAnim.interpolate({ inputRange: [0, 1], outputRange: [3.1, 1] });
  const stampScaleX = stampAnim.interpolate({ inputRange: [0, 0.35, 1], outputRange: [1, 1.22, 1] });
  const stampScaleY = stampAnim.interpolate({ inputRange: [0, 0.35, 1], outputRange: [1, 0.68, 1] });

  return (
    <Pressable style={styles.container} onPress={skipSplash} accessibilityRole="button" accessibilityLabel="Skip splash">
      <Animated.View
        style={[
          styles.dot,
          { transform: [{ translateX }, { rotate }, { scale: zoomScale }, { scaleX: stampScaleX }, { scaleY: stampScaleY }] },
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
