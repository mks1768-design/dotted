import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { ChevronLeftIcon, DotRewriteHero } from '../icons';
import { useNotes } from '../state/NotesContext';
import { rewriteFor } from '../state/rewrite';
import { Tone } from '../state/types';
import { colors, fonts, fontSizes } from '../theme/tokens';

const toneOptions: { label: string; value: Tone }[] = [
  { label: 'Polish', value: 'polish' },
  { label: 'Concise', value: 'concise' },
  { label: 'Formal', value: 'formal' },
];

export function ImproveScreen() {
  const { state, backToHome, switchWrite, switchImprove, switchScan, setTone, backToEditor, applyRewrite } = useNotes();
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };

  const hasDraft = !!state.draftBody.trim();
  const originalText = hasDraft ? state.draftBody : 'Nothing written yet — go to Write and add some text first.';
  const rewrittenText = rewriteFor(state.tone, state.draftBody);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Improve writing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <DotRewriteHero size={120} />
        </View>

        <SegmentedControl
          value={state.draftKind}
          onChange={(kind) => kindHandlers[kind]()}
          options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
        />
        <SegmentedControl value={state.tone} onChange={setTone} options={toneOptions} />

        <View>
          <Text style={styles.kicker}>Original</Text>
          <Text style={styles.originalText}>{originalText}</Text>
        </View>
        <Hr />
        {hasDraft && (
          <View>
            <Text style={styles.kicker}>Suggestion</Text>
            <Text style={styles.suggestionText}>{rewrittenText}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Discard" variant="ghost" onPress={backToEditor} style={{ flex: 1 }} />
        <Button title="Apply" variant="primary" onPress={applyRewrite} disabled={!hasDraft} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  hero: { alignItems: 'center', paddingVertical: 6 },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  originalText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.neutral700 },
  suggestionText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.text },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 },
});
