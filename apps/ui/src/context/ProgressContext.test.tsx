import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('./AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('./CurriculumContext', () => ({ useCurriculum: vi.fn() }));
vi.mock('../services/progressService', () => ({ getCourseProgress: vi.fn() }));

const { useAuth } = await import('./AuthContext');
const { useCurriculum } = await import('./CurriculumContext');
const progressService = await import('../services/progressService');
const { ProgressProvider, useAllProgress } = await import('./ProgressContext');

const python = {
  key: 'python',
  title: 'Python',
  description: '',
  lessons: [{ slug: 'intro', title: 'Intro', sortOrder: 1 }],
};

// Every render's view of the progress, so a render that only flashes by
// (and is gone after the effects run) is still caught
const seen: { isLoading: boolean; courses: number }[] = [];
function Probe() {
  const { isLoading, progressMap } = useAllProgress();
  seen.push({ isLoading, courses: Object.keys(progressMap).length });
  return null;
}

function setAuth(isLoggedIn: boolean) {
  vi.mocked(useAuth).mockReturnValue({ isLoggedIn } as ReturnType<typeof useAuth>);
}

beforeEach(() => {
  vi.clearAllMocks();
  seen.length = 0;
  vi.mocked(useCurriculum).mockReturnValue({
    courses: [python],
    isLoading: false,
  } as unknown as ReturnType<typeof useCurriculum>);
  vi.mocked(progressService.getCourseProgress).mockResolvedValue({
    courseKey: 'python',
    earnedXp: 0,
    totalXp: 0,
    completed: 0,
    total: 1,
    lessons: [
      { slug: 'intro', title: 'Intro', completed: false, completedAt: null, lastAccessedAt: null },
    ],
  });
});

describe('ProgressProvider', () => {
  it('never passes the empty map as settled right after sign-in', async () => {
    setAuth(false);
    const { rerender } = render(
      <ProgressProvider>
        <Probe />
      </ProgressProvider>,
    );
    expect(seen.at(-1)).toEqual({ isLoading: false, courses: 0 });

    seen.length = 0;
    setAuth(true);
    rerender(
      <ProgressProvider>
        <Probe />
      </ProgressProvider>,
    );
    await waitFor(() => expect(seen.at(-1)).toEqual({ isLoading: false, courses: 1 }));
    expect(seen.filter((r) => !r.isLoading && r.courses === 0)).toEqual([]);
  });

  it('settles without progress for a visitor', async () => {
    setAuth(false);
    render(
      <ProgressProvider>
        <Probe />
      </ProgressProvider>,
    );
    await waitFor(() => expect(seen.at(-1)).toEqual({ isLoading: false, courses: 0 }));
    expect(progressService.getCourseProgress).not.toHaveBeenCalled();
  });
});
