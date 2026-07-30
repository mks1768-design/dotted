import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { ChevronLeftIcon, DotSparklesIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii } from '../theme/tokens';

const CONSOLE_URL = 'https://console.anthropic.com';
const COPIED_RESET_MS = 1600;

type Step = { n: number; title: string; detail?: string };

// Kept to fragments on purpose — a step someone can read in one glance while
// switching back and forth to the console beats a paragraph they skip. Step 2
// gets a warning line anyway, because skipping it is the one mistake that
// makes a correctly-copied key fail and look broken.
const steps: Step[] = [
  { n: 1, title: 'Sign up at console.anthropic.com', detail: 'Pick "Individual".' },
  { n: 2, title: 'Add $5 credit', detail: '⚠️ Required — a key with no credit fails on first use.' },
  { n: 3, title: 'Create Key', detail: 'Copy the sk-ant-… code right away.' },
  { n: 4, title: 'Paste it here', detail: 'Settings → AI → Paste → Save.' },
];

function StepRow({ step }: { step: Step }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.n}</Text>
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        {!!step.detail && <Text style={styles.stepDetail}>{step.detail}</Text>}
      </View>
    </View>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

export function ApiKeyGuideScreen() {
  const { closeApiKeyGuide, goSettings } = useNotes();
  const [copied, setCopied] = useState(false);

  const openConsole = () => {
    // Falls through to the copy button below if the device has no browser
    // handler — nothing here should dead-end.
    Linking.openURL(CONSOLE_URL).catch(() => {});
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(CONSOLE_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={closeApiKeyGuide}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={20} />
        </Pressable>
        <Text style={styles.title}>Turning on AI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <DotSparklesIcon size={56} />
          <Text style={styles.optionalTag}>Optional — everything else works without this</Text>
        </View>

        <View style={styles.steps}>
          {steps.map((step) => (
            <StepRow key={step.n} step={step} />
          ))}
        </View>

        <View style={styles.linkBlock}>
          <Button title="Open console.anthropic.com" onPress={openConsole} block />
          <Button
            title={copied ? 'Link copied' : 'Copy the link instead'}
            variant="secondary"
            onPress={copyLink}
            block
          />
        </View>

        <View style={styles.facts}>
          <FactRow label="Cost" value="~1–5¢ per use, from the $5 you add." />
          <FactRow label="Your notes" value="Only what you Improve or Scan is sent — the rest stays on this phone." />
          <FactRow label="The key" value="Stored in this phone's secure storage. Delete it anytime in the console." />
        </View>

        <Button title="Go to Settings" variant="secondary" onPress={goSettings} block style={styles.settingsBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.headerTitle, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 22 },
  hero: { alignItems: 'center', paddingTop: 4, gap: 8 },
  optionalTag: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, fontStyle: 'italic' },
  steps: { gap: 18 },
  step: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent700,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: { fontFamily: fonts.heading, fontSize: 15, color: colors.surface },
  stepText: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  stepDetail: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.neutral700 },
  linkBlock: { gap: 10 },
  facts: {
    backgroundColor: colors.surface,
    borderRadius: radii.paper,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 14,
    gap: 12,
  },
  fact: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  factLabel: { fontFamily: fonts.heading, fontSize: 13, color: colors.accent700, width: 74 },
  factValue: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.text },
  settingsBtn: { marginTop: -4 },
});
