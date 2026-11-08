import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { NOTICES_MAX } from '@cyberstars/shared/notifications';
import type { NotificationDTO, UserSocketFrame } from '@cyberstars/shared/notifications';

const h = vi.hoisted(() => ({
  authState: { isLoggedIn: true, user: { role: 'USER' } as { role: string } | null },
  service: {
    getNotifications: vi.fn(),
    markRead: vi.fn(),
    markOneRead: vi.fn(),
    getNotices: vi.fn(),
    markShown: vi.fn(),
  },
  polls: { getPoll: vi.fn(), vote: vi.fn() },
  frameHandler: null as ((f: UserSocketFrame) => void) | null,
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.authState }));
vi.mock('../../services/notificationsService', () => h.service);
vi.mock('../../services/pollsService', () => h.polls);
vi.mock('../../hooks/useUserSocket', () => ({
  useUserSocket: (_enabled: boolean, onFrame: (f: UserSocketFrame) => void) => {
    h.frameHandler = onFrame;
  },
}));

import { UserSocketProvider } from '../../context/UserSocketContext';
import { NotificationProvider, useNotifications } from '../../context/NotificationContext';
import { DashboardNotices } from './DashboardNotices';

function notice(id: number, over: Partial<NotificationDTO> = {}): NotificationDTO {
  return {
    id,
    type: 'ANNOUNCEMENT',
    entityId: id,
    data: { text: `Announcement ${id}` },
    actor: { name: 'Founder', avatarUrl: null },
    readAt: null,
    createdAt: '2026-11-02T10:00:00.000Z',
    ...over,
  };
}

function renderNotices(held = false) {
  return render(
    <UserSocketProvider>
      <NotificationProvider>
        <DashboardNotices held={held} />
      </NotificationProvider>
    </UserSocketProvider>,
  );
}

// Stands in for the bell opening an announcement or a poll in its own window
function BellWindow() {
  const { noteBellWindow } = useNotifications();
  return (
    <>
      <button onClick={() => noteBellWindow(true)}>open from the bell</button>
      <button onClick={() => noteBellWindow(false)}>close the bell's</button>
    </>
  );
}

const dialog = (name = 'Official announcement') => screen.findByRole('dialog', { name });
const button = (name: string) => screen.getByRole('button', { name });
const frame = (payload: NotificationDTO) =>
  act(() => h.frameHandler?.({ channel: 'notification', type: 'new', payload }));

beforeEach(() => {
  vi.clearAllMocks();
  h.authState.isLoggedIn = true;
  h.authState.user = { role: 'USER' };
  h.service.getNotifications.mockResolvedValue({ items: [], unreadCount: 0 });
  h.service.getNotices.mockResolvedValue([]);
  h.service.markOneRead.mockResolvedValue({ ok: true });
  h.service.markShown.mockResolvedValue('');
});

describe('DashboardNotices', () => {
  it('opens nothing when there is nothing left to show', async () => {
    renderNotices();
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('asks for nothing while signed out', () => {
    h.authState.isLoggedIn = false;
    h.authState.user = null;
    renderNotices();
    expect(h.service.getNotices).not.toHaveBeenCalled();
  });

  it('shows a single one with its day and only Done, which closes it as shown', async () => {
    h.service.getNotices.mockResolvedValue([notice(3, { data: { text: 'Exams next week' } })]);
    renderNotices();
    await dialog();
    expect(screen.getByText('Exams next week')).toBeInTheDocument();
    expect(screen.getByText('November 2, 2026')).toBeInTheDocument();
    expect(screen.queryByText('1 of 1')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
    // Read in an effect, a moment after the window is on screen
    await waitFor(() => expect(h.service.markOneRead).toHaveBeenCalledWith(3));

    fireEvent.click(button('Done'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(h.service.markShown).toHaveBeenCalledWith([3]);
  });

  it('walks several oldest first, reading each once it is on screen', async () => {
    h.service.getNotices.mockResolvedValue([notice(3), notice(5), notice(8)]);
    renderNotices();
    await dialog();
    expect(screen.getByText('Announcement 3')).toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    expect(button('Back')).toBeDisabled();
    await waitFor(() => expect(h.service.markOneRead.mock.calls).toEqual([[3]]));

    fireEvent.click(button('Next'));
    expect(screen.getByText('Announcement 5')).toBeInTheDocument();
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    fireEvent.click(button('Back'));
    expect(screen.getByText('Announcement 3')).toBeInTheDocument();
    fireEvent.click(button('Next'));
    fireEvent.click(button('Next'));
    expect(screen.getByText('3 of 3')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
    // Each read once, however often it came back on screen
    expect(h.service.markOneRead.mock.calls).toEqual([[3], [5], [8]]);

    fireEvent.click(button('Done'));
    expect(h.service.markShown).toHaveBeenCalledWith([3, 5, 8]);
  });

  it('asks before the X closes it, counting the ones not seen yet', async () => {
    h.service.getNotices.mockResolvedValue([notice(3), notice(5), notice(8)]);
    renderNotices();
    await dialog();

    fireEvent.click(button('Close'));
    expect(screen.getByRole('status')).toHaveTextContent(
      "Close? There are 2 more you haven't seen. You'll find them any time in the bell at the top right.",
    );
    fireEvent.click(button('Stay'));
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByText('Announcement 3')).toBeInTheDocument();

    fireEvent.click(button('Next'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[0]);
    expect(screen.getByRole('status')).toHaveTextContent(
      "Close? There's one more you haven't seen.",
    );
    // The confirmation's Close, after the X
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[1]);
    expect(screen.queryByRole('dialog')).toBeNull();
    // All three shown, the last one left unread for the bell
    expect(h.service.markShown).toHaveBeenCalledWith([3, 5, 8]);
    expect(h.service.markOneRead.mock.calls).toEqual([[3], [5]]);
  });

  it('counts nothing when nothing is left unseen', async () => {
    h.service.getNotices.mockResolvedValue([notice(3)]);
    renderNotices();
    await dialog();
    fireEvent.click(button('Close'));
    expect(screen.getByRole('status')).toHaveTextContent(
      "Close? You'll find it any time in the bell at the top right.",
    );
  });

  it('asks on Escape too, and a second Escape takes the question back', async () => {
    h.service.getNotices.mockResolvedValue([notice(3)]);
    renderNotices();
    await dialog();
    // The Escape listener comes in the same effects as the read, a moment after the window
    await waitFor(() => expect(h.service.markOneRead).toHaveBeenCalledWith(3));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(h.service.markShown).not.toHaveBeenCalled();
  });

  it('stays open on a click beside it', async () => {
    h.service.getNotices.mockResolvedValue([notice(3)]);
    renderNotices();
    const box = await dialog();
    fireEvent.mouseDown(box.parentElement!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows a poll to vote on', async () => {
    h.polls.getPoll.mockResolvedValue({
      id: 4,
      question: 'Which course next?',
      options: [
        { id: 7, text: 'Rust', writeIn: false },
        { id: 8, text: 'Go', writeIn: false },
      ],
      voted: false,
    });
    h.service.getNotices.mockResolvedValue([
      notice(6, { type: 'POLL', entityId: 4, data: { text: 'Which course next?' } }),
    ]);
    renderNotices();
    await dialog('Poll');
    expect(await screen.findByRole('button', { name: 'Rust' })).toBeInTheDocument();
    expect(h.polls.getPoll).toHaveBeenCalledWith(4);
    expect(button('Vote')).toBeDisabled();
  });

  it('opens at once for one that comes in on the dashboard, and adds one to a window open', async () => {
    renderNotices();
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalledTimes(1));

    h.service.getNotices.mockResolvedValue([notice(9)]);
    await frame(notice(9));
    await dialog();
    expect(h.service.getNotices).toHaveBeenCalledTimes(2);

    // Read already, so the server leaves 9 out; 12 goes after it
    h.service.getNotices.mockResolvedValue([notice(12)]);
    await frame(notice(12));
    expect(await screen.findByText('1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Announcement 9')).toBeInTheDocument();
  });

  it('leaves the other notifications to the bell', async () => {
    renderNotices();
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalledTimes(1));
    await frame(notice(10, { type: 'POLL_ANSWER' }));
    expect(h.service.getNotices).toHaveBeenCalledTimes(1);
  });

  it('marks a window grown past the limit shown in slices the server takes', async () => {
    const first = Array.from({ length: NOTICES_MAX }, (_, i) => notice(i + 1));
    h.service.getNotices.mockResolvedValue(first);
    renderNotices();
    await dialog();

    // The first one is read now, so the server leaves it out; the live one goes last
    const late = notice(NOTICES_MAX + 1);
    h.service.getNotices.mockResolvedValue([...first.slice(1), late]);
    await frame(late);
    expect(await screen.findByText(`1 of ${NOTICES_MAX + 1}`)).toBeInTheDocument();

    fireEvent.click(button('Close'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[1]);
    expect(h.service.markShown.mock.calls).toEqual([[first.map((n) => n.id)], [[NOTICES_MAX + 1]]]);
  });

  it('never brings back the ones it closed, even from a load that missed the shown mark', async () => {
    h.service.getNotices.mockResolvedValue([notice(3), notice(5)]);
    renderNotices();
    await dialog();
    fireEvent.click(button('Close'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[1]);

    // 5 was skipped, so still unread; the shown mark hasn't landed yet
    h.service.getNotices.mockResolvedValue([notice(5), notice(11)]);
    await frame(notice(11));
    await dialog();
    expect(screen.getByText('Announcement 11')).toBeInTheDocument();
    expect(screen.queryByText('1 of 2')).toBeNull();
  });

  it('waits while another window is open on the dashboard', async () => {
    h.service.getNotices.mockResolvedValue([notice(3)]);
    const { rerender } = renderNotices(true);
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(h.service.markOneRead).not.toHaveBeenCalled();

    rerender(
      <UserSocketProvider>
        <NotificationProvider>
          <DashboardNotices />
        </NotificationProvider>
      </UserSocketProvider>,
    );
    await dialog();
    expect(h.service.markOneRead).toHaveBeenCalledWith(3);
  });

  it('waits while an announcement or a poll from the bell is open', async () => {
    render(
      <UserSocketProvider>
        <NotificationProvider>
          <BellWindow />
          <DashboardNotices />
        </NotificationProvider>
      </UserSocketProvider>,
    );
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalledTimes(1));
    fireEvent.click(button('open from the bell'));

    h.service.getNotices.mockResolvedValue([notice(9)]);
    await frame(notice(9));
    await waitFor(() => expect(h.service.getNotices).toHaveBeenCalledTimes(2));
    await act(async () => {});
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(h.service.markOneRead).not.toHaveBeenCalled();
    // Escape belongs to the bell's window alone
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.click(button("close the bell's"));
    await dialog();
    expect(h.service.markOneRead).toHaveBeenCalledWith(9);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
