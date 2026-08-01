import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { ReminderInterval } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

const INTERVALS: { minutes: ReminderInterval; label: string }[] = [
  { minutes: 30, label: 'Every 30 min' },
  { minutes: 60, label: 'Every hour' },
  { minutes: 180, label: 'Every 3 hours' },
  { minutes: 360, label: 'Every 6 hours' },
];

export function SettingsScreen() {
  const { state, goHome, setRemindersEnabled, setReminderInterval } = useStudy();
  const { enabled, intervalMinutes } = state.reminders;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goHome} hitSlop={10} style={styles.backHit} accessibilityRole="button" accessibilityLabel="Back">
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Study reminders</Text>
              <Text style={styles.rowBody}>Get a notification with a card on it at a set interval.</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={enabled ? colors.primary : undefined}
            />
          </View>

          {enabled && (
            <View style={styles.intervalRow}>
              {INTERVALS.map((opt) => (
                <Pressable
                  key={opt.minutes}
                  onPress={() => setReminderInterval(opt.minutes)}
                  style={[styles.intervalPill, opt.minutes === intervalMinutes && styles.intervalPillSelected]}
                >
                  <Text style={[styles.intervalText, opt.minutes === intervalMinutes && styles.intervalTextSelected]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.topPadding,
    paddingBottom: spacing.gapTight,
  },
  backHit: { padding: 4 },
  title: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  content: { padding: spacing.screenPaddingH },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    gap: spacing.gapStacked,
    ...shadows.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.gapTight },
  rowTitle: { fontSize: fontSizes.body, fontWeight: '700', color: colors.text },
  rowBody: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 2 },
  intervalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  intervalPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.neutral200,
  },
  intervalPillSelected: { backgroundColor: colors.primary },
  intervalText: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.text },
  intervalTextSelected: { color: colors.onPrimary },
});
