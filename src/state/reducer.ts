import { NoteKind, noteKinds } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { ScreenName } from '../config/screens';
import { AppState, Note, Tone } from './types';

export const initialState: AppState = {
  hydrated: false,
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

  scanImageUri: null,
  scanned: false,
  extractedText: '',
  explainedText: '',
  copiedCam: false,
};

const blankDraft = {
  editingId: null as string | null,
  draftTitle: '',
  draftBody: '',
  draftKind: 'write' as NoteKind,
  draftColor: 'bg' as PaperStyleId,
  draftPhotoUri: null as string | null,
  notePhotoEditing: false,
};

export type Action =
  | { type: 'HYDRATE'; notes: Note[] }
  | { type: 'SKIP_SPLASH' }
  | { type: 'GO_HOME' }
  | { type: 'GO_NOTES_LIST' }
  | { type: 'NEW_NOTE' }
  | { type: 'OPEN_NOTE'; note: Note }
  | { type: 'STORE_NOTE' }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_BODY'; body: string }
  | { type: 'SWITCH_KIND'; kind: NoteKind }
  | { type: 'SET_COLOR'; color: PaperStyleId }
  | { type: 'SET_PHOTO_URI'; uri: string }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'START_EDITING_PHOTO' }
  | { type: 'STOP_EDITING_PHOTO' }
  | { type: 'SET_TONE'; tone: Tone }
  | { type: 'APPLY_REWRITE'; rewritten: string }
  | { type: 'BACK_TO_EDITOR' }
  | { type: 'SET_SCAN_IMAGE'; uri: string }
  | { type: 'SCAN_PAGE'; extractedText: string; explainedText: string }
  | { type: 'SET_COPIED'; copied: boolean }
  | { type: 'INSERT_SCAN' };

function screenForKind(kind: NoteKind): ScreenName {
  return noteKinds[kind].screen;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, notes: action.notes, hydrated: true };

    case 'SKIP_SPLASH':
      return state.screen === 'splash' ? { ...state, screen: 'home' } : state;

    case 'GO_HOME':
      return { ...state, screen: 'home' };

    case 'GO_NOTES_LIST':
      return { ...state, screen: 'library' };

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
        id: String(Date.now()),
        title,
        snippet,
        date: 'Today',
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
      };

    case 'SET_COLOR':
      return { ...state, draftColor: action.color };

    case 'SET_PHOTO_URI':
      return { ...state, draftPhotoUri: action.uri, draftColor: 'photo' };

    case 'REMOVE_PHOTO':
      return { ...state, draftColor: 'bg', draftPhotoUri: null, notePhotoEditing: false };

    case 'START_EDITING_PHOTO':
      return { ...state, notePhotoEditing: true };

    case 'STOP_EDITING_PHOTO':
      return { ...state, notePhotoEditing: false };

    case 'SET_TONE':
      return { ...state, tone: action.tone };

    case 'APPLY_REWRITE':
      return { ...state, draftBody: action.rewritten, screen: 'editor' };

    case 'BACK_TO_EDITOR':
      return { ...state, screen: 'editor' };

    case 'SET_SCAN_IMAGE':
      return { ...state, scanImageUri: action.uri };

    case 'SCAN_PAGE':
      return { ...state, scanned: true, extractedText: action.extractedText, explainedText: action.explainedText };

    case 'SET_COPIED':
      return { ...state, copiedCam: action.copied };

    case 'INSERT_SCAN':
      return {
        ...state,
        draftBody: (state.draftBody && state.draftBody.trim() ? state.draftBody + '\n\n' : '') + state.extractedText,
        screen: 'editor',
      };

    default:
      return state;
  }
}
