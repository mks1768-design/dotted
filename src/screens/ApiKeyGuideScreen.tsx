import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Hr } from '../components/ui';
import { ChevronLeftIcon, DotSparklesIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, fontSizes, radii } from '../theme/tokens';

const CONSOLE_URL = 'https://console.anthropic.com';
const COPIED_RESET_MS = 1600;

type Step = { n: number; title: string; body: string };

// Written for someone who has never seen an API console. Every step names the
// exact button to press, and step 2 leads with the part that silently blocks
// people: a key without credit on the account returns an error on first use.
const steps: Step[] = [
  {
    n: 1,
    title: 'Make an Anthropic account',
    body: 'Open console.anthropic.com and sign up. Choose "Individual" when it asks how you\'ll use the API — that\'s the option for one person building on their own.',
  },
  {
    n: 2,
    title: 'Add credit — this part is required',
    body: 'Go to Billing and buy usage credits. $5 is the minimum and is plenty. Skipping this is the most common mistake: a key on an account with no credit fails the moment you use it, and the error looks like the key is broken when it isn\'t.',
  },
  {
    n: 3,
    title: 'Create the key',
    body: 'Go to API keys and press Create Key. It starts with "sk-ant-" and is shown to you exactly once — copy it right away. If you lose it, no harm done: delete it and make another.',
  },
  {
    n: 4,
    title: 'Paste it into dotted',
    body: 'Come back here, open Settings → AI, tap Paste, then Save. Improve and Scan start working immediately.',
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.n}</Text>
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepBody}>{step.body}</Text>
      </View>
    </View>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.note}>
      <Text style={styles.noteTitle}>{title}</Text>
      <Text style={styles.noteBody}>{body}</Text>
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
          <DotSparklesIcon size={64} />
        </View>

        <Text style={styles.lede}>
          dotted has no server of its own. That keeps your notes on this device and the app free — but it also
          means the AI features run on a key you own, billed to you directly by Anthropic. It takes about five
          minutes to set up, once.
        </Text>

        <Note
          title="You don't have to do this"
          body="Writing, photo notes, the board, search, backup and sharing all work without a key. Only Improve and Scan need one."
        />

        <Hr />

        {steps.map((step) => (
          <StepCard key={step.n} step={step} />
        ))}

        <View style={styles.linkBlock}>
          <Button title="Open console.anthropic.com" onPress={openConsole} block />
          <Button
            title={copied ? 'Link copied' : 'Copy the link instead'}
            variant="secondary"
            onPress={copyLink}
            block
          />
        </View>

        <Hr />

        <Note
          title="What it costs"
          body="You pay Anthropic for what you use, from the credit you bought. Improving a note runs a cent or two; scanning a page a little more, because the photo counts as input. $5 covers a few hundred uses. In the console you can set a spending limit so it can never surprise you."
        />

        <Note
          title="Where your writing goes"
          body="Only when you tap Improve or Capture: that note's text, or that one photo, goes straight from this app to Anthropic and the result comes back. Nothing passes through a dotted server, because there isn't one. Everything else you write never leaves the device."
        />

        <Note
          title="Keeping the key safe"
          body="It's stored in this phone's secure storage (Keystore on Android, Keychain on iOS) and never shown again after you save it. Treat it like a password — anyone with it can spend your credit. You can delete it from the console at any time and the app simply stops doing AI."
        />

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
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 18 },
  hero: { alignItems: 'center', paddingTop: 4 },
  lede: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.text },
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
  stepText: { flex: 1, gap: 4 },
  stepTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  stepBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.neutral700 },
  note: {
    backgroundColor: colors.surface,
    borderRadius: radii.paper,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent700,
    padding: 14,
    gap: 5,
  },
  noteTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.text },
  noteBody: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 21, color: colors.neutral700 },
  linkBlock: { gap: 10 },
  settingsBtn: { marginTop: 4 },
});
