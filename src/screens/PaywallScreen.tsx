import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { CheckIcon, CloseIcon, DotSparklesIcon } from '../icons';
import { useNotes } from '../state/NotesContext';
import { colors, fonts, radii } from '../theme/tokens';

const PRICE = '$2.99';

type Row = { label: string; free: boolean; pro: boolean };

const ROWS: Row[] = [
  { label: 'Unlimited notes', free: true, pro: true },
  { label: 'Board & list views', free: true, pro: true },
  { label: 'AI rewrite & scan (your own key)', free: true, pro: true },
  { label: 'Plain paper styles', free: true, pro: true },
  { label: 'Character paper styles', free: false, pro: true },
  { label: 'Future Pro styles & perks', free: false, pro: true },
];

function Mark({ on }: { on: boolean }) {
  return on ? (
    <CheckIcon size={14} color={colors.accent700} />
  ) : (
    <Text style={styles.dash}>–</Text>
  );
}

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

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <DotSparklesIcon size={60} />
        </View>
        <Text style={styles.title}>dotted Pro</Text>
        <Text style={styles.subtitle}>A one-time unlock — no subscription.</Text>

        <View style={styles.table}>
          <View style={styles.colHeaderRow}>
            <View style={styles.labelCol} />
            <View style={styles.col}>
              <Text style={styles.colHeaderText}>Free</Text>
            </View>
            <View style={[styles.col, styles.proCol, styles.proColHeader]}>
              <Text style={[styles.colHeaderText, styles.proColHeaderText]}>Pro</Text>
            </View>
          </View>

          {ROWS.map((row, i) => (
            <View key={row.label} style={[styles.row, i === ROWS.length - 1 && styles.rowLast]}>
              <View style={styles.labelCol}>
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
              <View style={styles.col}>
                <Mark on={row.free} />
              </View>
              <View style={[styles.col, styles.proCol]}>
                <Mark on={row.pro} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
  scrollBody: { paddingHorizontal: 24, paddingBottom: 12, alignItems: 'center' },
  hero: { marginTop: 4, marginBottom: 4 },
  title: { fontFamily: fonts.heading, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.neutral700, marginBottom: 20, textAlign: 'center' },
  table: { width: '100%', borderWidth: 1, borderColor: colors.divider, borderRadius: radii.md, overflow: 'hidden', backgroundColor: colors.surface },
  colHeaderRow: { flexDirection: 'row', alignItems: 'stretch', borderBottomWidth: 1, borderBottomColor: colors.divider },
  labelCol: { flex: 1, justifyContent: 'center', paddingVertical: 10, paddingLeft: 14, paddingRight: 6 },
  col: { width: 56, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  proCol: { backgroundColor: colors.accent100 },
  proColHeader: {},
  colHeaderText: { fontFamily: fonts.body, fontSize: 12, color: colors.neutral700 },
  proColHeaderText: { color: colors.accent700, fontWeight: '600' as const },
  row: { flexDirection: 'row', alignItems: 'stretch', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17, color: colors.text },
  dash: { fontFamily: fonts.body, fontSize: 14, color: colors.neutral700 },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
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
