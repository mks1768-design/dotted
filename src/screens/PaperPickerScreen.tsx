import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { RuledPaper } from '../components/RuledPaper';
import { paperStyles } from '../config/paperStyles';
import { ChevronLeftIcon, PhotoIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

const SAMPLE_BODY =
  "This is what your writing looks like on this paper. Pick whatever feels right — you can always change it later.";

export function PaperPickerScreen() {
  const { state, backToEditor, selectPaperStyle } = useNotes();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const scrollRef = useRef<ScrollView>(null);
  const { width, height } = size;

  const onLayout = (e: LayoutChangeEvent) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  // Tracks the scroll position continuously (not just on momentum end) so
  // "Use this paper" always matches what's actually on screen — momentum end
  // never fires for wheel/trackpad scrolling on web, which would otherwise
  // leave `page` pointing at a style the user isn't looking at.
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(Math.max(0, Math.min(paperStyles.length - 1, next)));
  };

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setPage(index);
  };

  const current = paperStyles[page];
  const title = state.draftTitle.trim() || 'Untitled';
  const body = state.draftBody.trim() || SAMPLE_BODY;
  const choose = (id: (typeof paperStyles)[number]['id']) => selectPaperStyle(id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={backToEditor} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Cancel">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose a paper</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {paperStyles.map((p) => (
          <Pressable key={p.id} style={[styles.page, { width, height }]} onPress={() => choose(p.id)}>
            {p.isPhoto ? (
              <View style={[StyleSheet.absoluteFill, styles.photoPreview]}>
                <PhotoIcon size={32} color={colors.neutral700} />
                <Text style={styles.photoPreviewText}>Your photo becomes the background</Text>
              </View>
            ) : (
              <RuledPaper tint={p.swatchColor} decoration={p.decoration} />
            )}
            {!p.isPhoto && (
              <View style={styles.preview}>
                <Text style={styles.previewTitle}>{title}</Text>
                <Text style={styles.previewBody} numberOfLines={6}>
                  {body}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {paperStyles.map((p, i) => (
            <Pressable key={p.id} onPress={() => goToPage(i)} hitSlop={8}>
              <View style={[styles.dot, i === page && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>{current.label}</Text>
        <Button title="Use this paper" onPress={() => choose(current.id)} block />
      </View>
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
  headerTitle: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  pager: { flex: 1 },
  page: { overflow: 'hidden' },
  preview: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 24, paddingTop: 28, gap: 10 },
  previewTitle: { fontFamily: fonts.heading, fontSize: fontSizes.screenTitle, color: colors.text },
  previewBody: { fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: 26, color: colors.text },
  photoPreview: { alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.neutral200 },
  photoPreviewText: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, textAlign: 'center', paddingHorizontal: 40 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8, gap: 14, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.divider },
  dotActive: { backgroundColor: colors.text, width: 18 },
  label: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700 },
});
