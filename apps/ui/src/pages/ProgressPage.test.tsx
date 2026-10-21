import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
const mockRefresh = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isLoggedIn: true })),
}));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: vi.fn(),
}));
vi.mock('../context/ProgressContext', () => ({
  useAllProgress: vi.fn(),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

const { useCurriculum } = await import('../context/CurriculumContext');
const { useAllProgress } = await import('../context/ProgressContext');
const { ProgressPage } = await import('./ProgressPage');

const lesson = (slug: string, title = slug) => ({ slug, title, sortOrder: 1 });
const done = (slug: string) => ({
  slug,
  title: slug,
  completed: true,
  completedAt: '2026-10-01T00:00:00Z',
  lastAccessedAt: '2026-10-01T00:00:00Z',
});
const progress = (courseKey: string, slugs: string[], earnedXp = 0, totalXp = 0) => ({
  courseKey,
  earnedXp,
  totalXp,
  completed: slugs.length,
  total: 0,
  lessons: slugs.map(done),
});

const COURSES = [
  { key: 'python', title: 'Python', lessons: [lesson('intro'), lesson('booleans', 'Booleans')] },
  { key: 'java', title: 'Java', lessons: [lesson('hello')] },
  { key: 'c', title: 'C', lessons: [lesson('main')] },
  {
    key: 'algo-python',
    title: 'Python Algorithms',
    lessons: [
      lesson('two-sum', 'Easy · Two Sum'),
      lesson('reverse', 'Easy · Reverse'),
      lesson('anagram', 'Medium · Anagram'),
      lesson('n-queens', 'Hard · N-Queens'),
    ],
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProgressPage />
    </MemoryRouter>,
  );
}

function card(name: string): HTMLElement {
  return screen.getByText(name).closest('button')!;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useCurriculum).mockReturnValue({
    courses: COURSES,
    isLoading: false,
    refresh: vi.fn(),
  } as unknown as ReturnType<typeof useCurriculum>);
  vi.mocked(useAllProgress).mockReturnValue({
    progressMap: {
      python: progress('python', ['intro'], 10, 21),
      java: progress('java', ['hello']),
      'algo-python': progress('algo-python', ['two-sum', 'anagram']),
    },
    failedCourses: new Set(),
    isLoading: false,
    refresh: mockRefresh,
  } as unknown as ReturnType<typeof useAllProgress>);
});

describe('ProgressPage', () => {
  it('reads the progress again when it opens', () => {
    renderPage();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows a started course with its share, XP and next lesson', () => {
    renderPage();
    const python = card('Python');
    expect(python).toHaveTextContent('50%');
    expect(python).toHaveTextContent('Lessons: 1 of 2');
    expect(python).toHaveTextContent('10 / 21 XP');
    expect(python).toHaveTextContent('Next: Booleans');
  });

  it('tells a finished course from one not started', () => {
    renderPage();
    expect(card('Java')).toHaveTextContent('Completed');
    expect(card('C')).toHaveTextContent('Not started yet');
    expect(card('C')).toHaveTextContent('0%');
  });

  it('splits a challenge set by difficulty', () => {
    renderPage();
    const algos = card('Python Algorithms');
    expect(algos).toHaveTextContent('Solved: 2 of 4');
    expect(within(algos).getByText('1/2')).toBeInTheDocument();
    expect(within(algos).getAllByText('1/1')).toHaveLength(1);
    expect(within(algos).getByText('0/1')).toBeInTheDocument();
  });

  it('opens a course and a challenge set', () => {
    renderPage();
    fireEvent.click(card('Python'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses/python');
    fireEvent.click(card('Python Algorithms'));
    expect(mockNavigate).toHaveBeenCalledWith('/algorithms/python');
  });
});
