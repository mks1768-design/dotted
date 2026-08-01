import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/ui';
import { BoltIcon, FlameIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function ResultsScreen() {
  const { state, finishResults } = useStudy();
  const completed = state.sessionEnded === 'completed';
  const total = state.studyQueue.length;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{completed ? '🎉' : '💔'}</Text>
        <Text style={styles.headline}>{completed ? 'Lesson complete!' : 'Out of hearts'}</Text>
        <Text style={styles.subhead}>
          {completed
            ? `You got ${state.correctCount} of ${total} right.`
            : `You got ${state.correctCount} of ${total} before running out — try again.`}
        </Text>

        {completed && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <BoltIcon size={22} />
              <Text style={styles.statValue}>+{state.xpEarned}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statCard}>
              <FlameIcon size={22} />
              <Text style={styles.statValue}>{state.stats.streak}</Text>
              <Text style={styles.statLabel}>day streak</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Done" onPress={finishResults} tone={completed ? 'success' : 'primary'} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.screenPaddingH, gap: spacing.gapTight },
  emoji: { fontSize: 64 },
  headline: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subhead: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.gapTight, marginTop: spacing.gapStacked },
  statCard: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.gapStacked,
    paddingHorizontal: 24,
    ...shadows.sm,
  },
  statValue: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSizes.smallLabel, color: colors.textMuted },
  footer: { padding: spacing.screenPaddingH },
});
