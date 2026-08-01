import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/ui';
import { BoltIcon, FlameIcon, GearIcon, PlusIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { Deck } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

const EMOJI_CHOICES = ['📚', '🧠', '🗺️', '🧪', '🎵', '🍜', '💻', '🌍'];

export function HomeScreen() {
  const { state, openDeck, newDeck, deleteDeck, goSettings } = useStudy();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    newDeck(trimmed, emoji);
    setName('');
    setEmoji(EMOJI_CHOICES[0]);
    setCreating(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recall</Text>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <FlameIcon size={16} />
            <Text style={styles.statText}>{state.stats.streak}</Text>
          </View>
          <View style={styles.statChip}>
            <BoltIcon size={16} />
            <Text style={styles.statText}>{state.stats.xp}</Text>
          </View>
          <Pressable onPress={goSettings} hitSlop={10} style={styles.settingsHit} accessibilityRole="button" accessibilityLabel="Settings">
            <GearIcon size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={state.decks}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !creating ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No decks yet</Text>
              <Text style={styles.emptyBody}>Make a deck of your own cards and start a lesson.</Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          creating ? (
            <View style={styles.newDeckCard}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Deck name"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoFocus
                onSubmitEditing={submit}
                returnKeyType="done"
              />
              <View style={styles.emojiRow}>
                {EMOJI_CHOICES.map((e) => (
                  <Pressable
                    key={e}
                    onPress={() => setEmoji(e)}
                    style={[styles.emojiOption, e === emoji && styles.emojiOptionSelected]}
                  >
                    <Text style={styles.emojiText}>{e}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.newDeckActions}>
                <Pressable onPress={() => setCreating(false)} style={styles.cancelLink}>
                  <Text style={styles.cancelLinkText}>Cancel</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <PrimaryButton label="Create deck" onPress={submit} disabled={!name.trim()} />
                </View>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => <DeckRow deck={item} onPress={() => openDeck(item.id)} onDelete={() => deleteDeck(item.id)} />}
      />

      {!creating && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New deck"
          onPress={() => setCreating(true)}
          style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}
        >
          <PlusIcon size={26} color={colors.onPrimary} />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

function DeckRow({ deck, onPress, onDelete }: { deck: Deck; onPress: () => void; onDelete: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.deckRow, { opacity: pressed ? 0.85 : 1 }]}>
      <Text style={styles.deckEmoji}>{deck.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.deckName}>{deck.name}</Text>
        <Text style={styles.deckCount}>{deck.cards.length} card{deck.cards.length === 1 ? '' : 's'}</Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteHit}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.topPadding,
    paddingBottom: spacing.gapTight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...shadows.sm,
  },
  statText: { fontWeight: '800', color: colors.text, fontSize: fontSizes.smallLabel },
  settingsHit: { padding: 4 },
  listContent: { paddingHorizontal: spacing.screenPaddingH, paddingBottom: 100, gap: spacing.gapTight },
  empty: { alignItems: 'center', paddingTop: 60, gap: 6 },
  emptyTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  emptyBody: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gapTight,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    ...shadows.sm,
  },
  deckEmoji: { fontSize: 28 },
  deckName: { fontSize: fontSizes.sectionTitle, fontWeight: '700', color: colors.text },
  deckCount: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 2 },
  deleteHit: { padding: 4 },
  deleteText: { color: colors.danger, fontWeight: '700', fontSize: fontSizes.smallLabel },
  fab: {
    position: 'absolute',
    right: spacing.screenPaddingH,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  newDeckCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    gap: spacing.gapTight,
    marginBottom: spacing.gapTight,
    ...shadows.sm,
  },
  input: {
    height: spacing.tapTarget,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiOption: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral200,
  },
  emojiOptionSelected: { backgroundColor: colors.primaryLight, borderWidth: 2, borderColor: colors.primary },
  emojiText: { fontSize: 20 },
  newDeckActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.gapTight },
  cancelLink: { padding: 8 },
  cancelLinkText: { color: colors.textMuted, fontWeight: '700' },
});
