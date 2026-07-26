import { Tone } from './types';

// Reference-only string transforms standing in for a real rewrite. Swap this
// for an actual LLM call: send `body` plus either the free-form `prompt` (when
// the user typed one) or the preset `tone`, and return the model's rewrite.
export function rewriteFor(tone: Tone, body: string, prompt?: string): string {
  const text = (body || '').trim();
  if (!text) return '';
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
  const polished = capitalized.endsWith('.') || capitalized.endsWith('!') || capitalized.endsWith('?')
    ? capitalized
    : capitalized + '.';

  // A free-form instruction always overrides the tone preset — the reference
  // logic can't actually follow it (that needs the real LLM call above), so
  // it falls back to the same light cleanup as "Polish" until that's wired in.
  if (prompt && prompt.trim()) {
    return polished;
  }

  if (tone === 'concise') {
    const firstSentence = text.split(/(?<=[.!?])\s/)[0];
    return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  }
  if (tone === 'formal') {
    return capitalized
      .replace(/\bi'm\b/gi, 'I am')
      .replace(/\bdon't\b/gi, 'do not')
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bit's\b/gi, 'it is');
  }
  return polished;
}
