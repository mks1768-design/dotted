import { AiQuality } from '../state/types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
// Both models think before answering, so a request is a good deal slower than a
// plain completion — 30s was cutting off legitimate work on longer notes.
const TIMEOUT_MS = 90000;

// 'high' costs noticeably more per request on the user's own API key, so it's
// an opt-in Settings toggle rather than the default.
const MODEL_FOR_QUALITY: Record<AiQuality, string> = {
  standard: 'claude-sonnet-5',
  high: 'claude-opus-5',
};

// Effort governs how hard the model works before answering. `xhigh` is the
// recommended setting where quality matters more than spend, which is exactly
// what the 'high' toggle opts into.
const EFFORT_FOR_QUALITY: Record<AiQuality, string> = {
  standard: 'high',
  high: 'xhigh',
};

// Both models run adaptive thinking by default, and max_tokens caps thinking
// AND the reply together — the old 2000 left so little room that a long note
// could come back truncated mid-sentence. Kept under ~16k so a non-streaming
// request can't hit an HTTP timeout.
const MAX_TOKENS = 8000;

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

/** Turns the ways a request can come back unusable into messages worth reading.
 * Without this a refusal or a truncated answer looked like a normal result and
 * quietly replaced the note with a fragment. */
function assertUsable(json: any, messages: { refused: string; truncated: string }) {
  const stop = json?.stop_reason;
  if (stop === 'refusal') throw new AnthropicError(messages.refused);
  if (stop === 'max_tokens') throw new AnthropicError(messages.truncated);
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
  const quality = opts.quality ?? 'standard';
  const instruction = opts.prompt?.trim() ? opts.prompt.trim() : TONE_INSTRUCTIONS[opts.tone] ?? TONE_INSTRUCTIONS.polish;
  const json = await callMessages(apiKey, {
    model: MODEL_FOR_QUALITY[quality],
    max_tokens: MAX_TOKENS,
    output_config: { effort: EFFORT_FOR_QUALITY[quality] },
    system:
      'You rewrite short personal notes for their author. Follow the instruction exactly, but preserve their ' +
      "distinctive phrasing and voice wherever the instruction doesn't require changing it — don't flatten it into " +
      'generic, corporate-sounding prose. Keep the author\'s own words wherever the instruction allows, and match ' +
      'the length of the original unless the instruction asks otherwise. ' +
      'Reply with ONLY the rewritten note text — no preamble, no quotes, no explanation.',
    messages: [{ role: 'user', content: `Instruction: ${instruction}\n\nNote:\n${body}` }],
  });
  assertUsable(json, {
    refused: 'Claude declined to rewrite this note. Try rephrasing it.',
    truncated: 'This note is too long to rewrite in one go — try a shorter section.',
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
    max_tokens: MAX_TOKENS,
    output_config: {
      effort: EFFORT_FOR_QUALITY[quality],
      // The API enforces this shape, so the reply can't come back as prose or
      // fenced markdown. Previously the prompt just asked for JSON and a parse
      // failure silently dropped the explanation and dumped raw text instead.
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            extractedText: { type: 'string', description: 'The page text, transcribed as it appears.' },
            explainedText: { type: 'string', description: 'The plain-language explanation of the page.' },
          },
          required: ['extractedText', 'explainedText'],
          additionalProperties: false,
        },
      },
    },
    system:
      "You help someone understand a page they just photographed from a book or document — read it the way a well-read " +
      'friend would, looking over their shoulder. Transcribe the visible text exactly as it appears (fix only ' +
      'obvious OCR artifacts, keep original wording and paragraph breaks) into `extractedText`. Into `explainedText`, ' +
      'write a short, genuinely useful explanation: open with the main idea in one plain-language sentence, quietly ' +
      'define or unpack anything a non-expert would stumble on (jargon, names, references, dense phrasing) inline ' +
      'rather than listing terms separately, and if the passage supports it, close with one sentence on why it ' +
      'matters or what to take away. Work only from what is actually on the page — if the photo is blurry, cropped, ' +
      'or unreadable in places, say so plainly rather than guessing at the missing words. ' +
      "Skip filler like \"this passage discusses\" or restating that you're an AI — get straight to the substance.",
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
  assertUsable(json, {
    refused: 'Claude declined to read this page.',
    truncated: "There's too much text on this page to read in one go — try a closer photo of one section.",
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
