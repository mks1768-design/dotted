import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Deck } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function DeckRow({ deck, onPress }: { deck: Deck; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>{deck.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{deck.name}</Text>
        <Text style={styles.count}>{deck.cards.length} card{deck.cards.length === 1 ? '' : 's'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gapTight,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    ...shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  name: { fontSize: fontSizes.body, fontWeight: '700', color: colors.text },
  count: { fontSize: fontSizes.smallLabel, color: colors.textMuted, marginTop: 2 },
});
