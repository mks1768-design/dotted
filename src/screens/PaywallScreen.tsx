import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { CheckIcon, CloseIcon, DotSparklesIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, radii } from '../theme/tokens';

const PRICE = '$2.99';

const PERKS = ['Character paper styles for the editor (Quiet dot, Scattered dots)', 'More Pro perks are on the way'];

export function PaywallScreen() {
  const { state, closePaywall, buyPro } = useNotes();
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onBuy = async () => {
    setMessage(null);
    setBuying(true);
    const result = await buyPro();
    setBuying(false);
    if (!result.ok) setMessage(result.message);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Pressable onPress={closePaywall} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
          <CloseIcon size={16} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.hero}>
          <DotSparklesIcon size={72} />
        </View>
        <Text style={styles.title}>dotted Pro</Text>
        <Text style={styles.subtitle}>A one-time unlock — no subscription.</Text>

        <View style={styles.perks}>
          {PERKS.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <CheckIcon size={15} color={colors.accent700} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        {state.isPro ? (
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedText}>You already own Pro — thank you.</Text>
          </View>
        ) : (
          <>
            <Button title={`Unlock Pro — ${PRICE}`} onPress={onBuy} loading={buying} block />
            {message && <Text style={styles.message}>{message}</Text>}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 34, height: 34 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center', gap: 8 },
  hero: { marginBottom: 8 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700, marginBottom: 20 },
  perks: { width: '100%', gap: 12, marginBottom: 28 },
  perkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  perkText: { flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.text },
  ownedBadge: {
    width: '100%',
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.accent100,
    alignItems: 'center',
  },
  ownedText: { fontFamily: fonts.body, fontSize: 14, color: colors.accent700 },
  message: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, textAlign: 'center', marginTop: 10 },
});
