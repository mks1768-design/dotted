import { ComponentType } from 'react';
import { DotMark, DotPencilIcon, DotSparklesIcon, IconProps } from '../icons';

// Single source of truth for the first-launch onboarding carousel — add,
// remove, or reorder a page by editing this array only.
export type OnboardingPage = {
  id: string;
  icon: ComponentType<IconProps>;
  title: string;
  body: string;
};

export const onboardingPages: OnboardingPage[] = [
  {
    id: 'welcome',
    icon: DotMark,
    title: 'Meet dotted',
    body: 'A quiet place to write — built around one small, recurring mark.',
  },
  {
    id: 'actions',
    icon: DotPencilIcon,
    title: 'Write, then find it again',
    body: 'Plain notes, photo notes, paper you pick. Store keeps them all — as a list, or as a board you can look across.',
  },
  {
    id: 'local',
    icon: DotSparklesIcon,
    title: 'Local, and yours',
    body: 'Everything stays on this device — no account, no server. Back it up anytime from Settings.',
  },
  {
    id: 'ai',
    icon: DotSparklesIcon,
    title: 'AI, if you want it',
    body: "Improve rewrites a note; Explanation reads a photographed page. Both run on an Anthropic key you add yourself — optional, and everything above works without one.",
  },
];
