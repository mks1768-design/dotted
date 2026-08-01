import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardsIcon, FlameIcon, GearIcon, HomeIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { ScreenName } from '../state/types';
import { colors, fontSizes, shadows, spacing } from '../theme/tokens';

type TabKey = 'home' | 'streak' | 'decks' | 'settings';

export function TabBar() {
  const { state, goHome, goStreak, goDecks, goSettings } = useStudy();
  const active = state.screen as TabKey;

  const tabs: { key: TabKey; label: string; onPress: () => void; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      key: 'home',
      label: 'Home',
      onPress: goHome,
      icon: (isActive) => <HomeIcon size={22} filled={isActive} color={isActive ? colors.primary : colors.textMuted} />,
    },
    {
      key: 'streak',
      label: 'Streak',
      onPress: goStreak,
      icon: (isActive) => <FlameIcon size={22} color={isActive ? colors.streak : colors.textMuted} />,
    },
    {
      key: 'decks',
      label: 'Decks',
      onPress: goDecks,
      icon: (isActive) => <CardsIcon size={22} filled={isActive} color={isActive ? colors.primary : colors.textMuted} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      onPress: goSettings,
      icon: (isActive) => <GearIcon size={22} filled={isActive} color={isActive ? colors.primary : colors.textMuted} />,
    },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={tab.onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              {tab.icon(isActive)}
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export function isTabScreen(screen: ScreenName): screen is TabKey {
  return screen === 'home' || screen === 'streak' || screen === 'decks' || screen === 'settings';
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.surface, ...shadows.md },
  row: {
    flexDirection: 'row',
    paddingTop: spacing.gapTight,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  labelActive: { color: colors.primary },
});
