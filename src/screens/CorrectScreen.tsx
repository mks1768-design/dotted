import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AiSetupNotice } from '../components/AiSetupNotice';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { ChevronLeftIcon, DotCheckHero } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

export function CorrectScreen() {
  const {
    state,
    backToHome,
    switchWrite,
    switchImprove,
    switchScan,
    switchCorrect,
    runCorrection,
    resetCorrection,
    applyCorrection,
    backToEditor,
  } = useNotes();
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan, correct: switchCorrect };

  const hasDraft = !!state.draftBody.trim();
  const hasKey = !!state.apiKey;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Correct writing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <DotCheckHero size={120} />
        </View>

        <SegmentedControl
          value={state.draftKind}
          onChange={(kind) => kindHandlers[kind]()}
          options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
        />

        {hasKey ? (
          !state.corrected ? (
            <>
              <View>
                <Text style={styles.kicker}>Original</Text>
                <Text style={styles.originalText}>
                  {hasDraft ? state.draftBody : 'Nothing written yet — go to Write and add some text first.'}
                </Text>
              </View>
              {hasDraft && (
                <Text style={styles.aiHint}>
                  {state.correctionLoading
                    ? 'Claude is proofreading your note…'
                    : 'Tap Correct to fix grammar, spelling, and word order — every change stays bold below.'}
                </Text>
              )}
            </>
          ) : (
            <>
              <View>
                <Text style={styles.kicker}>Corrected — changes in bold</Text>
                <Text style={styles.correctedText}>
                  {state.correctionSegments.map((seg, i) => (
                    <Text key={i} style={seg.changed ? styles.changedWord : undefined}>
                      {seg.text}
                    </Text>
                  ))}
                </Text>
              </View>
              {state.addedSentences.length > 0 && (
                <View>
                  <Hr />
                  <Text style={styles.kicker}>Added sentences</Text>
                  {state.addedSentences.map((item, i) => (
                    <View key={i} style={styles.addedItem}>
                      <Text style={styles.addedSentence}>{item.sentence}</Text>
                      <Text style={styles.addedReason}>(Added: {item.reason})</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )
        ) : (
          <AiSetupNotice />
        )}

        {state.aiError && <Text style={styles.errorText}>{state.aiError}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        {!state.corrected ? (
          <>
            <Button title="Back to note" variant="ghost" onPress={backToEditor} style={{ flex: 1 }} />
            {hasKey && (
              <Button
                title="Correct"
                variant="primary"
                onPress={runCorrection}
                disabled={!hasDraft || state.correctionLoading}
                loading={state.correctionLoading}
                style={{ flex: 1 }}
              />
            )}
          </>
        ) : (
          <>
            <Button title="Discard" variant="ghost" onPress={resetCorrection} style={{ flex: 1 }} />
            <Button title="Apply" variant="primary" onPress={applyCorrection} style={{ flex: 1 }} />
          </>
        )}
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
  originalText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.neutral700 },
  correctedText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 24, color: colors.text },
  changedWord: { fontFamily: fonts.body, fontWeight: '700', color: colors.text },
  addedItem: { marginTop: 8 },
  addedSentence: { fontFamily: fonts.body, fontWeight: '700', fontSize: 14, lineHeight: 22, color: colors.text },
  addedReason: { fontFamily: fonts.body, fontSize: 12, fontStyle: 'italic', color: colors.neutral700, marginTop: 2 },
  aiHint: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700, fontStyle: 'italic' },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.danger },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 },
});
