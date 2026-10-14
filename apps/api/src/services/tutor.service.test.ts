import { describe, it, expect, vi, beforeEach } from 'vitest';

const gemini = { converse: vi.fn(), isGeminiConfigured: vi.fn() };
vi.mock('./gemini.service.js', () => gemini);

const tools = { searchLessons: vi.fn(), readLesson: vi.fn(), listPages: vi.fn() };
vi.mock('./tutor-tools.service.js', () => tools);

const { askTutor, detectLanguage } = await import('./tutor.service.js');

function text(t: string) {
  return { content: { role: 'model', parts: [{ text: t }] }, finishReason: 'STOP' };
}
function call(name: string, args: Record<string, unknown> = {}, id = 'c1') {
  return {
    content: {
      role: 'model',
      parts: [{ functionCall: { name, args, id }, thoughtSignature: 's' }],
    },
    finishReason: 'STOP',
  };
}

const base = {
  message: 'Which lesson teaches for loops?',
  page: '/courses',
  uiLang: 'en' as const,
  role: 'USER' as const,
  isProd: true,
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
  it('refuses with a 503 when no Gemini key is set, before any call', async () => {
    gemini.isGeminiConfigured.mockReturnValue(false);
    await expect(askTutor(base)).rejects.toMatchObject({ statusCode: 503 });
    expect(gemini.converse).not.toHaveBeenCalled();
  });

  it('returns the answer when the model needs no tool', async () => {
    gemini.converse.mockResolvedValue(text('  Try the For lesson.  '));

    await expect(askTutor(base)).resolves.toBe('Try the For lesson.');

    const opts = gemini.converse.mock.calls[0][0];
    expect(opts.contents).toEqual([{ role: 'user', parts: [{ text: base.message }] }]);
    expect(opts.allowTools).toBe(true);
    expect(opts.tools.map((t: { name: string }) => t.name)).toEqual([
      'search_lessons',
      'read_lesson',
      'list_pages',
    ]);
    expect(opts.system).toContain('Answer in English.');
    expect(opts.system).toContain('on the page /courses');
  });

  it('writes the prompt in the language of the message, not of the UI', async () => {
    gemini.converse.mockResolvedValue(text('ok'));

    await askTutor({ ...base, message: 'Unde îmi schimb parola?', uiLang: 'en' });
    expect(gemini.converse.mock.calls[0][0].system).toContain('Răspunde în limba română.');

    await askTutor({ ...base, message: 'where do I change my password', uiLang: 'ro' });
    expect(gemini.converse.mock.calls[1][0].system).toContain('Answer in English.');
  });

  it('names the lesson the student is on, in both languages', async () => {
    gemini.converse.mockResolvedValue(text('ok'));

    await askTutor({ ...base, page: '/lesson/algo-c/caesar-cipher-c' });
    expect(gemini.converse.mock.calls[0][0].system).toContain(
      'That page is the lesson algo-c/caesar-cipher-c',
    );

    await askTutor({ ...base, message: 'ce face asta', page: '/lesson/python/for' });
    expect(gemini.converse.mock.calls[1][0].system).toContain('Pagina este lecția python/for');
  });

  it('runs the tool the model asks for and sends the result back with its id', async () => {
    const hits = [{ title: 'For', course: 'Python', kind: 'lesson', link: '/lesson/python/for' }];
    tools.searchLessons.mockReturnValue(hits);
    const first = call('search_lessons', { query: 'for loops' }, 'abc');
    gemini.converse
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(text('See [For](/lesson/python/for).'));

    await expect(askTutor(base)).resolves.toBe('See [For](/lesson/python/for).');

    expect(tools.searchLessons).toHaveBeenCalledWith('for loops');
    const contents = gemini.converse.mock.calls[1][0].contents;
    expect(contents[1]).toEqual(first.content);
    expect(contents[2]).toEqual({
      role: 'user',
      parts: [
        { functionResponse: { name: 'search_lessons', id: 'abc', response: { results: hits } } },
      ],
    });
  });

  it('reads a lesson in the language of the conversation', async () => {
    tools.readLesson.mockReturnValue({ title: 'For', statement: 'text' });
    gemini.converse
      .mockResolvedValueOnce(call('read_lesson', { course: 'python', slug: 'for' }))
      .mockResolvedValueOnce(text('ok'));

    await askTutor({ ...base, message: 'ce cere lecția asta?' });

    expect(tools.readLesson).toHaveBeenCalledWith('python', 'for', 'ro');
    const result = gemini.converse.mock.calls[1][0].contents[2].parts[0].functionResponse;
    expect(result.response).toEqual({ title: 'For', statement: 'text' });
  });

  it('tells the model when a lesson does not exist or a tool is unknown', async () => {
    tools.readLesson.mockReturnValue(null);
    gemini.converse
      .mockResolvedValueOnce({
        content: {
          role: 'model',
          parts: [
            { functionCall: { name: 'read_lesson', id: 'a' } },
            { functionCall: { name: 'drop_tables', args: {}, id: 'b' } },
          ],
        },
        finishReason: 'STOP',
      })
      .mockResolvedValueOnce(text('ok'));

    await askTutor(base);

    expect(tools.readLesson).toHaveBeenCalledWith('', '', 'en');
    const parts = gemini.converse.mock.calls[1][0].contents[2].parts;
    expect(parts[0].functionResponse.response).toEqual({ error: 'No such lesson' });
    expect(parts[1].functionResponse.response).toEqual({ error: 'No tool named drop_tables' });
  });

  it('lists the pages for this student and searches with an empty query when given none', async () => {
    tools.listPages.mockReturnValue({ pages: [], courses: [] });
    tools.searchLessons.mockReturnValue([]);
    gemini.converse
      .mockResolvedValueOnce(call('list_pages'))
      .mockResolvedValueOnce(call('search_lessons'))
      .mockResolvedValueOnce(text('ok'));

    await askTutor({ ...base, role: 'ADMIN', isProd: false });

    expect(tools.listPages).toHaveBeenCalledWith('ADMIN', false);
    expect(tools.searchLessons).toHaveBeenCalledWith('');
  });

  it('makes the model answer in words after three rounds of tools', async () => {
    tools.searchLessons.mockReturnValue([]);
    gemini.converse
      .mockResolvedValueOnce(call('search_lessons', { query: 'a' }))
      .mockResolvedValueOnce(call('search_lessons', { query: 'b' }))
      .mockResolvedValueOnce(call('search_lessons', { query: 'c' }))
      .mockResolvedValueOnce(text('Here is what I found.'));

    await expect(askTutor(base)).resolves.toBe('Here is what I found.');

    expect(gemini.converse).toHaveBeenCalledTimes(4);
    expect(gemini.converse.mock.calls.map((c) => c[0].allowTools)).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it('answers 502 when the last round still has no words', async () => {
    gemini.converse
      .mockResolvedValueOnce(call('list_pages'))
      .mockResolvedValueOnce(call('list_pages'))
      .mockResolvedValueOnce(call('list_pages'))
      .mockResolvedValueOnce(call('list_pages'));
    tools.listPages.mockReturnValue({ pages: [], courses: [] });

    await expect(askTutor(base)).rejects.toMatchObject({ statusCode: 502 });
  });

  it('answers 502 when the model sends an empty answer', async () => {
    gemini.converse.mockResolvedValue(text('   '));
    await expect(askTutor(base)).rejects.toMatchObject({ statusCode: 502 });
  });

  it('answers 502 and logs when the Gemini call fails', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    gemini.converse.mockRejectedValue(new Error('Gemini API 500'));

    await expect(askTutor(base)).rejects.toMatchObject({
      statusCode: 502,
      message: 'The tutor could not answer right now, please try again',
    });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
