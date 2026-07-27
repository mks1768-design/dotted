import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Matches the design handoff's `animation: fadeUp 0.3s ease-out both` on every
// screen — re-triggers whenever `transitionKey` changes (i.e. on every screen swap).
export function ScreenTransition({ transitionKey, children }: { transitionKey: string; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(6);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
    // transitionKey is the only thing that should re-fire this — opacity/translateY are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionKey]);

  return <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}
