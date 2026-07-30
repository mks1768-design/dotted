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
export type AiQuality = 'standard' | 'high';

export type CorrectionSegment = { text: string; changed: boolean };
export type AddedSentence = { sentence: string; reason: string };

export type AppState = {
  hydrated: boolean;
  hasOnboarded: boolean;
  screen: ScreenName;
  // The AI setup guide is reachable from Settings, Improve, and Scan, so its
  // back button has to return wherever the reader actually came from.
  guideReturnTo: ScreenName | null;
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

  corrected: boolean;
  correctionSegments: CorrectionSegment[];
  addedSentences: AddedSentence[];
  correctionLoading: boolean;

  apiKey: string | null;
  aiError: string | null;
  aiQuality: AiQuality;
};
