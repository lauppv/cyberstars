import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEffect, useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useLesson } from './useLesson';

const authState = { isLoggedIn: true };
vi.mock('../context/AuthContext', () => ({
  useAuth: () => authState,
}));

const i18nState = { language: 'en' };
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: i18nState }),
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
  authState.isLoggedIn = true;
  i18nState.language = 'en';
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
  it('loads title, starter, saved code, and solution for a lesson', async () => {
    mockFetchLessonSolution.mockResolvedValue('# Worked solution');
    const { result } = renderHook(() => useLesson('python', 'print'));
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.title).toBe('Title print');
    expect(result.current.starterCode).toBe('starter print');
    expect(result.current.savedCode).toBe('saved print');
    expect(result.current.solution).toBe('# Worked solution');
  });

  it('requests the ro locale when the UI language is Romanian', async () => {
    i18nState.language = 'ro';
    const { result } = renderHook(() => useLesson('python', 'print'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchLesson).toHaveBeenCalledWith('python', 'print', 'ro');
  });

  it('surfaces a not-found error when the lesson fetch fails', async () => {
    mockFetchLesson.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => useLesson('python', 'missing'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Lesson not found');
    expect(result.current.title).toBe('Lesson not found');
    expect(result.current.content).toBe('');
  });

  it('falls back to the default starter when no starter file exists', async () => {
    mockFetchLessonCode.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => useLesson('python', 'print'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.starterCode).toBe('# Python code goes here');
  });

  it('uses an empty starter for an unknown course with no starter file', async () => {
    mockFetchLessonCode.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => useLesson('mystery', 'print'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.starterCode).toBe('');
  });

  it('skips saved code and leaves it null for guests', async () => {
    authState.isLoggedIn = false;
    const { result } = renderHook(() => useLesson('python', 'print'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetSavedCode).not.toHaveBeenCalled();
    expect(result.current.savedCode).toBeNull();
  });

  it('leaves saved code null when fetching it fails', async () => {
    mockGetSavedCode.mockRejectedValue(new Error('500'));
    const { result } = renderHook(() => useLesson('python', 'print'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.savedCode).toBeNull();
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
