import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { shuffled } from './shuffle';
import { AppState, Card, Stats } from './types';

const DECKS_STORAGE_KEY = '@recall/decks';
const STATS_STORAGE_KEY = '@recall/stats';

const DEFAULT_STATS: Stats = { streak: 0, lastStudyDayKey: null, xp: 0 };

type Ctx = {
  state: AppState;
  goHome: () => void;
  newDeck: (name: string, emoji: string) => void;
  openDeck: (id: string) => void;
  renameDeck: (id: string, name: string) => void;
  deleteDeck: (id: string) => void;
  newCard: () => void;
  editCard: (card: Card) => void;
  cancelCardEdit: () => void;
  setDraftFront: (text: string) => void;
  setDraftBack: (text: string) => void;
  saveCard: () => void;
  deleteCard: (id: string) => void;
  startStudy: (deckId: string) => void;
  answer: (correct: boolean) => void;
  continueStudy: () => void;
  exitStudy: () => void;
  finishResults: () => void;
};

const StudyCtx = createContext<Ctx | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    Promise.all([AsyncStorage.getItem(DECKS_STORAGE_KEY), AsyncStorage.getItem(STATS_STORAGE_KEY)])
      .then(([rawDecks, rawStats]) => {
        if (cancelled) return;
        const decks = rawDecks ? JSON.parse(rawDecks) : [];
        const stats = rawStats ? { ...DEFAULT_STATS, ...JSON.parse(rawStats) } : DEFAULT_STATS;
        dispatch({ type: 'HYDRATE', decks, stats });
      })
      .catch(() => dispatch({ type: 'HYDRATE', decks: [], stats: DEFAULT_STATS }));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(state.decks)).catch(() => {});
  }, [state.decks, state.hydrated]);

  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(state.stats)).catch(() => {});
  }, [state.stats, state.hydrated]);

  const startStudy = useCallback(
    (deckId: string) => {
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck || deck.cards.length === 0) return;
      const queue = shuffled(deck.cards.map((c) => c.id));
      dispatch({ type: 'START_STUDY', deckId, queue });
    },
    [state.decks]
  );

  const value = useMemo<Ctx>(
    () => ({
      state,
      goHome: () => dispatch({ type: 'GO_HOME' }),
      newDeck: (name, emoji) => dispatch({ type: 'NEW_DECK', name, emoji }),
      openDeck: (id) => dispatch({ type: 'OPEN_DECK', id }),
      renameDeck: (id, name) => dispatch({ type: 'RENAME_DECK', id, name }),
      deleteDeck: (id) => dispatch({ type: 'DELETE_DECK', id }),
      newCard: () => dispatch({ type: 'NEW_CARD' }),
      editCard: (card) => dispatch({ type: 'EDIT_CARD', card }),
      cancelCardEdit: () => dispatch({ type: 'CANCEL_CARD_EDIT' }),
      setDraftFront: (text) => dispatch({ type: 'SET_DRAFT_FRONT', text }),
      setDraftBack: (text) => dispatch({ type: 'SET_DRAFT_BACK', text }),
      saveCard: () => dispatch({ type: 'SAVE_CARD' }),
      deleteCard: (id) => dispatch({ type: 'DELETE_CARD', id }),
      startStudy,
      answer: (correct) => dispatch({ type: 'ANSWER', correct }),
      continueStudy: () => dispatch({ type: 'CONTINUE' }),
      exitStudy: () => dispatch({ type: 'EXIT_STUDY' }),
      finishResults: () => dispatch({ type: 'FINISH_RESULTS' }),
    }),
    [state, startStudy]
  );

  return <StudyCtx.Provider value={value}>{children}</StudyCtx.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyCtx);
  if (!ctx) throw new Error('useStudy must be used within a StudyProvider');
  return ctx;
}
