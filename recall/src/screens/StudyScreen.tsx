import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartsRow, PrimaryButton, ProgressBar } from '../components/ui';
import { XIcon } from '../icons';
import { useStudy } from '../state/StudyContext';
import { shuffled } from '../state/shuffle';
import { Card } from '../state/types';
import { colors, fontSizes, radii, shadows, spacing } from '../theme/tokens';

const MAX_CHOICES = 4;

export function StudyScreen() {
  const { state, exitStudy, answer, continueStudy } = useStudy();
  const [selected, setSelected] = useState<string | null>(null);

  // In 'deck' mode the pool is just that one deck; in 'mix' mode it's every
  // deck, since the card being asked about could be from any of them.
  const poolDecks =
    state.studyMode === 'mix' ? state.decks : state.decks.filter((d) => d.id === state.studyDeckId);
  const poolCards = poolDecks.flatMap((d) => d.cards);

  const cardId = state.studyQueue[state.studyIndex];
  const card: Card | undefined = poolCards.find((c) => c.id === cardId);
  const sourceDeck = state.studyMode === 'deck' ? poolDecks[0] : null;

  useEffect(() => {
    setSelected(null);
  }, [state.studyIndex]);

  const choices = useMemo(() => {
    if (!card) return [];
    const distractorPool = shuffled(poolCards.filter((c) => c.id !== card.id).map((c) => c.back));
    const distractors = distractorPool.slice(0, MAX_CHOICES - 1);
    return shuffled([card.back, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  if (poolDecks.length === 0 || !card) {
    exitStudy();
    return null;
  }

  const answered = state.answerState !== 'idle';
  const sourceLabel = sourceDeck ? sourceDeck.name : 'Mix review';

  const onSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    answer(option === card.back);
  };

  const choiceStyle = (option: string) => {
    if (!answered) return styles.choice;
    if (option === card.back) return [styles.choice, styles.choiceCorrect];
    if (option === selected) return [styles.choice, styles.choiceWrong];
    return [styles.choice, styles.choiceDim];
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={exitStudy} hitSlop={10} accessibilityRole="button" accessibilityLabel="End lesson">
          <XIcon size={22} color={colors.textMuted} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar progress={state.studyIndex / state.studyQueue.length} />
        </View>
        <HeartsRow hearts={state.hearts} />
      </View>

      <View style={styles.content}>
        <Text style={styles.prompt}>{sourceLabel} · Choose the match</Text>
        <View style={styles.cardFace}>
          <Text style={styles.cardFront}>{card.front}</Text>
        </View>

        <View style={styles.choices}>
          {choices.map((option) => (
            <Pressable key={option} onPress={() => onSelect(option)} style={choiceStyle(option)} disabled={answered}>
              <Text style={styles.choiceText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.footer, answered && (state.answerState === 'correct' ? styles.footerCorrect : styles.footerWrong)]}>
        {answered && (
          <Text style={[styles.feedbackText, { color: state.answerState === 'correct' ? colors.success : colors.danger }]}>
            {state.answerState === 'correct' ? 'Nice!' : `Answer: ${card.back}`}
          </Text>
        )}
        <PrimaryButton
          label={answered ? 'Continue' : 'Skip'}
          onPress={answered ? continueStudy : () => onSelect('')}
          tone={answered ? (state.answerState === 'correct' ? 'success' : 'danger') : 'primary'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gapTight,
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.topPadding,
    paddingBottom: spacing.gapTight,
  },
  content: { flex: 1, paddingHorizontal: spacing.screenPaddingH, gap: spacing.gapStacked },
  prompt: { fontSize: fontSizes.smallLabel, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase' },
  cardFace: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.gapStacked * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...shadows.md,
  },
  cardFront: { fontSize: fontSizes.cardFront, fontWeight: '800', color: colors.text, textAlign: 'center' },
  choices: { gap: spacing.gapTight },
  choice: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.gapStacked,
  },
  choiceCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  choiceWrong: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  choiceDim: { opacity: 0.5 },
  choiceText: { fontSize: fontSizes.body, fontWeight: '600', color: colors.text },
  footer: { padding: spacing.screenPaddingH, gap: spacing.gapTight },
  footerCorrect: { backgroundColor: colors.successLight },
  footerWrong: { backgroundColor: colors.dangerLight },
  feedbackText: { fontSize: fontSizes.body, fontWeight: '800' },
});
