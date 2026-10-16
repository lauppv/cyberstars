import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const login = vi.fn().mockResolvedValue(undefined);
const signup = vi.fn().mockResolvedValue(undefined);

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login, signup }),
}));

import { AuthPage } from './AuthPage';

function signUp() {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/getstarted', state: { mode: 'signup' } }]}>
      <Routes>
        <Route path="/getstarted" element={<AuthPage />} />
        <Route path="/lesson/:category/:lesson" element={<span>tour</span>} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByPlaceholderText('Choose a username'), {
    target: { value: 'Ada' },
  });
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'ada@example.com' },
  });
  fireEvent.change(document.querySelector('input[autocomplete="new-password"]')!, {
    target: { value: 'secret-password' },
  });
  fireEvent.submit(document.querySelector('form')!);
}

function logInFrom(state?: { from: string }) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/getstarted', state }]}>
      <Routes>
        <Route path="/getstarted" element={<AuthPage />} />
        <Route path="/" element={<span>home</span>} />
        <Route path="/forum/t/:threadId" element={<span>thread</span>} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'ada@example.com' },
  });
  fireEvent.change(document.querySelector('input[autocomplete="current-password"]')!, {
    target: { value: 'secret-password' },
  });
  fireEvent.submit(document.querySelector('form')!);
}

describe('AuthPage', () => {
  it('goes back to the page a guest was sent away from', async () => {
    logInFrom({ from: '/forum/t/7' });
    await waitFor(() => expect(screen.getByText('thread')).toBeInTheDocument());
  });

  it('opens the home page after a plain sign in', async () => {
    logInFrom();
    await waitFor(() => expect(screen.getByText('home')).toBeInTheDocument());
  });

  it('signs up with the placement score this browser kept, then forgets it', async () => {
    localStorage.setItem('cyberstars.placement', '7');
    signUp();
    await waitFor(() => expect(screen.getByText('tour')).toBeInTheDocument());
    expect(signup).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret-password',
      placementScore: 7,
    });
    expect(localStorage.getItem('cyberstars.placement')).toBeNull();
  });

  it('signs up without a score when the test was skipped', async () => {
    localStorage.removeItem('cyberstars.placement');
    signUp();
    await waitFor(() => expect(screen.getByText('tour')).toBeInTheDocument());
    expect(signup).toHaveBeenLastCalledWith(expect.objectContaining({ placementScore: undefined }));
  });
});
