import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const login = vi.fn().mockResolvedValue(undefined);

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login, signup: vi.fn() }),
}));

import { AuthPage } from './AuthPage';

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
});
