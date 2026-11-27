import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ConversationDTO } from '@cyberstars/shared/messages';

const h = vi.hoisted(() => ({
  messages: {
    conversations: [] as ConversationDTO[],
    loading: false,
    loadFailed: false,
    refresh: vi.fn(),
    startWith: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, role: 'USER' }, isLoading: false }),
}));
vi.mock('../context/MessagesContext', () => ({ useMessages: () => h.messages }));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav /> }));
vi.mock('../components/messages/MessageThread', () => ({
  MessageThread: ({ conversation }: { conversation: ConversationDTO }) => (
    <div data-testid="thread">{conversation.id}</div>
  ),
  DraftThread: ({
    other,
    onSend,
  }: {
    other: { name: string };
    onSend: (content: string) => Promise<void>;
  }) => (
    <div data-testid="draft">
      {other.name}
      <button onClick={() => void onSend('hi')}>send first</button>
    </div>
  ),
}));

import { MessagesPage } from './MessagesPage';

const conv: ConversationDTO = {
  id: 10,
  other: { id: 2, name: 'Ben', avatarUrl: null },
  lastMessage: null,
  unreadCount: 0,
  updatedAt: '2026-07-17T10:00:00.000Z',
};

const nova = { id: 7, name: 'Nova', avatarUrl: null };

function renderPage(state?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/messages', state }]}>
      <MessagesPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.messages = {
    conversations: [],
    loading: false,
    loadFailed: false,
    refresh: vi.fn(),
    startWith: vi.fn(),
  };
});

describe('MessagesPage inbox', () => {
  it('shows an error with a retry, not the empty inbox, when the inbox fails', () => {
    h.messages.loadFailed = true;
    renderPage();
    expect(screen.getByRole('alert')).toHaveTextContent("Your conversations couldn't be loaded.");
    expect(screen.queryByText('No conversations yet')).toBeNull();
    fireEvent.click(screen.getByText('Try again'));
    expect(h.messages.refresh).toHaveBeenCalledTimes(1);
  });

  it('keeps a list it already has when a later load fails', () => {
    h.messages.loadFailed = true;
    h.messages.conversations = [conv];
    renderPage();
    expect(screen.getByText('Ben')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the empty inbox when it loaded with no conversations', () => {
    renderPage();
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('MessagesPage draft', () => {
  it('opens a draft from a profile without creating a conversation', () => {
    renderPage({ draftWith: nova });
    expect(screen.getByTestId('draft')).toHaveTextContent('Nova');
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    expect(h.messages.startWith).not.toHaveBeenCalled();
  });

  it('opens the existing conversation when they already talk', () => {
    h.messages.conversations = [{ ...conv, id: 11, other: nova }];
    renderPage({ draftWith: nova });
    expect(screen.getByTestId('thread')).toHaveTextContent('11');
    expect(screen.queryByTestId('draft')).toBeNull();
  });

  it('creates the conversation with the first message and shows it', async () => {
    const created = { ...conv, id: 12, other: nova };
    h.messages.startWith.mockImplementation(async () => {
      h.messages.conversations = [created];
      return created;
    });
    renderPage({ draftWith: nova });
    fireEvent.click(screen.getByText('send first'));
    await waitFor(() => expect(screen.getByTestId('thread')).toHaveTextContent('12'));
    expect(h.messages.startWith).toHaveBeenCalledWith(7, 'hi');
  });
});
