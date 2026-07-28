import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Tag } from '../components/ui';
import { homeMenu } from '../config/homeMenu';
import { dateKey, promptForDate } from '../config/quests';
import { CheckIcon, ChevronRightIcon, DotMark, SettingsIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii, shadows } from '../theme/tokens';

export function HomeScreen() {
  const { state, goNotesList, switchWrite, switchImprove, switchScan, goSettings, startQuest } = useNotes();

  const actionFor = (screenAction: (typeof homeMenu)[number]) => {
    if (screenAction.id === 'store') return goNotesList;
    if (screenAction.kind === 'write') return switchWrite;
    if (screenAction.kind === 'improve') return switchImprove;
    return switchScan;
  };

  const todaysPrompt = promptForDate(new Date());
  const questDoneToday = state.questCompletedDate === dateKey(new Date());

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

      <View style={styles.content}>
        <Card
          onPress={questDoneToday ? undefined : () => startQuest(todaysPrompt)}
          style={[styles.questCard, questDoneToday && styles.questCardDone] as any}
        >
          <View style={styles.questTop}>
            <Text style={styles.questKicker}>TODAY'S PROMPT</Text>
            {questDoneToday && (
              <View style={styles.questDoneBadge}>
                <CheckIcon size={12} color={colors.accent700} />
                <Text style={styles.questDoneText}>Done</Text>
              </View>
            )}
          </View>
          <Text style={styles.questPrompt}>{todaysPrompt}</Text>
          {!questDoneToday && <Text style={styles.questCta}>Write about this →</Text>}
        </Card>

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
  content: { flex: 1, justifyContent: 'center' },
  questCard: { marginHorizontal: 20, marginTop: 6 },
  questCardDone: { opacity: 0.7 },
  questTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questKicker: { fontFamily: fonts.body, fontSize: 11, color: colors.neutral700, letterSpacing: 0.6 },
  questDoneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  questDoneText: { fontFamily: fonts.body, fontSize: 12, color: colors.accent700 },
  questPrompt: { fontFamily: fonts.heading, fontSize: 19, color: colors.text, marginTop: 4 },
  questCta: { fontFamily: fonts.body, fontSize: 13, color: colors.accent700, marginTop: 10 },
  rows: { paddingHorizontal: 20, paddingTop: 14, gap: 14 },
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
});
