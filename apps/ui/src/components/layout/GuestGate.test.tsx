import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

let auth: { user: object | null; isLoading: boolean } = { user: null, isLoading: false };

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => auth,
}));

import { GuestGate } from './GuestGate';

function SignIn() {
  const state = useLocation().state as { from?: string } | null;
  return <span>sign in from {state?.from}</span>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <GuestGate>
        <Routes>
          <Route path="/getstarted" element={<SignIn />} />
          <Route path="/courses" element={<span>courses</span>} />
          <Route path="/algorithms/:lang" element={<span>algorithms</span>} />
          <Route path="/lesson/:category/:lesson" element={<span>lesson</span>} />
          <Route path="/almanac" element={<span>almanac</span>} />
          <Route path="/forum/t/:threadId" element={<span>thread</span>} />
        </Routes>
      </GuestGate>
    </MemoryRouter>,
  );
}

describe('GuestGate', () => {
  it.each([
    ['/courses', 'courses'],
    ['/algorithms/python', 'algorithms'],
    ['/lesson/python/print', 'lesson'],
    ['/almanac', 'almanac'],
  ])('lets a guest open %s', (path, text) => {
    auth = { user: null, isLoading: false };
    renderAt(path);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('sends a guest from any other page to sign-in, remembering where they were', () => {
    auth = { user: null, isLoading: false };
    renderAt('/forum/t/7?page=2');
    expect(screen.queryByText('thread')).not.toBeInTheDocument();
    expect(screen.getByText('sign in from /forum/t/7?page=2')).toBeInTheDocument();
  });

  it('shows nothing on such a page until it knows who is signed in', () => {
    auth = { user: null, isLoading: true };
    const { container } = renderAt('/forum/t/7');
    expect(container).toBeEmptyDOMElement();
  });

  it('opens a guest page while it is still checking', () => {
    auth = { user: null, isLoading: true };
    renderAt('/courses');
    expect(screen.getByText('courses')).toBeInTheDocument();
  });

  it('lets a signed-in student open any page', () => {
    auth = { user: {}, isLoading: false };
    renderAt('/forum/t/7');
    expect(screen.getByText('thread')).toBeInTheDocument();
  });
});
