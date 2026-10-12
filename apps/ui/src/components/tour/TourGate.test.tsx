import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

let user: { onboardedAt: string | null } | null = null;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user }),
}));

import { TourGate } from './TourGate';
import { TOUR_PATH } from '../../constants/tour';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TourGate>
        <Routes>
          <Route path="/courses" element={<span>courses</span>} />
          <Route path="/lesson/:category/:lesson" element={<span>lesson</span>} />
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
    user = { onboardedAt: '2026-10-09T00:00:00Z' };
    renderAt('/courses');
    expect(screen.getByText('courses')).toBeInTheDocument();
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
});
