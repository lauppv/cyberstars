import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  sendToPair: vi.fn(),
  findConversation: vi.fn(),
  listConversations: vi.fn(),
  unreadByConversation: vi.fn(),
  listMessages: vi.fn(),
  createMessage: vi.fn(),
  markRead: vi.fn(),
  findMessage: vi.fn(),
  editMessage: vi.fn(),
  softDeleteMessage: vi.fn(),
  toggleReaction: vi.fn(),
};
const mockUserRepo = { findById: vi.fn() };
const mockWs = { pushToUser: vi.fn() };
const mockBlocks = {
  MESSAGE_NOT_SENT: 'Message could not be sent',
  REQUEST_NOT_SENT: 'Request could not be sent',
  REACTION_NOT_ADDED: 'Reaction could not be added',
  existsBetween: vi.fn(async () => false),
  isBlockedBy: vi.fn(async (_blockerId: number, _blockedId: number) => false),
  blockedIds: vi.fn(async (): Promise<number[]> => []),
};
const mockSupport = { openTicket: vi.fn() };

vi.mock('../repositories/messages.repository.js', () => mockRepo);
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('./ws-user.js', () => mockWs);
vi.mock('./blocks.service.js', () => mockBlocks);
vi.mock('./support.service.js', () => mockSupport);

const {
  getInbox,
  startConversation,
  getHistory,
  sendMessage,
  markRead,
  editMessage,
  deleteMessage,
  toggleReaction,
  reportMessage,
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
  mockBlocks.existsBetween.mockImplementation(async () => false);
  mockBlocks.isBlockedBy.mockImplementation(async () => false);
  mockBlocks.blockedIds.mockImplementation(async () => []);
});

// `blocker` blocked `blocked`, nobody else
function block(blocker: number, blocked: number) {
  mockBlocks.isBlockedBy.mockImplementation(
    async (a: number, b: number) => a === blocker && b === blocked,
  );
  mockBlocks.existsBetween.mockImplementation(async () => true);
}

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

describe('messages.service startConversation', () => {
  it('rejects messaging yourself', async () => {
    await expect(startConversation(1, 1, 'hi')).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepo.sendToPair).not.toHaveBeenCalled();
  });

  it('404s when the recipient does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(startConversation(1, 99, 'hi')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.sendToPair).not.toHaveBeenCalled();
  });

  it('sends the first message, shapes the conversation and pushes to both', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.sendToPair.mockResolvedValue(msgRow({ senderId: 1, content: 'hi' }));
    mockRepo.findConversation.mockResolvedValue(
      convRow({ messages: [msgRow({ senderId: 1, content: 'hi' })] }),
    );
    const { conversation, message } = await startConversation(1, 2, 'hi');
    expect(mockRepo.sendToPair).toHaveBeenCalledWith(1, 2, 'hi');
    expect(mockRepo.findConversation).toHaveBeenCalledWith(100);
    expect(conversation.id).toBe(100);
    expect(conversation.other.id).toBe(2);
    expect(conversation.lastMessage?.content).toBe('hi');
    expect(message.content).toBe('hi');
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, expect.objectContaining({ type: 'message' }));
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, expect.objectContaining({ type: 'message' }));
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

  it('serializes a message readAt timestamp to ISO', async () => {
    mockRepo.findConversation.mockResolvedValue(convRow());
    mockRepo.listMessages.mockResolvedValue([
      msgRow({ readAt: new Date('2026-07-17T12:00:00.000Z') }),
    ]);
    const res = await getHistory(1, 100);
    expect(res.messages[0].readAt).toBe('2026-07-17T12:00:00.000Z');
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

  it('pushes to userA when the caller is userB', async () => {
    mockRepo.markRead.mockResolvedValue(1);
    await markRead(2, 100, 500);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, {
      channel: 'dm',
      type: 'read',
      payload: { conversationId: 100, upToMessageId: 500, readerId: 2 },
    });
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

describe('messages.service editMessage', () => {
  it('404s when the message belongs to someone else', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2 }));
    await expect(editMessage(1, 500, 'nou')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.editMessage).not.toHaveBeenCalled();
  });

  it('404s when the message is already deleted', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1, deleted: true }));
    await expect(editMessage(1, 500, 'nou')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.editMessage).not.toHaveBeenCalled();
  });

  it('updates an owned message and stamps editedAt', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.editMessage.mockResolvedValue(
      msgRow({ senderId: 1, content: 'nou', editedAt: new Date('2026-07-17T12:00:00.000Z') }),
    );
    mockRepo.findConversation.mockResolvedValue(convRow());
    const res = await editMessage(1, 500, 'nou');
    expect(mockRepo.editMessage).toHaveBeenCalledWith(500, 1, 'nou');
    expect(res.content).toBe('nou');
    expect(res.editedAt).toBe('2026-07-17T12:00:00.000Z');
  });

  it('pushes the edited message live to both participants', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.editMessage.mockResolvedValue(
      msgRow({ senderId: 1, content: 'nou', editedAt: new Date('2026-07-17T12:00:00.000Z') }),
    );
    mockRepo.findConversation.mockResolvedValue(convRow());

    await editMessage(1, 500, 'nou');

    const frame = {
      channel: 'dm',
      type: 'edited',
      payload: expect.objectContaining({ id: 500, content: 'nou' }),
    };
    expect(mockWs.pushToUser).toHaveBeenCalledWith(2, frame);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(1, frame);
  });

  it('404s when the update affects no row (raced delete)', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.editMessage.mockResolvedValue(null);
    await expect(editMessage(1, 500, 'nou')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('skips the live push when the conversation cannot be loaded', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.editMessage.mockResolvedValue(msgRow({ senderId: 1, content: 'nou' }));
    mockRepo.findConversation.mockResolvedValue(null);

    const res = await editMessage(1, 500, 'nou');
    expect(res.content).toBe('nou');
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
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

  it('404s when the soft-delete affects no row (already deleted)', async () => {
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    mockRepo.softDeleteMessage.mockResolvedValue(null);
    await expect(deleteMessage(1, 500)).rejects.toMatchObject({ statusCode: 404 });
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

describe('messages.service blocks (CYB-140)', () => {
  beforeEach(() => {
    mockRepo.findConversation.mockResolvedValue(convRow());
  });

  it('leaves the people the caller blocked out of the inbox', async () => {
    mockBlocks.blockedIds.mockImplementation(async () => [2]);
    mockRepo.listConversations.mockResolvedValue([]);
    await getInbox(1);
    expect(mockRepo.listConversations).toHaveBeenCalledWith(1, [2]);
  });

  it('refuses a first message either way with the same neutral words', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    block(2, 1);
    await expect(startConversation(1, 2, 'hi')).rejects.toMatchObject({
      statusCode: 403,
      message: 'Message could not be sent',
    });
    expect(mockRepo.sendToPair).not.toHaveBeenCalled();
  });

  it('hides the conversation from the one who blocked', async () => {
    block(1, 2);
    await expect(getHistory(1, 100)).rejects.toMatchObject({ statusCode: 404 });
    await expect(sendMessage(1, 100, 'hi')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('lets the blocked one read the conversation but not send', async () => {
    block(1, 2);
    mockRepo.listMessages.mockResolvedValue([msgRow({ senderId: 1 })]);
    await expect(getHistory(2, 100)).resolves.toMatchObject({ messages: [{ id: 500 }] });
    await expect(sendMessage(2, 100, 'hi')).rejects.toMatchObject({
      statusCode: 403,
      message: 'Message could not be sent',
    });
    expect(mockRepo.createMessage).not.toHaveBeenCalled();
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });

  it('refuses a reaction from the blocked one', async () => {
    block(1, 2);
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 1 }));
    await expect(toggleReaction(2, 500, '👍')).rejects.toMatchObject({
      statusCode: 403,
      message: 'Reaction could not be added',
    });
    expect(mockRepo.toggleReaction).not.toHaveBeenCalled();
  });

  it("keeps the blocked one's edits, deletes and reads off the blocker's screen", async () => {
    block(1, 2);
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2 }));
    mockRepo.editMessage.mockResolvedValue(msgRow({ senderId: 2, content: 'x' }));
    mockRepo.softDeleteMessage.mockResolvedValue(msgRow({ senderId: 2, deleted: true }));
    mockRepo.markRead.mockResolvedValue(1);

    await editMessage(2, 500, 'x');
    await deleteMessage(2, 500);
    await markRead(2, 100, 500);

    const recipients = mockWs.pushToUser.mock.calls.map((c) => c[0]);
    expect(recipients).toEqual([2, 2, 2]);
  });

  it('answers with the saved reaction when the block check before the live frame fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2 }));
    mockRepo.toggleReaction.mockResolvedValue([{ emoji: '👍', userId: 1 }]);
    mockBlocks.isBlockedBy
      .mockImplementationOnce(async () => false)
      .mockImplementationOnce(async () => false)
      .mockImplementationOnce(async () => {
        throw new Error('db down');
      });

    const res = await toggleReaction(1, 500, '👍');
    expect(res.reactions).toEqual([{ emoji: '👍', userId: 1 }]);
    expect(mockWs.pushToUser.mock.calls.map((c) => c[0])).toEqual([1]);
    error.mockRestore();
  });
});

describe('messages.service reportMessage', () => {
  beforeEach(() => {
    mockRepo.findConversation.mockResolvedValue(convRow());
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2, content: 'go away' }));
    mockSupport.openTicket.mockResolvedValue(77);
  });

  it('opens a rule violation ticket holding a copy of the message', async () => {
    const id = await reportMessage(1, 500, 'he keeps writing');
    expect(id).toBe(77);
    const [userId, type, subject, body] = mockSupport.openTicket.mock.calls[0];
    expect(userId).toBe(1);
    expect(type).toBe('RULE_VIOLATION');
    expect(subject).toBe('Reported message from Ben');
    expect(body).toContain('From: Ben (user 2)');
    expect(body).toContain('go away');
    expect(body).toContain('Note from the student: he keeps writing');
  });

  it('works after the reporter blocked the sender', async () => {
    block(1, 2);
    await expect(reportMessage(1, 500, undefined)).resolves.toBe(77);
  });

  it("refuses one's own message, a deleted one and someone else's conversation", async () => {
    await expect(reportMessage(2, 500, undefined)).rejects.toMatchObject({ statusCode: 400 });
    mockRepo.findMessage.mockResolvedValue(msgRow({ senderId: 2, deleted: true }));
    await expect(reportMessage(1, 500, undefined)).rejects.toMatchObject({ statusCode: 400 });
    await expect(reportMessage(3, 500, undefined)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockSupport.openTicket).not.toHaveBeenCalled();
  });
});
