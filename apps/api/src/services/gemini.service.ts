import { config } from '../config/index.js';

// Thin wrapper over the Gemini REST API (generateContent). Deliberately tiny:
// one text-in/text-out call for hints, and one conversation turn with tools for
// the tutor chat. No SDK so the dependency footprint stays zero.
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 20_000;

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

interface GenerateOptions {
  system: string;
  user: string;
  maxOutputTokens?: number;
  temperature?: number;
}

interface GeminiResponse {
  candidates?: { content?: { role?: string; parts?: GeminiPart[] }; finishReason?: string }[];
}

async function callGemini(body: unknown): Promise<Response> {
  const { apiKey, model } = config.gemini;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
  } finally {
    clearTimeout(timer);
  }
}

async function generate(body: unknown): Promise<GeminiResponse> {
  // Flash models get congested in spikes and answer 503 UNAVAILABLE; Google says
  // these are transient, so retry once before giving up rather than hang.
  let res = await callGemini(body);
  if (res.status === 503) {
    res = await callGemini(body);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 300)}`);
  }

  return (await res.json()) as GeminiResponse;
}

export async function generateText(opts: GenerateOptions): Promise<string> {
  const data = await generate({
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: 'user', parts: [{ text: opts.user }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      maxOutputTokens: opts.maxOutputTokens ?? 500,
    },
  });
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  return text.trim();
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
}

export interface GeminiTurn {
  content: GeminiContent;
  finishReason: string;
}

// One model turn of a conversation that may call tools. The caller runs any
// functionCall parts and sends their results back as the next user turn.
export async function converse(opts: ConverseOptions): Promise<GeminiTurn> {
  const data = await generate({
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: opts.contents,
    tools: [{ functionDeclarations: opts.tools }],
    toolConfig: { functionCallingConfig: { mode: opts.allowTools ? 'AUTO' : 'NONE' } },
    generationConfig: { temperature: opts.temperature, maxOutputTokens: opts.maxOutputTokens },
  });
  const candidate = data.candidates?.[0];
  return {
    content: { role: 'model', parts: candidate?.content?.parts ?? [] },
    finishReason: candidate?.finishReason ?? '',
  };
}
