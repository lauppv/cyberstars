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
    expect(
      within(main()).getByRole('heading', { level: 1, name: 'Learn to code for free' }),
    ).toBeDefined();
    expect(within(main()).getByRole('img', { name: /Flight Report mission/ })).toBeDefined();
    expect(within(main()).getByRole('region', { name: 'What there is to learn' })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: 'How it works' })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: "What's inside" })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: 'Free. Open source.' })).toBeDefined();
    expect(within(main()).getByRole('heading', { name: 'Questions' })).toBeDefined();
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

  it('keeps the navbar to the logo, the language switch and sign-in', () => {
    renderPage();
    const nav = within(header());
    expect(nav.getAllByRole('link').map((l) => l.getAttribute('href'))).toEqual([
      '/',
      '/getstarted',
    ]);
    expect(nav.getByRole('group', { name: 'Switch language' })).toBeDefined();
    expect(nav.queryByRole('button', { name: 'Open menu' })).toBeNull();
  });

  it('switches the page to Romanian from the navbar', async () => {
    renderPage();
    const languages = within(header()).getByRole('group', { name: 'Switch language' });
    fireEvent.click(within(languages).getByRole('button', { name: 'RO' }));
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
