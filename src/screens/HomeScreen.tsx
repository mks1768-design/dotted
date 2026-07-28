import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '../components/ui';
import { homeMenu } from '../config/homeMenu';
import { ChevronRightIcon, DotMark, SettingsIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

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
        {homeMenu.map((item, i) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.id}>
              {i > 0 && <View style={styles.hr} />}
              <Pressable
                onPress={actionFor(item)}
                style={({ pressed, hovered }: any) => [
                  styles.row,
                  hovered && { backgroundColor: colors.accent100 },
                  pressed && { backgroundColor: colors.accent100, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Icon size={52} />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
                <ChevronRightIcon />
              </Pressable>
            </React.Fragment>
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
  settingsBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontFamily: fonts.heading, fontSize: 18, color: colors.text },
  rows: { flex: 1 },
  hr: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 24,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowLabel: { fontFamily: fonts.heading, fontSize: fontSizes.homeRowLabel, color: colors.text },
});
