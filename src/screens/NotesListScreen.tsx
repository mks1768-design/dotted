import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { NoteBoard } from '../components/NoteBoard';
import { Card, Hr, Tag } from '../components/ui';
import { noteKinds } from '../config/noteKinds';
import { BoardIcon, BookIcon, ChevronLeftIcon, ListIcon, PlusIcon, ShareIcon, TrashIcon } from '../icons';
import { LibraryNook } from '../illustrations';
import { formatNoteDate } from '../state/formatDate';
import { useNotes } from '../state/NotesContext';
import { Note } from '../state/types';
import { colors, fonts, fontSizes, radii, shadows } from '../theme/tokens';

type ViewMode = 'list' | 'board';

export function NotesListScreen() {
  const { state, backToHome, openNote, newNote, shareNote, deleteNote } = useNotes();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const confirmDelete = () => {
    if (pendingDelete) deleteNote(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={18} />
        </Pressable>
        <View style={styles.badge}>
          <BookIcon size={16} />
        </View>
        <Text style={styles.title}>dotted</Text>

        <View style={styles.viewToggle}>
          <Pressable
            onPress={() => setViewMode('list')}
            style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="List view"
            accessibilityState={{ selected: viewMode === 'list' }}
          >
            <ListIcon size={15} color={viewMode === 'list' ? colors.bg : colors.neutral700} />
          </Pressable>
          <Pressable
            onPress={() => setViewMode('board')}
            style={[styles.viewToggleBtn, viewMode === 'board' && styles.viewToggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Board view"
            accessibilityState={{ selected: viewMode === 'board' }}
          >
            <BoardIcon size={15} color={viewMode === 'board' ? colors.bg : colors.neutral700} />
          </Pressable>
        </View>
      </View>
      <Hr style={styles.hrMargin} />

      {state.notes.length === 0 ? (
        <View style={styles.empty}>
          <LibraryNook width={220} />
          <Text style={styles.emptyText}>No notes yet — tap + to write your first one.</Text>
        </View>
      ) : viewMode === 'board' ? (
        <NoteBoard notes={state.notes} onOpen={openNote} onShare={shareNote} onDelete={setPendingDelete} />
      ) : (
        <FlatList
          data={state.notes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: Note }) => (
            <Card onPress={() => openNote(item)} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.kicker}>{formatNoteDate(item.createdAt)}</Text>
                <View style={styles.cardTopRight}>
                  <Tag label={noteKinds[item.kind].label} variant="outline" />
                  <Pressable
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      shareNote(item);
                    }}
                    style={styles.cardIconBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Share "${item.title}"`}
                    hitSlop={8}
                  >
                    <ShareIcon size={14} />
                  </Pressable>
                  <Pressable
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      setPendingDelete(item);
                    }}
                    style={styles.cardIconBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete "${item.title}"`}
                    hitSlop={8}
                  >
                    <TrashIcon size={14} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardSnippet} numberOfLines={1}>
                {item.snippet}
              </Text>
            </Card>
          )}
        />
      )}

      <Pressable
        onPress={newNote}
        style={({ pressed, hovered }: any) => [
          styles.fab,
          hovered && { transform: [{ scale: 1.06 }] },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel="New note"
      >
        <PlusIcon size={24} />
      </Pressable>

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete this note?"
        message={pendingDelete ? `"${pendingDelete.title}" will be gone for good — this can't be undone.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  viewToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    padding: 2,
    gap: 2,
  },
  viewToggleBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  viewToggleBtnActive: { backgroundColor: colors.text },
  hrMargin: { marginHorizontal: 20 },
  list: { padding: 20, paddingBottom: 90, gap: 12 },
  card: { gap: 6 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardIconBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, letterSpacing: 0.04 },
  cardTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  cardSnippet: { fontFamily: fonts.body, fontSize: fontSizes.cardSnippet, color: colors.neutral700 },
  empty: { flex: 1, alignItems: 'center', gap: 14, marginTop: 60, paddingHorizontal: 40 },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
});
