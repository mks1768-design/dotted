import { Tone } from './types';

// Reference-only string transforms standing in for a real rewrite. Swap this
// for an actual LLM call (send `body` + `tone`, return the rewritten text).
export function rewriteFor(tone: Tone, body: string): string {
  const text = (body || '').trim();
  if (!text) return '';
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);

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
  return capitalized.endsWith('.') || capitalized.endsWith('!') || capitalized.endsWith('?')
    ? capitalized
    : capitalized + '.';
}
