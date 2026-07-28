import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { RuledPaper } from '../components/RuledPaper';
import { noteKindOrder, noteKinds } from '../config/noteKinds';
import { paperBackgroundColor, paperStyles } from '../config/paperStyles';
import { ChevronLeftIcon, CloseIcon, EditIcon, PhotoIcon, TrashIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

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
    setColor,
    pickPhoto,
    removePhoto,
    startEditingPhoto,
    stopEditingPhoto,
    deleteNote,
  } = useNotes();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const kindHandlers = { write: switchWrite, improve: switchImprove, scan: switchScan };
  const isPhoto = state.draftColor === 'photo';

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
        {state.activeQuestPrompt && (
          <View style={styles.questBanner}>
            <Text style={styles.questBannerKicker}>TODAY'S PROMPT</Text>
            <Text style={styles.questBannerText}>{state.activeQuestPrompt}</Text>
          </View>
        )}

        <SegmentedControl
          value={state.draftKind}
          onChange={(kind) => kindHandlers[kind]()}
          options={noteKindOrder.map((k) => ({ label: noteKinds[k].segmentLabel, value: k }))}
        />

        <View style={styles.paperRow}>
          <Text style={styles.paperLabel}>Paper</Text>
          {paperStyles.map((swatch) => {
            const active = state.draftColor === swatch.id;
            return (
              <Pressable
                key={swatch.id}
                onPress={() => setColor(swatch.id)}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch.swatchColor, borderColor: active ? colors.text : 'transparent' },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                {swatch.isPhoto && <PhotoIcon size={11} />}
              </Pressable>
            );
          })}
        </View>

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
                <Pressable style={styles.photoClose} onPress={removePhoto} accessibilityLabel="Remove photo">
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
                    <LinearGradient colors={['rgba(243,242,242,0.92)', 'transparent']} style={styles.captionGradient}>
                      <Text style={styles.captionText}>
                        {state.draftBody.trim() ? state.draftBody : 'Tap the pencil to add words to this note.'}
                      </Text>
                    </LinearGradient>
                    <Pressable style={styles.photoEditFab} onPress={startEditingPhoto} accessibilityLabel="Edit note text">
                      <EditIcon size={16} />
                    </Pressable>
                  </>
                )}
              </>
            )}
          </View>
        ) : (
          <View style={styles.flatBody}>
            <RuledPaper tint={paperBackgroundColor(state.draftColor)} />
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
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 20, gap: 8 },
  questBanner: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: 12,
    paddingVertical: 2,
    marginBottom: 2,
  },
  questBannerKicker: { fontFamily: fonts.body, fontSize: 11, color: colors.neutral700, letterSpacing: 0.6 },
  questBannerText: { fontFamily: fonts.heading, fontSize: 16, color: colors.text, marginTop: 2 },
  paperRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  paperLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smallLabel,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    color: colors.neutral700,
    opacity: 0.7,
    marginRight: 2,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.screenTitle,
    color: colors.text,
    paddingVertical: 6,
    outlineWidth: 0,
  },
  flatBody: { flex: 1, marginTop: 6, borderRadius: 4, overflow: 'hidden', position: 'relative' },
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
  photoArea: { flex: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 16, backgroundColor: colors.neutral200 },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  photoPlaceholderText: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, textAlign: 'center' },
  photoClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(243,242,242,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(243,242,242,0.7)',
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
