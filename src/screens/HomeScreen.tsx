import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '../components/ui';
import { homeMenu } from '../config/homeMenu';
import { ChevronRightIcon, DotMark, SettingsIcon } from '../icons';
import { ForestScene } from '../illustrations';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii, shadows } from '../theme/tokens';

export function HomeScreen() {
  const { state, goNotesList, switchWrite, switchImprove, switchScan, goSettings } = useNotes();

  const actionFor = (screenAction: (typeof homeMenu)[number]) => {
    if (screenAction.id === 'store') return goNotesList;
    if (screenAction.kind === 'write') return switchWrite;
    if (screenAction.kind === 'improve') return switchImprove;
    return switchScan;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <DotMark size={26} />
          <Text style={styles.wordmark}>dotted</Text>
        </View>
        <View style={styles.headerRight}>
          <Tag label={`${state.notes.length} saved`} variant="accent" />
          <Pressable onPress={goSettings} style={styles.settingsBtn} accessibilityRole="button" accessibilityLabel="Settings">
            <SettingsIcon size={18} />
          </Pressable>
        </View>
      </View>

      <View style={styles.rows}>
        {homeMenu.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.id}
              onPress={actionFor(item)}
              style={({ pressed, hovered }: any) => [
                styles.row,
                hovered && styles.rowHovered,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.rowLeft}>
                <Icon size={48} />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <ChevronRightIcon />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <ForestScene height={240} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingsBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  rows: { paddingHorizontal: 20, paddingTop: 10, gap: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  rowHovered: { borderColor: colors.accent300 },
  rowPressed: { backgroundColor: colors.accent100, transform: [{ scale: 0.98 }] },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowLabel: { fontFamily: fonts.heading, fontSize: fontSizes.homeRowLabel, color: colors.text },
  footer: { flex: 1, justifyContent: 'flex-end', overflow: 'hidden' },
});
