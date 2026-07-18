import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  findOrCreatePair: vi.fn(),
  findConversation: vi.fn(),
  listConversations: vi.fn(),
  unreadByConversation: vi.fn(),
  listMessages: vi.fn(),
  createMessage: vi.fn(),
  markRead: vi.fn(),
  findMessage: vi.fn(),
  softDeleteMessage: vi.fn(),
  toggleReaction: vi.fn(),
};
const mockUserRepo = { findById: vi.fn() };
const mockWs = { pushToUser: vi.fn() };

vi.mock('../repositories/messages.repository.js', () => mockRepo);
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('./ws-user.js', () => mockWs);

const {
  getInbox,
  openConversation,
  getHistory,
  sendMessage,
  markRead,
  deleteMessage,
  toggleReaction,
} = await import('./messages.service.js');

function convRow(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 100,
    userAId: 1,
    userBId: 2,
    createdAt: new Date('2026-07-17T10:00:00.000Z'),
    updatedAt: new Date('2026-07-17T11:00:00.000Z'),
    userA: { id: 1, name: 'Ada', avatarUrl: '/a.png' },
    userB: { id: 2, name: 'Ben', avatarUrl: null },
    messages: [],
    ...over,
  };
}

function msgRow(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 500,
    conversationId: 100,
    senderId: 2,
    content: 'salut',
    readAt: null,
    deleted: false,
    createdAt: new Date('2026-07-17T11:00:00.000Z'),
    reactions: [],
    ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockRepo.unreadByConversation.mockResolvedValue(new Map());
});

describe('messages.service getInbox', () => {
  it('shapes each conversation from the caller perspective with its unread count', async () => {
    mockRepo.listConversations.mockResolvedValue([convRow({ messages: [msgRow()] })]);
    mockRepo.unreadByConversation.mockResolvedValue(new Map([[100, 3]]));

    const inbox = await getInbox(1);

    expect(inbox).toHaveLength(1);
    // caller is userA (id 1), so `other` must be userB.
    expect(inbox[0].other).toEqual({ id: 2, name: 'Ben', avatarUrl: null });
    expect(inbox[0].unreadCount).toBe(3);
    expect(inbox[0].lastMessage?.content).toBe('salut');
  });

  it('reports the other participant when the caller is userB', async () => {
    mockRepo.listConversations.mockResolvedValue([convRow()]);
    const inbox = await getInbox(2);
    expect(inbox[0].other).toEqual({ id: 1, name: 'Ada', avatarUrl: '/a.png' });
    expect(inbox[0].unreadCount).toBe(0);
  });
});

describe('messages.service openConversation', () => {
  it('rejects messaging yourself', async () => {
    await expect(openConversation(1, 1)).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepo.findOrCreatePair).not.toHaveBeenCalled();
  });

  it('404s when the recipient does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(openConversation(1, 99)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('creates or reuses the canonical pair and shapes it', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.findOrCreatePair.mockResolvedValue(convRow());
    const conv = await openConversation(1, 2);
    expect(mockRepo.findOrCreatePair).toHaveBeenCalledWith(1, 2);
    expect(conv.id).toBe(100);
    expect(conv.other.id).toBe(2);
  });
});

describe('messages.service getHistory', () => {
  it('404s when the caller is not a participant', async () => {
    mockRepo.findConversation.mockResolvedValue(convRow({ userAId: 3, userBId: 4 }));
    await expect(getHistory(1, 100)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('404s when the conversation does not exist', async () => {
    mockRepo.findConversation.mockResolvedValue(null);
    await expect(getHistory(1, 100)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns take rows and computes hasMore from the take+1 probe', async () => {
    mockRepo.findConversation.mockResolvedValue(convRow());
    // asked for take=2 -> service requests 3; repo returns 3 -> hasMore true.
    mockRepo.listMessages.mockResolvedValue([
      msgRow({ id: 3 }),
      msgRow({ id: 2 }),
      msgRow({ id: 1 }),
    ]);
    const res = await getHistory(1, 100, 2);
    expect(mockRepo.listMessages).toHaveBeenCalledWith(100, 3, undefined);
    expect(res.messages).toHaveLength(2);
    expect(res.hasMore).toBe(true);
  });

  it('blanks the content of deleted messages', async () => {
    mockRepo.findConversation.mockResolvedValue(convRow());
    mockRepo.listMessages.mockResolvedValue([msgRow({ deleted: true, content: 'secret' })]);
    const res = await getHistory(1, 100);
    expect(res.messages[0].deleted).toBe(true);
    expect(res.messages[0].content).toBe('');
  });
});

describe('messages.service sendMessage', () => {
  beforeEach(() => {
    mockRepo.findConversation.mockResolvedValue(convRow());
    mockRepo.createMessage.mockResolvedValue(msgRow({ senderId: 1, content: 'buna' }));
  });

  it('pushes the message to both participants without a bell notification', async () => {
    const msg = await sendMessage(1, 100, 'buna');

    expect(msg.content).toBe('buna');
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, {
      channel: 'dm',
      type: 'message',
      payload: expect.objectContaining({ id: 500 }),
    });
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, {
      channel: 'dm',
      type: 'message',
      payload: expect.objectContaining({ id: 500 }),
    });
  });

  it('404s when the caller is not a participant', async () => {
    mockRepo.findConversation.mockResolvedValue(convRow({ userAId: 5, userBId: 6 }));
    await expect(sendMessage(1, 100, 'hi')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.createMessage).not.toHaveBeenCalled();
  });
});

describe('messages.service markRead', () => {
  beforeEach(() => {
    mockRepo.findConversation.mockResolvedValue(convRow());
  });

  it('pushes a read frame to the other side', async () => {
    mockRepo.markRead.mockResolvedValue(2);
    await markRead(1, 100, 500);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, {
      channel: 'dm',
      type: 'read',
      payload: { conversationId: 100, upToMessageId: 500, readerId: 1 },
    });
  });

  it('does not push a read frame when nothing was newly read', async () => {
    mockRepo.markRead.mockResolvedValue(0);
    await markRead(1, 100, 500);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });
});

describe('messages.service toggleReaction', () => {
  it('404s when the message does not exist', async () => {
    mockRepo.findMessage.mockResolvedValue(null);
    await expect(toggleReaction(1, 500, '🔥')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.toggleReaction).not.toHaveBeenCalled();
  });

  it('404s when the caller is not a participant', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow());
    mockRepo.findConversation.mockResolvedValue(convRow({ userAId: 5, userBId: 6 }));
    await expect(toggleReaction(1, 500, '🔥')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.toggleReaction).not.toHaveBeenCalled();
  });

  it('rejects reacting to a deleted message', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ deleted: true }));
    mockRepo.findConversation.mockResolvedValue(convRow());
    await expect(toggleReaction(1, 500, '🔥')).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepo.toggleReaction).not.toHaveBeenCalled();
  });

  it('toggles, pushes the refreshed list to both participants, and returns the message', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow());
    mockRepo.findConversation.mockResolvedValue(convRow());
    mockRepo.toggleReaction.mockResolvedValue([{ emoji: '🔥', userId: 1 }]);

    const msg = await toggleReaction(1, 500, '🔥');

    expect(mockRepo.toggleReaction).toHaveBeenCalledWith(500, 1, '🔥');
    expect(msg.reactions).toEqual([{ emoji: '🔥', userId: 1 }]);
    const frame = {
      channel: 'dm',
      type: 'reaction',
      payload: { conversationId: 100, messageId: 500, reactions: [{ emoji: '🔥', userId: 1 }] },
    };
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, frame);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, frame);
  });
});

describe('messages.service deleteMessage', () => {
  it('404s when the message belongs to someone else', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2 }));
    await expect(deleteMessage(1, 500)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.softDeleteMessage).not.toHaveBeenCalled();
  });

  it('soft-deletes an owned message and blanks its content', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.softDeleteMessage.mockResolvedValue(
      msgRow({ senderId: 1, deleted: true, content: '' }),
    );
    const res = await deleteMessage(1, 500);
    expect(mockRepo.softDeleteMessage).toHaveBeenCalledWith(500, 1);
    expect(res.deleted).toBe(true);
    expect(res.content).toBe('');
  });

  it('pushes the redacted message live to both participants', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.softDeleteMessage.mockResolvedValue(
      msgRow({ senderId: 1, deleted: true, content: 'secret' }),
    );
    mockRepo.findConversation.mockResolvedValue(convRow());

    await deleteMessage(1, 500);

    const frame = {
      channel: 'dm',
      type: 'deleted',
      payload: expect.objectContaining({ id: 500, deleted: true, content: '' }),
    };
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, frame);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, frame);
  });

  it('skips the live push when the conversation cannot be loaded', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.softDeleteMessage.mockResolvedValue(
      msgRow({ senderId: 1, deleted: true, content: '' }),
    );
    mockRepo.findConversation.mockResolvedValue(null);

    const res = await deleteMessage(1, 500);
    expect(res.deleted).toBe(true);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });
});
