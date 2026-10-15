import { config } from '../config/index.js';

// Thin wrapper over the Gemini REST API. Deliberately tiny: one streamed
// conversation turn with tools for the tutor chat. No SDK so the dependency
// footprint stays zero.
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
// A streamed turn holds the request open while the words arrive, so its limit
// covers the whole turn, not only the wait for the first byte.
const STREAM_TIMEOUT_MS = 60_000;

export function isGeminiConfigured(): boolean {
  return config.gemini.apiKey.length > 0;
}

// A piece of a turn: words, a tool call the model asks for, or a tool's result.
// The model's own parts carry a thoughtSignature that must go back unchanged.
export interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args?: Record<string, unknown>; id?: string };
  functionResponse?: { name: string; id?: string; response: Record<string, unknown> };
  thoughtSignature?: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

interface GeminiResponse {
  candidates?: { content?: { role?: string; parts?: GeminiPart[] }; finishReason?: string }[];
}

function post(method: string, body: unknown, signal: AbortSignal): Promise<Response> {
  const { apiKey, model } = config.gemini;
  return fetch(`${ENDPOINT}/${model}:${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal,
    body: JSON.stringify(body),
  });
}

async function failure(res: Response): Promise<Error> {
  const text = await res.text().catch(() => '');
  return new Error(`Gemini API ${res.status}: ${text.slice(0, 300)}`);
}

interface ConverseOptions {
  system: string;
  contents: GeminiContent[];
  tools: FunctionDeclaration[];
  // false makes the model answer in words even though tools are declared, for
  // the last round once the tool calls have run out.
  allowTools: boolean;
  maxOutputTokens: number;
  temperature: number;
  // A busy model (503) is retried once only while the student has seen no words
  // yet: after that, a second answer would not follow on from the first.
  retryBusy: boolean;
  // Aborted when the student leaves, so the model stops writing for nobody.
  signal: AbortSignal;
}

// One piece of a streamed turn, as Gemini sends it.
interface GeminiChunk {
  parts: GeminiPart[];
  // Only on the last piece: STOP, MAX_TOKENS, SAFETY...
  finishReason?: string;
  // Set when the question itself was blocked, and no answer comes at all.
  blockReason?: string;
  // What the model has written in this turn so far, in tokens, as Gemini counts
  // it: every piece carries the running total.
  outputTokens?: number;
}

interface GeminiStreamResponse extends GeminiResponse {
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { candidatesTokenCount?: number };
  error?: { message?: string };
}

// One model turn of a conversation that may call tools, yielded piece by piece
// as Gemini writes it. The caller runs any functionCall parts and sends their
// results back as the next user turn.
export async function* converseStream(opts: ConverseOptions): AsyncGenerator<GeminiChunk> {
  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: opts.contents,
    tools: [{ functionDeclarations: opts.tools }],
    toolConfig: { functionCallingConfig: { mode: opts.allowTools ? 'AUTO' : 'NONE' } },
    generationConfig: { temperature: opts.temperature, maxOutputTokens: opts.maxOutputTokens },
  };
  const signal = AbortSignal.any([opts.signal, AbortSignal.timeout(STREAM_TIMEOUT_MS)]);
  const method = 'streamGenerateContent?alt=sse';

  let res = await post(method, body, signal);
  if (res.status === 503 && opts.retryBusy) {
    res = await post(method, body, signal);
  }
  if (!res.ok || !res.body) throw await failure(res);

  for await (const data of sseData(res.body)) {
    const chunk = JSON.parse(data) as GeminiStreamResponse;
    if (chunk.error) throw new Error(`Gemini API stream: ${chunk.error.message ?? ''}`);
    const candidate = chunk.candidates?.[0];
    yield {
      parts: candidate?.content?.parts ?? [],
      finishReason: candidate?.finishReason,
      blockReason: chunk.promptFeedback?.blockReason,
      outputTokens: chunk.usageMetadata?.candidatesTokenCount,
    };
  }
}

// The data of each server-sent event in a body. Gemini writes every event as one
// `data:` line, but a line can be split between two network reads.
async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const bytes of body) {
    buffer += decoder.decode(bytes, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data:')) yield line.slice(5).trim();
    }
  }
  buffer += decoder.decode();
  if (buffer.startsWith('data:')) yield buffer.slice(5).trim();
}
