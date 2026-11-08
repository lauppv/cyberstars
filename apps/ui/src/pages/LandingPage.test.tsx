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
  it('says free only in the hero, the free band and the question about it', () => {
    renderPage();
    expect(main().textContent?.match(/free/gi)).toHaveLength(3);
    expect(within(main()).getByRole('heading', { level: 1 })).toHaveTextContent('for free');
    expect(within(main()).getByRole('heading', { name: 'Free. Open source.' })).toBeDefined();
    expect(within(main()).getByRole('button', { name: 'Is it free?' })).toBeDefined();
  });

  it('says no card and nothing to install by the hero buttons', () => {
    renderPage();
    const hero = within(main()).getByRole('heading', { level: 1 }).closest('section')!;
    expect(within(hero).getByText('No card')).toBeDefined();
    expect(within(hero).getByText('Nothing to install')).toBeDefined();
  });

  it('shows the chapters of the page at its side', () => {
    renderPage();
    expect(screen.getByRole('navigation', { name: 'Chapters of the page' })).toBeDefined();
  });

  it('shows the hero, the proof strip and the sections between its navbar and footer', () => {
    renderPage();
    expect(
      within(main()).getByRole('heading', { level: 1, name: 'Learn to code for free' }),
    ).toBeDefined();
    expect(
      within(main()).getByRole('img', { name: /for loop over a list of names/ }),
    ).toBeDefined();
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

  it('asks once more before the footer, with the placement test, and not mid-page', () => {
    renderPage();
    expect(within(main()).getAllByRole('button', { name: 'Start learning' })).toHaveLength(1);
    expect(within(main()).getByRole('button', { name: 'Test me' })).toBeDefined();
    expect(screen.queryByText('Your first program is one click away.')).toBeNull();
    expect(within(main()).getByRole('heading', { name: 'Not sure where to start?' })).toBeDefined();
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

  it("scrolls from the footer to the page's own sections", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    renderPage();
    const foot = within(footer());
    for (const [name, id] of [
      ['How it works', 'how'],
      ["What's inside", 'features'],
      ['Questions', 'faq'],
    ]) {
      scrollIntoView.mockClear();
      fireEvent.click(foot.getByRole('button', { name }));
      expect(scrollIntoView).toHaveBeenCalledOnce();
      expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById(id));
    }
    expect(foot.queryByRole('link', { name: 'Courses' })).toBeNull();
  });

  it('links the source code and the license from the footer', () => {
    renderPage();
    const foot = within(footer());
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
