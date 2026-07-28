import { AiQuality } from '../state/types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
const TIMEOUT_MS = 30000;

// 'high' costs noticeably more per request on the user's own API key, so it's
// an opt-in Settings toggle rather than the default.
const MODEL_FOR_QUALITY: Record<AiQuality, string> = {
  standard: 'claude-sonnet-5',
  high: 'claude-opus-5',
};

export class AnthropicError extends Error {}

async function callMessages(apiKey: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': API_VERSION,
        // Required for calling the API directly from a browser/client instead of a server.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AnthropicError('Anthropic took too long to respond — try again.');
    }
    throw new AnthropicError('Could not reach Anthropic — check your connection.');
  } finally {
    clearTimeout(timeout);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AnthropicError(json?.error?.message || `Request failed (${res.status})`);
  }
  return json;
}

function textFromResponse(json: any): string {
  const block = json?.content?.find((b: any) => b.type === 'text');
  return (block?.text ?? '').trim();
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  polish: 'Lightly polish grammar, punctuation, and flow. Keep the meaning, length, and voice close to the original.',
  concise: 'Compress this down as short as truly works for its length, keeping every point that matters — a single sentence for a short note, a tight paragraph for a longer one.',
  formal: 'Rewrite this in a more formal register — expand contractions, tighten the phrasing.',
};

export async function rewriteNote(
  apiKey: string,
  body: string,
  opts: { tone: string; prompt?: string; quality?: AiQuality }
): Promise<string> {
  const instruction = opts.prompt?.trim() ? opts.prompt.trim() : TONE_INSTRUCTIONS[opts.tone] ?? TONE_INSTRUCTIONS.polish;
  const json = await callMessages(apiKey, {
    model: MODEL_FOR_QUALITY[opts.quality ?? 'standard'],
    max_tokens: 2000,
    system:
      'You rewrite short personal notes for their author. Follow the instruction exactly, but preserve their ' +
      "distinctive phrasing and voice wherever the instruction doesn't require changing it — don't flatten it into " +
      'generic, corporate-sounding prose. Reply with ONLY the rewritten note text — no preamble, no quotes, no explanation.',
    messages: [{ role: 'user', content: `Instruction: ${instruction}\n\nNote:\n${body}` }],
  });
  return textFromResponse(json) || body;
}

export async function explainScan(
  apiKey: string,
  base64: string,
  mimeType: string,
  quality: AiQuality = 'standard'
): Promise<{ extractedText: string; explainedText: string }> {
  const json = await callMessages(apiKey, {
    model: MODEL_FOR_QUALITY[quality],
    max_tokens: 2200,
    system:
      "You help someone understand a page they just photographed from a book or document — read it the way a well-read " +
      'friend would, looking over their shoulder. First, transcribe the visible text exactly as it appears (fix only ' +
      'obvious OCR artifacts, keep original wording and paragraph breaks). Then write a short, genuinely useful ' +
      'explanation: open with the main idea in one plain-language sentence, quietly define or unpack anything a ' +
      'non-expert would stumble on (jargon, names, references, dense phrasing) inline rather than listing terms ' +
      'separately, and if the passage supports it, close with one sentence on why it matters or what to take away. ' +
      "Skip filler like \"this passage discusses\" or restating that you're an AI — get straight to the substance. " +
      'Reply with strict JSON only, no markdown fences: {"extractedText": string, "explainedText": string}.',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: 'Transcribe the visible text, then explain what it means.' },
        ],
      },
    ],
  });
  const raw = textFromResponse(json);
  try {
    const parsed = JSON.parse(raw);
    return {
      extractedText: String(parsed.extractedText ?? '').trim() || 'No text detected.',
      explainedText: String(parsed.explainedText ?? '').trim(),
    };
  } catch {
    return { extractedText: raw || 'No text detected.', explainedText: '' };
  }
}
