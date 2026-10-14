import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { FunctionDeclaration, GeminiContent, GeminiPart } from './gemini.service.js';

const geminiConfig = { apiKey: 'test-key', model: 'gemini-flash-lite-latest' };

vi.mock('../config/index.js', () => ({
  config: {
    get gemini() {
      return geminiConfig;
    },
  },
}));

const { isGeminiConfigured, generateText, converse, converseStream } =
  await import('./gemini.service.js');

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

// A streamed answer as Gemini sends it: one `data:` line per response, each
// network read given as its own string.
function sseResponse(reads: string[]): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const read of reads) controller.enqueue(encoder.encode(read));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

function event(body: unknown): string {
  return `data: ${JSON.stringify(body)}\r\n\r\n`;
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

describe('converseStream', () => {
  const tool: FunctionDeclaration = { name: 'search_lessons', description: 'find lessons' };
  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: 'which lesson has loops?' }] },
  ];
  const opts = {
    system: 'be kind',
    contents,
    tools: [tool],
    allowTools: true,
    maxOutputTokens: 600,
    temperature: 0.5,
    retryBusy: true,
    signal: new AbortController().signal,
  };

  async function collect(stream: AsyncGenerator<unknown>) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return chunks;
  }

  it('streams the conversation with its tools and yields each piece as it came', async () => {
    const call: GeminiPart = {
      functionCall: { name: 'search_lessons', args: { query: 'loops' }, id: 'c1' },
      thoughtSignature: 'sig',
    };
    fetchMock.mockResolvedValue(
      sseResponse([
        event({ candidates: [{ content: { role: 'model', parts: [call] } }] }),
        event({ candidates: [{ content: { parts: [{ text: '' }] }, finishReason: 'STOP' }] }),
      ]),
    );

    await expect(collect(converseStream(opts))).resolves.toEqual([
      { parts: [call], finishReason: undefined, blockReason: undefined },
      { parts: [{ text: '' }], finishReason: 'STOP', blockReason: undefined },
    ]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('gemini-flash-lite-latest:streamGenerateContent?alt=sse');
    const body = JSON.parse(init.body);
    expect(body.systemInstruction.parts[0].text).toBe('be kind');
    expect(body.contents).toEqual(opts.contents);
    expect(body.tools).toEqual([{ functionDeclarations: [tool] }]);
    expect(body.toolConfig).toEqual({ functionCallingConfig: { mode: 'AUTO' } });
    expect(body.generationConfig).toEqual({ temperature: 0.5, maxOutputTokens: 600 });
  });

  it('puts back together a line split between two reads', async () => {
    const line = event({ candidates: [{ content: { parts: [{ text: 'Once upon' }] } }] });
    fetchMock.mockResolvedValue(
      sseResponse([
        line.slice(0, 20),
        line.slice(20, -3),
        line.slice(-3) + 'data: {"candidates":[{"finishReason":"MAX_TOKENS"}]}',
      ]),
    );

    await expect(collect(converseStream(opts))).resolves.toEqual([
      { parts: [{ text: 'Once upon' }], finishReason: undefined, blockReason: undefined },
      { parts: [], finishReason: 'MAX_TOKENS', blockReason: undefined },
    ]);
  });

  it('asks for words only once tools are no longer allowed', async () => {
    fetchMock.mockResolvedValue(sseResponse([]));

    await collect(converseStream({ ...opts, allowTools: false }));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.toolConfig).toEqual({ functionCallingConfig: { mode: 'NONE' } });
  });

  it('reports a question blocked before any answer', async () => {
    fetchMock.mockResolvedValue(
      sseResponse([event({ promptFeedback: { blockReason: 'SAFETY' } })]),
    );

    await expect(collect(converseStream(opts))).resolves.toEqual([
      { parts: [], finishReason: undefined, blockReason: 'SAFETY' },
    ]);
  });

  it('throws when the stream reports an error part way', async () => {
    fetchMock.mockResolvedValue(
      sseResponse([
        event({ candidates: [{ content: { parts: [{ text: 'Recur' }] } }] }),
        event({ error: { code: 500, message: 'Internal error' } }),
      ]),
    );

    await expect(collect(converseStream(opts))).rejects.toThrow(
      'Gemini API stream: Internal error',
    );
  });

  it('throws when the stream reports an error without a message', async () => {
    fetchMock.mockResolvedValue(sseResponse([event({ error: { code: 500 } })]));

    await expect(collect(converseStream(opts))).rejects.toThrow(/^Gemini API stream: $/);
  });

  it('retries a busy model once while nothing was shown yet', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: 'unavailable' }, 503))
      .mockResolvedValueOnce(
        sseResponse([event({ candidates: [{ content: { parts: [{ text: 'hi' }] } }] })]),
      );

    const chunks = await collect(converseStream(opts));

    expect(chunks).toEqual([
      { parts: [{ text: 'hi' }], finishReason: undefined, blockReason: undefined },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry a busy model once the student has seen words', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'unavailable' }, 503));

    await expect(collect(converseStream({ ...opts, retryBusy: false }))).rejects.toThrow(
      'Gemini API 503',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('stops the request when the caller aborts', async () => {
    const leave = new AbortController();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(init.signal?.reason));
        }),
    );

    const pending = collect(converseStream({ ...opts, signal: leave.signal }));
    leave.abort();

    await expect(pending).rejects.toThrow();
  });
});

describe('converse', () => {
  const tool: FunctionDeclaration = { name: 'search_lessons', description: 'find lessons' };
  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: 'which lesson has loops?' }] },
  ];
  const opts = {
    system: 'be kind',
    contents,
    tools: [tool],
    allowTools: true,
    maxOutputTokens: 600,
    temperature: 0.5,
  };

  it('sends the conversation with its tools and returns the model turn as it came', async () => {
    const parts: GeminiPart[] = [
      {
        functionCall: { name: 'search_lessons', args: { query: 'loops' }, id: 'c1' },
        thoughtSignature: 'sig',
      },
    ];
    fetchMock.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { role: 'model', parts }, finishReason: 'STOP' }] }),
    );

    await expect(converse(opts)).resolves.toEqual({
      content: { role: 'model', parts },
      finishReason: 'STOP',
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.systemInstruction.parts[0].text).toBe('be kind');
    expect(body.contents).toEqual(opts.contents);
    expect(body.tools).toEqual([{ functionDeclarations: [tool] }]);
    expect(body.toolConfig).toEqual({ functionCallingConfig: { mode: 'AUTO' } });
    expect(body.generationConfig).toEqual({ temperature: 0.5, maxOutputTokens: 600 });
  });

  it('asks for words only once tools are no longer allowed', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ candidates: [] }));

    await converse({ ...opts, allowTools: false });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.toolConfig).toEqual({ functionCallingConfig: { mode: 'NONE' } });
  });

  it('returns an empty turn when the response carries no candidates', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await expect(converse(opts)).resolves.toEqual({
      content: { role: 'model', parts: [] },
      finishReason: '',
    });
  });

  it('retries a busy model once, like a single text call', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: 'unavailable' }, 503))
      .mockResolvedValueOnce(
        jsonResponse({ candidates: [{ content: { parts: [{ text: 'hi' }] } }] }),
      );

    const turn = await converse(opts);

    expect(turn.content.parts).toEqual([{ text: 'hi' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
