import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const geminiConfig = { apiKey: 'test-key', model: 'gemini-flash-lite-latest' };

vi.mock('../config/index.js', () => ({
  config: {
    get gemini() {
      return geminiConfig;
    },
  },
}));

const { isGeminiConfigured, generateText } = await import('./gemini.service.js');

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  geminiConfig.apiKey = 'test-key';
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isGeminiConfigured', () => {
  it('is true only when an API key is set', () => {
    expect(isGeminiConfigured()).toBe(true);
    geminiConfig.apiKey = '';
    expect(isGeminiConfigured()).toBe(false);
  });
});

describe('generateText', () => {
  const opts = { system: 'be brief', user: 'help me' };

  it('sends the prompt to the configured model and returns the trimmed text', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: '  a hint  ' }] } }] }),
    );

    await expect(generateText(opts)).resolves.toBe('a hint');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('gemini-flash-lite-latest:generateContent');
    expect(init.headers['x-goog-api-key']).toBe('test-key');
    const body = JSON.parse(init.body);
    expect(body.systemInstruction.parts[0].text).toBe('be brief');
    expect(body.contents[0].parts[0].text).toBe('help me');
    expect(body.generationConfig).toEqual({ temperature: 0.4, maxOutputTokens: 500 });
  });

  it('passes through an explicit temperature and token budget', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ candidates: [] }));

    await generateText({ ...opts, temperature: 0.9, maxOutputTokens: 42 });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.generationConfig).toEqual({ temperature: 0.9, maxOutputTokens: 42 });
  });

  it('joins every returned part', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        candidates: [{ content: { parts: [{ text: 'one ' }, {}, { text: 'two' }] } }],
      }),
    );

    await expect(generateText(opts)).resolves.toBe('one two');
  });

  it('returns an empty string when the response carries no candidates', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await expect(generateText(opts)).resolves.toBe('');
  });

  it('retries once when the model answers 503 and keeps the second answer', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: 'unavailable' }, 503))
      .mockResolvedValueOnce(
        jsonResponse({ candidates: [{ content: { parts: [{ text: 'second try' }] } }] }),
      );

    await expect(generateText(opts)).resolves.toBe('second try');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up when the retry also fails', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'unavailable' }, 503));

    await expect(generateText(opts)).rejects.toThrow('Gemini API 503');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports a non-retryable error with a truncated body', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'x'.repeat(500),
    } as Response);

    await expect(generateText(opts)).rejects.toThrow(/Gemini API 400: x{300}$/);
  });

  it('still reports the status when the error body cannot be read', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => {
        throw new Error('stream closed');
      },
    } as unknown as Response);

    await expect(generateText(opts)).rejects.toThrow('Gemini API 500: ');
  });

  it('aborts the in-flight request once the timeout elapses', async () => {
    vi.useFakeTimers();
    let aborted = false;
    fetchMock.mockImplementation(async (_url: string, init: RequestInit) => {
      init.signal?.addEventListener('abort', () => {
        aborted = true;
      });
      await vi.advanceTimersByTimeAsync(20_000);
      return jsonResponse({ candidates: [] });
    });

    await generateText(opts);

    expect(aborted).toBe(true);
    vi.useRealTimers();
  });
});
