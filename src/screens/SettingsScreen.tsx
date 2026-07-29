import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr, SegmentedControl, useFocusRing } from '../components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, focusRing, fonts, fontSizes, radii, shadows, spacing } from '../theme/tokens';

type SectionId = 'ai' | 'backup';

function SectionHeader({ title, subtitle, expanded, onPress }: { title: string; subtitle: string; expanded: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed, hovered }: any) => [styles.row, (hovered || pressed) && { backgroundColor: colors.accent100 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ expanded }}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
        <ChevronRightIcon />
      </View>
    </Pressable>
  );
}

function AiSection() {
  const { state, setApiKey, clearApiKey, setAiQuality } = useNotes();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const key = useFocusRing();
  const hasKey = !!state.apiKey;

  const onSave = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    await setApiKey(draft.trim());
    setSaving(false);
    setDraft('');
  };

  const onClear = async () => {
    await clearApiKey();
    setDraft('');
  };

  const onPaste = async () => {
    const text = await Clipboard.getStringAsync().catch(() => '');
    if (text.trim()) setDraft(text.trim());
  };

  return (
    <View style={styles.sectionBody}>
      <View>
        <Text style={styles.kicker}>Anthropic API key</Text>
        <Text style={styles.status}>{hasKey ? 'Connected — Improve and Scan use real AI.' : 'Not set — Improve and Scan use placeholder text.'}</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={hasKey ? 'Enter a new key to replace it' : 'sk-ant-…'}
          placeholderTextColor={colors.neutral700}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { flex: 1 }, key.focused && styles.inputFocused, key.focused && focusRing]}
          {...key.handlers}
        />
        <Button title="Paste" variant="secondary" onPress={onPaste} />
      </View>

      <View style={styles.actionsRow}>
        <Button title="Save" onPress={onSave} disabled={!draft.trim()} loading={saving} style={{ flex: 1 }} />
        {hasKey && <Button title="Remove key" variant="ghost" onPress={onClear} style={{ flex: 1 }} />}
      </View>

      <Text style={styles.helpText}>
        Get a key at console.anthropic.com. It's stored only on this device (Keychain/Keystore on iOS and Android,
        local storage on web) and is sent straight from this app to Anthropic — dotted has no server of its own.
      </Text>

      <Hr style={{ marginVertical: 4 }} />

      <View>
        <Text style={styles.kicker}>AI quality</Text>
        <Text style={styles.status}>
          High uses a stronger model for Improve and Scan — noticeably better results, at a higher cost per
          request on your own API key.
        </Text>
      </View>
      <SegmentedControl
        value={state.aiQuality}
        onChange={setAiQuality}
        options={[
          { label: 'Standard', value: 'standard' },
          { label: 'High', value: 'high' },
        ]}
      />
    </View>
  );
}

function BackupSection() {
  const { exportNotes, importNotes } = useNotes();
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
    <View style={styles.sectionBody}>
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
    </View>
  );
}

export function SettingsScreen() {
  const { state, backToHome } = useNotes();
  const [expanded, setExpanded] = useState<SectionId | null>(null);
  const hasKey = !!state.apiKey;

  const toggle = (id: SectionId) => setExpanded((cur) => (cur === id ? null : id));

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
          <SectionHeader
            title="AI"
            subtitle={hasKey ? 'Connected' : 'Add an API key to use Improve and Scan'}
            expanded={expanded === 'ai'}
            onPress={() => toggle('ai')}
          />
          {expanded === 'ai' && <AiSection />}
          <Hr />
          <SectionHeader
            title="Backup"
            subtitle="Export or import your notes"
            expanded={expanded === 'backup'}
            onPress={() => toggle('backup')}
          />
          {expanded === 'backup' && <BackupSection />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
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
  sectionBody: { paddingHorizontal: 16, paddingBottom: 18, gap: 14 },
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  status: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.text },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    minHeight: spacing.tapTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    outlineWidth: 0,
  },
  inputFocused: { borderColor: colors.accent700 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  helpText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.neutral700 },
  backupStatus: { fontFamily: fonts.body, fontSize: 13, color: colors.accent700 },
  backupStatusError: { color: colors.danger },
});
