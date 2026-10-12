import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import i18n from 'i18next';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const lessons = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ slug: `l${i}`, title: `L${i}`, sortOrder: i + 1 }));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      { key: 'python', title: 'Python', description: '', lessons: lessons(3) },
      { key: 'algo-c', title: 'C Algorithms', description: '', lessons: lessons(2) },
    ],
    isLoading: false,
    refresh: vi.fn(),
  }),
}));

import { LandingPage } from './LandingPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

const header = () => screen.getByRole('banner');
const main = () => screen.getByRole('main');
const footer = () => screen.getByRole('contentinfo');

beforeEach(() => {
  vi.clearAllMocks();
});

// The language is a global i18n singleton; reset it so the ro test can't leak.
afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('LandingPage', () => {
  it('shows the hero, the proof strip and the sections between its navbar and footer', () => {
    renderPage();
    expect(within(main()).getByText('Learn to code for free')).toBeDefined();
    expect(within(main()).getByRole('img', { name: /Flight Report mission/ })).toBeDefined();
    expect(within(main()).getByRole('region', { name: 'What there is to learn' })).toBeDefined();
    expect(
      within(main()).getByRole('heading', { name: 'Starting to code is harder than it should be' }),
    ).toBeDefined();
    expect(within(main()).getByRole('heading', { name: 'How it works' })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: "What's inside" })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: 'Free, and open source' })).toBeDefined();
    expect(header()).toBeDefined();
    expect(footer()).toBeDefined();
  });

  it("the hero's Start learning opens Courses and its Sign in opens sign-in", () => {
    renderPage();
    const [heroStart] = within(main()).getAllByRole('button', { name: 'Start learning' });
    fireEvent.click(heroStart);
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
    const [heroSignIn] = within(main()).getAllByRole('button', { name: 'Sign in' });
    fireEvent.click(heroSignIn);
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });

  it('asks again mid-page and once more before the footer', () => {
    renderPage();
    expect(within(main()).getAllByRole('button', { name: 'Start learning' })).toHaveLength(3);
    expect(
      within(main()).getByRole('heading', { name: 'Write your first line of code today' }),
    ).toBeDefined();
  });

  it('links the navbar only to pages a visitor can open, plus sign-in', () => {
    renderPage();
    const nav = within(header());
    expect(nav.getByRole('link', { name: 'CyberStars' })).toHaveAttribute('href', '/');
    expect(nav.getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/courses');
    expect(nav.getByRole('link', { name: 'Algorithms' })).toHaveAttribute('href', '/algorithms');
    expect(nav.getByRole('link', { name: 'Almanac' })).toHaveAttribute('href', '/almanac');
    expect(nav.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/getstarted');
    expect(nav.queryByRole('link', { name: 'Forum' })).toBeNull();
  });

  it('folds the links into a menu that opens, closes on Escape and on a pick', () => {
    renderPage();
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('landing-menu')).toBeNull();

    fireEvent.click(toggle);
    const menu = document.getElementById('landing-menu')!;
    expect(within(menu).getByRole('link', { name: 'Courses' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.getElementById('landing-menu')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(
      within(document.getElementById('landing-menu')!).getByRole('link', { name: 'Almanac' }),
    );
    expect(document.getElementById('landing-menu')).toBeNull();
  });

  it('switches the page to Romanian from the navbar', async () => {
    renderPage();
    const [desktopSwitch] = within(header()).getAllByRole('group', { name: 'Switch language' });
    fireEvent.click(within(desktopSwitch).getByRole('button', { name: 'RO' }));
    expect(await screen.findByRole('link', { name: 'Codul sursă' })).toBeDefined();
    expect(i18n.language).toBe('ro');
  });

  it('links the source code and the license from the footer', () => {
    renderPage();
    const foot = within(footer());
    expect(foot.getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/courses');
    expect(foot.getByRole('link', { name: 'Source code' })).toHaveAttribute(
      'href',
      'https://github.com/lauppv/cyberstars',
    );
    expect(foot.getByRole('link', { name: 'License' })).toHaveAttribute(
      'href',
      'https://github.com/lauppv/cyberstars/blob/main/LICENSE',
    );
  });
});
