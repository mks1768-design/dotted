import { todayKey, yesterdayKey } from './date';
import { generateId } from './id';
import { AppState, Card, Deck, ReminderMode, StudyMode } from './types';

const STARTING_HEARTS = 5;
const XP_PER_CORRECT = 10;

export const initialState: AppState = {
  hydrated: false,
  screen: 'home',
  decks: [],
  stats: { streak: 0, lastStudyDayKey: null, xp: 0, practicedDays: [] },
  reminders: {},

  activeDeckId: null,

  editingCardId: null,
  draftFront: '',
  draftBack: '',

  studyMode: 'deck',
  studyDeckId: null,
  studyQueue: [],
  studyIndex: 0,
  hearts: STARTING_HEARTS,
  correctCount: 0,
  xpEarned: 0,
  answerState: 'idle',
  sessionEnded: null,
};

export type Action =
  | { type: 'HYDRATE'; decks: Deck[]; stats: AppState['stats']; reminders: AppState['reminders'] }
  | { type: 'GO_HOME' }
  | { type: 'GO_STREAK' }
  | { type: 'GO_DECKS' }
  | { type: 'GO_SETTINGS' }
  | { type: 'SET_DECK_REMINDER'; deckId: string; mode: ReminderMode }
  | { type: 'NEW_DECK'; name: string; emoji: string }
  | { type: 'OPEN_DECK'; id: string }
  | { type: 'RENAME_DECK'; id: string; name: string }
  | { type: 'DELETE_DECK'; id: string }
  | { type: 'NEW_CARD' }
  | { type: 'EDIT_CARD'; card: Card }
  | { type: 'CANCEL_CARD_EDIT' }
  | { type: 'SET_DRAFT_FRONT'; text: string }
  | { type: 'SET_DRAFT_BACK'; text: string }
  | { type: 'SAVE_CARD' }
  | { type: 'DELETE_CARD'; id: string }
  | { type: 'START_STUDY'; mode: StudyMode; deckId: string | null; queue: string[] }
  | { type: 'ANSWER'; correct: boolean }
  | { type: 'CONTINUE' }
  | { type: 'EXIT_STUDY' }
  | { type: 'FINISH_RESULTS' };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, decks: action.decks, stats: action.stats, reminders: action.reminders, hydrated: true };

    case 'GO_HOME':
      return { ...state, screen: 'home', activeDeckId: null };

    case 'GO_STREAK':
      return { ...state, screen: 'streak' };

    case 'GO_DECKS':
      return { ...state, screen: 'decks' };

    case 'GO_SETTINGS':
      return { ...state, screen: 'settings' };

    case 'SET_DECK_REMINDER':
      return { ...state, reminders: { ...state.reminders, [action.deckId]: action.mode } };

    case 'NEW_DECK': {
      const deck: Deck = { id: generateId(), name: action.name, emoji: action.emoji, cards: [], createdAt: Date.now() };
      return { ...state, decks: [deck, ...state.decks], screen: 'deck', activeDeckId: deck.id };
    }

    case 'OPEN_DECK':
      return { ...state, screen: 'deck', activeDeckId: action.id };

    case 'RENAME_DECK':
      return { ...state, decks: state.decks.map((d) => (d.id === action.id ? { ...d, name: action.name } : d)) };

    case 'DELETE_DECK': {
      const { [action.id]: _removed, ...reminders } = state.reminders;
      return {
        ...state,
        decks: state.decks.filter((d) => d.id !== action.id),
        reminders,
        screen: state.activeDeckId === action.id ? 'decks' : state.screen,
        activeDeckId: state.activeDeckId === action.id ? null : state.activeDeckId,
      };
    }

    case 'NEW_CARD':
      return { ...state, editingCardId: null, draftFront: '', draftBack: '', screen: 'cardEditor' };

    case 'EDIT_CARD':
      return { ...state, editingCardId: action.card.id, draftFront: action.card.front, draftBack: action.card.back, screen: 'cardEditor' };

    case 'CANCEL_CARD_EDIT':
      return { ...state, editingCardId: null, draftFront: '', draftBack: '', screen: 'deck' };

    case 'SET_DRAFT_FRONT':
      return { ...state, draftFront: action.text };

    case 'SET_DRAFT_BACK':
      return { ...state, draftBack: action.text };

    case 'SAVE_CARD': {
      const front = state.draftFront.trim();
      const back = state.draftBack.trim();
      if (!front || !back || !state.activeDeckId) return { ...state, screen: 'deck' };
      const decks = state.decks.map((d) => {
        if (d.id !== state.activeDeckId) return d;
        if (state.editingCardId) {
          return { ...d, cards: d.cards.map((c) => (c.id === state.editingCardId ? { ...c, front, back } : c)) };
        }
        return { ...d, cards: [...d.cards, { id: generateId(), front, back }] };
      });
      return { ...state, decks, screen: 'deck', editingCardId: null, draftFront: '', draftBack: '' };
    }

    case 'DELETE_CARD': {
      const decks = state.decks.map((d) =>
        d.id === state.activeDeckId ? { ...d, cards: d.cards.filter((c) => c.id !== action.id) } : d
      );
      return { ...state, decks };
    }

    case 'START_STUDY':
      return {
        ...state,
        screen: 'study',
        studyMode: action.mode,
        studyDeckId: action.deckId,
        studyQueue: action.queue,
        studyIndex: 0,
        hearts: STARTING_HEARTS,
        correctCount: 0,
        xpEarned: 0,
        answerState: 'idle',
        sessionEnded: null,
      };

    case 'ANSWER': {
      if (state.answerState !== 'idle') return state; // already answered this card — ignore repeat taps
      const hearts = action.correct ? state.hearts : state.hearts - 1;
      return {
        ...state,
        hearts,
        xpEarned: state.xpEarned + (action.correct ? XP_PER_CORRECT : 0),
        correctCount: state.correctCount + (action.correct ? 1 : 0),
        answerState: action.correct ? 'correct' : 'wrong',
      };
    }

    case 'CONTINUE': {
      const outOfHearts = state.hearts <= 0;
      const nextIndex = state.studyIndex + 1;
      const finished = outOfHearts || nextIndex >= state.studyQueue.length;

      if (!finished) {
        return { ...state, studyIndex: nextIndex, answerState: 'idle' };
      }

      const completed = !outOfHearts;
      let stats = state.stats;
      if (completed) {
        const today = todayKey();
        const alreadyToday = state.stats.lastStudyDayKey === today;
        const continuesStreak = state.stats.lastStudyDayKey === yesterdayKey();
        const streak = alreadyToday ? state.stats.streak : continuesStreak ? state.stats.streak + 1 : 1;
        const practicedDays = alreadyToday ? state.stats.practicedDays : [...state.stats.practicedDays, today];
        stats = { streak, lastStudyDayKey: today, xp: state.stats.xp + state.xpEarned, practicedDays };
      }

      return {
        ...state,
        screen: 'results',
        sessionEnded: completed ? 'completed' : 'outOfHearts',
        stats,
      };
    }

    case 'EXIT_STUDY':
      return { ...state, screen: state.studyMode === 'mix' ? 'home' : 'deck', studyDeckId: null, studyQueue: [] };

    case 'FINISH_RESULTS':
      return { ...state, screen: 'home', activeDeckId: null, studyDeckId: null, studyQueue: [] };

    default:
      return state;
  }
}
