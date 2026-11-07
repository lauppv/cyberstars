import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'algo-python',
        title: 'Python Algorithms',
        lessons: [
          { slug: 'reverse', title: 'Easy · Reverse a String', sortOrder: 1, hasTests: true },
          { slug: 'caesar', title: 'Medium · Caesar Cipher', sortOrder: 2, hasTests: true },
        ],
      },
    ],
    isLoading: false,
  }),
}));
vi.mock('../context/ProgressContext', () => ({ useAllProgress: vi.fn() }));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => null }));

const { useAuth } = await import('../context/AuthContext');
const { useAllProgress } = await import('../context/ProgressContext');
const { AlgorithmsPage } = await import('./AlgorithmsPage');

function progress(completed = 1, lastAccessedAt: string | null = null) {
  vi.mocked(useAllProgress).mockReturnValue({
    progressMap: {
      'algo-python': {
        courseKey: 'algo-python',
        completed,
        total: 2,
        earnedXp: 10,
        totalXp: 21,
        lessons: [
          { slug: 'reverse', title: 'Reverse', completed: true, completedAt: null, lastAccessedAt },
        ],
      },
    },
    failedCourses: new Set(),
    isLoading: false,
    refresh: vi.fn(),
  } as unknown as ReturnType<typeof useAllProgress>);
}

function noProgress() {
  vi.mocked(useAllProgress).mockReturnValue({
    progressMap: {},
    failedCourses: new Set(),
    isLoading: false,
    refresh: vi.fn(),
  } as unknown as ReturnType<typeof useAllProgress>);
}

function renderPage(path = '/algorithms') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/algorithms" element={<AlgorithmsPage />} />
        <Route path="/algorithms/:lang" element={<AlgorithmsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AlgorithmsPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
  });

  it('heads the page and opens a challenge set from its card', () => {
    noProgress();
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Algorithms' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /View Challenges/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/algorithms/python');
  });

  it('counts a set on its card like a course', () => {
    noProgress();
    renderPage();
    expect(screen.getByText('challenges')).toBeInTheDocument();
    expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
  });

  it('offers Continue once a set is started, to the challenge opened last', () => {
    progress(1, '2026-11-01T10:00:00Z');
    renderPage();
    expect(screen.getByText('Solved: 1 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/algo-python/reverse');
  });

  it("opens a set's challenges in the drawer over the cards", () => {
    noProgress();
    renderPage('/algorithms/python');
    const drawer = screen.getByRole('dialog', { name: /Python Algorithms/ });
    expect(screen.getByRole('heading', { level: 1, name: 'Algorithms' })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /Reverse a String/ })).toHaveAttribute(
      'href',
      '/lesson/algo-python/reverse',
    );
    expect(within(drawer).getByRole('link', { name: /Caesar Cipher/ })).toBeInTheDocument();
  });

  it('filters the challenges by difficulty', () => {
    noProgress();
    renderPage('/algorithms/python');
    const drawer = screen.getByRole('dialog');
    fireEvent.click(within(drawer).getByRole('button', { name: 'Hard' }));
    expect(within(drawer).getByText('No challenges match this filter.')).toBeInTheDocument();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Medium' }));
    expect(within(drawer).getByRole('link', { name: /Caesar Cipher/ })).toBeInTheDocument();
    expect(within(drawer).queryByRole('link', { name: /Reverse a String/ })).toBeNull();
  });

  it('counts solved as the server does', () => {
    // A completed challenge that left the curriculum still counts on the server
    progress(2);
    renderPage('/algorithms/python');
    expect(within(screen.getByRole('dialog')).getByText('Solved: 2 of 2')).toBeInTheDocument();
  });

  it('shows a guest no progress', () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    noProgress();
    renderPage('/algorithms/python');
    expect(screen.queryByText(/Solved/)).toBeNull();
  });

  it('closes the drawer back to the cards, by its X or Escape', () => {
    noProgress();
    renderPage('/algorithms/python');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(mockNavigate).toHaveBeenCalledWith('/algorithms');
    mockNavigate.mockClear();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockNavigate).toHaveBeenCalledWith('/algorithms');
  });

  it('shows only the cards for a language with no set', () => {
    noProgress();
    renderPage('/algorithms/cobol');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Python' })).toBeInTheDocument();
  });
});
