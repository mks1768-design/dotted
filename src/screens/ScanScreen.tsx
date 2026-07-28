import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { CameraBadgeIcon, CheckIcon, ChevronLeftIcon, CopyIcon, DotMagnifierHero, ViewfinderIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii } from '../theme/tokens';

export function ScanScreen() {
  const { state, backToHome, switchWrite, switchImprove, switchScan, capturePage, copyScan, insertScan } = useNotes();
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Scan a page</Text>
        <View style={styles.badge}>
          <CameraBadgeIcon size={17} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <DotMagnifierHero size={96} />
        </View>

        <SegmentedControl
          value={state.draftKind}
          onChange={(kind) => kindHandlers[kind]()}
          options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
        />

        <View style={styles.viewfinder}>
          {state.scanImageUri ? (
            <Image source={{ uri: state.scanImageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <View style={styles.viewfinderEmpty}>
              <ViewfinderIcon size={52} />
              <Text style={styles.viewfinderText}>Point the camera at a page</Text>
            </View>
          )}
        </View>

        {!state.scanned ? (
          <>
            <Button
              title={state.scanLoading ? 'Reading the page…' : 'Capture page'}
              onPress={capturePage}
              disabled={state.scanLoading}
              loading={state.scanLoading}
              block
            />
            {state.aiError && <Text style={styles.errorText}>{state.aiError}</Text>}
          </>
        ) : (
          <>
            <View>
              <Text style={styles.kicker}>Extracted text</Text>
              <Text style={styles.extractedText}>{state.extractedText}</Text>
            </View>
            <Hr />
            <View style={styles.explainBlock}>
              <Text style={styles.kicker}>What it means</Text>
              <Text style={styles.explainedText}>{state.explainedText}</Text>
            </View>
            <View style={styles.actionsRow}>
              <Button
                title="Copy"
                variant="secondary"
                onPress={copyScan}
                icon={state.copiedCam ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                style={{ flex: 1 }}
              />
              <Button title="Insert into note" onPress={insertScan} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  badge: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  hero: { alignItems: 'center', paddingVertical: 4 },
  viewfinder: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral200,
  },
  viewfinderEmpty: { alignItems: 'center', gap: 10 },
  viewfinderText: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700 },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  extractedText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.text },
  explainBlock: { borderLeftWidth: 2, borderLeftColor: colors.accent, paddingLeft: 14 },
  explainedText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.text },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.danger },
});
