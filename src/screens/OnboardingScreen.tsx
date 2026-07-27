import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { homeMenu } from '../config/homeMenu';
import { onboardingPages } from '../config/onboarding';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

export function OnboardingScreen() {
  const { completeOnboarding } = useNotes();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const scrollRef = useRef<ScrollView>(null);

  const onLayout = (e: LayoutChangeEvent) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(Math.max(0, Math.min(onboardingPages.length - 1, next)));
  };

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setPage(index);
  };

  const isLast = page === onboardingPages.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Pressable onPress={completeOnboarding} style={styles.skipBtn} accessibilityRole="button" accessibilityLabel="Skip">
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}
        onMomentumScrollEnd={onScrollEnd}
        style={styles.pager}
      >
        {onboardingPages.map((p) => {
          const Icon = p.icon;
          return (
            <View key={p.id} style={[styles.page, { width, height }]}>
              <Icon size={72} />
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.body}>{p.body}</Text>

              {p.id === 'actions' && (
                <View style={styles.actionsRow}>
                  {homeMenu.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <View key={item.id} style={styles.actionItem}>
                        <ItemIcon size={30} />
                        <Text style={styles.actionLabel}>{item.label}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingPages.map((p, i) => (
            <View key={p.id} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
        <Button
          title={isLast ? 'Get started' : 'Next'}
          onPress={() => (isLast ? completeOnboarding() : goToPage(page + 1))}
          block
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  skipBtn: { position: 'absolute', top: 12, right: 20, zIndex: 1, padding: 8 },
  skipText: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700 },
  pager: { flex: 1 },
  page: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 18 },
  title: { width: '100%', fontFamily: fonts.heading, fontSize: fontSizes.screenTitle, color: colors.text, textAlign: 'center' },
  body: { width: '100%', fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.neutral700, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  actionItem: { alignItems: 'center', gap: 6, width: 62 },
  actionLabel: { fontFamily: fonts.body, fontSize: 10, letterSpacing: 0.04, color: colors.neutral700, textTransform: 'uppercase', textAlign: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 20, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.divider },
  dotActive: { backgroundColor: colors.text, width: 18 },
});
