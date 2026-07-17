import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import type { ConversationDTO, MessageDTO } from '../../shared/messages';
import type { UserSocketFrame } from '../../shared/notifications';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true, user: { id: 1, role: 'USER' } as { id: number; role: string } | null },
  service: {
    getConversations: vi.fn(),
    openConversation: vi.fn(),
    getHistory: vi.fn(),
    sendMessage: vi.fn(),
    markRead: vi.fn(),
    deleteMessage: vi.fn(),
  },
  // Captures the fan-out handler UserSocketProvider hands to the raw socket hook.
  frameHandler: null as ((f: UserSocketFrame) => void) | null,
}));

vi.mock('../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../services/messagesService', () => h.service);
vi.mock('../hooks/useUserSocket', () => ({
  useUserSocket: (_enabled: boolean, onFrame: (f: UserSocketFrame) => void) => {
    h.frameHandler = onFrame;
  },
}));

import { UserSocketProvider } from './UserSocketContext';
import { MessagesProvider, useMessages } from './MessagesContext';

function conv(over: Partial<ConversationDTO> = {}): ConversationDTO {
  return {
    id: 10,
    other: { id: 2, name: 'Ben', avatarUrl: null },
    lastMessage: null,
    unreadCount: 0,
    updatedAt: '2026-07-17T10:00:00.000Z',
    ...over,
  };
}

function msg(over: Partial<MessageDTO> = {}): MessageDTO {
  return {
    id: 100,
    conversationId: 10,
    senderId: 2,
    content: 'salut',
    deleted: false,
    readAt: null,
    createdAt: '2026-07-17T11:00:00.000Z',
    ...over,
  };
}

function Probe() {
  const { conversations, totalUnread, openWith, setActiveConversation, markConversationRead } =
    useMessages();
  return (
    <div>
      <span data-testid="unread">{totalUnread}</span>
      <span data-testid="count">{conversations.length}</span>
      <span data-testid="ids">{conversations.map((c) => c.id).join(',')}</span>
      <button onClick={() => openWith(2)}>open</button>
      <button onClick={() => setActiveConversation(10)}>activate</button>
      <button onClick={() => markConversationRead(10)}>read</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <UserSocketProvider>
      <MessagesProvider>
        <Probe />
      </MessagesProvider>
    </UserSocketProvider>,
  );
}

function dispatch(frame: UserSocketFrame) {
  act(() => h.frameHandler?.(frame));
}

// Flush pending passive effects (the knownIds mirror sync) so a dispatched frame
// sees the up-to-date conversation set instead of racing the effect.
async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  h.frameHandler = null;
  h.auth = { isLoggedIn: true, user: { id: 1, role: 'USER' } };
  h.service.getConversations.mockResolvedValue({ conversations: [conv({ unreadCount: 2 })] });
});

describe('MessagesContext', () => {
  it('loads the inbox and sums unread counts', async () => {
    renderProvider();
    expect(await screen.findByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('unread')).toHaveTextContent('2');
  });

  it('clears conversations and skips loading when disabled', async () => {
    h.auth = { isLoggedIn: false, user: null };
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'));
    expect(h.service.getConversations).not.toHaveBeenCalled();
  });

  it('bumps unread and moves a conversation to the top on an incoming message from the other side', async () => {
    h.service.getConversations.mockResolvedValue({
      conversations: [conv({ id: 10, unreadCount: 0 }), conv({ id: 11, unreadCount: 0 })],
    });
    renderProvider();
    await screen.findByTestId('count');
    await flushEffects();

    dispatch({ channel: 'dm', type: 'message', payload: msg({ id: 200, conversationId: 11 }) });

    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('11,10'));
    expect(screen.getByTestId('unread')).toHaveTextContent('1');
  });

  it('does not bump unread for my own message', async () => {
    renderProvider();
    await screen.findByTestId('count');
    await flushEffects();
    dispatch({
      channel: 'dm',
      type: 'message',
      payload: msg({ id: 201, conversationId: 10, senderId: 1 }),
    });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('2'));
  });

  it('does not bump unread for the active conversation', async () => {
    renderProvider();
    await screen.findByTestId('count');
    await flushEffects();
    fireEvent.click(screen.getByText('activate'));
    dispatch({ channel: 'dm', type: 'message', payload: msg({ id: 202, conversationId: 10 }) });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('2'));
  });

  it('refetches when a message arrives for an unknown conversation', async () => {
    renderProvider();
    await screen.findByTestId('count');
    expect(h.service.getConversations).toHaveBeenCalledTimes(1);
    dispatch({ channel: 'dm', type: 'message', payload: msg({ id: 300, conversationId: 99 }) });
    await waitFor(() => expect(h.service.getConversations).toHaveBeenCalledTimes(2));
  });

  it('ignores non-dm frames', async () => {
    renderProvider();
    await screen.findByTestId('count');
    dispatch({ channel: 'notification', type: 'unread-count', payload: { unreadCount: 5 } });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('2'));
  });

  it('opens a conversation, adding it only if new', async () => {
    h.service.getConversations.mockResolvedValue({ conversations: [] });
    h.service.openConversation.mockResolvedValue({ conversation: conv({ id: 20 }) });
    renderProvider();
    await screen.findByTestId('count');

    fireEvent.click(screen.getByText('open'));
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('20'));

    // Opening the same one again must not duplicate it.
    fireEvent.click(screen.getByText('open'));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));
  });

  it('clears a conversation unread count when marked read', async () => {
    renderProvider();
    await screen.findByTestId('count');
    expect(screen.getByTestId('unread')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('read'));
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('0'));
  });

  it('leaves other conversations untouched when one is marked read', async () => {
    h.service.getConversations.mockResolvedValue({
      conversations: [conv({ id: 10, unreadCount: 2 }), conv({ id: 11, unreadCount: 3 })],
    });
    renderProvider();
    await screen.findByTestId('count');
    expect(screen.getByTestId('unread')).toHaveTextContent('5');
    fireEvent.click(screen.getByText('read')); // marks id 10 only
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('3'));
  });

  it('ignores a dm frame that is not a message event', async () => {
    renderProvider();
    await screen.findByTestId('count');
    dispatch({ channel: 'dm', type: 'read', payload: { conversationId: 10 } } as never);
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('2'));
  });
});

describe('useMessages guard', () => {
  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/within MessagesProvider/);
    spy.mockRestore();
  });
});
