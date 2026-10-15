import { describe, it, expect, vi, beforeEach } from 'vitest';

const repo = {
  listConversations: vi.fn(),
  findConversation: vi.fn(),
  listNewest: vi.fn(),
  saveAndPrune: vi.fn(),
  deleteConversation: vi.fn(),
};
vi.mock('../repositories/tutor-conversations.repository.js', () => repo);

const service = await import('./tutor-conversations.service.js');

const caps = { messages: 200, conversations: 50 };

function row(id: number, role: string, text: string, finish: string | null = null) {
  return {
    id,
    conversationId: 12,
    role,
    text,
    finish,
    createdAt: new Date(`2026-10-14T10:00:0${id % 10}Z`),
  };
}

function conversation(id: number, courseKey: string | null, lessonSlug: string | null) {
  return {
    id,
    userId: 7,
    courseKey,
    lessonSlug,
    title: `t${id}`,
    createdAt: new Date('2026-10-14T09:00:00Z'),
    updatedAt: new Date('2026-10-14T10:00:00Z'),
  };
}

beforeEach(() => vi.clearAllMocks());

describe('titleOf', () => {
  it('keeps the start of the question on one line', () => {
    expect(service.titleOf('  why does\n\nmy   loop stop?  ')).toBe('why does my loop stop?');
    expect(service.titleOf('x'.repeat(100))).toHaveLength(80);
  });
});

describe('listConversations', () => {
  it('lists the newest 50, a lesson one with its lesson and a general one with none', async () => {
    repo.listConversations.mockResolvedValue([
      conversation(3, 'python', 'for'),
      conversation(2, null, null),
    ]);

    await expect(service.listConversations(7)).resolves.toEqual([
      {
        id: 3,
        title: 't3',
        lesson: { courseKey: 'python', lessonSlug: 'for' },
        updatedAt: '2026-10-14T10:00:00.000Z',
      },
      { id: 2, title: 't2', lesson: null, updatedAt: '2026-10-14T10:00:00.000Z' },
    ]);
    expect(repo.listConversations).toHaveBeenCalledWith(7, 50);
  });
});

describe('findConversation', () => {
  it('gives the conversation and its lesson when it is the student’s', async () => {
    repo.findConversation.mockResolvedValue(conversation(3, 'python', 'for'));

    await expect(service.findConversation(7, 3)).resolves.toEqual({
      id: 3,
      lesson: { courseKey: 'python', lessonSlug: 'for' },
    });
    expect(repo.findConversation).toHaveBeenCalledWith(7, 3);
  });

  it('gives null for one that is not', async () => {
    repo.findConversation.mockResolvedValue(null);
    await expect(service.findConversation(7, 4)).resolves.toBeNull();
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

    await expect(service.recentHistory(12)).resolves.toEqual([
      { role: 'student', text: 'what is a for loop?' },
      { role: 'student', text: 'and in Java?' },
      { role: 'tutor', text: 'Same idea in Java.' },
    ]);
    expect(repo.listNewest).toHaveBeenCalledWith(12, 20);
  });
});

describe('saveExchange', () => {
  const sentAt = new Date('2026-10-14T10:00:00Z');

  it("saves the student's message and the answer together into the conversation", async () => {
    repo.saveAndPrune.mockResolvedValue(12);

    await expect(
      service.saveExchange(
        7,
        12,
        { text: 'and in Java?', sentAt },
        { text: 'Same idea.', finish: 'cut' },
      ),
    ).resolves.toBe(12);

    const [to, messages, saveCaps] = repo.saveAndPrune.mock.calls[0];
    expect(to).toBe(12);
    expect(saveCaps).toEqual(caps);
    expect(messages).toEqual([
      { role: 'student', text: 'and in Java?', finish: null, createdAt: sentAt },
      { role: 'tutor', text: 'Same idea.', finish: 'cut', createdAt: expect.any(Date) },
    ]);
    expect(messages[1].createdAt.getTime()).toBeGreaterThanOrEqual(sentAt.getTime());
  });

  it('starts a new conversation about the lesson, titled by the question', async () => {
    repo.saveAndPrune.mockResolvedValue(13);

    await expect(
      service.saveExchange(
        7,
        { lesson: { courseKey: 'python', lessonSlug: 'for' } },
        { text: 'why\ntwice?', sentAt },
        { text: 'Look at the range.', finish: 'complete' },
      ),
    ).resolves.toBe(13);

    expect(repo.saveAndPrune.mock.calls[0][0]).toEqual({
      userId: 7,
      courseKey: 'python',
      lessonSlug: 'for',
      title: 'why twice?',
    });
  });

  it('starts a new general conversation with no lesson', async () => {
    repo.saveAndPrune.mockResolvedValue(14);

    await service.saveExchange(
      7,
      { lesson: null },
      { text: 'hi', sentAt },
      { text: 'Hi.', finish: 'complete' },
    );

    expect(repo.saveAndPrune.mock.calls[0][0]).toMatchObject({ courseKey: null, lessonSlug: null });
  });

  it('logs a storage failure instead of throwing it', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    repo.saveAndPrune.mockRejectedValue(new Error('db down'));

    await expect(
      service.saveExchange(7, 12, { text: 'hi', sentAt }, { text: 'Hello.', finish: 'complete' }),
    ).resolves.toBeNull();
    expect(log).toHaveBeenCalledWith('[tutor] could not save the conversation:', expect.any(Error));
    log.mockRestore();
  });
});

describe('getPage', () => {
  beforeEach(() => repo.findConversation.mockResolvedValue(conversation(12, null, null)));

  it('returns 30 messages newest first and says when older ones remain', async () => {
    const rows = Array.from({ length: 31 }, (_, i) => row(100 - i, 'student', `m${i}`));
    repo.listNewest.mockResolvedValue(rows);

    const page = await service.getPage(7, 12, 101);

    expect(repo.findConversation).toHaveBeenCalledWith(7, 12);
    expect(repo.listNewest).toHaveBeenCalledWith(12, 31, 101);
    expect(page?.hasMore).toBe(true);
    expect(page?.messages).toHaveLength(30);
    expect(page?.messages[0]).toEqual({
      id: 100,
      role: 'student',
      text: 'm0',
      finish: null,
      createdAt: rows[0].createdAt.toISOString(),
    });
  });

  it('says nothing older remains on the last page', async () => {
    repo.listNewest.mockResolvedValue([row(2, 'tutor', 'Hi.', 'complete')]);

    await expect(service.getPage(7, 12)).resolves.toEqual({
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

  it("reads nothing of a conversation that isn't the student's", async () => {
    repo.findConversation.mockResolvedValue(null);

    await expect(service.getPage(8, 12)).resolves.toBeNull();
    expect(repo.listNewest).not.toHaveBeenCalled();
  });
});

describe('deleteConversation', () => {
  it("deletes the student's conversation and says whether there was one", async () => {
    repo.deleteConversation.mockResolvedValue(true);
    await expect(service.deleteConversation(7, 12)).resolves.toBe(true);
    expect(repo.deleteConversation).toHaveBeenCalledWith(7, 12);
  });
});
