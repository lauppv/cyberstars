import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { UserSocketFrame } from '../../shared/notifications';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true, user: { id: 1, role: 'USER' } as { id: number; role: string } | null },
  enabledArg: undefined as boolean | undefined,
  frameHandler: null as ((f: UserSocketFrame) => void) | null,
}));

vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../hooks/useUserSocket', () => ({
  useUserSocket: (enabled: boolean, onFrame: (f: UserSocketFrame) => void) => {
    h.enabledArg = enabled;
    h.frameHandler = onFrame;
  },
}));

import { UserSocketProvider, useUserSocketFrames } from './UserSocketContext';

const frame: UserSocketFrame = {
  channel: 'notification',
  type: 'unread-count',
  payload: { unreadCount: 3 },
};

// Records every frame it receives so a test can assert delivery.
function Listener({ id }: { id: string }) {
  const seen = { current: [] as UserSocketFrame[] };
  useUserSocketFrames((f) => {
    seen.current.push(f);
    document.getElementById(id)!.textContent = String(seen.current.length);
  });
  return <span id={id}>0</span>;
}

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { isLoggedIn: true, user: { id: 1, role: 'USER' } };
  h.enabledArg = undefined;
  h.frameHandler = null;
});

describe('UserSocketProvider', () => {
  it('enables the socket for a logged-in user', () => {
    render(
      <UserSocketProvider>
        <Listener id="a" />
      </UserSocketProvider>,
    );
    expect(h.enabledArg).toBe(true);
  });

  it('disables the socket when logged out', () => {
    h.auth = { isLoggedIn: false, user: null };
    render(
      <UserSocketProvider>
        <Listener id="a" />
      </UserSocketProvider>,
    );
    expect(h.enabledArg).toBe(false);
  });

  it('fans a frame out to every subscriber', () => {
    render(
      <UserSocketProvider>
        <Listener id="a" />
        <Listener id="b" />
      </UserSocketProvider>,
    );
    h.frameHandler?.(frame);
    expect(screen.getByText((_, el) => el?.id === 'a').textContent).toBe('1');
    expect(document.getElementById('b')!.textContent).toBe('1');
  });

  it('stops delivering to a subscriber after it unmounts', () => {
    const { rerender } = render(
      <UserSocketProvider>
        <Listener id="a" />
        <Listener id="b" />
      </UserSocketProvider>,
    );
    rerender(
      <UserSocketProvider>
        <Listener id="a" />
      </UserSocketProvider>,
    );
    h.frameHandler?.(frame);
    expect(document.getElementById('a')!.textContent).toBe('1');
    expect(document.getElementById('b')).toBeNull();
  });

  it('useUserSocketFrames is a no-op without a provider', () => {
    // No provider: the hook returns early and simply never receives frames.
    expect(() => render(<Listener id="solo" />)).not.toThrow();
    expect(document.getElementById('solo')!.textContent).toBe('0');
  });
});
