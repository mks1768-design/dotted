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
 * the app isn't, is the honest version of that. Kept to a couple of short
 * lines rather than a paragraph, on the theory that a wall of text here just
 * gets skipped past on the way to tapping something. */
export function AiSetupNotice() {
  const { goApiKeyGuide, goSettings } = useNotes();

  return (
    <View style={styles.card}>
      <DotSparklesIcon size={44} />
      <Text style={styles.title}>AI isn't set up yet</Text>
      <Text style={styles.body}>Needs your own Anthropic key (a few cents per use) — everything else here works without one.</Text>
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
    gap: 8,
  },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.text, marginTop: 2 },
  body: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20, color: colors.neutral700, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 8 },
});
