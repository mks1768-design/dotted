// Daily writing prompt — a single source of truth, same pattern as homeMenu.
// Add, remove, or reorder a prompt by editing this array only.
export const dailyPrompts: string[] = [
  'Write about something you learned recently.',
  "Describe a moment from today you don't want to forget.",
  'What is a small thing that made you smile this week?',
  'Write a note to your future self.',
  "What's on your mind right now?",
  'Describe a place that feels like home.',
  'What are you looking forward to?',
  'Write about a person who shaped who you are.',
  "What's a question you've been sitting with?",
  'Describe your morning in three sentences.',
  'What would you tell your younger self?',
  'Write about a habit you want to build.',
];

export function promptForDate(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
  return dailyPrompts[dayOfYear % dailyPrompts.length];
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
