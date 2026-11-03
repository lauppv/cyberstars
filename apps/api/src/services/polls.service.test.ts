import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  createPoll: vi.fn(),
  listPolls: vi.fn(),
};
const mockNotifications = { pushLive: vi.fn() };

vi.mock('../repositories/polls.repository.js', () => mockRepo);
vi.mock('./notifications.service.js', () => mockNotifications);

const { send, list } = await import('./polls.service.js');

beforeEach(() => vi.clearAllMocks());

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
