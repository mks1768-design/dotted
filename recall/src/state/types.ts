export type ScreenName = 'home' | 'deck' | 'cardEditor' | 'study' | 'results' | 'settings';

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

/** Minutes between reminder notifications. */
export type ReminderInterval = 30 | 60 | 180 | 360;

export interface Reminders {
  enabled: boolean;
  intervalMinutes: ReminderInterval;
}

export interface AppState {
  hydrated: boolean;
  screen: ScreenName;
  decks: Deck[];
  stats: Stats;
  reminders: Reminders;

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
