import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import type { ConversationDTO, MessageDTO } from '@cyberstars/shared/messages';
import { ApiClientError } from '../../services/apiClient';

const h = vi.hoisted(() => ({
  service: {
    getHistory: vi.fn(),
    sendMessage: vi.fn(),
    markRead: vi.fn(),
    editMessage: vi.fn(),
    deleteMessage: vi.fn(),
    toggleReaction: vi.fn(),
    reportMessage: vi.fn(),
  },
  blocks: { block: vi.fn() },
  // Stable, as the real context's are: new ones each render would reload the history
  messages: {
    setActiveConversation: vi.fn(),
    markConversationRead: vi.fn(),
    refresh: vi.fn(),
    dropConversation: vi.fn(),
  },
}));

vi.mock('../../services/messagesService', () => h.service);
vi.mock('../../services/blocksService', () => h.blocks);
vi.mock('../../context/MessagesContext', () => ({
  useMessages: () => h.messages,
}));
vi.mock('../../context/UserSocketContext', () => ({ useUserSocketFrames: () => {} }));
vi.mock('../ui/UserLink', () => ({
  UserLink: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import { DraftThread, MessageThread } from './MessageThread';

const conversation: ConversationDTO = {
  id: 10,
  other: { id: 2, name: 'Ben', avatarUrl: null, staff: false },
  lastMessage: null,
  unreadCount: 0,
  updatedAt: '2026-07-17T10:00:00.000Z',
};

function msg(over: Partial<MessageDTO> = {}): MessageDTO {
  return {
    id: 100,
    conversationId: 10,
    senderId: 1,
    content: 'salut',
    deleted: false,
    readAt: null,
    editedAt: null,
    createdAt: '2026-07-17T11:00:00.000Z',
    reactions: [],
    ...over,
  };
}

function renderThread() {
  return render(<MessageThread conversation={conversation} currentUserId={1} onBack={() => {}} />);
}

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Message actions' }));
}

const box = () => screen.getByPlaceholderText('Write a message…') as HTMLTextAreaElement;

beforeEach(() => {
  vi.clearAllMocks();
  h.service.getHistory.mockResolvedValue({ messages: [msg()], hasMore: false });
  h.service.markRead.mockResolvedValue({ ok: true });
});

describe('MessageThread failures', () => {
  it('shows an error with a retry instead of an empty thread when the history fails', async () => {
    h.service.getHistory.mockRejectedValueOnce(new Error('down'));
    renderThread();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "This conversation couldn't be loaded.",
    );
    expect(screen.queryByPlaceholderText('Write a message…')).toBeNull();

    fireEvent.click(screen.getByText('Try again'));
    expect(await screen.findByText('salut')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(h.service.getHistory).toHaveBeenCalledTimes(2);
  });

  it('keeps the text and says why when a message is not sent', async () => {
    h.service.sendMessage.mockRejectedValueOnce(new ApiClientError(404, 'Conversation not found'));
    renderThread();
    await screen.findByText('salut');
    fireEvent.change(box(), { target: { value: 'hello there' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Conversation not found');
    expect(box().value).toBe('hello there');

    h.service.sendMessage.mockResolvedValueOnce({ message: msg({ id: 101, content: 'hi' }) });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('hi')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(box().value).toBe('');
  });

  it('keeps the editor open with the draft when an edit fails', async () => {
    h.service.editMessage.mockRejectedValueOnce(new ApiClientError(404, 'Message not found'));
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByText('Edit'));
    const editor = screen.getByDisplayValue('salut');
    fireEvent.change(editor, { target: { value: 'salut, Ben' } });
    fireEvent.click(screen.getByText('Save'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Message not found');
    expect(screen.getByDisplayValue('salut, Ben')).toBeInTheDocument();

    h.service.editMessage.mockResolvedValueOnce({
      message: msg({ content: 'salut, Ben', editedAt: '2026-07-17T11:05:00.000Z' }),
    });
    fireEvent.click(screen.getByText('Save'));
    // The editor's textarea holds the draft as text too, so wait for it to close
    await waitFor(() => expect(screen.queryByDisplayValue('salut, Ben')).toBeNull());
    expect(screen.getByText('salut, Ben')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('forgets the edit error when the editor is cancelled', async () => {
    h.service.editMessage.mockRejectedValueOnce(new Error('boom'));
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByDisplayValue('salut'), { target: { value: 'other' } });
    fireEvent.click(screen.getByText('Save'));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('salut')).toBeInTheDocument();
  });

  it('says why a delete failed and keeps the message', async () => {
    h.service.deleteMessage.mockRejectedValueOnce(new ApiClientError(404, 'Message not found'));
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByText('Delete'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Message not found');
    expect(screen.getByText('salut')).toBeInTheDocument();
  });

  it('says why a reaction failed and clears it once one goes through', async () => {
    h.service.toggleReaction.mockRejectedValueOnce(
      new ApiClientError(400, 'Cannot react to a deleted message'),
    );
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByText('😎'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot react to a deleted message');

    h.service.toggleReaction.mockResolvedValueOnce({
      message: msg({ reactions: [{ userId: 1, emoji: '😎' }] }),
    });
    openMenu();
    fireEvent.click(screen.getAllByText('😎')[0]);
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('says why older messages did not load and keeps the button', async () => {
    h.service.getHistory.mockResolvedValueOnce({ messages: [msg()], hasMore: true });
    h.service.getHistory.mockRejectedValueOnce(new Error(''));
    renderThread();
    fireEvent.click(await screen.findByText('Load older messages'));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    );
    expect(screen.getByText('Load older messages')).toBeInTheDocument();

    h.service.getHistory.mockResolvedValueOnce({
      messages: [msg({ id: 99, content: 'earlier' })],
      hasMore: false,
    });
    fireEvent.click(screen.getByText('Load older messages'));
    expect(await screen.findByText('earlier')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('clears the reason of another action once one goes through', async () => {
    h.service.getHistory.mockResolvedValueOnce({ messages: [msg()], hasMore: true });
    h.service.getHistory.mockRejectedValueOnce(new Error('down'));
    renderThread();
    fireEvent.click(await screen.findByText('Load older messages'));
    expect(await screen.findByRole('alert')).toHaveTextContent('down');

    h.service.sendMessage.mockResolvedValueOnce({ message: msg({ id: 101, content: 'hi' }) });
    fireEvent.change(box(), { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(screen.getByText('Load older messages')).toBeInTheDocument();
  });

  it('says it in Romanian on a Romanian page', async () => {
    await i18next.changeLanguage('ro');
    try {
      h.service.getHistory.mockRejectedValueOnce(new Error('down'));
      renderThread();
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Conversația nu s-a putut încărca.',
      );
      h.service.getHistory.mockResolvedValueOnce({ messages: [msg()], hasMore: false });
      fireEvent.click(screen.getByText('Încearcă din nou'));
      await screen.findByText('salut');
      h.service.deleteMessage.mockRejectedValueOnce(new ApiClientError(404, 'Message not found'));
      fireEvent.click(screen.getByRole('button', { name: i18next.t('messages.actions') }));
      fireEvent.click(screen.getByText(i18next.t('messages.delete')));
      expect(await screen.findByRole('alert')).toHaveTextContent('Mesajul nu există');
    } finally {
      await i18next.changeLanguage('en');
    }
  });
});

describe('MessageThread block and report (CYB-140)', () => {
  it('offers Report only on a message received', async () => {
    renderThread();
    await screen.findByText('salut');
    openMenu();
    expect(screen.queryByRole('menuitem', { name: 'Report' })).toBeNull();
  });

  it('sends a report with the note and says it went through', async () => {
    h.service.getHistory.mockResolvedValue({ messages: [msg({ senderId: 2 })], hasMore: false });
    h.service.reportMessage.mockResolvedValue({ ticketId: 7 });
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Report' }));
    fireEvent.change(screen.getByLabelText("What's wrong? (optional)"), {
      target: { value: '  rude  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Thank you. The admins will look at it.',
    );
    expect(h.service.reportMessage).toHaveBeenCalledWith(100, 'rude');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the report dialog open and says why when it fails', async () => {
    h.service.getHistory.mockResolvedValue({ messages: [msg({ senderId: 2 })], hasMore: false });
    h.service.reportMessage.mockRejectedValue(new Error('Too many requests'));
    renderThread();
    await screen.findByText('salut');
    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Report' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many requests');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('blocks after asking, then refreshes the inbox and goes back to the list', async () => {
    h.blocks.block.mockResolvedValue({ ok: true });
    const onBack = vi.fn();
    render(<MessageThread conversation={conversation} currentUserId={1} onBack={onBack} />);
    await screen.findByText('salut');
    fireEvent.click(screen.getByRole('button', { name: 'Block' }));
    expect(screen.getByRole('dialog')).toHaveTextContent("Ben won't be able to send you messages");
    fireEvent.click(screen.getByRole('dialog').querySelectorAll('button')[1]);
    await waitFor(() => expect(onBack).toHaveBeenCalled());
    expect(h.blocks.block).toHaveBeenCalledWith(2);
    expect(h.messages.refresh).toHaveBeenCalled();
    expect(h.messages.dropConversation).toHaveBeenCalledWith(conversation.id);
  });

  it('offers no Block for someone of the team', async () => {
    render(
      <MessageThread
        conversation={{ ...conversation, other: { ...conversation.other, staff: true } }}
        currentUserId={1}
        onBack={() => {}}
      />,
    );
    await screen.findByText('salut');
    expect(screen.queryByRole('button', { name: 'Block' })).toBeNull();
  });
});

describe('DraftThread', () => {
  const ben = { id: 2, name: 'Ben', avatarUrl: null, staff: false };

  it('shows who the draft is to and loads nothing', () => {
    render(<DraftThread other={ben} onSend={vi.fn()} onBack={() => {}} />);
    expect(screen.getByText('Ben')).toBeInTheDocument();
    expect(h.service.getHistory).not.toHaveBeenCalled();
  });

  it('keeps the text and says why when the first message is not sent', async () => {
    const onSend = vi.fn().mockRejectedValue(new Error('nope'));
    render(<DraftThread other={ben} onSend={onSend} onBack={() => {}} />);
    fireEvent.change(box(), { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('nope');
    expect(onSend).toHaveBeenCalledWith('hi');
    expect(box().value).toBe('hi');
  });
});
