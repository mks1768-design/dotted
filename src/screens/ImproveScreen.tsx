import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr, SegmentedControl, useFocusRing } from '../components/ui';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { ChevronLeftIcon, DotRewriteHero } from '../icons';
import { useNotes } from '../state/NotesContext';
import { rewriteFor } from '../state/rewrite';
import { Tone } from '../state/types';
import { colors, focusRing, fonts, fontSizes } from '../theme/tokens';

const toneOptions: { label: string; value: Tone }[] = [
  { label: 'Polish', value: 'polish' },
  { label: 'Concise', value: 'concise' },
  { label: 'Formal', value: 'formal' },
];

export function ImproveScreen() {
  const {
    state,
    backToHome,
    switchWrite,
    switchImprove,
    switchScan,
    setTone,
    setImprovePrompt,
    backToEditor,
    applyRewrite,
  } = useNotes();
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };
  const prompt = useFocusRing();

  const hasDraft = !!state.draftBody.trim();
  const hasPrompt = !!state.improvePrompt.trim();
  const hasKey = !!state.apiKey;
  const originalText = hasDraft ? state.draftBody : 'Nothing written yet — go to Write and add some text first.';
  const referencePreview = rewriteFor(state.tone, state.draftBody, state.improvePrompt);

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
        <SegmentedControl value={state.tone} onChange={setTone} options={toneOptions} disabled={hasPrompt} />

        <View>
          <Text style={styles.kicker}>Or describe how</Text>
          <TextInput
            value={state.improvePrompt}
            onChangeText={setImprovePrompt}
            placeholder="e.g. “make it punchier”, “write it like a product update”…"
            placeholderTextColor={colors.neutral700}
            multiline
            style={[styles.promptInput, prompt.focused && styles.promptInputFocused, prompt.focused && focusRing]}
            {...prompt.handlers}
          />
          {hasPrompt && <Text style={styles.promptHint}>Using your instruction instead of the tone above.</Text>}
        </View>

        <View>
          <Text style={styles.kicker}>Original</Text>
          <Text style={styles.originalText}>{originalText}</Text>
        </View>
        <Hr />

        {hasKey ? (
          hasDraft && (
            <Text style={styles.aiHint}>
              {state.rewriteLoading ? 'Claude is rewriting your note…' : 'Tap Apply to rewrite this note with Claude.'}
            </Text>
          )
        ) : (
          hasDraft && (
            <View>
              <Text style={styles.kicker}>Suggestion (reference preview — add an API key in Settings for real AI)</Text>
              <Text style={styles.suggestionText}>{referencePreview}</Text>
            </View>
          )
        )}

        {state.aiError && <Text style={styles.errorText}>{state.aiError}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Discard" variant="ghost" onPress={backToEditor} style={{ flex: 1 }} />
        <Button
          title="Apply"
          variant="primary"
          onPress={applyRewrite}
          disabled={!hasDraft || state.rewriteLoading}
          loading={state.rewriteLoading}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  hero: { alignItems: 'center', paddingVertical: 6 },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  promptInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 64,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    textAlignVertical: 'top',
    outlineWidth: 0,
  },
  promptInputFocused: { borderColor: colors.accent700 },
  promptHint: { fontFamily: fonts.body, fontSize: 12, color: colors.accent700, marginTop: 6 },
  originalText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.neutral700 },
  suggestionText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.text },
  aiHint: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700, fontStyle: 'italic' },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.danger },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 },
});
