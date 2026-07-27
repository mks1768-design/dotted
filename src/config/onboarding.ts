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
    title: 'Four things, one dot',
    body: 'Write it, ask AI to Improve it, Explanation to scan a page, Store to browse it all later.',
  },
  {
    id: 'local',
    icon: DotSparklesIcon,
    title: 'Local, and yours',
    body: "Everything stays on this device — no account, no server. Back it up anytime from Settings.",
  },
];
