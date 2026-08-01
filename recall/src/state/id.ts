// Date.now() alone can collide if two cards are created in the same
// millisecond (e.g. fast programmatic taps); pair it with a random suffix.
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
