import { describe, it, expect, vi, beforeEach } from 'vitest';

const repo = { listNewest: vi.fn(), saveAndPrune: vi.fn(), deleteConversation: vi.fn() };
vi.mock('../repositories/tutor-messages.repository.js', () => repo);

const service = await import('./tutor-conversations.service.js');

const key = { userId: 7, courseKey: 'python', lessonSlug: 'for' };

function row(id: number, role: string, text: string, finish: string | null = null) {
  return {
    id,
    userId: 7,
    courseKey: 'python',
    lessonSlug: 'for',
    role,
    text,
    finish,
    createdAt: new Date(`2026-10-14T10:00:0${id % 10}Z`),
  };
}

beforeEach(() => vi.clearAllMocks());

describe('conversationKey', () => {
  it('names the general conversation by having no lesson', () => {
    expect(service.conversationKey(7)).toEqual({ userId: 7, courseKey: null, lessonSlug: null });
  });

  it("names a lesson's conversation by its course and slug", () => {
    expect(service.conversationKey(7, { courseKey: 'python', lessonSlug: 'for' })).toEqual(key);
  });
});

describe('recentHistory', () => {
  it('gives the last 20 messages oldest first, leaving out empty answers', async () => {
    repo.listNewest.mockResolvedValue([
      row(4, 'tutor', 'Same idea in Java.', 'complete'),
      row(3, 'student', 'and in Java?'),
      row(2, 'tutor', '', 'blocked'),
      row(1, 'student', 'what is a for loop?'),
    ]);

    await expect(service.recentHistory(key)).resolves.toEqual([
      { role: 'student', text: 'what is a for loop?' },
      { role: 'student', text: 'and in Java?' },
      { role: 'tutor', text: 'Same idea in Java.' },
    ]);
    expect(repo.listNewest).toHaveBeenCalledWith(key, 20);
  });
});

describe('saveExchange', () => {
  it("saves the student's message and the answer together, capped at 200", async () => {
    const sentAt = new Date('2026-10-14T10:00:00Z');

    await service.saveExchange(
      key,
      { text: 'and in Java?', sentAt },
      { text: 'Same idea.', finish: 'cut' },
    );

    const [savedKey, messages, cap] = repo.saveAndPrune.mock.calls[0];
    expect(savedKey).toBe(key);
    expect(cap).toBe(200);
    expect(messages).toEqual([
      { role: 'student', text: 'and in Java?', finish: null, createdAt: sentAt },
      { role: 'tutor', text: 'Same idea.', finish: 'cut', createdAt: expect.any(Date) },
    ]);
    expect(messages[1].createdAt.getTime()).toBeGreaterThanOrEqual(sentAt.getTime());
  });

  it('logs a storage failure instead of throwing it', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    repo.saveAndPrune.mockRejectedValue(new Error('db down'));

    await expect(
      service.saveExchange(
        key,
        { text: 'hi', sentAt: new Date() },
        { text: 'Hello.', finish: 'complete' },
      ),
    ).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith('[tutor] could not save the conversation:', expect.any(Error));
    log.mockRestore();
  });
});

describe('getPage', () => {
  it('returns 30 messages newest first and says when older ones remain', async () => {
    const rows = Array.from({ length: 31 }, (_, i) => row(100 - i, 'student', `m${i}`));
    repo.listNewest.mockResolvedValue(rows);

    const page = await service.getPage(key, 101);

    expect(repo.listNewest).toHaveBeenCalledWith(key, 31, 101);
    expect(page.hasMore).toBe(true);
    expect(page.messages).toHaveLength(30);
    expect(page.messages[0]).toEqual({
      id: 100,
      role: 'student',
      text: 'm0',
      finish: null,
      createdAt: rows[0].createdAt.toISOString(),
    });
  });

  it('says nothing older remains on the last page', async () => {
    repo.listNewest.mockResolvedValue([row(2, 'tutor', 'Hi.', 'complete')]);

    await expect(service.getPage(key)).resolves.toEqual({
      messages: [
        {
          id: 2,
          role: 'tutor',
          text: 'Hi.',
          finish: 'complete',
          createdAt: '2026-10-14T10:00:02.000Z',
        },
      ],
      hasMore: false,
    });
  });
});

describe('deleteConversation', () => {
  it('deletes the conversation by its key', async () => {
    await service.deleteConversation(key);
    expect(repo.deleteConversation).toHaveBeenCalledWith(key);
  });
});
