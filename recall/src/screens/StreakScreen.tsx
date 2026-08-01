import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlameIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { monthGrid } from '../state/date';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function StreakScreen() {
  const { state } = useStudy();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const practiced = new Set(state.stats.practicedDays);
  const grid = monthGrid(viewYear, viewMonth);
  const daysThisMonth = grid.filter((d) => d && practiced.has(d.dayKey)).length;

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Streak</Text>
      </View>

      <View style={styles.hero}>
        <FlameIcon size={72} />
        <Text style={styles.num}>{state.stats.streak}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>

      <View style={styles.tip}>
        <FlameIcon size={18} />
        <Text style={styles.tipText}>Study today to keep your streak alive!</Text>
      </View>

      <View style={styles.monthRow}>
        <Text style={styles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <View style={styles.monthNav}>
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Previous month">
            <Text style={styles.monthArrow}>‹</Text>
          </Pressable>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Next month">
            <Text style={styles.monthArrow}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.dowRow}>
          {WEEKDAY_LABELS.map((d) => (
            <Text key={d} style={styles.dow}>{d}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {grid.map((cell, i) =>
            cell ? (
              <View key={cell.dayKey} style={styles.dayCell}>
                <View style={[styles.day, practiced.has(cell.dayKey) && styles.dayHit, cell.isToday && styles.dayToday]}>
                  <Text style={[styles.dayText, practiced.has(cell.dayKey) && styles.dayTextHit]}>{cell.date}</Text>
                </View>
              </View>
            ) : (
              <View key={`blank-${i}`} style={styles.dayCell} />
            )
          )}
        </View>
      </View>

      <Text style={styles.footNote}>{daysThisMonth} day{daysThisMonth === 1 ? '' : 's'} practiced this month</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.screenPaddingH, paddingTop: spacing.topPadding, paddingBottom: 4 },
  title: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text },
  hero: { alignItems: 'center', marginTop: 8 },
  num: { fontSize: 56, fontWeight: '900', color: colors.streak, marginTop: 4 },
  label: { fontSize: fontSizes.body, color: colors.textMuted, fontWeight: '700' },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: spacing.screenPaddingH,
    marginTop: spacing.gapStacked,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.gapTight,
    ...shadows.sm,
  },
  tipText: { fontSize: fontSizes.smallLabel, color: colors.textMuted, fontWeight: '600', flex: 1 },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.screenPaddingH,
    marginTop: spacing.gapStacked,
    marginBottom: 8,
  },
  monthTitle: { fontSize: fontSizes.sectionTitle, fontWeight: '800', color: colors.text },
  monthNav: { flexDirection: 'row', gap: 16 },
  monthArrow: { fontSize: 20, color: colors.textMuted, fontWeight: '700' },
  grid: {
    marginHorizontal: spacing.screenPaddingH,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.gapStacked,
    ...shadows.sm,
  },
  dowRow: { flexDirection: 'row', marginBottom: 8 },
  dow: { flex: 1, textAlign: 'center', fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.textMuted },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, aspectRatio: 1.4, alignItems: 'center', justifyContent: 'center' },
  day: { width: 34, height: 34, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  dayHit: { backgroundColor: colors.streak },
  dayToday: { borderWidth: 2, borderColor: colors.primary },
  dayText: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.text },
  dayTextHit: { color: '#fff' },
  footNote: { textAlign: 'center', color: colors.textMuted, fontSize: fontSizes.smallLabel, marginTop: spacing.gapStacked },
});
