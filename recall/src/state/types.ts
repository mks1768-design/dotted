export type ScreenName = 'home' | 'deck' | 'cardEditor' | 'study' | 'results';

export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  name: string;
  emoji: string;
  cards: Card[];
  createdAt: number;
}

export interface Stats {
  streak: number;
  lastStudyDayKey: string | null;
  xp: number;
}

export type AnswerState = 'idle' | 'correct' | 'wrong';

export interface AppState {
  hydrated: boolean;
  screen: ScreenName;
  decks: Deck[];
  stats: Stats;

  activeDeckId: string | null;

  editingCardId: string | null;
  draftFront: string;
  draftBack: string;

  // Active study session
  studyDeckId: string | null;
  studyQueue: string[];
  studyIndex: number;
  hearts: number;
  correctCount: number;
  xpEarned: number;
  answerState: AnswerState;
  sessionEnded: 'completed' | 'outOfHearts' | null;
}
