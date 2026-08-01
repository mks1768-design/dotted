import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/ui';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { Card } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function DeckScreen() {
  const { state, goHome, editCard, newCard, deleteCard, startStudy } = useStudy();
  const deck = state.decks.find((d) => d.id === state.activeDeckId);

  if (!deck) {
    goHome();
    return null;
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goHome} hitSlop={10} style={styles.backHit} accessibilityRole="button" accessibilityLabel="Back">
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {deck.emoji} {deck.name}
        </Text>
        <Pressable onPress={newCard} hitSlop={10} style={styles.backHit} accessibilityRole="button" accessibilityLabel="Add card">
          <PlusIcon />
        </Pressable>
      </View>

      <FlatList
        data={deck.cards}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptyBody}>Add a card with a front and back to start building this deck.</Text>
          </View>
        }
        renderItem={({ item }) => <CardRow card={item} onPress={() => editCard(item)} onDelete={() => deleteCard(item.id)} />}
      />

      <View style={styles.footer}>
        <PrimaryButton
          label={deck.cards.length < 2 ? 'Add at least 2 cards to study' : 'Start lesson'}
          onPress={() => startStudy(deck.id)}
          disabled={deck.cards.length < 2}
        />
      </View>
    </SafeAreaView>
  );
}

function CardRow({ card, onPress, onDelete }: { card: Card; onPress: () => void; onDelete: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cardRow, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardFront} numberOfLines={1}>{card.front}</Text>
        <Text style={styles.cardBack} numberOfLines={1}>{card.back}</Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteHit} accessibilityRole="button" accessibilityLabel="Delete card">
        <TrashIcon size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
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
    gap: spacing.gapTight,
  },
  backHit: { padding: 4 },
  title: { flex: 1, fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text, textAlign: 'center' },
  listContent: { paddingHorizontal: spacing.screenPaddingH, paddingBottom: 24, gap: spacing.gapTight },
  empty: { alignItems: 'center', paddingTop: 40, gap: 6 },
  emptyTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  emptyBody: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gapTight,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    ...shadows.sm,
  },
  cardFront: { fontSize: fontSizes.body, fontWeight: '700', color: colors.text },
  cardBack: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 2 },
  deleteHit: { padding: 4 },
  footer: { padding: spacing.screenPaddingH },
});
