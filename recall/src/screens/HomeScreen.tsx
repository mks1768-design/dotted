import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeckRow } from '../components/DeckRow';
import { NewDeckSheet } from '../components/NewDeckSheet';
import { CardsIcon, FlameIcon, PlusIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function HomeScreen() {
  const { state, openDeck, startStudy, startMixStudy, goDecks, goStreak } = useStudy();
  const [creating, setCreating] = useState(false);

  const studyTarget = state.decks.find((d) => d.cards.length >= 2);
  const totalCards = state.decks.reduce((sum, d) => sum + d.cards.length, 0);
  const canMixReview = totalCards >= 2;
  const previewDecks = state.decks.slice(0, 3);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <CardsIcon size={18} color={colors.onPrimary} filled />
          </View>
          <Text style={styles.brandName}>Recall</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroValue}>{state.stats.xp.toLocaleString()}</Text>
          <Text style={styles.heroLabel}>total XP</Text>
          <Pressable onPress={goStreak} style={styles.streakPill}>
            <FlameIcon size={14} />
            <Text style={styles.streakPillText}>{state.stats.streak} day streak</Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <ActionButton label="New deck" onPress={() => setCreating(true)} icon={<PlusIcon size={22} color={colors.primary} />} />
          <ActionButton
            label="Study"
            onPress={() => studyTarget && startStudy(studyTarget.id)}
            disabled={!studyTarget}
            icon={<CardsIcon size={22} color={colors.primary} />}
          />
          <ActionButton
            label="Mix review"
            onPress={startMixStudy}
            disabled={!canMixReview}
            icon={<FlameIcon size={22} color={colors.primary} />}
          />
        </View>

        {creating && (
          <View style={styles.sheetWrap}>
            <NewDeckSheet onDone={() => setCreating(false)} />
          </View>
        )}

        {previewDecks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your decks</Text>
              <Pressable onPress={goDecks} hitSlop={8}>
                <Text style={styles.seeAll}>See all ›</Text>
              </Pressable>
            </View>
            <View style={{ gap: spacing.gapTight }}>
              {previewDecks.map((deck) => (
                <DeckRow key={deck.id} deck={deck} onPress={() => openDeck(deck.id)} />
              ))}
            </View>
          </View>
        )}

        {state.decks.length === 0 && !creating && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No decks yet</Text>
            <Text style={styles.emptyBody}>Tap "New deck" above to make your first one.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  onPress,
  icon,
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.actionButton}>
      <View style={[styles.actionIconWrap, disabled && styles.actionIconWrapDisabled]}>{icon}</View>
      <Text style={[styles.actionLabel, disabled && styles.actionLabelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.screenPaddingH, paddingTop: spacing.topPadding, paddingBottom: 100 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontSize: fontSizes.body, fontWeight: '800', color: colors.text },
  hero: { alignItems: 'center', marginTop: spacing.gapStacked * 2 },
  heroValue: { fontSize: 48, fontWeight: '900', color: colors.text },
  heroLabel: { fontSize: fontSizes.body, color: colors.textMuted, fontWeight: '600', marginTop: -4 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.neutral200,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: spacing.gapStacked,
  },
  streakPillText: { fontSize: fontSizes.smallLabel, fontWeight: '800', color: colors.text },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.gapStacked * 2 },
  actionButton: { alignItems: 'center', gap: 8, width: 90 },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrapDisabled: { opacity: 0.4 },
  actionLabel: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.text },
  actionLabelDisabled: { color: colors.textMuted },
  sheetWrap: { marginTop: spacing.gapStacked * 2 },
  section: { marginTop: spacing.gapStacked * 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.gapTight },
  sectionTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  seeAll: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.primary },
  empty: { alignItems: 'center', marginTop: spacing.gapStacked * 3, gap: 6 },
  emptyTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  emptyBody: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
});
