import { ComponentType } from 'react';
import { DotMagnifierIcon, DotPencilIcon, DotSparklesIcon, IconProps } from '../icons';
import { ScreenName } from './screens';

// Note "kind" is an enum with a label + icon + target screen each. Adding a 4th
// kind (e.g. "Record") is additive — append an entry here, nothing else changes.
export type NoteKind = 'write' | 'improve' | 'scan';

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
};

export const noteKindOrder: NoteKind[] = ['write', 'improve', 'scan'];
