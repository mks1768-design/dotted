import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, radii } from '../theme/tokens';

export function Hr({ style }: { style?: ViewStyle }) {
  return <View style={[styles.hr, style]} />;
}

export function Tag({
  label,
  variant = 'outline',
}: {
  label: string;
  variant?: 'outline' | 'accent';
}) {
  return (
    <View style={[styles.tag, variant === 'accent' ? styles.tagAccent : styles.tagOutline]}>
      <Text style={[styles.tagText, variant === 'accent' && { color: colors.accent700 }]}>{label}</Text>
    </View>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  block,
  icon,
  style,
  loading,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'destructive' && styles.btnDestructive,
        block && { width: '100%' },
        (disabled || loading) && { opacity: 0.4 },
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'destructive' ? colors.bg : colors.text} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.btnText,
              variant === 'primary' && { color: colors.bg },
              variant === 'secondary' && { color: colors.text },
              variant === 'ghost' && { color: colors.neutral700 },
              variant === 'destructive' && { color: colors.bg },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <View style={[styles.seg, disabled && { opacity: 0.4, pointerEvents: 'none' }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active, disabled }}
            onPress={() => onChange(opt.value)}
            style={[styles.segOpt, active && styles.segOptActive]}
          >
            <Text style={[styles.segOptText, active && styles.segOptTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Card({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        styles.card,
        hovered && { borderColor: colors.accent300 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  tagOutline: {
    borderWidth: 1,
    borderColor: colors.divider,
  },
  tagAccent: {
    backgroundColor: colors.accent100,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.tag,
    color: colors.neutral700,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  btnPrimary: {
    backgroundColor: colors.text,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.text,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDestructive: {
    backgroundColor: colors.danger,
  },
  btnText: {
    fontFamily: fonts.body,
    fontSize: 15,
  },
  seg: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    padding: 3,
    gap: 2,
  },
  segOpt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  segOptActive: {
    backgroundColor: colors.text,
  },
  segOptText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral700,
  },
  segOptTextActive: {
    color: colors.bg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: 14,
    backgroundColor: colors.bg,
    gap: 6,
  },
});
