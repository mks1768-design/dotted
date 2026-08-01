export type ScreenName = 'home' | 'streak' | 'decks' | 'settings' | 'deck' | 'cardEditor' | 'study' | 'results';

/** The four screens that show the persistent bottom tab bar. */
export const TAB_SCREENS: ScreenName[] = ['home', 'streak', 'decks', 'settings'];

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
  /** Calendar day keys (see date.ts) a lesson was completed on, for the streak calendar. */
  practicedDays: string[];
}

export type AnswerState = 'idle' | 'correct' | 'wrong';

/** Per-deck reminder schedule. Fixed fires every N minutes; random fires at a
 * new random gap (between min and max) each time, so it doesn't get
 * predictable. */
export type ReminderMode =
  | { type: 'off' }
  | { type: 'fixed'; minutes: 30 | 60 | 180 | 360 }
  | { type: 'random'; minMinutes: number; maxMinutes: number };

export type DeckReminders = Record<string, ReminderMode>;

export type StudyMode = 'deck' | 'mix';

export interface AppState {
  hydrated: boolean;
  screen: ScreenName;
  decks: Deck[];
  stats: Stats;
  reminders: DeckReminders;

  activeDeckId: string | null;

  editingCardId: string | null;
  draftFront: string;
  draftBack: string;

  // Active study session — `mode: 'mix'` studies a shuffled pool pulled from
  // every deck instead of one; deckId is only meaningful for `mode: 'deck'`.
  studyMode: StudyMode;
  studyDeckId: string | null;
  studyQueue: string[];
  studyIndex: number;
  hearts: number;
  correctCount: number;
  xpEarned: number;
  answerState: AnswerState;
  sessionEnded: 'completed' | 'outOfHearts' | null;
}
