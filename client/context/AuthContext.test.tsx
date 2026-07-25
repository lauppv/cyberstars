import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { AuthenticatedUser } from '../../shared/auth';

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

const { AuthProvider, useAuth } = await import('./AuthContext');

const ADA = { id: 1, name: 'Ada', role: 'USER' } as AuthenticatedUser;
const GRACE = { id: 2, name: 'Grace', role: 'ADMIN' } as AuthenticatedUser;

function Probe() {
  const { user, isLoggedIn, isLoading, login, signup, logout, refreshUser } = useAuth();
  return (
    <div>
      <span data-testid="state">
        {isLoading ? 'loading' : `${isLoggedIn ? 'in' : 'out'}:${user?.name ?? '-'}`}
      </span>
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

describe('useAuth', () => {
  it('refuses to run outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useAuth must be used within AuthProvider');
  });
});
