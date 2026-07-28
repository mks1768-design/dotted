import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '../components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

const rows = [
  { id: 'pro', title: 'dotted Pro' },
  { id: 'ai', title: 'AI' },
  { id: 'backup', title: 'Backup' },
] as const;

export function SettingsScreen() {
  const { state, backToHome, goSettingsAi, goSettingsBackup, goPaywall } = useNotes();
  const hasKey = !!state.apiKey;

  const subtitleFor = (id: (typeof rows)[number]['id']) => {
    if (id === 'pro') return state.isPro ? 'Unlocked' : 'Character paper styles, and more to come';
    if (id === 'ai') return hasKey ? 'Connected' : 'Add an API key to use Improve and Scan';
    return 'Export or import your notes';
  };

  const actionFor = (id: (typeof rows)[number]['id']) => {
    if (id === 'pro') return () => goPaywall('settings');
    if (id === 'ai') return goSettingsAi;
    return goSettingsBackup;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.rows}>
        {rows.map((item, i) => (
          <React.Fragment key={item.id}>
            {i > 0 && <View style={styles.hr} />}
            <Pressable
              onPress={actionFor(item.id)}
              style={({ pressed, hovered }: any) => [
                styles.row,
                hovered && { backgroundColor: colors.accent100 },
                pressed && { backgroundColor: colors.accent100, transform: [{ scale: 0.98 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View>
                <Text style={styles.rowLabel}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{subtitleFor(item.id)}</Text>
              </View>
              {item.id === 'pro' && state.isPro ? <Tag label="Pro" variant="accent" /> : <ChevronRightIcon />}
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  rows: { flex: 1 },
  hr: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingHorizontal: 24 },
  rowLabel: { fontFamily: fonts.heading, fontSize: fontSizes.homeRowLabel, color: colors.text },
  rowSubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, marginTop: 4 },
});
