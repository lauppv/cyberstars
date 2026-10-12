import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import i18n from 'i18next';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

import { LandingPage } from './LandingPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

const main = () => screen.getByRole('main');

beforeEach(() => {
  vi.clearAllMocks();
});

// The language is a global i18n singleton; reset it so the ro test can't leak.
afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('LandingPage', () => {
  it('shows the hero and the four cards', () => {
    renderPage();
    expect(within(main()).getByText('Learn to code for free')).toBeDefined();
    for (const card of ['Read', 'Write', 'Run', 'Level up']) {
      expect(within(main()).getByText(card)).toBeDefined();
    }
  });

  it('Start Learning opens Courses and the hero Sign in opens sign-in', () => {
    renderPage();
    fireEvent.click(within(main()).getByText('Start Learning →'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
    fireEvent.click(within(main()).getByText('Sign in'));
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });
});
