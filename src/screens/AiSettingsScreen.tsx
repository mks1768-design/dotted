import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr, SegmentedControl } from '../components/ui';
import { ChevronLeftIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes } from '../theme/tokens';

export function AiSettingsScreen() {
  const { state, goSettings, setApiKey, clearApiKey, setAiQuality } = useNotes();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goSettings} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to settings">
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>AI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
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
            style={[styles.input, { flex: 1 }]}
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

        <Hr style={{ marginVertical: 8 }} />

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
  kicker: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700, marginBottom: 6 },
  status: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.text },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    outlineWidth: 0,
  },
  actionsRow: { flexDirection: 'row', gap: 12 },
  helpText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.neutral700 },
});
