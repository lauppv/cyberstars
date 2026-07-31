import { config } from '../config/index.js';

// Thin wrapper over the Gemini REST API (generateContent). Deliberately tiny —
// hints are the only caller and need a single text-in/text-out shape. No SDK so
// the dependency footprint stays zero.
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 20_000;

export function isGeminiConfigured(): boolean {
  return config.gemini.apiKey.length > 0;
}

interface GenerateOptions {
  system: string;
  user: string;
  maxOutputTokens?: number;
  temperature?: number;
}

async function callGemini(opts: GenerateOptions): Promise<Response> {
  const { apiKey, model } = config.gemini;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: [{ role: 'user', parts: [{ text: opts.user }] }],
        generationConfig: {
          temperature: opts.temperature ?? 0.4,
          maxOutputTokens: opts.maxOutputTokens ?? 500,
        },
      }),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function generateText(opts: GenerateOptions): Promise<string> {
  // Flash models get congested in spikes and answer 503 UNAVAILABLE; Google says
  // these are transient, so retry once before giving up rather than hang.
  let res = await callGemini(opts);
  if (res.status === 503) {
    res = await callGemini(opts);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  return text.trim();
}
