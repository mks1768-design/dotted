import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { NoteKind } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { initialState, reducer } from './reducer';
import { rewriteFor } from './rewrite';
import { AppState, Note, Tone } from './types';

const STORAGE_KEY = '@dotted/notes';
const COPY_RESET_MS = 1500;
const SPLASH_MS = 1600;

type Ctx = {
  state: AppState;
  skipSplash: () => void;
  backToHome: () => void;
  goNotesList: () => void;
  newNote: () => void;
  openNote: (note: Note) => void;
  storeNote: () => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  switchWrite: () => void;
  switchImprove: () => void;
  switchScan: () => void;
  setColor: (color: PaperStyleId) => void;
  pickPhoto: () => Promise<void>;
  removePhoto: () => void;
  startEditingPhoto: () => void;
  stopEditingPhoto: () => void;
  setTone: (tone: Tone) => void;
  setImprovePrompt: (prompt: string) => void;
  applyRewrite: () => void;
  backToEditor: () => void;
  capturePage: () => Promise<void>;
  copyScan: () => Promise<void>;
  insertScan: () => void;
};

const NotesContext = createContext<Ctx | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const splashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate persisted notes on mount.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const notes: Note[] = raw ? JSON.parse(raw) : [];
        dispatch({ type: 'HYDRATE', notes });
      })
      .catch(() => dispatch({ type: 'HYDRATE', notes: [] }));
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist notes whenever they change (after initial hydration).
  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes)).catch(() => {});
  }, [state.notes, state.hydrated]);

  useEffect(() => {
    splashTimer.current = setTimeout(() => dispatch({ type: 'SKIP_SPLASH' }), SPLASH_MS);
    return () => {
      if (splashTimer.current) clearTimeout(splashTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const skipSplash = useCallback(() => {
    if (splashTimer.current) clearTimeout(splashTimer.current);
    dispatch({ type: 'SKIP_SPLASH' });
  }, []);

  const switchKind = useCallback((kind: NoteKind) => dispatch({ type: 'SWITCH_KIND', kind }), []);

  const pickPhoto = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      dispatch({ type: 'SET_PHOTO_URI', uri: result.assets[0].uri });
    }
  }, []);

  const capturePage = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    let uri: string | null = null;
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.85, aspect: [4, 3] });
      if (!result.canceled) uri = result.assets?.[0]?.uri ?? null;
    }
    if (uri) dispatch({ type: 'SET_SCAN_IMAGE', uri });
    dispatch({
      type: 'SCAN_PAGE',
      extractedText: 'Extracted text will appear here once scanning is connected.',
      explainedText: "The AI's explanation of the page will appear here.",
    });
  }, []);

  const copyScan = useCallback(async () => {
    await Clipboard.setStringAsync(state.extractedText).catch(() => {});
    dispatch({ type: 'SET_COPIED', copied: true });
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => dispatch({ type: 'SET_COPIED', copied: false }), COPY_RESET_MS);
  }, [state.extractedText]);

  const applyRewrite = useCallback(() => {
    dispatch({ type: 'APPLY_REWRITE', rewritten: rewriteFor(state.tone, state.draftBody, state.improvePrompt) });
  }, [state.tone, state.draftBody, state.improvePrompt]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      skipSplash,
      backToHome: () => dispatch({ type: 'GO_HOME' }),
      goNotesList: () => dispatch({ type: 'GO_NOTES_LIST' }),
      newNote: () => dispatch({ type: 'NEW_NOTE' }),
      openNote: (note) => dispatch({ type: 'OPEN_NOTE', note }),
      storeNote: () => dispatch({ type: 'STORE_NOTE' }),
      setTitle: (title) => dispatch({ type: 'SET_TITLE', title }),
      setBody: (body) => dispatch({ type: 'SET_BODY', body }),
      switchWrite: () => switchKind('write'),
      switchImprove: () => switchKind('improve'),
      switchScan: () => switchKind('scan'),
      setColor: (color) => dispatch({ type: 'SET_COLOR', color }),
      pickPhoto,
      removePhoto: () => dispatch({ type: 'REMOVE_PHOTO' }),
      startEditingPhoto: () => dispatch({ type: 'START_EDITING_PHOTO' }),
      stopEditingPhoto: () => dispatch({ type: 'STOP_EDITING_PHOTO' }),
      setTone: (tone) => dispatch({ type: 'SET_TONE', tone }),
      setImprovePrompt: (prompt) => dispatch({ type: 'SET_IMPROVE_PROMPT', prompt }),
      applyRewrite,
      backToEditor: () => dispatch({ type: 'BACK_TO_EDITOR' }),
      capturePage,
      copyScan,
      insertScan: () => dispatch({ type: 'INSERT_SCAN' }),
    }),
    [state, skipSplash, switchKind, pickPhoto, applyRewrite, capturePage, copyScan]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
}
