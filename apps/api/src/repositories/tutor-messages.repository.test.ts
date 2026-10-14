import { describe, it, expect, vi, beforeEach } from 'vitest';

const tx = {
  tutorMessage: {
    create: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

const mockPrisma = {
  $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
  tutorMessage: {
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./tutor-messages.repository.js');

const lessonKey = { userId: 7, courseKey: 'python', lessonSlug: 'for' };
const generalKey = { userId: 7, courseKey: null, lessonSlug: null };

beforeEach(() => vi.clearAllMocks());

describe('listNewest', () => {
  it("reads the conversation's newest messages first", async () => {
    mockPrisma.tutorMessage.findMany.mockResolvedValue([]);

    await repo.listNewest(generalKey, 20);

    expect(mockPrisma.tutorMessage.findMany).toHaveBeenCalledWith({
      where: generalKey,
      orderBy: { id: 'desc' },
      take: 20,
    });
  });

  it('reads only older messages after a cursor', async () => {
    mockPrisma.tutorMessage.findMany.mockResolvedValue([]);

    await repo.listNewest(lessonKey, 31, 120);

    expect(mockPrisma.tutorMessage.findMany).toHaveBeenCalledWith({
      where: { ...lessonKey, id: { lt: 120 } },
      orderBy: { id: 'desc' },
      take: 31,
    });
  });
});

describe('saveAndPrune', () => {
  const at = new Date('2026-10-14T10:00:00Z');
  const messages = [
    { role: 'student', text: 'and in Java?', finish: null, createdAt: at },
    { role: 'tutor', text: 'Same idea.', finish: 'complete', createdAt: at },
  ];

  it('inserts the messages in order, then drops those past the cap', async () => {
    tx.tutorMessage.findMany.mockResolvedValue([{ id: 41 }]);

    await repo.saveAndPrune(lessonKey, messages, 200);

    expect(tx.tutorMessage.create.mock.calls).toEqual([
      [{ data: { ...lessonKey, ...messages[0] } }],
      [{ data: { ...lessonKey, ...messages[1] } }],
    ]);
    expect(tx.tutorMessage.findMany).toHaveBeenCalledWith({
      where: lessonKey,
      orderBy: { id: 'desc' },
      skip: 200,
      take: 1,
      select: { id: true },
    });
    expect(tx.tutorMessage.deleteMany).toHaveBeenCalledWith({
      where: { ...lessonKey, id: { lte: 41 } },
    });
  });

  it('deletes nothing while the conversation is under the cap', async () => {
    tx.tutorMessage.findMany.mockResolvedValue([]);

    await repo.saveAndPrune(generalKey, messages, 200);

    expect(tx.tutorMessage.deleteMany).not.toHaveBeenCalled();
  });
});

describe('deleteConversation', () => {
  it("removes only that conversation's messages", async () => {
    await repo.deleteConversation(lessonKey);

    expect(mockPrisma.tutorMessage.deleteMany).toHaveBeenCalledWith({ where: lessonKey });
  });
});
