import { NoteKind } from '../config/noteKinds';
import { PaperStyleId } from '../config/paperStyles';
import { ScreenName } from '../config/screens';

export type Note = {
  id: string;
  title: string;
  snippet: string;
  createdAt: number;
  body: string;
  kind: NoteKind;
  color: PaperStyleId;
  photoUri: string | null;
};

export type Tone = 'polish' | 'concise' | 'formal';

export type AppState = {
  hydrated: boolean;
  hasOnboarded: boolean;
  screen: ScreenName;
  notes: Note[];
  editingId: string | null;

  draftTitle: string;
  draftBody: string;
  draftKind: NoteKind;
  draftColor: PaperStyleId;
  draftPhotoUri: string | null;
  notePhotoEditing: boolean;

  tone: Tone;
  improvePrompt: string;
  rewriteLoading: boolean;

  scanImageUri: string | null;
  scanned: boolean;
  extractedText: string;
  explainedText: string;
  copiedCam: boolean;
  scanLoading: boolean;

  apiKey: string | null;
  aiError: string | null;
};
