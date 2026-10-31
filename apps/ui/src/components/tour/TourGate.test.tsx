import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router';

let user: { onboardedAt: string | null; interests?: string[] | null } | null = null;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user }),
}));

import { TourGate } from './TourGate';
import { INTERESTS_PATH, TOUR_PATH } from '../../constants/tour';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TourGate>
        <Routes>
          <Route path="/courses" element={<span>courses</span>} />
          <Route path="/lesson/:category/:lesson" element={<Link to="/courses">lesson</Link>} />
          <Route path={INTERESTS_PATH} element={<span>interests</span>} />
        </Routes>
      </TourGate>
    </MemoryRouter>,
  );
}

describe('TourGate', () => {
  it('lets a guest go anywhere', () => {
    user = null;
    renderAt('/courses');
    expect(screen.getByText('courses')).toBeInTheDocument();
  });

  it('lets an onboarded user go anywhere', () => {
    user = { onboardedAt: '2026-10-09T00:00:00Z', interests: ['c'] };
    renderAt('/courses');
    expect(screen.getByText('courses')).toBeInTheDocument();
  });

  it('asks an account that just finished the tour what it wants to learn, and keeps it there', () => {
    user = { onboardedAt: '2026-10-09T00:00:00Z', interests: null };
    renderAt(TOUR_PATH);
    expect(screen.getByText('interests')).toBeInTheDocument();
    renderAt(INTERESTS_PATH);
    expect(screen.getAllByText('interests')).toHaveLength(2);
  });

  it('sends a new account back to the tour lesson', () => {
    user = { onboardedAt: null };
    renderAt('/courses');
    expect(screen.getByText('lesson')).toBeInTheDocument();
  });

  it('keeps a new account on the tour lesson', () => {
    user = { onboardedAt: null };
    renderAt(TOUR_PATH);
    expect(screen.getByText('lesson')).toBeInTheDocument();
  });

  it('brings a new account back from a link off the tour lesson and says why', () => {
    user = { onboardedAt: null };
    renderAt(TOUR_PATH);
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.click(screen.getByText('lesson'));
    expect(screen.getByText('lesson')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Finish this lesson first');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('sends a new account to the tour lesson from elsewhere without the notice', () => {
    user = { onboardedAt: null };
    renderAt('/courses');
    expect(screen.getByText('lesson')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('lets an onboarded user follow a link off the first lesson', () => {
    user = { onboardedAt: '2026-10-09T00:00:00Z', interests: ['c'] };
    renderAt(TOUR_PATH);
    fireEvent.click(screen.getByText('lesson'));
    expect(screen.getByText('courses')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
