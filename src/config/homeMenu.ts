import { ComponentType } from 'react';
import { DotBookshelfIcon, DotMagnifierIcon, DotPencilIcon, DotSparklesIcon, IconProps } from '../icons';
import { NoteKind } from './noteKinds';
import { ScreenName } from './screens';

// Home menu items — single source of truth for the 4 home rows. Add, remove, or
// reorder a row by editing this array only; HomeScreen just maps over it.
export type HomeMenuItem = {
  id: string;
  label: string;
  screen: ScreenName;
  /** Draft kind to switch to when this row also acts as a kind-switcher (null for Store, which is pure navigation). */
  kind: NoteKind | null;
  icon: ComponentType<IconProps>;
};

export const homeMenu: HomeMenuItem[] = [
  { id: 'store', label: 'STORE', screen: 'library', kind: null, icon: DotBookshelfIcon },
  { id: 'explanation', label: 'EXPLANATION', screen: 'camera', kind: 'scan', icon: DotMagnifierIcon },
  { id: 'write', label: 'WRITE', screen: 'editor', kind: 'write', icon: DotPencilIcon },
  { id: 'improve', label: 'IMPROVE', screen: 'ai', kind: 'improve', icon: DotSparklesIcon },
];
