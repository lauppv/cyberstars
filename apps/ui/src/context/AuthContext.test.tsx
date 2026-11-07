import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { AuthenticatedUser } from '@cyberstars/shared/auth';

const getMe = vi.fn();
const login = vi.fn();
const signup = vi.fn();
const logout = vi.fn();
vi.mock('../services/authService', () => ({
  getMe: () => getMe(),
  login: (payload: unknown) => login(payload),
  signup: (payload: unknown) => signup(payload),
  logout: () => logout(),
}));

const { AuthProvider, useAuth, wasSignedIn } = await import('./AuthContext');
const { errorOf } = await import('../services/apiClient');

const ADA = { id: 1, name: 'Ada', role: 'USER' } as AuthenticatedUser;
const GRACE = { id: 2, name: 'Grace', role: 'ADMIN' } as AuthenticatedUser;

function Probe() {
  const {
    user,
    isLoggedIn,
    isLoading,
    sessionEnded,
    dismissSessionEnded,
    login,
    signup,
    logout,
    refreshUser,
  } = useAuth();
  return (
    <div>
      <span data-testid="state">
        {isLoading ? 'loading' : `${isLoggedIn ? 'in' : 'out'}:${user?.name ?? '-'}`}
      </span>
      <span data-testid="ended">{String(sessionEnded)}</span>
      <button onClick={dismissSessionEnded}>dismiss</button>
      <button onClick={() => void login({ email: 'a@b.c', password: 'pw' })}>login</button>
      <button onClick={() => void signup({ name: 'Ada', email: 'a@b.c', password: 'pw' })}>
        signup
      </button>
      <button onClick={() => void logout()}>logout</button>
      <button onClick={refreshUser}>refresh</button>
    </div>
  );
}

const state = () => screen.getByTestId('state').textContent;

function renderProvider() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getMe.mockResolvedValue(ADA);
  login.mockResolvedValue(undefined);
  signup.mockResolvedValue(undefined);
  logout.mockResolvedValue(undefined);
});

describe('AuthProvider bootstrap', () => {
  it('starts loading and adopts the session user', async () => {
    getMe.mockReturnValue(new Promise(() => {}));
    renderProvider();
    expect(state()).toBe('loading');
  });

  it('resolves to the signed-in user', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
  });

  it('resolves to a guest when there is no session', async () => {
    getMe.mockRejectedValue(new Error('401'));
    renderProvider();
    await waitFor(() => expect(state()).toBe('out:-'));
  });
});

describe('AuthProvider actions', () => {
  it('re-reads the user after a login', async () => {
    getMe.mockRejectedValueOnce(new Error('401')).mockResolvedValue(ADA);
    renderProvider();
    await waitFor(() => expect(state()).toBe('out:-'));

    fireEvent.click(screen.getByText('login'));

    await waitFor(() => expect(state()).toBe('in:Ada'));
    expect(login).toHaveBeenCalledWith({ email: 'a@b.c', password: 'pw' });
  });

  it('re-reads the user after a signup', async () => {
    getMe.mockRejectedValueOnce(new Error('401')).mockResolvedValue(ADA);
    renderProvider();
    await waitFor(() => expect(state()).toBe('out:-'));

    fireEvent.click(screen.getByText('signup'));

    await waitFor(() => expect(state()).toBe('in:Ada'));
    expect(signup).toHaveBeenCalledWith({ name: 'Ada', email: 'a@b.c', password: 'pw' });
  });

  it('clears the user on logout', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    fireEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(state()).toBe('out:-'));
    expect(logout).toHaveBeenCalledOnce();
  });

  it('picks up profile changes on refresh', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    getMe.mockResolvedValue(GRACE);
    fireEvent.click(screen.getByText('refresh'));

    await waitFor(() => expect(state()).toBe('in:Grace'));
  });

  it('keeps the current user when a refresh fails', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    getMe.mockRejectedValue(new Error('offline'));
    fireEvent.click(screen.getByText('refresh'));

    await waitFor(() => expect(getMe).toHaveBeenCalledTimes(2));
    expect(state()).toBe('in:Ada');
  });
});

describe('the signed-in hint', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is set once a student is signed in', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
    // Written by an effect after that render, which a slow run can check before.
    await waitFor(() => expect(wasSignedIn()).toBe(true));
  });

  it('is left alone while sign-in is still being checked', () => {
    localStorage.setItem('cyberstars.student', '1');
    getMe.mockReturnValue(new Promise(() => {}));
    renderProvider();
    expect(wasSignedIn()).toBe(true);
  });

  it('is cleared for a guest and on logout', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
    fireEvent.click(screen.getByText('logout'));
    await waitFor(() => expect(state()).toBe('out:-'));
    expect(wasSignedIn()).toBe(false);
  });

  it('reads as not signed in when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(wasSignedIn()).toBe(false);
    spy.mockRestore();
  });
});

describe('another tab', () => {
  const otherTab = (key: string, newValue: string | null) =>
    fireEvent(window, new StorageEvent('storage', { key, newValue }));

  it('signing in there signs this tab in too', async () => {
    getMe.mockRejectedValueOnce(new Error('401')).mockResolvedValue(ADA);
    renderProvider();
    await waitFor(() => expect(state()).toBe('out:-'));

    otherTab('cyberstars.student', '1');

    await waitFor(() => expect(state()).toBe('in:Ada'));
  });

  it('signing out there signs this tab out too', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    getMe.mockRejectedValue(new Error('401'));
    otherTab('cyberstars.student', null);

    await waitFor(() => expect(state()).toBe('out:-'));
  });

  it('ignores the other keys it writes', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    otherTab('something.else', '1');

    expect(getMe).toHaveBeenCalledOnce();
  });
});

describe('a session the server ended', () => {
  const ended = () => screen.getByTestId('ended').textContent;
  // A request's answer once the cookie expired
  const requestFindsItGone = () =>
    act(() => errorOf(Response.json({ error: 'No token provided' }, { status: 401 })));
  // The app listens for it from an effect after the render that shows the
  // student, which a slow run can check before; a later request finds it gone too
  const sessionEnds = () =>
    waitFor(async () => {
      await errorOf(Response.json({ error: 'No token provided' }, { status: 401 }));
      expect(ended()).toBe('true');
    });

  it('signs out a student the app still showed signed in', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    await sessionEnds();

    expect(state()).toBe('out:-');
    expect(ended()).toBe('true');
  });

  it('says nothing to a guest', async () => {
    getMe.mockRejectedValue(new Error('401'));
    renderProvider();
    await waitFor(() => expect(state()).toBe('out:-'));

    await requestFindsItGone();

    expect(ended()).toBe('false');
  });

  it('goes away when dismissed', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
    await sessionEnds();

    fireEvent.click(screen.getByText('dismiss'));

    expect(ended()).toBe('false');
  });

  it('goes away once the student signs in again', async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
    await sessionEnds();

    fireEvent.click(screen.getByText('login'));

    await waitFor(() => expect(state()).toBe('in:Ada'));
    expect(ended()).toBe('false');
  });

  it("doesn't come back after a sign out of the student's own", async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));
    await sessionEnds();
    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(state()).toBe('in:Ada'));

    fireEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(state()).toBe('out:-'));
    expect(ended()).toBe('false');
  });

  it("doesn't show when the student signed out in another tab", async () => {
    renderProvider();
    await waitFor(() => expect(state()).toBe('in:Ada'));

    // This tab follows, and its check finds the cookie that sign-out cleared gone
    getMe.mockImplementation(async () => {
      throw await errorOf(Response.json({ error: 'No token provided' }, { status: 401 }));
    });
    fireEvent(window, new StorageEvent('storage', { key: 'cyberstars.student', newValue: null }));

    await waitFor(() => expect(state()).toBe('out:-'));
    expect(ended()).toBe('false');
  });
});

describe('useAuth', () => {
  it('refuses to run outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useAuth must be used within AuthProvider');
  });
});
