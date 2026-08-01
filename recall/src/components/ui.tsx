import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HeartIcon } from '../icons';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'success' | 'danger';
}) {
  const bg = disabled ? colors.border : tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={styles.secondaryButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

export function HeartsRow({ hearts, max = 5 }: { hearts: number; max?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <HeartIcon key={i} size={18} filled={i < hearts} color={colors.danger} />
      ))}
    </View>
  );
}

export function Pill({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      {icon}
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: spacing.tapTarget + 4,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.gapStacked,
    ...shadows.sm,
  },
  buttonLabel: {
    color: colors.onPrimary,
    fontSize: fontSizes.body,
    fontWeight: '800',
  },
  secondaryButton: {
    height: spacing.tapTarget,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.gapStacked,
    backgroundColor: colors.neutral200,
  },
  secondaryButtonLabel: {
    color: colors.text,
    fontSize: fontSizes.body,
    fontWeight: '700',
  },
  progressTrack: {
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.neutral200,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  pillLabel: {
    fontSize: fontSizes.smallLabel,
    fontWeight: '800',
    color: colors.text,
  },
});
