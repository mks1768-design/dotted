import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { paperBackgroundColor } from '../config/paperStyles';
import { ShareIcon, TrashIcon } from '../icons';
import { Note } from '../state/types';
import { colors, fonts, radii } from '../theme/tokens';

const COLUMN_COUNT = 2;
const COLUMN_GAP = 12;

function hashSeed(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Pinterest-style masonry: photo notes get a varied "pin" height (deterministic
// per note, so the layout doesn't reshuffle on every render); text notes size
// to roughly how much they'd have to say.
function estimatePinHeight(note: Note): number {
  if (note.color === 'photo' && note.photoUri) {
    return 170 + (hashSeed(note.id) % 90);
  }
  return 128 + Math.min(note.title.length + note.snippet.length, 160);
}

function splitIntoColumns(notes: Note[], columnCount: number): Note[][] {
  const columns: Note[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);
  for (const note of notes) {
    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(note);
    heights[shortest] += estimatePinHeight(note) + COLUMN_GAP;
  }
  return columns;
}

function Pin({
  note,
  onOpen,
  onShare,
  onDelete,
}: {
  note: Note;
  onOpen: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  const isPhoto = note.color === 'photo' && !!note.photoUri;
  const height = estimatePinHeight(note);

  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed, hovered }: any) => [
        styles.pin,
        { height },
        !isPhoto && { backgroundColor: paperBackgroundColor(note.color) },
        hovered && { transform: [{ scale: 1.015 }] },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {isPhoto ? (
        <>
          <Image source={{ uri: note.photoUri! }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(32,31,29,0.72)']} style={styles.pinScrim} pointerEvents="none">
            <Text style={styles.pinTitlePhoto} numberOfLines={2}>
              {note.title}
            </Text>
          </LinearGradient>
        </>
      ) : (
        <View style={styles.pinTextInner}>
          <Text style={styles.pinTitleFlat} numberOfLines={3}>
            {note.title}
          </Text>
          <Text style={styles.pinSnippetFlat} numberOfLines={5}>
            {note.snippet}
          </Text>
        </View>
      )}

      <View style={styles.pinActions}>
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onShare();
          }}
          style={[styles.pinActionBtn, isPhoto && styles.pinActionBtnOnPhoto]}
          accessibilityRole="button"
          accessibilityLabel={`Share "${note.title}"`}
          hitSlop={8}
        >
          <ShareIcon size={13} color={isPhoto ? '#fff' : colors.text} />
        </Pressable>
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onDelete();
          }}
          style={[styles.pinActionBtn, isPhoto && styles.pinActionBtnOnPhoto]}
          accessibilityRole="button"
          accessibilityLabel={`Delete "${note.title}"`}
          hitSlop={8}
        >
          <TrashIcon size={13} color={isPhoto ? '#fff' : colors.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export function NoteBoard({
  notes,
  onOpen,
  onShare,
  onDelete,
}: {
  notes: Note[];
  onOpen: (note: Note) => void;
  onShare: (note: Note) => void;
  onDelete: (note: Note) => void;
}) {
  const columns = splitIntoColumns(notes, COLUMN_COUNT);

  return (
    <ScrollView contentContainerStyle={styles.board}>
      <View style={styles.columns}>
        {columns.map((col, i) => (
          <View key={i} style={styles.column}>
            {col.map((note) => (
              <Pin
                key={note.id}
                note={note}
                onOpen={() => onOpen(note)}
                onShare={() => onShare(note)}
                onDelete={() => onDelete(note)}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  board: { padding: 16, paddingBottom: 90 },
  columns: { flexDirection: 'row', gap: COLUMN_GAP },
  column: { flex: 1, gap: COLUMN_GAP },
  pin: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  pinScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 28,
    paddingBottom: 10,
  },
  pinTitlePhoto: { fontFamily: fonts.heading, fontSize: 15, color: '#fff' },
  pinTextInner: { flex: 1, padding: 12, gap: 6 },
  pinTitleFlat: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  pinSnippetFlat: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.neutral700 },
  pinActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  pinActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243,242,242,0.85)',
  },
  pinActionBtnOnPhoto: {
    backgroundColor: 'rgba(32,31,29,0.45)',
  },
});
