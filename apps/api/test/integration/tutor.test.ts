import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { config } from '../../src/config/index.js';
import { saveExchange, conversationKey } from '../../src/services/tutor-conversations.service.js';

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

// Every request Gemini got, as the conversation it was sent.
const sent: SentContent[][] = [];
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
  reply = () => streamed('Loops ', 'repeat code.');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      sent.push(JSON.parse(String(init.body)).contents);
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

function texts(contents: SentContent[]): string[] {
  return contents.map((c) => `${c.role}: ${c.parts[0].text}`);
}

describe('Tutor conversations', () => {
  it('saves each exchange and sends it back to the model with the next message', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const first = await ask(a, {}).expect(200);
    expect(first.text).toContain('data: {"type":"done","finish":"complete"}');

    const page = await a.get('/api/tutor/conversations/general').expect(200);
    expect(page.body.hasMore).toBe(false);
    expect(page.body.messages).toEqual([
      expect.objectContaining({ role: 'tutor', text: 'Loops repeat code.', finish: 'complete' }),
      expect.objectContaining({ role: 'student', text: 'What is a loop?', finish: null }),
    ]);

    await ask(a, { message: 'and in Java?' }).expect(200);
    expect(texts(sent[1])).toEqual([
      'user: What is a loop?',
      'model: Loops repeat code.',
      'user: and in Java?',
    ]);
  });

  it("keeps each lesson's conversation apart from the general one and from other lessons", async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await ask(a, { message: 'general question' }).expect(200);
    await ask(a, { message: 'lesson question', lesson }).expect(200);
    await ask(a, {
      message: 'other lesson question',
      lesson: { courseKey: 'python', lessonSlug: 'print' },
    }).expect(200);

    // The lesson's own message is the only history its second message carries.
    await ask(a, { message: 'and again?', lesson }).expect(200);
    expect(texts(sent[3])).toEqual([
      'user: lesson question',
      'model: Loops repeat code.',
      'user: and again?',
    ]);

    const general = await a.get('/api/tutor/conversations/general').expect(200);
    expect(general.body.messages.map((m: { text: string }) => m.text)).toEqual([
      'Loops repeat code.',
      'general question',
    ]);
  });

  it("deletes a lesson's conversation and leaves the general one as it was", async () => {
    const { agent: a } = await createAuthenticatedAgent();
    await ask(a, {}).expect(200);
    await ask(a, { lesson }).expect(200);

    await a.delete('/api/tutor/conversations/python/for').expect(204);

    const deleted = await a.get('/api/tutor/conversations/python/for').expect(200);
    expect(deleted.body.messages).toEqual([]);
    await ask(a, { message: 'remember me?', lesson }).expect(200);
    expect(texts(sent.at(-1)!)).toEqual(['user: remember me?']);

    const general = await a.get('/api/tutor/conversations/general').expect(200);
    expect(general.body.messages).toHaveLength(2);
  });

  it("never shows or deletes another student's messages", async () => {
    const { agent: owner } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();
    await ask(owner, {}).expect(200);

    const seen = await other.get('/api/tutor/conversations/general').expect(200);
    expect(seen.body.messages).toEqual([]);
    await other.delete('/api/tutor/conversations/general').expect(204);

    const kept = await owner.get('/api/tutor/conversations/general').expect(200);
    expect(kept.body.messages).toHaveLength(2);
  });

  it('saves nothing when the model fails before any words', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    reply = () => new Response('{"error":{"message":"boom"}}', { status: 500 });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    await ask(a, {}).expect(502);
    log.mockRestore();

    const page = await a.get('/api/tutor/conversations/general').expect(200);
    expect(page.body.messages).toEqual([]);
  });

  it('keeps an answer cut by the length limit marked as cut', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    reply = () =>
      new Response(
        `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Half' }] }, finishReason: 'MAX_TOKENS' }] })}\r\n\r\n`,
        { headers: { 'Content-Type': 'text/event-stream' } },
      );

    await ask(a, {}).expect(200);

    const page = await a.get('/api/tutor/conversations/general').expect(200);
    expect(page.body.messages[0]).toMatchObject({ text: 'Half', finish: 'cut' });
  });

  it('refuses a conversation about a lesson the curriculum does not list', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await ask(a, { lesson: { courseKey: 'python', lessonSlug: 'nope' } }).expect(400);
    await a.get('/api/tutor/conversations/python/nope').expect(404);
    expect(sent).toEqual([]);
  });

  it('keeps only the newest 200 messages of a conversation', async () => {
    const { email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await prisma.tutorMessage.createMany({
      data: Array.from({ length: 199 }, (_, i) => ({
        userId,
        courseKey: 'python',
        lessonSlug: 'for',
        role: i % 2 ? 'tutor' : 'student',
        text: `old ${i}`,
      })),
    });

    await saveExchange(
      conversationKey(userId, lesson),
      { text: 'newest question', sentAt: new Date() },
      { text: 'newest answer', finish: 'complete' },
    );

    const rows = await prisma.tutorMessage.findMany({ where: { userId }, orderBy: { id: 'asc' } });
    expect(rows).toHaveLength(200);
    expect(rows[0].text).toBe('old 1');
    expect(rows.at(-1)!.text).toBe('newest answer');
  });

  it("takes a student's messages with them when their user row is deleted", async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await ask(a, {}).expect(200);
    await ask(a, { lesson }).expect(200);

    await prisma.user.delete({ where: { id: userId } });

    expect(await prisma.tutorMessage.count({ where: { userId } })).toBe(0);
  });
});
