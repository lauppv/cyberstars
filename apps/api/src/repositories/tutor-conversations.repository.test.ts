import { describe, it, expect, vi, beforeEach } from 'vitest';

const tx = {
  tutorConversation: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  tutorMessage: {
    create: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

const mockPrisma = {
  $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
  tutorConversation: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    deleteMany: vi.fn(),
  },
  tutorMessage: {
    findMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./tutor-conversations.repository.js');

const caps = { messages: 200, conversations: 50 };

beforeEach(() => vi.clearAllMocks());

describe('listConversations', () => {
  it("reads the student's conversations, the one saved to last first", async () => {
    mockPrisma.tutorConversation.findMany.mockResolvedValue([]);

    await repo.listConversations(7, 50);

    expect(mockPrisma.tutorConversation.findMany).toHaveBeenCalledWith({
      where: { userId: 7 },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take: 50,
    });
  });
});

describe('findConversation', () => {
  it('looks for the conversation among the student’s own only', async () => {
    mockPrisma.tutorConversation.findFirst.mockResolvedValue(null);

    await expect(repo.findConversation(7, 12)).resolves.toBeNull();

    expect(mockPrisma.tutorConversation.findFirst).toHaveBeenCalledWith({
      where: { id: 12, userId: 7 },
    });
  });
});

describe('listNewest', () => {
  it("reads the conversation's newest messages first", async () => {
    mockPrisma.tutorMessage.findMany.mockResolvedValue([]);

    await repo.listNewest(12, 20);

    expect(mockPrisma.tutorMessage.findMany).toHaveBeenCalledWith({
      where: { conversationId: 12 },
      orderBy: { id: 'desc' },
      take: 20,
    });
  });

  it('reads only older messages after a cursor', async () => {
    mockPrisma.tutorMessage.findMany.mockResolvedValue([]);

    await repo.listNewest(12, 31, 120);

    expect(mockPrisma.tutorMessage.findMany).toHaveBeenCalledWith({
      where: { conversationId: 12, id: { lt: 120 } },
      orderBy: { id: 'desc' },
      take: 31,
    });
  });
});

describe('saveAndPrune', () => {
  const sentAt = new Date('2026-10-14T10:00:00Z');
  const answeredAt = new Date('2026-10-14T10:00:05Z');
  const messages = [
    { role: 'student', text: 'and in Java?', finish: null, createdAt: sentAt },
    { role: 'tutor', text: 'Same idea.', finish: 'complete', createdAt: answeredAt },
  ];

  beforeEach(() => {
    tx.tutorMessage.findMany.mockResolvedValue([]);
    tx.tutorConversation.findMany.mockResolvedValue([]);
  });

  it('adds the messages in order to the conversation and moves it to the top', async () => {
    tx.tutorConversation.update.mockResolvedValue({ id: 12, userId: 7 });

    await expect(repo.saveAndPrune(12, messages, caps)).resolves.toBe(12);

    expect(tx.tutorConversation.update).toHaveBeenCalledWith({
      where: { id: 12 },
      data: { updatedAt: answeredAt },
    });
    expect(tx.tutorMessage.create.mock.calls.map((c) => c[0])).toEqual([
      { data: { ...messages[0], conversationId: 12 } },
      { data: { ...messages[1], conversationId: 12 } },
    ]);
    expect(tx.tutorConversation.create).not.toHaveBeenCalled();
  });

  it('starts a new conversation with the first message and returns its id', async () => {
    tx.tutorConversation.create.mockResolvedValue({ id: 13, userId: 7 });
    const lesson = { userId: 7, courseKey: 'python', lessonSlug: 'for', title: 'and in Java?' };

    await expect(repo.saveAndPrune(lesson, messages, caps)).resolves.toBe(13);

    expect(tx.tutorConversation.create).toHaveBeenCalledWith({
      data: { ...lesson, createdAt: sentAt, updatedAt: answeredAt },
    });
    expect(tx.tutorMessage.create.mock.calls[0][0].data.conversationId).toBe(13);
  });

  it("drops the conversation's messages past the cap and nothing else", async () => {
    tx.tutorConversation.update.mockResolvedValue({ id: 12, userId: 7 });
    tx.tutorMessage.findMany.mockResolvedValue([{ id: 40 }]);

    await repo.saveAndPrune(12, messages, caps);

    expect(tx.tutorMessage.findMany).toHaveBeenCalledWith({
      where: { conversationId: 12 },
      orderBy: { id: 'desc' },
      skip: 200,
      take: 1,
      select: { id: true },
    });
    expect(tx.tutorMessage.deleteMany).toHaveBeenCalledWith({
      where: { conversationId: 12, id: { lte: 40 } },
    });
  });

  it("drops the student's conversations past the newest 50", async () => {
    tx.tutorConversation.create.mockResolvedValue({ id: 60, userId: 7 });
    tx.tutorConversation.findMany.mockResolvedValue([{ id: 3 }, { id: 1 }]);

    await repo.saveAndPrune(
      { userId: 7, courseKey: null, lessonSlug: null, title: 'hi' },
      messages,
      caps,
    );

    expect(tx.tutorConversation.findMany).toHaveBeenCalledWith({
      where: { userId: 7 },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: 50,
      select: { id: true },
    });
    expect(tx.tutorConversation.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: [3, 1] } },
    });
  });

  it('deletes nothing while both caps hold', async () => {
    tx.tutorConversation.update.mockResolvedValue({ id: 12, userId: 7 });

    await repo.saveAndPrune(12, messages, caps);

    expect(tx.tutorMessage.deleteMany).not.toHaveBeenCalled();
    expect(tx.tutorConversation.deleteMany).not.toHaveBeenCalled();
  });
});

describe('deleteConversation', () => {
  it("deletes the student's own conversation and says so", async () => {
    mockPrisma.tutorConversation.deleteMany.mockResolvedValue({ count: 1 });

    await expect(repo.deleteConversation(7, 12)).resolves.toBe(true);

    expect(mockPrisma.tutorConversation.deleteMany).toHaveBeenCalledWith({
      where: { id: 12, userId: 7 },
    });
  });

  it("says when there was no such conversation of the student's", async () => {
    mockPrisma.tutorConversation.deleteMany.mockResolvedValue({ count: 0 });

    await expect(repo.deleteConversation(7, 99)).resolves.toBe(false);
  });
});
