import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ConversationDTO } from '@cyberstars/shared/messages';

const h = vi.hoisted(() => ({
  messages: {
    conversations: [] as ConversationDTO[],
    loading: false,
    loadFailed: false,
    refresh: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, role: 'USER' }, isLoading: false }),
}));
vi.mock('../context/MessagesContext', () => ({ useMessages: () => h.messages }));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav /> }));
vi.mock('../components/messages/MessageThread', () => ({ MessageThread: () => <div /> }));

import { MessagesPage } from './MessagesPage';

const conv: ConversationDTO = {
  id: 10,
  other: { id: 2, name: 'Ben', avatarUrl: null },
  lastMessage: null,
  unreadCount: 0,
  updatedAt: '2026-07-17T10:00:00.000Z',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <MessagesPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.messages = { conversations: [], loading: false, loadFailed: false, refresh: vi.fn() };
});

describe('MessagesPage inbox', () => {
  it('shows an error with a retry, not the empty inbox, when the inbox fails', () => {
    h.messages.loadFailed = true;
    renderPage();
    expect(screen.getByRole('alert')).toHaveTextContent("Your conversations couldn't be loaded.");
    expect(screen.queryByText('No conversations yet.')).toBeNull();
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
    expect(screen.getByText('No conversations yet.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
