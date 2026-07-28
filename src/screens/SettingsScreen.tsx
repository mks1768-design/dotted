import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hr, Tag } from '../components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii, shadows } from '../theme/tokens';

function Row({ title, subtitle, onPress, right }: { title: string; subtitle: string; onPress: () => void; right?: React.ReactNode }) {
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {right ?? <ChevronRightIcon />}
    </Pressable>
  );
}

export function SettingsScreen() {
  const { state, backToHome, goSettingsAi, goSettingsBackup, goPaywall } = useNotes();
  const hasKey = !!state.apiKey;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={backToHome} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to home">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.group}>
          <Row
            title="dotted Pro"
            subtitle={state.isPro ? 'Unlocked' : 'Character paper styles, and more to come'}
            onPress={() => goPaywall('settings')}
            right={state.isPro ? <Tag label="Pro" variant="accent" /> : undefined}
          />
          <Hr />
          <Row title="AI" subtitle={hasKey ? 'Connected' : 'Add an API key to use Improve and Scan'} onPress={goSettingsAi} />
          <Hr />
          <Row title="Backup" subtitle="Export or import your notes" onPress={goSettingsBackup} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  group: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 12 },
  rowTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  rowSubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, marginTop: 2 },
});
