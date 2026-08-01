import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStudy } from '../state/StudyContext';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';
import { PrimaryButton } from './ui';

const EMOJI_CHOICES = ['📚', '🧠', '🗺️', '🧪', '🎵', '🍜', '💻', '🌍'];

export function NewDeckSheet({ onDone }: { onDone: () => void }) {
  const { newDeck } = useStudy();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    newDeck(trimmed, emoji);
    onDone();
  };

  return (
    <View style={styles.card}>
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
          <Pressable key={e} onPress={() => setEmoji(e)} style={[styles.emojiOption, e === emoji && styles.emojiOptionSelected]}>
            <Text style={styles.emojiText}>{e}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onDone} style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Create deck" onPress={submit} disabled={!name.trim()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapStacked,
    gap: spacing.gapTight,
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
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.gapTight },
  cancelLink: { padding: 8 },
  cancelLinkText: { color: colors.textMuted, fontWeight: '700' },
});
