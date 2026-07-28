import { NoteKind, noteKinds } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { ScreenName } from '../config/screens';
import { generateId } from './id';
import { AiQuality, AppState, Note, Tone } from './types';

export const initialState: AppState = {
  hydrated: false,
  hasOnboarded: false,
  screen: 'splash',
  notes: [],
  editingId: null,

  draftTitle: '',
  draftBody: '',
  draftKind: 'write',
  draftColor: 'bg',
  draftPhotoUri: null,
  notePhotoEditing: false,

  tone: 'polish',
  improvePrompt: '',
  rewriteLoading: false,

  scanImageUri: null,
  scanned: false,
  extractedText: '',
  explainedText: '',
  copiedCam: false,
  scanLoading: false,

  apiKey: null,
  aiError: null,
  aiQuality: 'standard',
  isPro: false,
  paywallReturnTo: 'home',
};

const blankDraft = {
  editingId: null as string | null,
  draftTitle: '',
  draftBody: '',
  draftKind: 'write' as NoteKind,
  draftColor: 'bg' as PaperStyleId,
  draftPhotoUri: null as string | null,
  notePhotoEditing: false,
  improvePrompt: '',
  aiError: null as string | null,
};

export type Action =
  | { type: 'HYDRATE'; notes: Note[] }
  | { type: 'HYDRATE_API_KEY'; apiKey: string | null }
  | { type: 'SET_API_KEY'; apiKey: string | null }
  | { type: 'HYDRATE_AI_QUALITY'; value: AiQuality }
  | { type: 'SET_AI_QUALITY'; value: AiQuality }
  | { type: 'HYDRATE_PRO'; value: boolean }
  | { type: 'UNLOCK_PRO' }
  | { type: 'GO_PAYWALL'; from: ScreenName }
  | { type: 'CLOSE_PAYWALL' }
  | { type: 'HYDRATE_ONBOARDED'; value: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SKIP_SPLASH' }
  | { type: 'GO_HOME' }
  | { type: 'GO_NOTES_LIST' }
  | { type: 'GO_SETTINGS' }
  | { type: 'NEW_NOTE' }
  | { type: 'OPEN_NOTE'; note: Note }
  | { type: 'STORE_NOTE' }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_BODY'; body: string }
  | { type: 'SWITCH_KIND'; kind: NoteKind }
  | { type: 'SET_COLOR'; color: PaperStyleId }
  | { type: 'GO_PAPER_PICKER' }
  | { type: 'SELECT_PAPER_STYLE'; color: PaperStyleId }
  | { type: 'SET_PHOTO_URI'; uri: string }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'START_EDITING_PHOTO' }
  | { type: 'STOP_EDITING_PHOTO' }
  | { type: 'SET_TONE'; tone: Tone }
  | { type: 'SET_IMPROVE_PROMPT'; prompt: string }
  | { type: 'SET_REWRITE_LOADING'; loading: boolean }
  | { type: 'APPLY_REWRITE'; rewritten: string }
  | { type: 'BACK_TO_EDITOR' }
  | { type: 'SET_SCAN_IMAGE'; uri: string }
  | { type: 'SET_SCAN_LOADING'; loading: boolean }
  | { type: 'SCAN_PAGE'; extractedText: string; explainedText: string }
  | { type: 'SET_COPIED'; copied: boolean }
  | { type: 'SET_AI_ERROR'; error: string | null }
  | { type: 'INSERT_SCAN' }
  | { type: 'DELETE_NOTE'; id: string }
  | { type: 'IMPORT_NOTES'; notes: Note[] };

function screenForKind(kind: NoteKind): ScreenName {
  return noteKinds[kind].screen;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, notes: action.notes, hydrated: true };

    case 'HYDRATE_API_KEY':
      return { ...state, apiKey: action.apiKey };

    case 'SET_API_KEY':
      return { ...state, apiKey: action.apiKey };

    case 'HYDRATE_AI_QUALITY':
      return { ...state, aiQuality: action.value };

    case 'SET_AI_QUALITY':
      return { ...state, aiQuality: action.value };

    case 'HYDRATE_PRO':
      return { ...state, isPro: action.value };

    case 'UNLOCK_PRO':
      return { ...state, isPro: true, screen: state.paywallReturnTo };

    case 'GO_PAYWALL':
      return { ...state, screen: 'paywall', paywallReturnTo: action.from };

    case 'CLOSE_PAYWALL':
      return { ...state, screen: state.paywallReturnTo };

    case 'HYDRATE_ONBOARDED':
      return { ...state, hasOnboarded: action.value };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasOnboarded: true, screen: 'home' };

    case 'SKIP_SPLASH':
      return state.screen === 'splash' ? { ...state, screen: state.hasOnboarded ? 'home' : 'onboarding' } : state;

    case 'GO_HOME':
      return { ...state, screen: 'home', aiError: null };

    case 'GO_NOTES_LIST':
      return { ...state, screen: 'library', aiError: null };

    case 'GO_SETTINGS':
      return { ...state, screen: 'settings' };

    case 'NEW_NOTE':
      return { ...state, ...blankDraft, screen: 'editor' };

    case 'OPEN_NOTE': {
      const n = action.note;
      return {
        ...state,
        editingId: n.id,
        draftTitle: n.title,
        draftBody: n.body,
        draftKind: n.kind,
        draftColor: n.color,
        draftPhotoUri: n.photoUri,
        notePhotoEditing: false,
        improvePrompt: '',
        aiError: null,
        screen: screenForKind(n.kind),
        scanned: false,
      };
    }

    case 'STORE_NOTE': {
      const title = state.draftTitle.trim() || 'Untitled';
      const snippet = state.draftBody.trim().slice(0, 90) || 'No content yet.';
      if (state.editingId != null) {
        return {
          ...state,
          notes: state.notes.map((n) =>
            n.id === state.editingId
              ? { ...n, title, snippet, body: state.draftBody, kind: state.draftKind, color: state.draftColor, photoUri: state.draftPhotoUri }
              : n
          ),
          screen: 'library',
        };
      }
      const newNote: Note = {
        id: generateId(),
        title,
        snippet,
        createdAt: Date.now(),
        body: state.draftBody,
        kind: state.draftKind,
        color: state.draftColor,
        photoUri: state.draftPhotoUri,
      };
      return { ...state, notes: [newNote, ...state.notes], screen: 'library' };
    }

    case 'SET_TITLE':
      return { ...state, draftTitle: action.title };

    case 'SET_BODY':
      return { ...state, draftBody: action.body };

    case 'SWITCH_KIND':
      return {
        ...state,
        draftKind: action.kind,
        screen: screenForKind(action.kind),
        scanned: false,
        aiError: null,
      };

    case 'SET_COLOR':
      return { ...state, draftColor: action.color };

    case 'GO_PAPER_PICKER':
      return { ...state, screen: 'paperPicker' };

    case 'SELECT_PAPER_STYLE':
      return { ...state, draftColor: action.color, screen: 'editor' };

    case 'SET_PHOTO_URI':
      return { ...state, draftPhotoUri: action.uri, draftColor: 'photo' };

    case 'REMOVE_PHOTO':
      return { ...state, draftColor: 'bg', draftPhotoUri: null, notePhotoEditing: false };

    case 'START_EDITING_PHOTO':
      return { ...state, notePhotoEditing: true };

    case 'STOP_EDITING_PHOTO':
      return { ...state, notePhotoEditing: false };

    case 'SET_TONE':
      return { ...state, tone: action.tone, aiError: null };

    case 'SET_IMPROVE_PROMPT':
      return { ...state, improvePrompt: action.prompt, aiError: null };

    case 'SET_REWRITE_LOADING':
      return { ...state, rewriteLoading: action.loading };

    case 'APPLY_REWRITE':
      return { ...state, draftBody: action.rewritten, screen: 'editor', rewriteLoading: false, aiError: null };

    case 'BACK_TO_EDITOR':
      return { ...state, screen: 'editor', aiError: null };

    case 'SET_SCAN_IMAGE':
      return { ...state, scanImageUri: action.uri };

    case 'SET_SCAN_LOADING':
      return { ...state, scanLoading: action.loading };

    case 'SCAN_PAGE':
      return {
        ...state,
        scanned: true,
        extractedText: action.extractedText,
        explainedText: action.explainedText,
        scanLoading: false,
        aiError: null,
      };

    case 'SET_COPIED':
      return { ...state, copiedCam: action.copied };

    case 'SET_AI_ERROR':
      return { ...state, aiError: action.error, rewriteLoading: false, scanLoading: false };

    case 'INSERT_SCAN':
      return {
        ...state,
        draftBody: (state.draftBody && state.draftBody.trim() ? state.draftBody + '\n\n' : '') + state.extractedText,
        screen: 'editor',
      };

    case 'DELETE_NOTE': {
      const notes = state.notes.filter((n) => n.id !== action.id);
      if (state.editingId !== action.id) {
        return { ...state, notes };
      }
      // Deleted the note currently open in the editor — back out to the
      // library instead of leaving a stale draft pointed at a gone note.
      return { ...state, notes, ...blankDraft, screen: 'library' };
    }

    case 'IMPORT_NOTES':
      return { ...state, notes: [...action.notes, ...state.notes] };

    default:
      return state;
  }
}
