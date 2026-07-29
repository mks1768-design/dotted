import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '../components/ui';
import { homeMenu } from '../config/homeMenu';
import { PaperRules } from '../components/RuledPaper';
import { ChevronRightIcon, DotMark, SettingsIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii, shadows, spacing } from '../theme/tokens';

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
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed, hovered }: any) => [
                styles.row,
                hovered && styles.rowHovered,
                pressed && styles.rowPressed,
              ]}
            >
              <PaperRules />
              <View style={styles.rowLeft}>
                <Icon size={52} bgColor={colors.surface} />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <ChevronRightIcon />
            </Pressable>
          );
        })}
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
  settingsBtn: {
    width: spacing.tapTarget,
    height: spacing.tapTarget,
    borderRadius: spacing.tapTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  // Four sheets stacked down the desk. They still divide the screen evenly, so
  // the reach and rhythm of the old full-bleed rows is unchanged.
  rows: { flex: 1, paddingHorizontal: 14, paddingTop: 2, paddingBottom: 16, gap: 10 },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 18,
    borderRadius: radii.paper,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.paper,
  },
  // Pressing lifts the sheet rather than tinting it — the tint would fight the
  // printed rules underneath.
  rowHovered: { backgroundColor: colors.neutral100 },
  rowPressed: { backgroundColor: colors.neutral100, transform: [{ scale: 0.985 }] },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowLabel: { fontFamily: fonts.heading, fontSize: fontSizes.homeRowLabel, color: colors.text },
});
