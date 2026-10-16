import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({
  progress: {} as Record<string, unknown>,
  isLoading: false,
  enabled: true,
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Ada Lovelace' } }),
}));
vi.mock('../../context/ProgressContext', () => ({
  useAllProgress: () => ({ progressMap: h.progress, isLoading: h.isLoading }),
}));
vi.mock('../../context/TutorContext', () => ({ useTutor: () => ({ enabled: h.enabled }) }));

import { TutorWelcomeBack } from './TutorWelcomeBack';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
const lastSeen = (at: string) => {
  h.progress = {
    python: {
      lessons: [
        { lastAccessedAt: daysAgo(30), completedAt: null },
        { lastAccessedAt: at, completedAt: at },
      ],
    },
  };
};
const greeting = () => screen.queryByText('Welcome back, Ada! Good to see you again.');

beforeEach(() => {
  localStorage.clear();
  h.isLoading = false;
  h.enabled = true;
});

describe('TutorWelcomeBack', () => {
  it('welcomes back a student away for a week or more, once for that return', () => {
    lastSeen(daysAgo(8));
    const first = render(<TutorWelcomeBack />);
    expect(greeting()).toBeInTheDocument();
    first.unmount();
    render(<TutorWelcomeBack />);
    expect(greeting()).toBeNull();
  });

  it('says nothing after a shorter break, while progress loads, or without the tutor', () => {
    lastSeen(daysAgo(3));
    const { rerender } = render(<TutorWelcomeBack />);
    expect(greeting()).toBeNull();
    lastSeen(daysAgo(8));
    h.isLoading = true;
    rerender(<TutorWelcomeBack />);
    expect(greeting()).toBeNull();
    h.isLoading = false;
    h.enabled = false;
    rerender(<TutorWelcomeBack />);
    expect(greeting()).toBeNull();
  });
});
