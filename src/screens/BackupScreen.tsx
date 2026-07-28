import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { ChevronLeftIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

export function BackupScreen() {
  const { goSettings, exportNotes, importNotes } = useNotes();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const onExport = async () => {
    setStatus(null);
    setExporting(true);
    const result = await exportNotes();
    setExporting(false);
    setStatus(
      result.ok
        ? { text: `Exported ${result.count} note${result.count === 1 ? '' : 's'}.`, isError: false }
        : { text: result.error, isError: true }
    );
  };

  const onImport = async () => {
    setStatus(null);
    setImporting(true);
    const result = await importNotes();
    setImporting(false);
    if ('canceled' in result) return;
    setStatus(
      result.ok
        ? { text: `Imported ${result.count} note${result.count === 1 ? '' : 's'}.`, isError: false }
        : { text: result.error, isError: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goSettings} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to settings">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Backup</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.status}>
          Every note lives only on this device. Export a backup file every so often so a lost or wiped phone
          doesn't mean losing what you've written.
        </Text>

        <View style={styles.actionsRow}>
          <Button title="Export all notes" onPress={onExport} loading={exporting} disabled={importing} style={{ flex: 1 }} />
          <Button
            title="Import notes"
            variant="secondary"
            onPress={onImport}
            loading={importing}
            disabled={exporting}
            style={{ flex: 1 }}
          />
        </View>
        {status && <Text style={[styles.backupStatus, status.isError && styles.backupStatusError]}>{status.text}</Text>}
        <Text style={styles.helpText}>
          Import adds notes from a backup file alongside what's already here — it won't delete or overwrite
          anything currently on this device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },
  status: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.text },
  actionsRow: { flexDirection: 'row', gap: 12 },
  helpText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.neutral700 },
  backupStatus: { fontFamily: fonts.body, fontSize: 13, color: colors.accent700 },
  backupStatusError: { color: colors.danger },
});
