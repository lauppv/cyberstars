import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  createPoll: vi.fn(),
  findPoll: vi.fn(),
  joinedAt: vi.fn(),
  vote: vi.fn(),
  listPolls: vi.fn(),
};
const mockNotifications = { pushLive: vi.fn() };

vi.mock('../repositories/polls.repository.js', () => mockRepo);
vi.mock('./notifications.service.js', () => mockNotifications);

const { send, get, vote, list } = await import('./polls.service.js');

const sentAt = new Date('2026-11-03T10:00:00.000Z');
const stored = {
  id: 4,
  authorId: 2,
  createdAt: sentAt,
  question: 'Next?',
  options: [
    { id: 7, text: 'Rust' },
    { id: 8, text: 'Go' },
  ],
  voted: [] as { userId: number }[],
};

beforeEach(() => {
  vi.clearAllMocks();
  // Signed up before the poll went out, so it got it
  mockRepo.joinedAt.mockResolvedValue(new Date('2026-11-01T10:00:00.000Z'));
});

describe('polls.service send', () => {
  it('inserts it for everyone, pushes it live and says how many got it', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    mockRepo.createPoll.mockResolvedValue(rows);
    expect(await send(2, 'Next?', ['Rust', 'Go'])).toBe(2);
    expect(mockRepo.createPoll).toHaveBeenCalledWith(2, 'Next?', ['Rust', 'Go']);
    expect(mockNotifications.pushLive).toHaveBeenCalledWith(rows);
  });

  it('throws when the insert fails, so the admin hears of it', async () => {
    mockRepo.createPoll.mockRejectedValue(new Error('db down'));
    await expect(send(2, 'Next?', ['Rust', 'Go'])).rejects.toThrow('db down');
    expect(mockNotifications.pushLive).not.toHaveBeenCalled();
  });
});

describe('polls.service get', () => {
  it('gives the question and options, and whether this user voted', async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    expect(await get(4, 10)).toEqual({
      id: 4,
      question: 'Next?',
      options: stored.options,
      voted: false,
    });
    expect(mockRepo.findPoll).toHaveBeenCalledWith(4, 10);

    mockRepo.findPoll.mockResolvedValue({ ...stored, voted: [{ userId: 10 }] });
    expect((await get(4, 10)).voted).toBe(true);
  });

  it('is a 404 for a poll that does not exist', async () => {
    mockRepo.findPoll.mockResolvedValue(null);
    await expect(get(99, 10)).rejects.toMatchObject({ statusCode: 404, message: 'Poll not found' });
  });

  it('is a 404 for the author and for an account made after it went out', async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    await expect(get(4, 2)).rejects.toMatchObject({ statusCode: 404, message: 'Poll not found' });
    mockRepo.joinedAt.mockResolvedValue(new Date('2026-11-03T10:00:00.001Z'));
    await expect(get(4, 10)).rejects.toMatchObject({ statusCode: 404, message: 'Poll not found' });
    mockRepo.joinedAt.mockResolvedValue(null);
    await expect(get(4, 10)).rejects.toMatchObject({ statusCode: 404, message: 'Poll not found' });
    expect(mockRepo.joinedAt).toHaveBeenCalledWith(10);
  });

  it('opens it for an account made in the same moment it went out', async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    mockRepo.joinedAt.mockResolvedValue(sentAt);
    expect((await get(4, 10)).id).toBe(4);
  });
});

describe('polls.service vote', () => {
  it('counts the vote', async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    mockRepo.vote.mockResolvedValue(true);
    await expect(vote(4, 10, [7, 8])).resolves.toBeUndefined();
    expect(mockRepo.vote).toHaveBeenCalledWith(4, 10, [7, 8]);
  });

  it('is a 404 for a poll that does not exist', async () => {
    mockRepo.findPoll.mockResolvedValue(null);
    await expect(vote(99, 10, [7])).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.vote).not.toHaveBeenCalled();
  });

  it("is a 404 for an account the poll didn't go to, counting nothing", async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    await expect(vote(4, 2, [7])).rejects.toMatchObject({ statusCode: 404 });
    mockRepo.joinedAt.mockResolvedValue(new Date('2026-11-04T10:00:00.000Z'));
    await expect(vote(4, 10, [7])).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.vote).not.toHaveBeenCalled();
  });

  it("refuses an option of another poll's", async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    await expect(vote(4, 10, [7, 12])).rejects.toMatchObject({
      statusCode: 400,
      message: 'Pick options from this poll',
    });
    expect(mockRepo.vote).not.toHaveBeenCalled();
  });

  it('is a 409 for a second vote', async () => {
    mockRepo.findPoll.mockResolvedValue(stored);
    mockRepo.vote.mockResolvedValue(false);
    await expect(vote(4, 10, [7])).rejects.toMatchObject({
      statusCode: 409,
      message: 'You already voted in this poll',
    });
  });
});

describe('polls.service list', () => {
  it('lists each poll with its counts, naming the author while their account is there', async () => {
    const at = new Date('2026-11-03T10:00:00.000Z');
    mockRepo.listPolls.mockResolvedValue([
      {
        id: 2,
        question: 'Next?',
        createdAt: at,
        recipients: 40,
        voters: 4,
        author: { name: 'Ada' },
        options: [{ id: 7, pollId: 2, text: 'Rust', votes: 3 }],
      },
      {
        id: 1,
        question: 'Hard?',
        createdAt: at,
        recipients: 30,
        voters: 0,
        author: null,
        options: [],
      },
    ]);
    expect(await list()).toEqual([
      {
        id: 2,
        question: 'Next?',
        authorName: 'Ada',
        createdAt: '2026-11-03T10:00:00.000Z',
        recipients: 40,
        voters: 4,
        options: [{ id: 7, text: 'Rust', votes: 3 }],
      },
      {
        id: 1,
        question: 'Hard?',
        authorName: null,
        createdAt: '2026-11-03T10:00:00.000Z',
        recipients: 30,
        voters: 0,
        options: [],
      },
    ]);
    expect(mockRepo.listPolls).toHaveBeenCalledWith(50);
  });
});
