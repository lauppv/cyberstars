import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

const dismissSessionEnded = vi.fn();
const auth = { sessionEnded: true, dismissSessionEnded };
vi.mock('../../context/AuthContext', () => ({ useAuth: () => auth }));

const { SessionEndedNotice } = await import('./SessionEndedNotice');

function SignIn() {
  const { state } = useLocation();
  return <p>sign in, then back to {(state as { from?: string } | null)?.from ?? '-'}</p>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SessionEndedNotice />
      <Routes>
        <Route path="/getstarted" element={<SignIn />} />
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.sessionEnded = true;
});

describe('SessionEndedNotice', () => {
  it('stays away while the session holds', () => {
    auth.sessionEnded = false;
    renderAt('/progress');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('says the session ended and signs in back to the same page', () => {
    renderAt('/lesson/python/print?tab=code');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Your session has ended. Sign in again to see your progress and save your code.',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByText('sign in, then back to /lesson/python/print?tab=code')).toBeVisible();
  });

  it('keeps only the words on the sign-in page itself', () => {
    renderAt('/getstarted');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('closes', () => {
    renderAt('/progress');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(dismissSessionEnded).toHaveBeenCalledOnce();
  });
});
