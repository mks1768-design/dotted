import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { RuledPaper } from '../components/RuledPaper';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { paperDecorationFor, paperStyleFor } from '../config/paperStyles';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, EditIcon, PhotoIcon, TrashIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii, shadows, spacing } from '../theme/tokens';

export function EditorScreen() {
  const {
    state,
    backToHome,
    storeNote,
    setTitle,
    setBody,
    switchWrite,
    switchImprove,
    switchScan,
    goPaperPicker,
    pickPhoto,
    removePhoto,
    startEditingPhoto,
    stopEditingPhoto,
    deleteNote,
  } = useNotes();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };
  const isPhoto = state.draftColor === 'photo';
  const currentPaper = paperStyleFor(state.draftColor);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <View style={styles.headerRight}>
          {state.editingId != null && (
            <Pressable
              onPress={() => setConfirmingDelete(true)}
              style={styles.deleteBtn}
              accessibilityRole="button"
              accessibilityLabel="Delete note"
            >
              <TrashIcon size={18} color={colors.neutral700} />
            </Pressable>
          )}
          <Button title="Store" onPress={storeNote} />
        </View>
      </View>

      <View style={styles.body}>
        <SegmentedControl
          value={state.draftKind}
          onChange={(kind) => kindHandlers[kind]()}
          options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
        />

        <Pressable style={styles.paperRow} onPress={goPaperPicker} accessibilityRole="button" accessibilityLabel="Choose paper">
          <Text style={styles.paperLabel}>Paper</Text>
          <View style={[styles.paperSwatch, { backgroundColor: currentPaper.swatchColor }]}>
            {currentPaper.isPhoto && <PhotoIcon size={11} />}
          </View>
          <Text style={styles.paperValue}>{currentPaper.label}</Text>
          <ChevronRightIcon size={14} />
        </Pressable>

        <TextInput
          value={state.draftTitle}
          onChangeText={setTitle}
          placeholder="Untitled"
          placeholderTextColor={colors.neutral700}
          style={styles.titleInput}
        />
        <Hr />

        {isPhoto ? (
          <View style={styles.photoArea}>
            {!state.draftPhotoUri ? (
              <Pressable style={styles.photoPlaceholder} onPress={pickPhoto}>
                <PhotoIcon size={28} color={colors.neutral700} />
                <Text style={styles.photoPlaceholderText}>Tap to choose a photo for this note's background</Text>
              </Pressable>
            ) : (
              <>
                <Image source={{ uri: state.draftPhotoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <Pressable style={styles.photoClose} onPress={removePhoto} accessibilityRole="button" accessibilityLabel="Remove photo">
                  <CloseIcon size={15} />
                </Pressable>
                {state.notePhotoEditing ? (
                  <>
                    <View style={styles.photoScrim} />
                    <TextInput
                      value={state.draftBody}
                      onChangeText={setBody}
                      placeholder="Start writing…"
                      placeholderTextColor={colors.neutral700}
                      multiline
                      style={styles.photoTextInput}
                    />
                    <Button title="Done" onPress={stopEditingPhoto} style={styles.photoDoneBtn} />
                  </>
                ) : (
                  <>
                    <LinearGradient colors={[colors.paperVeilStrong, 'transparent']} style={styles.captionGradient}>
                      <Text style={styles.captionText}>
                        {state.draftBody.trim() ? state.draftBody : 'Tap the pencil to add words to this note.'}
                      </Text>
                    </LinearGradient>
                    <Pressable style={styles.photoEditFab} onPress={startEditingPhoto} accessibilityRole="button" accessibilityLabel="Edit note text">
                      <EditIcon size={16} />
                    </Pressable>
                  </>
                )}
              </>
            )}
          </View>
        ) : (
          <View style={styles.flatBody}>
            <RuledPaper tint={currentPaper.swatchColor} decoration={paperDecorationFor(state.draftColor)} />
            <TextInput
              value={state.draftBody}
              onChangeText={setBody}
              placeholder="Start writing…"
              placeholderTextColor={colors.neutral700}
              multiline
              style={styles.flatTextInput}
            />
          </View>
        )}
      </View>

      <ConfirmDialog
        visible={confirmingDelete}
        title="Delete this note?"
        message={`"${state.draftTitle.trim() || 'Untitled'}" will be gone for good — this can't be undone.`}
        onConfirm={() => {
          setConfirmingDelete(false);
          if (state.editingId != null) deleteNote(state.editingId);
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 20, gap: 8 },
  paperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    // Padding rather than margin so the strip itself is a 44pt-tall target;
    // the negative margin keeps it visually where it was against the title.
    minHeight: spacing.tapTarget,
    paddingRight: 8,
    marginVertical: -8,
  },
  paperLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smallLabel,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    color: colors.neutral700,
    opacity: 0.7,
  },
  paperSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperValue: { fontFamily: fonts.body, fontSize: 13, color: colors.text },
  titleInput: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.screenTitle,
    color: colors.text,
    paddingVertical: 6,
    outlineWidth: 0,
  },
  // The writing surface is itself a sheet on the desk — bottom margin so its
  // edge is visible rather than running off the screen.
  flatBody: {
    flex: 1,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: radii.paper,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.paper,
  },
  flatTextInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    lineHeight: 26,
    color: colors.text,
    backgroundColor: 'transparent',
    padding: 0,
    textAlignVertical: 'top',
    outlineWidth: 0,
  },
  photoArea: {
    flex: 1,
    borderRadius: radii.paper,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: colors.neutral200,
    ...shadows.paper,
  },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  photoPlaceholderText: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, textAlign: 'center' },
  photoClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: spacing.tapTarget,
    height: spacing.tapTarget,
    borderRadius: spacing.tapTarget / 2,
    backgroundColor: colors.paperVeil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paperVeilSoft,
    pointerEvents: 'none',
  },
  photoTextInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlignVertical: 'top',
    outlineWidth: 0,
  },
  photoDoneBtn: { position: 'absolute', bottom: 12, right: 12 },
  captionGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    pointerEvents: 'none',
  },
  captionText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.text },
  photoEditFab: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: spacing.tapTarget,
    height: spacing.tapTarget,
    borderRadius: spacing.tapTarget / 2,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
