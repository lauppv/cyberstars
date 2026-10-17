import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { config } from '../../src/config/index.js';
import { saveExchange } from '../../src/services/tutor-conversations.service.js';
import { record } from '../../src/services/submissions.service.js';

// The config is read once, by setup.ts, before this file runs, so the tutor
// gets its key here. The calls themselves are answered below, so no request
// leaves the machine.
const gemini = config.gemini as { apiKey: string };
let realKey: string;

beforeAll(() => {
  realKey = gemini.apiKey;
  gemini.apiKey = 'test-key';
});

afterAll(() => {
  gemini.apiKey = realKey;
});

interface SentContent {
  role: string;
  parts: { text?: string }[];
}

// Every request Gemini got, as the conversation it was sent, and its prompt.
const sent: SentContent[][] = [];
const systems: string[] = [];
let reply: () => Response;

function streamed(...pieces: string[]): Response {
  const events = pieces.map((text, i) => ({
    candidates: [
      {
        content: { role: 'model', parts: [{ text }] },
        ...(i === pieces.length - 1 ? { finishReason: 'STOP' } : {}),
      },
    ],
  }));
  return new Response(events.map((e) => `data: ${JSON.stringify(e)}\r\n\r\n`).join(''), {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

beforeEach(() => {
  sent.length = 0;
  systems.length = 0;
  reply = () => streamed('Loops ', 'repeat code.');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      sent.push(body.contents);
      systems.push(body.systemInstruction?.parts?.[0]?.text ?? '');
      return reply();
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const lesson = { courseKey: 'python', lessonSlug: 'for' };

function ask(a: Awaited<ReturnType<typeof createAuthenticatedAgent>>['agent'], body: object) {
  return a.post('/api/tutor/chat').send({ message: 'What is a loop?', page: '/courses', ...body });
}

// The conversation an answer was saved to, as its `done` event names it.
function conversationOf(res: { text: string }): number {
  const id = /"type":"done"[^}]*"conversationId":(\d+)/.exec(res.text)?.[1];
  expect(id).toBeDefined();
  return Number(id);
}

function texts(contents: SentContent[]): string[] {
  // The words of each turn: in a lesson chat the work comes first, the message last.
  return contents.map((c) => `${c.role}: ${c.parts.at(-1)!.text}`);
}

describe('Tutor conversations', () => {
  it('starts a conversation with its first exchange and sends it back with the next message', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const first = await ask(a, { message: '  What is\n a loop?' }).expect(200);
    const id = conversationOf(first);

    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body).toEqual([
      { id, title: 'What is a loop?', lesson: null, updatedAt: expect.any(String) },
    ]);
    const page = await a.get(`/api/tutor/conversations/${id}`).expect(200);
    expect(page.body.hasMore).toBe(false);
    expect(page.body.messages).toEqual([
      expect.objectContaining({ role: 'tutor', text: 'Loops repeat code.', finish: 'complete' }),
      expect.objectContaining({ role: 'student', text: 'What is\n a loop?', finish: null }),
    ]);

    const second = await ask(a, { message: 'and in Java?', conversationId: id }).expect(200);
    expect(conversationOf(second)).toBe(id);
    expect(texts(sent[1])).toEqual([
      'user: What is\n a loop?',
      'model: Loops repeat code.',
      'user: and in Java?',
    ]);
  });

  it('starts a new conversation for a message that names none, with no history', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const first = conversationOf(await ask(a, { message: 'first' }).expect(200));
    const second = conversationOf(await ask(a, { message: 'second' }).expect(200));

    expect(second).not.toBe(first);
    expect(texts(sent[1])).toEqual(['user: second']);
    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body.map((c: { title: string }) => c.title)).toEqual(['second', 'first']);
  });

  it('lists the conversation saved to last first', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    const first = conversationOf(await ask(a, { message: 'first' }).expect(200));
    await ask(a, { message: 'second' }).expect(200);

    await ask(a, { message: 'back to the first', conversationId: first }).expect(200);

    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body.map((c: { title: string }) => c.title)).toEqual(['first', 'second']);
  });

  it('keeps a lesson conversation about its lesson only', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    const id = conversationOf(await ask(a, { message: 'lesson question', lesson }).expect(200));

    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body[0]).toMatchObject({ id, lesson });

    await ask(a, { message: 'and again?', lesson, conversationId: id }).expect(200);
    expect(texts(sent[1])).toEqual([
      'user: lesson question',
      'model: Loops repeat code.',
      'user: and again?',
    ]);

    await ask(a, { conversationId: id }).expect(404);
    await ask(a, {
      conversationId: id,
      lesson: { courseKey: 'python', lessonSlug: 'print' },
    }).expect(404);
    expect(sent).toHaveLength(2);
  });

  it('deletes a conversation and leaves the others as they were', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    const kept = conversationOf(await ask(a, {}).expect(200));
    const gone = conversationOf(await ask(a, { lesson }).expect(200));

    await a.delete(`/api/tutor/conversations/${gone}`).expect(204);

    await a.get(`/api/tutor/conversations/${gone}`).expect(404);
    await a.delete(`/api/tutor/conversations/${gone}`).expect(404);
    await ask(a, { lesson, conversationId: gone }).expect(404);
    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body.map((c: { id: number }) => c.id)).toEqual([kept]);
  });

  it("never shows, continues or deletes another student's conversation", async () => {
    const { agent: owner } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();
    const id = conversationOf(await ask(owner, {}).expect(200));

    expect((await other.get('/api/tutor/conversations').expect(200)).body).toEqual([]);
    await other.get(`/api/tutor/conversations/${id}`).expect(404);
    await other.delete(`/api/tutor/conversations/${id}`).expect(404);
    await ask(other, { conversationId: id }).expect(404);
    expect(sent).toHaveLength(1);

    const kept = await owner.get(`/api/tutor/conversations/${id}`).expect(200);
    expect(kept.body.messages).toHaveLength(2);
  });

  it('saves nothing when the model fails before any words', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    reply = () => new Response('{"error":{"message":"boom"}}', { status: 500 });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    await ask(a, {}).expect(502);
    log.mockRestore();

    expect((await a.get('/api/tutor/conversations').expect(200)).body).toEqual([]);
  });

  it('keeps an answer cut by the length limit marked as cut', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    reply = () =>
      new Response(
        `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Half' }] }, finishReason: 'MAX_TOKENS' }] })}\r\n\r\n`,
        { headers: { 'Content-Type': 'text/event-stream' } },
      );

    const id = conversationOf(await ask(a, {}).expect(200));

    const page = await a.get(`/api/tutor/conversations/${id}`).expect(200);
    expect(page.body.messages[0]).toMatchObject({ text: 'Half', finish: 'cut' });
  });

  it('refuses a lesson the curriculum does not list and an id that is no number', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await ask(a, { lesson: { courseKey: 'python', lessonSlug: 'nope' } }).expect(400);
    await a.get('/api/tutor/conversations/general').expect(404);
    expect(sent).toEqual([]);
  });

  it('keeps only the newest 200 messages of a conversation', async () => {
    const { email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    const { id } = await prisma.tutorConversation.create({
      data: { userId, ...lesson, title: 'old' },
    });
    await prisma.tutorMessage.createMany({
      data: Array.from({ length: 199 }, (_, i) => ({
        conversationId: id,
        role: i % 2 ? 'tutor' : 'student',
        text: `old ${i}`,
      })),
    });

    await saveExchange(
      userId,
      id,
      { text: 'newest question', sentAt: new Date() },
      { text: 'newest answer', finish: 'complete' },
    );

    const rows = await prisma.tutorMessage.findMany({
      where: { conversationId: id },
      orderBy: { id: 'asc' },
    });
    expect(rows).toHaveLength(200);
    expect(rows[0].text).toBe('old 1');
    expect(rows.at(-1)!.text).toBe('newest answer');
  });

  it('keeps only the newest 50 conversations of a student', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await prisma.tutorConversation.createMany({
      data: Array.from({ length: 50 }, (_, i) => ({
        userId,
        title: `old ${i}`,
        updatedAt: new Date(Date.UTC(2026, 0, 1, 0, i)),
      })),
    });

    await ask(a, { message: 'newest' }).expect(200);

    const list = await a.get('/api/tutor/conversations').expect(200);
    expect(list.body).toHaveLength(50);
    expect(list.body[0].title).toBe('newest');
    expect(list.body.map((c: { title: string }) => c.title)).not.toContain('old 0');
    expect(await prisma.tutorConversation.count({ where: { userId } })).toBe(50);
  });

  it("takes a student's conversations and messages with them when their user row is deleted", async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await ask(a, {}).expect(200);
    await ask(a, { lesson }).expect(200);

    await prisma.user.delete({ where: { id: userId } });

    expect(await prisma.tutorConversation.count({ where: { userId } })).toBe(0);
    expect(await prisma.tutorMessage.count()).toBe(0);
  });
});

// An answer of `tokens` tokens, as Gemini counts them.
function answerOf(tokens: number): Response {
  const event = {
    candidates: [
      { content: { role: 'model', parts: [{ text: 'An answer.' }] }, finishReason: 'STOP' },
    ],
    usageMetadata: { promptTokenCount: 500, candidatesTokenCount: tokens },
  };
  return new Response(`data: ${JSON.stringify(event)}\r\n\r\n`, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('Tutor session', () => {
  async function used(email: string): Promise<number> {
    const row = await prisma.usageWindow.findUnique({
      where: { userId_action: { userId: await userIdFor(email), action: 'tutorMessage' } },
    });
    return row?.used ?? 0;
  }

  it('answers 30 short answers in a window, then refuses with the refill time', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    reply = () => answerOf(60);

    for (let i = 0; i < 30; i++) await ask(a, {}).expect(200);
    const refused = await ask(a, {}).expect(429);

    expect(refused.body.error).toMatch(/^Limit reached\. It refills at /);
    expect(sent).toHaveLength(30);
    expect(await used(email)).toBe(30);
    const usage = await a.get('/api/usage').expect(200);
    expect(usage.body.tutorMessage).toMatchObject({ used: 30, limit: 30, remaining: 0 });
  });

  it('answers 15 long answers in a window', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    reply = () => answerOf(301);

    for (let i = 0; i < 15; i++) await ask(a, {}).expect(200);
    await ask(a, {}).expect(429);

    expect(await used(email)).toBe(30);
  });

  it('answers with the last unit left, even at length', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    reply = () => answerOf(301);
    for (let i = 0; i < 14; i++) await ask(a, {}).expect(200);
    reply = () => answerOf(60);
    await ask(a, {}).expect(200);
    expect(await used(email)).toBe(29);

    reply = () => answerOf(301);
    await ask(a, {}).expect(200);

    expect(await used(email)).toBe(30);
    await ask(a, {}).expect(429);
  });

  it('uses no units when the model fails before any words', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    reply = () => new Response('{"error":{"message":"boom"}}', { status: 500 });

    await ask(a, {}).expect(502);

    expect(await used(email)).toBe(0);
  });

  it('shares one session between the general conversation and every lesson', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    reply = () => answerOf(60);

    await ask(a, {}).expect(200);
    await ask(a, { lesson }).expect(200);

    expect(await used(email)).toBe(2);
  });
});

describe('Lesson chat', () => {
  // A failed run as the judge returns it: the hidden test it stopped on has
  // the student's output but no expected output.
  const failedRun = {
    status: 'failed' as const,
    comparator: 'trimmed' as const,
    structureFailures: [],
    cases: [
      { index: 0, visible: true, passed: true, expected: '0', actual: '0' },
      { index: 1, visible: false, passed: false, inject: { n: 4 }, actual: '0\n1\n2' },
    ],
    total: 4,
    passedCount: 1,
  };
  const page = '/lesson/python/for';

  // The work that came with the last message sent.
  function lastWork(): string {
    return sent.at(-1)!.at(-1)!.parts[0].text ?? '';
  }

  it('gives the model the statement, the code, the run and the verdict on screen', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    const code = 'for i in range(n - 1):\n    print(i)';
    const attempt = await record(userId, 'python', 'for', 'en', 'python', code, failedRun);

    await ask(a, {
      message: 'why does test 2 fail?',
      page,
      lesson,
      work: { code, runOutput: '0\n1\n', submissionId: attempt.id },
    }).expect(200);

    expect(systems[0]).toContain('(python/for)');
    const shown = lastWork();
    expect(shown).toContain(code);
    expect(shown).toContain('0\n1\n');
    expect(shown).toContain('Test 2 (hidden) failed.');
    expect(shown).toContain('n = 4');
    expect(shown).not.toContain('Expected output');
    expect(sent[0].at(-1)!.parts[1].text).toBe('why does test 2 fail?');
  });

  it('sees the new code on the next message, and keeps only the words in the history', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const first = await ask(a, { page, lesson, work: { code: 'print(1)', runOutput: '' } });
    await ask(a, {
      page,
      lesson,
      conversationId: conversationOf(first),
      work: { code: 'print(2)', runOutput: '' },
    }).expect(200);

    expect(lastWork()).toContain('print(2)');
    expect(sent[1]).toHaveLength(3);
    expect(JSON.stringify(sent[1].slice(0, -1))).not.toContain('print(1)');
  });

  it("never shows another student's attempt", async () => {
    const other = await createAuthenticatedAgent();
    const attempt = await record(
      await userIdFor(other.email),
      'python',
      'for',
      'en',
      'python',
      'secret = 1',
      failedRun,
    );
    const { agent: a } = await createAuthenticatedAgent();

    await ask(a, {
      page,
      lesson,
      work: { code: 'x', runOutput: '', submissionId: attempt.id },
    }).expect(200);

    expect(lastWork()).toContain('No Run Tests verdict on screen.');
    expect(lastWork()).not.toContain('secret');
  });

  it('refuses a lesson name that climbs out of the lesson folder, before any model call', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    for (const lessonSlug of ['../../../package', '..', 'for/../../x']) {
      await ask(a, {
        page,
        lesson: { courseKey: 'python', lessonSlug },
        work: { code: 'x', runOutput: '' },
      }).expect(400);
    }
    await ask(a, { work: { code: 'x', runOutput: '' } }).expect(400);
    expect(sent).toEqual([]);
  });
});
