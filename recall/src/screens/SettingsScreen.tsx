import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudy } from '../state/StudyContext';
import { ReminderMode } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

const FIXED_OPTIONS: { minutes: 30 | 60 | 180 | 360; label: string }[] = [
  { minutes: 30, label: 'Every 30 min' },
  { minutes: 60, label: 'Every hour' },
  { minutes: 180, label: 'Every 3 hours' },
  { minutes: 360, label: 'Every 6 hours' },
];

const RANDOM_PRESETS: { minMinutes: number; maxMinutes: number; label: string }[] = [
  { minMinutes: 30, maxMinutes: 120, label: 'Random, 30m–2h' },
  { minMinutes: 120, maxMinutes: 360, label: 'Random, 2h–6h' },
];

function sameMode(a: ReminderMode, b: ReminderMode): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'fixed' && b.type === 'fixed') return a.minutes === b.minutes;
  if (a.type === 'random' && b.type === 'random') return a.minMinutes === b.minMinutes && a.maxMinutes === b.maxMinutes;
  return a.type === 'off';
}

function modeSummary(mode: ReminderMode): string {
  if (mode.type === 'off') return 'Off';
  if (mode.type === 'fixed') return FIXED_OPTIONS.find((o) => o.minutes === mode.minutes)?.label ?? 'Fixed';
  return RANDOM_PRESETS.find((p) => p.minMinutes === mode.minMinutes && p.maxMinutes === mode.maxMinutes)?.label ?? 'Random';
}

export function SettingsScreen() {
  const { state, setDeckReminder } = useStudy();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>STUDY REMINDERS</Text>
        <Text style={styles.sectionBody}>Each deck can remind you on its own schedule — a fixed gap, or a random one so it stays fresh.</Text>

        {state.decks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Add a deck first to set up reminders.</Text>
          </View>
        ) : (
          <View style={{ gap: spacing.gapTight, marginTop: spacing.gapStacked }}>
            {state.decks.map((deck) => {
              const mode: ReminderMode = state.reminders[deck.id] ?? { type: 'off' };
              const expanded = expandedId === deck.id;
              return (
                <View key={deck.id} style={styles.card}>
                  <Pressable style={styles.row} onPress={() => setExpandedId(expanded ? null : deck.id)}>
                    <Text style={styles.deckEmoji}>{deck.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.deckName}>{deck.name}</Text>
                      <Text style={styles.deckMode}>{modeSummary(mode)}</Text>
                    </View>
                    <Text style={styles.chevron}>{expanded ? '˄' : '˅'}</Text>
                  </Pressable>

                  {expanded && (
                    <View style={styles.options}>
                      <OptionPill label="Off" selected={mode.type === 'off'} onPress={() => setDeckReminder(deck.id, { type: 'off' })} />
                      {FIXED_OPTIONS.map((opt) => (
                        <OptionPill
                          key={opt.minutes}
                          label={opt.label}
                          selected={sameMode(mode, { type: 'fixed', minutes: opt.minutes })}
                          onPress={() => setDeckReminder(deck.id, { type: 'fixed', minutes: opt.minutes })}
                        />
                      ))}
                      {RANDOM_PRESETS.map((preset) => (
                        <OptionPill
                          key={preset.label}
                          label={preset.label}
                          selected={sameMode(mode, { type: 'random', minMinutes: preset.minMinutes, maxMinutes: preset.maxMinutes })}
                          onPress={() => setDeckReminder(deck.id, { type: 'random', minMinutes: preset.minMinutes, maxMinutes: preset.maxMinutes })}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionPill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.screenPaddingH, paddingTop: spacing.topPadding, paddingBottom: 4 },
  title: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text },
  content: { padding: spacing.screenPaddingH, paddingBottom: 100 },
  sectionLabel: { fontSize: fontSizes.smallLabel, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.4 },
  sectionBody: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  empty: { marginTop: spacing.gapStacked, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.gapStacked, ...shadows.sm },
  emptyText: { color: colors.textMuted, fontSize: fontSizes.body },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, ...shadows.sm, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.gapTight, padding: spacing.gapStacked },
  deckEmoji: { fontSize: 22 },
  deckName: { fontSize: fontSizes.body, fontWeight: '700', color: colors.text },
  deckMode: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 14 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.gapStacked, paddingBottom: spacing.gapStacked },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.pill, backgroundColor: colors.neutral200 },
  pillSelected: { backgroundColor: colors.primary },
  pillText: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.text },
  pillTextSelected: { color: colors.onPrimary },
});
