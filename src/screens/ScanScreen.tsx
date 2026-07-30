import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AiSetupNotice } from '../components/AiSetupNotice';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { CameraBadgeIcon, CheckIcon, ChevronLeftIcon, CopyIcon, DotMagnifierHero, ViewfinderIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii } from '../theme/tokens';

/** The live viewfinder, plus every state it can be in before one exists:
 * permission not yet asked, permission refused, or a camera that won't start. */
function Viewfinder({
  cameraRef,
  onReady,
  mountError,
  onMountError,
}: {
  cameraRef: React.RefObject<CameraView | null>;
  onReady: () => void;
  mountError: string | null;
  onMountError: (message: string) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();

  if (mountError) {
    return (
      <View style={styles.viewfinderEmpty}>
        <ViewfinderIcon size={52} />
        <Text style={styles.viewfinderText}>{mountError}</Text>
        <Text style={styles.viewfinderHint}>Choose an existing photo below instead.</Text>
      </View>
    );
  }

  // Still resolving whether permission was granted on a previous visit.
  if (!permission) {
    return (
      <View style={styles.viewfinderEmpty}>
        <ViewfinderIcon size={52} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.viewfinderEmpty}>
        <ViewfinderIcon size={52} />
        <Text style={styles.viewfinderText}>
          {permission.canAskAgain
            ? 'dotted needs the camera to read a page.'
            : 'Camera access is turned off for dotted.'}
        </Text>
        {permission.canAskAgain ? (
          <Button title="Allow camera" variant="secondary" onPress={requestPermission} />
        ) : (
          <Text style={styles.viewfinderHint}>
            Turn it back on in your phone's settings, or choose an existing photo below.
          </Text>
        )}
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      facing="back"
      // A page is text on paper — the flash mostly makes glare, so it stays off
      // unless the reader turns it on for a dark room.
      flash="off"
      onCameraReady={onReady}
      onMountError={(event) => onMountError(event?.message || "The camera wouldn't start.")}
    />
  );
}

export function ScanScreen() {
  const { state, backToHome, switchWrite, switchImprove, switchScan, readPage, pickPageFromLibrary, rescanPage, copyScan, insertScan } =
    useNotes();
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };
  const hasKey = !!state.apiKey;

  const cameraRef = useRef<CameraView | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  const busy = capturing || state.scanLoading;

  const onCapture = async () => {
    if (!cameraRef.current || busy) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, base64: true });
      if (!photo?.base64) throw new Error('The photo came back empty.');
      // `format` is 'jpg' | 'png'; the API wants a media type.
      await readPage({
        uri: photo.uri,
        base64: photo.base64,
        mimeType: photo.format === 'png' ? 'image/png' : 'image/jpeg',
      });
    } catch {
      setMountError("That shot didn't come through — try again.");
    } finally {
      setCapturing(false);
    }
  };

  const canCapture = cameraReady && !mountError && !busy;

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
        {!hasKey ? (
          <>
            <View style={styles.hero}>
              <DotMagnifierHero size={96} />
            </View>
            <SegmentedControl
              value={state.draftKind}
              onChange={(kind) => kindHandlers[kind]()}
              options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
            />
            <AiSetupNotice />
          </>
        ) : (
          <>
            <SegmentedControl
              value={state.draftKind}
              onChange={(kind) => kindHandlers[kind]()}
              options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
            />

            <View style={styles.viewfinder}>
              {state.scanImageUri ? (
                <Image source={{ uri: state.scanImageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              ) : (
                <Viewfinder
                  cameraRef={cameraRef}
                  onReady={() => setCameraReady(true)}
                  mountError={mountError}
                  onMountError={(message) => setMountError(message)}
                />
              )}
              {state.scanLoading && (
                <View style={styles.readingOverlay}>
                  <Text style={styles.readingText}>Reading the page…</Text>
                </View>
              )}
            </View>

            {!state.scanned ? (
              <>
                <Button
                  title={busy ? 'Reading the page…' : 'Capture page'}
                  onPress={onCapture}
                  disabled={!canCapture}
                  loading={busy}
                  block
                />
                <Button
                  title="Choose an existing photo"
                  variant="secondary"
                  onPress={pickPageFromLibrary}
                  disabled={busy}
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
                <Button title="Scan another page" variant="ghost" onPress={rescanPage} block />
              </>
            )}
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
    aspectRatio: 3 / 4,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral200,
  },
  viewfinderEmpty: { alignItems: 'center', gap: 10, paddingHorizontal: 24 },
  viewfinderText: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, textAlign: 'center' },
  viewfinderHint: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, textAlign: 'center' },
  readingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingText: { fontFamily: fonts.body, fontSize: 14, color: colors.onPhoto },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  extractedText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.text },
  explainBlock: { borderLeftWidth: 2, borderLeftColor: colors.accent, paddingLeft: 14 },
  explainedText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.text },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.danger },
});
