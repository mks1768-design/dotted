import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Share } from 'react-native';
import { NoteKind } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { AnthropicError, correctWriting, explainScan, rewriteNote } from '../services/anthropic';
import { exportBackup, importBackup } from '../services/backup';
import { deleteSecureItem, getSecureItem, setSecureItem } from '../services/secureStorage';
import { generateId } from './id';
import { initialState, reducer } from './reducer';
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
  goApiKeyGuide: () => void;
  closeApiKeyGuide: () => void;
  newNote: () => void;
  openNote: (note: Note) => void;
  storeNote: () => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  switchWrite: () => void;
  switchImprove: () => void;
  switchScan: () => void;
  switchCorrect: () => void;
  goPaperPicker: () => void;
  selectPaperStyle: (color: PaperStyleId) => void;
  pickPhoto: () => Promise<void>;
  removePhoto: () => void;
  startEditingPhoto: () => void;
  stopEditingPhoto: () => void;
  setTone: (tone: Tone) => void;
  setImprovePrompt: (prompt: string) => void;
  applyRewrite: () => Promise<void>;
  runCorrection: () => Promise<void>;
  resetCorrection: () => void;
  applyCorrection: () => void;
  backToEditor: () => void;
  readPage: (photo: { uri: string; base64: string; mimeType: string }) => Promise<void>;
  pickPageFromLibrary: () => Promise<void>;
  rescanPage: () => void;
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

  // expo-camera hands back a data URL on web and bare base64 on Android/iOS.
  // The API only accepts the bare form, so the prefix has to come off before
  // it's sent — otherwise scanning works on device and fails on web.
  const stripDataUrl = (base64: string) => base64.replace(/^data:[^;]+;base64,/, '');

  /** Sends one already-captured page to the API. The photo itself comes from
   * the inline camera on the Scan screen, or from the photo library below. */
  const readPage = useCallback(async (photo: { uri: string; base64: string; mimeType: string }) => {
    const apiKey = stateRef.current.apiKey;
    if (!apiKey) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Add an Anthropic API key in Settings to read a page.' });
      return;
    }

    const myGeneration = draftGeneration.current;
    dispatch({ type: 'SET_SCAN_IMAGE', uri: photo.uri });
    dispatch({ type: 'SET_SCAN_LOADING', loading: true });

    try {
      const { extractedText, explainedText } = await explainScan(
        apiKey,
        stripDataUrl(photo.base64),
        photo.mimeType,
        stateRef.current.aiQuality
      );
      if (draftGeneration.current !== myGeneration) return; // the user has since moved to a different note
      dispatch({ type: 'SCAN_PAGE', extractedText, explainedText });
    } catch (err) {
      if (draftGeneration.current !== myGeneration) return;
      dispatch({ type: 'SET_AI_ERROR', error: err instanceof Error ? err.message : 'Scan failed.' });
    }
  }, []);

  // The way in for a page that's already a photo, or a device whose camera
  // can't start.
  const pickPageFromLibrary = useCallback(async () => {
    if (!stateRef.current.apiKey) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Add an Anthropic API key in Settings to read a page.' });
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Photo library permission was denied.' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      base64: true,
    });
    const asset = result.canceled ? null : (result.assets?.[0] ?? null);
    if (!asset) return; // user backed out of the picker
    if (!asset.base64) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Could not read that photo.' });
      return;
    }
    await readPage({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType || 'image/jpeg' });
  }, [readPage]);

  const rescanPage = useCallback(() => dispatch({ type: 'RESET_SCAN' }), []);

  const copyScan = useCallback(async () => {
    await Clipboard.setStringAsync(state.extractedText).catch(() => {});
    dispatch({ type: 'SET_COPIED', copied: true });
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => dispatch({ type: 'SET_COPIED', copied: false }), COPY_RESET_MS);
  }, [state.extractedText]);

  const applyRewrite = useCallback(async () => {
    const { apiKey, tone, draftBody, improvePrompt } = stateRef.current;
    // The screen hides Apply without a key; this is the backstop so no path
    // can reach the old behaviour of returning the note unchanged as if it
    // had been rewritten.
    if (!apiKey) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Add an Anthropic API key in Settings to rewrite a note.' });
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

  const runCorrection = useCallback(async () => {
    const { apiKey, draftBody } = stateRef.current;
    if (!apiKey) {
      dispatch({ type: 'SET_AI_ERROR', error: 'Add an Anthropic API key in Settings to correct writing.' });
      return;
    }
    const myGeneration = draftGeneration.current;
    dispatch({ type: 'SET_CORRECTION_LOADING', loading: true });
    try {
      const { segments, addedSentences } = await correctWriting(apiKey, draftBody, stateRef.current.aiQuality);
      if (draftGeneration.current !== myGeneration) return; // the user has since moved to a different note
      dispatch({ type: 'CORRECTION_DONE', segments, addedSentences });
    } catch (err) {
      if (draftGeneration.current !== myGeneration) return;
      dispatch({ type: 'SET_AI_ERROR', error: err instanceof Error ? err.message : 'Correction failed.' });
    }
  }, []);

  const resetCorrection = useCallback(() => dispatch({ type: 'RESET_CORRECTION' }), []);

  const applyCorrection = useCallback(() => {
    const { correctionSegments, addedSentences } = stateRef.current;
    const corrected = correctionSegments.map((s) => s.text).join('');
    const withAdded = addedSentences.length
      ? `${corrected}\n\n${addedSentences.map((a) => a.sentence).join(' ')}`
      : corrected;
    dispatch({ type: 'APPLY_CORRECTION', corrected: withAdded });
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
      goApiKeyGuide: () => dispatch({ type: 'GO_API_KEY_GUIDE' }),
      closeApiKeyGuide: () => dispatch({ type: 'CLOSE_API_KEY_GUIDE' }),
      newNote,
      openNote,
      storeNote: () => dispatch({ type: 'STORE_NOTE' }),
      setTitle: (title) => dispatch({ type: 'SET_TITLE', title }),
      setBody: (body) => dispatch({ type: 'SET_BODY', body }),
      switchWrite: () => switchKind('write'),
      switchImprove: () => switchKind('improve'),
      switchScan: () => switchKind('scan'),
      switchCorrect: () => switchKind('correct'),
      goPaperPicker: () => dispatch({ type: 'GO_PAPER_PICKER' }),
      selectPaperStyle: (color) => dispatch({ type: 'SELECT_PAPER_STYLE', color }),
      pickPhoto,
      removePhoto: () => dispatch({ type: 'REMOVE_PHOTO' }),
      startEditingPhoto: () => dispatch({ type: 'START_EDITING_PHOTO' }),
      stopEditingPhoto: () => dispatch({ type: 'STOP_EDITING_PHOTO' }),
      setTone: (tone) => dispatch({ type: 'SET_TONE', tone }),
      setImprovePrompt: (prompt) => dispatch({ type: 'SET_IMPROVE_PROMPT', prompt }),
      applyRewrite,
      runCorrection,
      resetCorrection,
      applyCorrection,
      backToEditor: () => dispatch({ type: 'BACK_TO_EDITOR' }),
      readPage,
      pickPageFromLibrary,
      rescanPage,
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
      runCorrection,
      resetCorrection,
      applyCorrection,
      readPage,
      pickPageFromLibrary,
      rescanPage,
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
