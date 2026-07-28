import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Share } from 'react-native';
import { NoteKind } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { AnthropicError, explainScan, rewriteNote } from '../services/anthropic';
import { exportBackup, importBackup } from '../services/backup';
import { deleteSecureItem, getSecureItem, setSecureItem } from '../services/secureStorage';
import { generateId } from './id';
import { initialState, reducer } from './reducer';
import { rewriteFor } from './rewrite';
import { AiQuality, AppState, Note, Tone } from './types';

const STORAGE_KEY = '@dotted/notes';
const API_KEY_STORAGE_KEY = 'dotted.anthropicApiKey';
const ONBOARDED_STORAGE_KEY = '@dotted/hasOnboarded';
const AI_QUALITY_STORAGE_KEY = '@dotted/aiQuality';
const COPY_RESET_MS = 1500;
const SPLASH_MS = 1600;

type Ctx = {
  state: AppState;
  skipSplash: () => void;
  completeOnboarding: () => void;
  backToHome: () => void;
  goNotesList: () => void;
  goSettings: () => void;
  goSettingsAi: () => void;
  goSettingsBackup: () => void;
  newNote: () => void;
  openNote: (note: Note) => void;
  storeNote: () => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  switchWrite: () => void;
  switchImprove: () => void;
  switchScan: () => void;
  goPaperPicker: () => void;
  selectPaperStyle: (color: PaperStyleId) => void;
  pickPhoto: () => Promise<void>;
  removePhoto: () => void;
  startEditingPhoto: () => void;
  stopEditingPhoto: () => void;
  setTone: (tone: Tone) => void;
  setImprovePrompt: (prompt: string) => void;
  applyRewrite: () => Promise<void>;
  backToEditor: () => void;
  capturePage: () => Promise<void>;
  copyScan: () => Promise<void>;
  insertScan: () => void;
  setApiKey: (key: string) => Promise<void>;
  clearApiKey: () => Promise<void>;
  setAiQuality: (value: AiQuality) => void;
  shareNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => void;
  exportNotes: () => Promise<{ ok: true; count: number } | { ok: false; error: string }>;
  importNotes: () => Promise<{ ok: true; count: number } | { ok: false; canceled: true } | { ok: false; error: string }>;
};

const NotesContext = createContext<Ctx | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const splashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  // Bumped every time the draft switches to a different note (new or opened),
  // so a slow AI response for the PREVIOUS note can recognize it's stale and
  // avoid overwriting whatever note is open by the time it resolves.
  const draftGeneration = useRef(0);

  // Hydrate persisted notes on mount. Backfills fields for notes saved by an
  // older build (e.g. before createdAt existed) so old local data can't crash render.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const parsed: Partial<Note>[] = raw ? JSON.parse(raw) : [];
        const notes: Note[] = parsed.map((n, i) => ({
          id: n.id || generateId(),
          title: n.title ?? 'Untitled',
          snippet: n.snippet ?? '',
          createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now() - i,
          body: n.body ?? '',
          kind: n.kind ?? 'write',
          color: n.color ?? 'bg',
          photoUri: n.photoUri ?? null,
        }));
        dispatch({ type: 'HYDRATE', notes });
      })
      .catch(() => dispatch({ type: 'HYDRATE', notes: [] }));
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate the locally-stored Anthropic API key on mount.
  useEffect(() => {
    let cancelled = false;
    getSecureItem(API_KEY_STORAGE_KEY)
      .then((key) => {
        if (!cancelled) dispatch({ type: 'HYDRATE_API_KEY', apiKey: key });
      })
      .catch(() => dispatch({ type: 'HYDRATE_API_KEY', apiKey: null }));
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate whether the first-launch onboarding has already been completed.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(ONBOARDED_STORAGE_KEY)
      .then((value) => {
        if (!cancelled) dispatch({ type: 'HYDRATE_ONBOARDED', value: value === '1' });
      })
      .catch(() => dispatch({ type: 'HYDRATE_ONBOARDED', value: false }));
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate the saved AI quality preference (defaults to 'standard' if unset).
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(AI_QUALITY_STORAGE_KEY)
      .then((value) => {
        if (!cancelled && (value === 'standard' || value === 'high')) {
          dispatch({ type: 'HYDRATE_AI_QUALITY', value });
        }
      })
      .catch(() => {});
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

  const completeOnboarding = useCallback(() => {
    AsyncStorage.setItem(ONBOARDED_STORAGE_KEY, '1').catch(() => {});
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, []);

  const switchKind = useCallback((kind: NoteKind) => dispatch({ type: 'SWITCH_KIND', kind }), []);

  const newNote = useCallback(() => {
    draftGeneration.current += 1;
    dispatch({ type: 'NEW_NOTE' });
  }, []);

  const openNote = useCallback((note: Note) => {
    draftGeneration.current += 1;
    dispatch({ type: 'OPEN_NOTE', note });
  }, []);

  const setApiKey = useCallback(async (key: string) => {
    await setSecureItem(API_KEY_STORAGE_KEY, key);
    dispatch({ type: 'SET_API_KEY', apiKey: key });
  }, []);

  const clearApiKey = useCallback(async () => {
    await deleteSecureItem(API_KEY_STORAGE_KEY);
    dispatch({ type: 'SET_API_KEY', apiKey: null });
  }, []);

  const setAiQuality = useCallback((value: AiQuality) => {
    AsyncStorage.setItem(AI_QUALITY_STORAGE_KEY, value).catch(() => {});
    dispatch({ type: 'SET_AI_QUALITY', value });
  }, []);

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
    const myGeneration = draftGeneration.current;
    dispatch({ type: 'SET_SCAN_LOADING', loading: true });

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      if (draftGeneration.current === myGeneration) {
        dispatch({ type: 'SET_AI_ERROR', error: 'Camera permission was denied.' });
      }
      return;
    }
    const apiKey = stateRef.current.apiKey;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      aspect: [4, 3],
      base64: !!apiKey,
    });
    if (draftGeneration.current !== myGeneration) return; // the user has since moved to a different note

    const asset = result.canceled ? null : (result.assets?.[0] ?? null);
    if (asset) dispatch({ type: 'SET_SCAN_IMAGE', uri: asset.uri });

    if (!apiKey) {
      // Reference mode has nothing to send anywhere, so it doesn't require a
      // real photo — it mirrors the design prototype's placeholder behavior.
      dispatch({
        type: 'SCAN_PAGE',
        extractedText: 'Extracted text will appear here once you add an API key in Settings.',
        explainedText: 'Add an Anthropic API key in Settings to get a real explanation of the page.',
      });
      return;
    }

    if (!asset) {
      dispatch({ type: 'SET_SCAN_LOADING', loading: false }); // user canceled — nothing to send to the API
      return;
    }

    try {
      if (!asset.base64) throw new AnthropicError('Could not read the captured photo.');
      const { extractedText, explainedText } = await explainScan(
        apiKey,
        asset.base64,
        asset.mimeType || 'image/jpeg',
        stateRef.current.aiQuality
      );
      if (draftGeneration.current !== myGeneration) return;
      dispatch({ type: 'SCAN_PAGE', extractedText, explainedText });
    } catch (err) {
      if (draftGeneration.current !== myGeneration) return;
      dispatch({ type: 'SET_AI_ERROR', error: err instanceof Error ? err.message : 'Scan failed.' });
    }
  }, []);

  const copyScan = useCallback(async () => {
    await Clipboard.setStringAsync(state.extractedText).catch(() => {});
    dispatch({ type: 'SET_COPIED', copied: true });
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => dispatch({ type: 'SET_COPIED', copied: false }), COPY_RESET_MS);
  }, [state.extractedText]);

  const applyRewrite = useCallback(async () => {
    const { apiKey, tone, draftBody, improvePrompt } = stateRef.current;
    if (!apiKey) {
      dispatch({ type: 'APPLY_REWRITE', rewritten: rewriteFor(tone, draftBody, improvePrompt) });
      return;
    }
    const myGeneration = draftGeneration.current;
    dispatch({ type: 'SET_REWRITE_LOADING', loading: true });
    try {
      const rewritten = await rewriteNote(apiKey, draftBody, { tone, prompt: improvePrompt, quality: stateRef.current.aiQuality });
      if (draftGeneration.current !== myGeneration) return; // the user has since moved to a different note
      dispatch({ type: 'APPLY_REWRITE', rewritten });
    } catch (err) {
      if (draftGeneration.current !== myGeneration) return;
      dispatch({ type: 'SET_AI_ERROR', error: err instanceof Error ? err.message : 'Rewrite failed.' });
    }
  }, []);

  const shareNote = useCallback(async (note: Note) => {
    const message = note.body?.trim() ? `${note.title}\n\n${note.body}` : note.title;
    try {
      await Share.share({ title: note.title, message });
    } catch {
      // Sharing unsupported on this platform/browser, or the user dismissed the sheet — nothing to do.
    }
  }, []);

  const deleteNote = useCallback((id: string) => {
    if (stateRef.current.editingId === id) draftGeneration.current += 1;
    dispatch({ type: 'DELETE_NOTE', id });
  }, []);

  const exportNotes = useCallback(async () => {
    const result = await exportBackup(stateRef.current.notes);
    if (!result.ok) return result;
    return { ok: true as const, count: stateRef.current.notes.length };
  }, []);

  const importNotes = useCallback(async () => {
    const result = await importBackup();
    if (!result.ok) return result;
    dispatch({ type: 'IMPORT_NOTES', notes: result.notes });
    return { ok: true as const, count: result.notes.length };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      skipSplash,
      completeOnboarding,
      backToHome: () => dispatch({ type: 'GO_HOME' }),
      goNotesList: () => dispatch({ type: 'GO_NOTES_LIST' }),
      goSettings: () => dispatch({ type: 'GO_SETTINGS' }),
      goSettingsAi: () => dispatch({ type: 'GO_SETTINGS_AI' }),
      goSettingsBackup: () => dispatch({ type: 'GO_SETTINGS_BACKUP' }),
      newNote,
      openNote,
      storeNote: () => dispatch({ type: 'STORE_NOTE' }),
      setTitle: (title) => dispatch({ type: 'SET_TITLE', title }),
      setBody: (body) => dispatch({ type: 'SET_BODY', body }),
      switchWrite: () => switchKind('write'),
      switchImprove: () => switchKind('improve'),
      switchScan: () => switchKind('scan'),
      goPaperPicker: () => dispatch({ type: 'GO_PAPER_PICKER' }),
      selectPaperStyle: (color) => dispatch({ type: 'SELECT_PAPER_STYLE', color }),
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
      setApiKey,
      clearApiKey,
      setAiQuality,
      shareNote,
      deleteNote,
      exportNotes,
      importNotes,
    }),
    [
      state,
      skipSplash,
      completeOnboarding,
      switchKind,
      newNote,
      openNote,
      pickPhoto,
      applyRewrite,
      capturePage,
      copyScan,
      setApiKey,
      clearApiKey,
      setAiQuality,
      shareNote,
      deleteNote,
      exportNotes,
      importNotes,
    ]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
}
