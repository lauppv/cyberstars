import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { UserSocketFrame } from '@cyberstars/shared/notifications';

const refreshUser = vi.fn();
const auth: { user: Record<string, unknown> | null; refreshUser: typeof refreshUser } = {
  user: null,
  refreshUser,
};
vi.mock('../../context/AuthContext', () => ({ useAuth: () => auth }));

let frameHandler: ((frame: UserSocketFrame) => void) | null = null;
vi.mock('../../context/UserSocketContext', () => ({
  useUserSocketFrames: (handler: (frame: UserSocketFrame) => void) => {
    frameHandler = handler;
  },
}));

const resendConfirmation = vi.fn();
vi.mock('../../services/authService', () => ({
  resendConfirmation: () => resendConfirmation(),
}));

const { EmailConfirmBanner, BANNER_AWAY_MS } = await import('./EmailConfirmBanner');

const USER = {
  id: 4,
  email: 'ana@gmail.com',
  emailConfirmed: false,
  confirmLinkSent: true,
  onboardedAt: '2026-11-01T00:00:00Z',
  interests: ['python'],
};

function renderAt(path = '/courses') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <EmailConfirmBanner />
      <Routes>
        <Route path="/settings" element={<p>settings page</p>} />
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  auth.user = { ...USER };
  frameHandler = null;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('EmailConfirmBanner', () => {
  it('stays away for a guest and for a confirmed email', () => {
    auth.user = null;
    const { unmount } = renderAt();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();
    auth.user = { ...USER, emailConfirmed: true };
    renderAt();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('says where the link went, over the top of the page', () => {
    renderAt();
    const banner = screen.getByRole('alert');
    expect(banner).toHaveTextContent('we sent a link to ana@gmail.com');
    expect(banner.className).toContain('fixed');
    expect(screen.getByRole('button', { name: 'Send again' })).toBeInTheDocument();
  });

  it('asks an account made before links were sent to send one', () => {
    auth.user = { ...USER, confirmLinkSent: false };
    renderAt();
    expect(screen.getByRole('alert')).toHaveTextContent('Confirm your email ana@gmail.com');
    expect(screen.getByRole('button', { name: 'Send the link' })).toBeInTheDocument();
  });

  it('sends a new link and says so', async () => {
    resendConfirmation.mockResolvedValue({ message: 'Confirmation link sent' });
    renderAt();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Send again' }));
    });
    expect(resendConfirmation).toHaveBeenCalledOnce();
    expect(screen.getByRole('alert')).toHaveTextContent('We sent a new link to ana@gmail.com');
    expect(refreshUser).toHaveBeenCalled();
  });

  it("shows the server's words when the link can't be sent", async () => {
    resendConfirmation.mockRejectedValue(new Error('Too many links asked for, try again later'));
    renderAt();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Send again' }));
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Too many links asked for');
  });

  it('opens Settings on its email section', () => {
    renderAt();
    fireEvent.click(screen.getByRole('button', { name: 'Change email' }));
    expect(screen.getByText('settings page')).toBeInTheDocument();
  });

  it('waits until the tour and the question of what to learn are behind a new account', () => {
    auth.user = { ...USER, onboardedAt: null, interests: null };
    const { unmount } = renderAt('/lesson/python/print');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();
    auth.user = { ...USER, interests: null };
    renderAt('/interests');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('goes away for 12 hours when closed, a reload included, then comes back by itself', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    const { unmount } = renderAt();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();

    renderAt();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(BANNER_AWAY_MS - 1000));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('keeps one account closing it from hiding it for another on the same device', () => {
    const { unmount } = renderAt();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    unmount();
    auth.user = { ...USER, id: 5 };
    renderAt();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('reads the account again when the server says the email was confirmed', () => {
    renderAt();
    act(() => frameHandler!({ channel: 'account', type: 'email-confirmed' }));
    expect(refreshUser).toHaveBeenCalledOnce();
  });

  it('stays off the page the link opens', () => {
    renderAt('/confirm-email');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
