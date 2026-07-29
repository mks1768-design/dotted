import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DotSparklesIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, radii } from '../theme/tokens';
import { Button } from './ui';

/** Stands in for Improve and Scan when there's no API key.
 *
 * These two screens used to run a fake local transform instead — a capitalize
 * and a full stop dressed up as a rewrite — which read as a bad AI rather than
 * a missing one. Saying plainly that the feature is off, and that the rest of
 * the app isn't, is the honest version of that. */
export function AiSetupNotice({ feature }: { feature: 'improve' | 'scan' }) {
  const { goApiKeyGuide, goSettings } = useNotes();

  const line =
    feature === 'improve'
      ? 'Improving a note asks Claude to rewrite it, so it needs an Anthropic API key of your own.'
      : 'Reading a page asks Claude to look at the photo, so it needs an Anthropic API key of your own.';

  return (
    <View style={styles.card}>
      <DotSparklesIcon size={48} />
      <Text style={styles.title}>AI isn't set up yet</Text>
      <Text style={styles.body}>
        {line} dotted has no server, so nothing runs until you add one. It takes about five minutes and costs
        a few cents per use.
      </Text>
      <Text style={styles.aside}>Everything else — writing, photos, the board, backup — works without it.</Text>
      <View style={styles.actions}>
        <Button title="Show me how" onPress={goApiKeyGuide} block />
        <Button title="I already have a key" variant="secondary" onPress={goSettings} block />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  title: { fontFamily: fonts.heading, fontSize: 19, color: colors.text, marginTop: 2 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.neutral700, textAlign: 'center' },
  aside: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.neutral700, textAlign: 'center', fontStyle: 'italic' },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 6 },
});
