import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, shadows } from '../theme/tokens';

export function SplashScreen() {
  const { skipSplash } = useNotes();
  const dropAnim = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordTranslate = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(0),
      Animated.timing(dropAnim, {
        toValue: 1,
        duration: 1100,
        easing: Easing.bezier(0.32, 1.6, 0.5, 1),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(wordTranslate, { toValue: 0, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
    ]).start();
  }, [dropAnim, wordOpacity, wordTranslate]);

  const translateY = dropAnim.interpolate({
    inputRange: [0, 0.55, 0.7, 0.85, 1],
    outputRange: [-140, 0, -18, 0, 0],
  });
  const scale = dropAnim.interpolate({
    inputRange: [0, 0.55, 0.7, 0.85, 1],
    outputRange: [0.9, 1, 1.03, 0.98, 1],
  });

  return (
    <Pressable style={styles.container} onPress={skipSplash} accessibilityRole="button" accessibilityLabel="Skip splash">
      <Animated.View style={[styles.dot, { transform: [{ translateY }, { scale }] }]} />
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
