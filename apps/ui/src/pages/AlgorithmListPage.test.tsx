import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

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
const { AlgorithmListPage } = await import('./AlgorithmListPage');

function progress(failed = false, completed = 1) {
  vi.mocked(useAllProgress).mockReturnValue({
    progressMap: failed
      ? {}
      : {
          'algo-python': {
            courseKey: 'algo-python',
            completed,
            total: 2,
            earnedXp: 10,
            totalXp: 21,
            lessons: [
              {
                slug: 'reverse',
                title: 'Reverse',
                completed: true,
                completedAt: null,
                lastAccessedAt: null,
              },
            ],
          },
        },
    failedCourses: new Set(failed ? ['algo-python'] : []),
    isLoading: false,
    refresh: vi.fn(),
  } as unknown as ReturnType<typeof useAllProgress>);
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/algorithms/python']}>
      <Routes>
        <Route path="/algorithms/:lang" element={<AlgorithmListPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AlgorithmListPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
  });

  it('shows a signed-in student how many are solved and the badge they work towards', () => {
    progress();
    renderPage();
    expect(screen.getByRole('heading', { name: 'Python Algorithms' })).toBeInTheDocument();
    expect(screen.getByText('Solved: 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Next badge: Python Algorithms Bronze')).toBeInTheDocument();
  });

  it('counts solved from the same progress as the badge', () => {
    // A completed challenge that left the curriculum still counts on the server
    progress(false, 2);
    renderPage();
    expect(screen.getByText('Solved: 2 of 2')).toBeInTheDocument();
  });

  it('shows a guest the first badge and no progress', () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    vi.mocked(useAllProgress).mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    } as unknown as ReturnType<typeof useAllProgress>);
    renderPage();
    expect(screen.getByText('Next badge: Python Algorithms First Steps')).toBeInTheDocument();
    expect(screen.queryByText(/Solved/)).toBeNull();
  });

  it("leaves the badge out when the progress didn't load", () => {
    progress(true);
    renderPage();
    expect(screen.queryByText(/Next badge/)).toBeNull();
  });
});
