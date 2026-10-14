import { describe, it, expect, vi, beforeEach } from 'vitest';

const gemini = { converseStream: vi.fn(), isGeminiConfigured: vi.fn() };
vi.mock('./gemini.service.js', () => gemini);

const tools = { searchLessons: vi.fn(), readLesson: vi.fn(), listPages: vi.fn() };
vi.mock('./tutor-tools.service.js', () => tools);

const { askTutor, detectLanguage } = await import('./tutor.service.js');

interface Chunk {
  parts: Record<string, unknown>[];
  finishReason?: string;
  blockReason?: string;
  outputTokens?: number;
}

// A model turn as converseStream yields it.
async function* turn(...chunks: Chunk[]) {
  for (const chunk of chunks) yield chunk;
}
// An answer in words, piece by piece, ending the way Gemini says.
function text(pieces: string | string[], finishReason = 'STOP') {
  const list = [pieces].flat();
  return turn(
    ...list.map((t, i) => ({
      parts: [{ text: t }],
      ...(i === list.length - 1 ? { finishReason } : {}),
    })),
  );
}
// A tool call, then the empty closing piece Gemini sends after one.
function call(name: string, args: Record<string, unknown> = {}, id = 'c1') {
  return turn(
    { parts: [{ functionCall: { name, args, id }, thoughtSignature: 's' }] },
    { parts: [{ text: '' }], finishReason: 'STOP' },
  );
}
async function* failing(err: Error, ...chunks: Chunk[]): AsyncGenerator<Chunk> {
  yield* turn(...chunks);
  throw err;
}

async function collect(answer: AsyncGenerator<unknown>) {
  const events = [];
  for await (const event of answer) events.push(event);
  return events;
}

const base = {
  message: 'Which lesson teaches for loops?',
  history: [],
  page: '/courses',
  uiLang: 'en' as const,
  role: 'USER' as const,
  isProd: true,
  signal: new AbortController().signal,
  written: { tokens: 0 },
};

beforeEach(() => {
  vi.clearAllMocks();
  gemini.isGeminiConfigured.mockReturnValue(true);
});

describe('detectLanguage', () => {
  it('reads Romanian from its diacritics', () => {
    expect(detectLanguage('De ce nu merge bucla mea?', 'en')).toBe('ro');
    expect(detectLanguage('Ajută-mă', 'en')).toBe('ro');
  });

  it('reads Romanian written without diacritics', () => {
    expect(detectLanguage('de ce nu merge codul meu', 'en')).toBe('ro');
  });

  it('reads English with the UI in Romanian', () => {
    expect(detectLanguage('why does my loop print twice', 'ro')).toBe('en');
  });

  it('keeps the UI language when there are only code and no words to tell by', () => {
    expect(detectLanguage('```python\nfor i in range(3): print(i)\n```', 'ro')).toBe('ro');
    expect(detectLanguage('`x = 1`', 'en')).toBe('en');
    expect(detectLanguage('```c\nint main(void) { return 0; }', 'ro')).toBe('ro');
  });

  it('ignores the words inside code', () => {
    expect(detectLanguage('de ce nu merge?\n```\nprint("how is this the code")\n```', 'en')).toBe(
      'ro',
    );
  });
});

describe('askTutor', () => {
  const stream = gemini.converseStream;

  it('refuses with a 503 when no Gemini key is set, before any call', async () => {
    gemini.isGeminiConfigured.mockReturnValue(false);
    await expect(collect(askTutor(base))).rejects.toMatchObject({ statusCode: 503 });
    expect(stream).not.toHaveBeenCalled();
  });

  it('passes on each piece of the answer as it comes, then says it is complete', async () => {
    stream.mockReturnValue(text(['  Try the ', 'For lesson.']));

    await expect(collect(askTutor(base))).resolves.toEqual([
      { type: 'text', text: 'Try the ' },
      { type: 'text', text: 'For lesson.' },
      { type: 'done', finish: 'complete' },
    ]);

    const opts = stream.mock.calls[0][0];
    expect(opts.contents).toEqual([{ role: 'user', parts: [{ text: base.message }] }]);
    expect(opts.allowTools).toBe(true);
    expect(opts.retryBusy).toBe(true);
    expect(opts.signal).toBe(base.signal);
    expect(opts.tools.map((t: { name: string }) => t.name)).toEqual([
      'search_lessons',
      'read_lesson',
      'list_pages',
    ]);
    expect(opts.system).toContain('Answer in English.');
    expect(opts.system).toContain('on the page /courses');
  });

  it('sends the conversation so far before the new message', async () => {
    stream.mockReturnValue(text('Same idea in Java.'));

    await collect(
      askTutor({
        ...base,
        message: 'and in Java?',
        history: [
          { role: 'student', text: 'What is a for loop in Python?' },
          { role: 'tutor', text: 'It repeats code for each item.' },
        ],
      }),
    );

    expect(stream.mock.calls[0][0].contents).toEqual([
      { role: 'user', parts: [{ text: 'What is a for loop in Python?' }] },
      { role: 'model', parts: [{ text: 'It repeats code for each item.' }] },
      { role: 'user', parts: [{ text: 'and in Java?' }] },
    ]);
  });

  it('skips the blank pieces before the first words', async () => {
    stream.mockReturnValue(text(['', '\n ', 'Hi', '', ' there']));

    await expect(collect(askTutor(base))).resolves.toEqual([
      { type: 'text', text: 'Hi' },
      { type: 'text', text: ' there' },
      { type: 'done', finish: 'complete' },
    ]);
  });

  it('marks an answer cut by the length limit', async () => {
    stream.mockReturnValue(text(['Recursion is', ' when a'], 'MAX_TOKENS'));

    const events = await collect(askTutor(base));

    expect(events.at(-1)).toEqual({ type: 'done', finish: 'cut' });
  });

  it('marks an answer the model stopped for safety, even part way', async () => {
    stream.mockReturnValue(text(['Here is'], 'SAFETY'));

    await expect(collect(askTutor(base))).resolves.toEqual([
      { type: 'text', text: 'Here is' },
      { type: 'done', finish: 'blocked' },
    ]);
  });

  it('marks a question blocked before any words', async () => {
    stream.mockReturnValue(turn({ parts: [], blockReason: 'PROHIBITED_CONTENT' }));

    await expect(collect(askTutor(base))).resolves.toEqual([{ type: 'done', finish: 'blocked' }]);
  });

  it('writes the prompt in the language of the message, not of the UI', async () => {
    stream.mockImplementation(() => text('ok'));

    await collect(askTutor({ ...base, message: 'Unde îmi schimb parola?', uiLang: 'en' }));
    expect(stream.mock.calls[0][0].system).toContain('Răspunde în limba română.');

    await collect(askTutor({ ...base, message: 'where do I change my password', uiLang: 'ro' }));
    expect(stream.mock.calls[1][0].system).toContain('Answer in English.');
  });

  it('names the lesson the student is on, in both languages', async () => {
    stream.mockImplementation(() => text('ok'));

    await collect(askTutor({ ...base, page: '/lesson/algo-c/caesar-cipher-c' }));
    expect(stream.mock.calls[0][0].system).toContain(
      'That page is the lesson algo-c/caesar-cipher-c',
    );

    await collect(askTutor({ ...base, message: 'ce face asta', page: '/lesson/python/for' }));
    expect(stream.mock.calls[1][0].system).toContain('Pagina este lecția python/for');
  });

  it('runs the tool the model asks for and sends its whole turn back with the result', async () => {
    const hits = [{ title: 'For', course: 'Python', kind: 'lesson', link: '/lesson/python/for' }];
    tools.searchLessons.mockReturnValue(hits);
    stream
      .mockReturnValueOnce(call('search_lessons', { query: 'for loops' }, 'abc'))
      .mockReturnValueOnce(text('See [For](/lesson/python/for).'));

    await expect(collect(askTutor(base))).resolves.toEqual([
      { type: 'text', text: 'See [For](/lesson/python/for).' },
      { type: 'done', finish: 'complete' },
    ]);

    expect(tools.searchLessons).toHaveBeenCalledWith('for loops');
    const contents = stream.mock.calls[1][0].contents;
    expect(contents[1]).toEqual({
      role: 'model',
      parts: [
        {
          functionCall: { name: 'search_lessons', args: { query: 'for loops' }, id: 'abc' },
          thoughtSignature: 's',
        },
        { text: '' },
      ],
    });
    expect(contents[2]).toEqual({
      role: 'user',
      parts: [
        { functionResponse: { name: 'search_lessons', id: 'abc', response: { results: hits } } },
      ],
    });
  });

  it('reads a lesson in the language of the conversation', async () => {
    tools.readLesson.mockReturnValue({ title: 'For', statement: 'text' });
    stream
      .mockReturnValueOnce(call('read_lesson', { course: 'python', slug: 'for' }))
      .mockReturnValueOnce(text('ok'));

    await collect(askTutor({ ...base, message: 'ce cere lecția asta?' }));

    expect(tools.readLesson).toHaveBeenCalledWith('python', 'for', 'ro');
    const result = stream.mock.calls[1][0].contents[2].parts[0].functionResponse;
    expect(result.response).toEqual({ title: 'For', statement: 'text' });
  });

  it('tells the model when a lesson does not exist or a tool is unknown', async () => {
    tools.readLesson.mockReturnValue(null);
    stream
      .mockReturnValueOnce(
        turn({
          parts: [
            { functionCall: { name: 'read_lesson', id: 'a' } },
            { functionCall: { name: 'drop_tables', args: {}, id: 'b' } },
          ],
          finishReason: 'STOP',
        }),
      )
      .mockReturnValueOnce(text('ok'));

    await collect(askTutor(base));

    expect(tools.readLesson).toHaveBeenCalledWith('', '', 'en');
    const parts = stream.mock.calls[1][0].contents[2].parts;
    expect(parts[0].functionResponse.response).toEqual({ error: 'No such lesson' });
    expect(parts[1].functionResponse.response).toEqual({ error: 'No tool named drop_tables' });
  });

  it('lists the pages for this student and searches with an empty query when given none', async () => {
    tools.listPages.mockReturnValue({ pages: [], courses: [] });
    tools.searchLessons.mockReturnValue([]);
    stream
      .mockReturnValueOnce(call('list_pages'))
      .mockReturnValueOnce(call('search_lessons'))
      .mockReturnValueOnce(text('ok'));

    await collect(askTutor({ ...base, role: 'ADMIN', isProd: false }));

    expect(tools.listPages).toHaveBeenCalledWith('ADMIN', false);
    expect(tools.searchLessons).toHaveBeenCalledWith('');
  });

  it('makes the model answer in words after three rounds of tools', async () => {
    tools.searchLessons.mockReturnValue([]);
    stream
      .mockReturnValueOnce(call('search_lessons', { query: 'a' }))
      .mockReturnValueOnce(call('search_lessons', { query: 'b' }))
      .mockReturnValueOnce(call('search_lessons', { query: 'c' }))
      .mockReturnValueOnce(text('Here is what I found.'));

    const events = await collect(askTutor(base));

    expect(events[0]).toEqual({ type: 'text', text: 'Here is what I found.' });
    expect(stream).toHaveBeenCalledTimes(4);
    expect(stream.mock.calls.map((c) => c[0].allowTools)).toEqual([true, true, true, false]);
  });

  it('answers 502 when the last round still has no words', async () => {
    stream.mockImplementation(() => call('list_pages'));
    tools.listPages.mockReturnValue({ pages: [], courses: [] });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(collect(askTutor(base))).rejects.toMatchObject({ statusCode: 502 });
    log.mockRestore();
  });

  it('answers 502 when the model sends an empty answer', async () => {
    stream.mockReturnValue(text('   '));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(collect(askTutor(base))).rejects.toMatchObject({ statusCode: 502 });
    expect(log).toHaveBeenCalledWith('[tutor] Gemini ended without an answer:', 'STOP');
    log.mockRestore();
  });

  it('answers 502 when the answer stops for no reason it names', async () => {
    stream.mockReturnValue(text(['Half an'], 'OTHER'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    const answer = askTutor(base);
    await expect(answer.next()).resolves.toMatchObject({ value: { type: 'text' } });
    await expect(answer.next()).rejects.toMatchObject({ statusCode: 502 });
    log.mockRestore();
  });

  it('answers 502 and logs when the Gemini call fails', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    stream.mockReturnValue(failing(new Error('Gemini API 500')));

    await expect(collect(askTutor(base))).rejects.toMatchObject({
      statusCode: 502,
      message: 'The tutor could not answer right now, please try again',
    });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('keeps the words already sent when the stream breaks, and retries no more', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    tools.searchLessons.mockReturnValue([]);
    // A turn with words before its tool call: once they are out, a busy model
    // is not retried in the next round.
    stream
      .mockReturnValueOnce(
        turn(
          { parts: [{ text: 'Let me look.' }] },
          { parts: [{ functionCall: { name: 'search_lessons', args: {}, id: 'x' } }] },
        ),
      )
      .mockReturnValueOnce(failing(new Error('Gemini API 503')));

    const answer = askTutor(base);
    await expect(answer.next()).resolves.toEqual({
      done: false,
      value: { type: 'text', text: 'Let me look.' },
    });
    await expect(answer.next()).rejects.toMatchObject({ statusCode: 502 });
    expect(stream.mock.calls.map((c) => c[0].retryBusy)).toEqual([true, false]);
    log.mockRestore();
  });

  it('lets an abort through as it is, without logging it', async () => {
    const leave = new AbortController();
    leave.abort();
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const abort = new DOMException('This operation was aborted', 'AbortError');
    stream.mockReturnValue(failing(abort));

    await expect(collect(askTutor({ ...base, signal: leave.signal }))).rejects.toBe(abort);
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
});

describe('askTutor: the length of the answer', () => {
  const stream = gemini.converseStream;

  it("keeps the running count of the answer's tokens", async () => {
    const written = { tokens: 0 };
    const seen: number[] = [];
    stream.mockReturnValue(
      turn(
        { parts: [{ text: 'A loop ' }], outputTokens: 3 },
        { parts: [{ text: 'repeats.' }], outputTokens: 5, finishReason: 'STOP' },
      ),
    );

    for await (const event of askTutor({ ...base, written })) {
      if (event.type === 'text') seen.push(written.tokens);
    }

    expect(seen).toEqual([3, 5]);
    expect(written.tokens).toBe(5);
  });

  it('leaves out the rounds that only called a tool', async () => {
    tools.searchLessons.mockReturnValue([]);
    const written = { tokens: 0 };
    stream
      .mockReturnValueOnce(
        turn(
          { parts: [{ functionCall: { name: 'search_lessons', args: { query: 'loops' } } }] },
          { parts: [{ text: '' }], outputTokens: 40, finishReason: 'STOP' },
        ),
      )
      .mockReturnValueOnce(
        turn({ parts: [{ text: 'Try the For lesson.' }], outputTokens: 7, finishReason: 'STOP' }),
      );

    await collect(askTutor({ ...base, written }));

    expect(written.tokens).toBe(7);
  });

  it('counts what was written before the answer broke off', async () => {
    const written = { tokens: 0 };
    stream.mockReturnValue(
      failing(new Error('reset'), { parts: [{ text: 'A loop ' }], outputTokens: 320 }),
    );

    await expect(collect(askTutor({ ...base, written }))).rejects.toMatchObject({
      statusCode: 502,
    });

    expect(written.tokens).toBe(320);
  });
});
