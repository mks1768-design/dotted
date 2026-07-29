import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { PaperRules } from './RuledPaper';
import { colors, fonts, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function Hr({ style }: { style?: ViewStyle }) {
  return <View style={[styles.hr, style]} />;
}

/** Tracks whether a field has focus, so the surface around it can show a ring.
 * Spread the handlers onto the TextInput and style on `focused`. */
export function useFocusRing() {
  const [focused, setFocused] = React.useState(false);
  return {
    focused,
    handlers: { onFocus: () => setFocused(true), onBlur: () => setFocused(false) },
  };
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
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'destructive' ? colors.surface : colors.text} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.btnText,
              variant === 'primary' && { color: colors.surface },
              variant === 'secondary' && { color: colors.text },
              variant === 'ghost' && { color: colors.neutral700 },
              variant === 'destructive' && { color: colors.surface },
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

/** A note as a sheet of paper on the desk: paper stock, printed rules, and a
 * lift shadow. `PaperRules` renders first so the content sits over the lines. */
export function Card({
  children,
  onPress,
  style,
  accessibilityLabel,
  actions,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /** Secondary buttons pinned to the card's top right. Rendered above the tap
   * layer so they stay independently clickable. */
  actions?: React.ReactNode;
}) {
  const [active, setActive] = React.useState(false);

  // The card is a plain View and the whole-card tap is a Pressable laid over the
  // content. Making the card itself the button would nest `actions`' buttons
  // inside it, which is invalid HTML and confuses screen readers.
  return (
    <View style={[styles.card, active && styles.cardActive, style]}>
      <PaperRules />
      {children}
      {onPress && (
        <Pressable
          onPress={onPress}
          onPressIn={() => setActive(true)}
          onPressOut={() => setActive(false)}
          onHoverIn={() => setActive(true)}
          onHoverOut={() => setActive(false)}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={StyleSheet.absoluteFill}
        />
      )}
      {actions}
    </View>
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
    minHeight: spacing.tapTarget,
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
    borderColor: colors.border,
    borderRadius: radii.pill,
    padding: 3,
    gap: 2,
  },
  segOpt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    minHeight: spacing.tapTarget - 8, // + the 3pt container padding on each side
    borderRadius: radii.pill,
  },
  segOptActive: {
    backgroundColor: colors.accent700,
  },
  segOptText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.neutral700,
  },
  segOptTextActive: {
    color: colors.surface,
  },
  card: {
    borderRadius: radii.paper,
    padding: 16,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    gap: 6,
    ...shadows.paper,
  },
  cardActive: { backgroundColor: colors.neutral100 },
});
