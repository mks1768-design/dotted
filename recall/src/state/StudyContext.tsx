import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import { cancelReminders, requestNotificationPermission, scheduleReminders } from '../services/notifications';
import { initialState, reducer } from './reducer';
import { shuffled } from './shuffle';
import { AppState, Card, ReminderInterval, Reminders, Stats } from './types';

const DECKS_STORAGE_KEY = '@recall/decks';
const STATS_STORAGE_KEY = '@recall/stats';
const REMINDERS_STORAGE_KEY = '@recall/reminders';

const DEFAULT_STATS: Stats = { streak: 0, lastStudyDayKey: null, xp: 0 };
const DEFAULT_REMINDERS: Reminders = { enabled: false, intervalMinutes: 180 };

type Ctx = {
  state: AppState;
  goHome: () => void;
  goSettings: () => void;
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
  setRemindersEnabled: (enabled: boolean) => Promise<void>;
  setReminderInterval: (minutes: ReminderInterval) => void;
};

const StudyCtx = createContext<Ctx | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      AsyncStorage.getItem(DECKS_STORAGE_KEY),
      AsyncStorage.getItem(STATS_STORAGE_KEY),
      AsyncStorage.getItem(REMINDERS_STORAGE_KEY),
    ])
      .then(([rawDecks, rawStats, rawReminders]) => {
        if (cancelled) return;
        const decks = rawDecks ? JSON.parse(rawDecks) : [];
        const stats = rawStats ? { ...DEFAULT_STATS, ...JSON.parse(rawStats) } : DEFAULT_STATS;
        const reminders = rawReminders ? { ...DEFAULT_REMINDERS, ...JSON.parse(rawReminders) } : DEFAULT_REMINDERS;
        dispatch({ type: 'HYDRATE', decks, stats, reminders });
      })
      .catch(() => dispatch({ type: 'HYDRATE', decks: [], stats: DEFAULT_STATS, reminders: DEFAULT_REMINDERS }));
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

  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(state.reminders)).catch(() => {});
  }, [state.reminders, state.hydrated]);

  // Keeps the notification queue matching the current reminder settings and
  // deck contents. Re-runs on deck edits too, so a freshly-added card can
  // show up in a reminder instead of only ones that existed when it was
  // first turned on.
  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.reminders.enabled) {
      cancelReminders().catch(() => {});
      return;
    }
    scheduleReminders(state.decks, state.reminders.intervalMinutes).catch(() => {});
  }, [state.hydrated, state.reminders.enabled, state.reminders.intervalMinutes, state.decks]);

  // The scheduled queue is a finite batch of one-shot notifications — top it
  // back up whenever the app returns to the foreground so a long stretch in
  // the background doesn't quietly run it dry.
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (next) => {
      if (next !== 'active') return;
      const s = stateRef.current;
      if (s.hydrated && s.reminders.enabled) {
        scheduleReminders(s.decks, s.reminders.intervalMinutes).catch(() => {});
      }
    });
    return () => sub.remove();
  }, []);

  // Tapping a reminder jumps straight into studying the deck that card
  // belongs to, rather than just opening the app to the home screen.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const deckId = response.notification.request.content.data?.deckId as string | undefined;
      if (!deckId) return;
      const deck = stateRef.current.decks.find((d) => d.id === deckId);
      if (!deck || deck.cards.length === 0) return;
      const queue = shuffled(deck.cards.map((c) => c.id));
      dispatch({ type: 'START_STUDY', deckId, queue });
    });
    return () => sub.remove();
  }, []);

  const startStudy = useCallback(
    (deckId: string) => {
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck || deck.cards.length === 0) return;
      const queue = shuffled(deck.cards.map((c) => c.id));
      dispatch({ type: 'START_STUDY', deckId, queue });
    },
    [state.decks]
  );

  const setRemindersEnabled = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    dispatch({ type: 'SET_REMINDERS_ENABLED', enabled });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      goHome: () => dispatch({ type: 'GO_HOME' }),
      goSettings: () => dispatch({ type: 'GO_SETTINGS' }),
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
      setRemindersEnabled,
      setReminderInterval: (minutes) => dispatch({ type: 'SET_REMINDER_INTERVAL', minutes }),
    }),
    [state, startStudy, setRemindersEnabled]
  );

  return <StudyCtx.Provider value={value}>{children}</StudyCtx.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyCtx);
  if (!ctx) throw new Error('useStudy must be used within a StudyProvider');
  return ctx;
}
