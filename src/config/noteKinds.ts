import { ComponentType } from 'react';
import { DotCheckIcon, DotMagnifierIcon, DotPencilIcon, DotSparklesIcon, IconProps } from '../icons';
import { ScreenName } from './screens';

// Note "kind" is an enum with a label + icon + target screen each. Adding a 5th
// kind (e.g. "Record") is additive — append an entry here, nothing else changes.
export type NoteKind = 'write' | 'improve' | 'scan' | 'correct';

export type NoteKindConfig = {
  id: NoteKind;
  label: string;
  segmentLabel: string;
  screen: ScreenName;
  icon: ComponentType<IconProps>;
};

export const noteKinds: Record<NoteKind, NoteKindConfig> = {
  write: { id: 'write', label: 'Write', segmentLabel: 'Write', screen: 'editor', icon: DotPencilIcon },
  improve: { id: 'improve', label: 'Improve', segmentLabel: 'Improve', screen: 'ai', icon: DotSparklesIcon },
  scan: { id: 'scan', label: 'Scan', segmentLabel: 'Scan', screen: 'camera', icon: DotMagnifierIcon },
  correct: { id: 'correct', label: 'Correct', segmentLabel: 'Correct', screen: 'correct', icon: DotCheckIcon },
};

export const noteKindOrder: NoteKind[] = ['write', 'improve', 'scan', 'correct'];
