import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEffect, useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useLesson } from './useLesson';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: true }),
}));

const { mockFetchLesson, mockFetchLessonCode, mockFetchLessonSolution, mockGetSavedCode } =
  vi.hoisted(() => ({
    mockFetchLesson: vi.fn(),
    mockFetchLessonCode: vi.fn(),
    mockFetchLessonSolution: vi.fn(),
    mockGetSavedCode: vi.fn(),
  }));

vi.mock('../services/lessonService', () => ({
  fetchLesson: (...args: unknown[]) => mockFetchLesson(...args),
  fetchLessonCode: (...args: unknown[]) => mockFetchLessonCode(...args),
  fetchLessonSolution: (...args: unknown[]) => mockFetchLessonSolution(...args),
}));

vi.mock('../services/progressService', () => ({
  getSavedCode: (...args: unknown[]) => mockGetSavedCode(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchLesson.mockImplementation((_course: string, slug: string) =>
    Promise.resolve({ title: `Title ${slug}`, content: `Content ${slug}` }),
  );
  mockFetchLessonCode.mockImplementation((_course: string, slug: string) =>
    Promise.resolve(`starter ${slug}`),
  );
  mockFetchLessonSolution.mockRejectedValue(new Error('no solution'));
  mockGetSavedCode.mockImplementation((_course: string, slug: string) =>
    Promise.resolve({ code: `saved ${slug}` }),
  );
});

// Mirrors LessonPage's editor-population effect: consume savedCode/starterCode
// only once isLoading is false, keyed by lesson. This is the consumer the
// synchronous isLoading reset in useLesson protects.
function EditorProbe({ slug }: { slug: string }) {
  const { starterCode, savedCode, isLoading } = useLesson('python', slug);
  const [userCode, setUserCode] = useState('');
  const loadedLessonRef = useRef('');
  useEffect(() => {
    if (isLoading) return;
    if (loadedLessonRef.current !== slug) {
      loadedLessonRef.current = slug;
      setUserCode(savedCode ?? starterCode);
    }
  }, [isLoading, slug, starterCode, savedCode]);
  return <div data-testid="editor">{userCode}</div>;
}

describe('useLesson', () => {
  it('loads title, starter, and saved code for a lesson', async () => {
    const { result } = renderHook(() => useLesson('python', 'print'));
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.title).toBe('Title print');
    expect(result.current.starterCode).toBe('starter print');
    expect(result.current.savedCode).toBe('saved print');
  });

  it("never hands a consumer the previous lesson's savedCode on lesson switch", async () => {
    // Regression: isLoading only flipped in an effect, so in the first render
    // after a slug change a consumer effect saw stale isLoading=false + stale
    // savedCode and populated the new lesson's editor with the old code.
    const { rerender } = render(<EditorProbe slug="variables-str" />);
    await waitFor(() =>
      expect(screen.getByTestId('editor').textContent).toBe('saved variables-str'),
    );

    rerender(<EditorProbe slug="variables-bool" />);
    await waitFor(() =>
      expect(screen.getByTestId('editor').textContent).toBe('saved variables-bool'),
    );
  });
});
