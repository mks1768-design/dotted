import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeckRow } from '../components/DeckRow';
import { NewDeckSheet } from '../components/NewDeckSheet';
import { PlusIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { colors, fontSizes, spacing } from '../theme/tokens';

export function DecksScreen() {
  const { state, openDeck } = useStudy();
  const [creating, setCreating] = useState(false);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Decks</Text>
        <Pressable onPress={() => setCreating(true)} hitSlop={10} accessibilityRole="button" accessibilityLabel="New deck">
          <PlusIcon size={22} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={state.decks}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={creating ? <NewDeckSheet onDone={() => setCreating(false)} /> : null}
        ListEmptyComponent={
          !creating ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No decks yet</Text>
              <Text style={styles.emptyBody}>Make a deck of your own cards and start a lesson.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <DeckRow deck={item} onPress={() => openDeck(item.id)} />}
      />
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
  title: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text },
  listContent: { paddingHorizontal: spacing.screenPaddingH, paddingBottom: 24, gap: spacing.gapTight },
  empty: { alignItems: 'center', paddingTop: 60, gap: 6 },
  emptyTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  emptyBody: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
});
