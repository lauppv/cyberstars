import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

let mockLang = 'en';
let mockLoggedIn = false;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: mockLang } }),
}));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: mockLoggedIn }),
}));
vi.mock('../services/lessonService', () => ({
  fetchLesson: vi.fn(),
  fetchLessonCode: vi.fn(),
  fetchLessonSolution: vi.fn(),
}));
vi.mock('../services/progressService', () => ({
  getSavedCode: vi.fn(),
}));

const lessonService = await import('../services/lessonService');
const progressService = await import('../services/progressService');
const mockFetchLesson = vi.mocked(lessonService.fetchLesson);
const mockFetchCode = vi.mocked(lessonService.fetchLessonCode);
const mockFetchSolution = vi.mocked(lessonService.fetchLessonSolution);
const mockGetSaved = vi.mocked(progressService.getSavedCode);

const { useLesson } = await import('./useLesson');

beforeEach(() => {
  vi.clearAllMocks();
  mockLang = 'en';
  mockLoggedIn = false;
  mockFetchLesson.mockResolvedValue({ title: 'Intro', content: '# Hello', slug: 'py-1' } as Awaited<
    ReturnType<typeof lessonService.fetchLesson>
  >);
  mockFetchCode.mockResolvedValue('print(1)');
  mockFetchSolution.mockResolvedValue('print(42)');
  mockGetSaved.mockResolvedValue({ code: 'my saved code' });
});

describe('useLesson', () => {
  it('loads lesson content, starter code and solution', async () => {
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.title).toBe('Intro');
    expect(result.current.content).toBe('# Hello');
    expect(result.current.starterCode).toBe('print(1)');
    expect(result.current.solution).toBe('print(42)');
    expect(result.current.error).toBeNull();
    expect(mockFetchLesson).toHaveBeenCalledWith('python', 'py-1', 'en');
  });

  it('passes ro when the language is Romanian', async () => {
    mockLang = 'ro';
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchLesson).toHaveBeenCalledWith('python', 'py-1', 'ro');
  });

  it('sets an error when the lesson fetch fails', async () => {
    mockFetchLesson.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Lesson not found');
    expect(result.current.title).toBe('Lesson not found');
    expect(result.current.content).toBe('');
  });

  it('falls back to default starter code when the code fetch fails', async () => {
    mockFetchCode.mockRejectedValue(new Error('no code'));
    const { result } = renderHook(() => useLesson('c', 'c-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.starterCode).toContain('int main(void)');
  });

  it('uses an empty starter for an unknown course when the code fetch fails', async () => {
    mockFetchCode.mockRejectedValue(new Error('no code'));
    const { result } = renderHook(() => useLesson('mystery', 'x-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.starterCode).toBe('');
  });

  it('sets solution to null when the lesson ships none', async () => {
    mockFetchSolution.mockRejectedValue(new Error('no solution'));
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.solution).toBeNull();
  });

  it('loads saved code when logged in', async () => {
    mockLoggedIn = true;
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetSaved).toHaveBeenCalledWith('python', 'py-1');
    expect(result.current.savedCode).toBe('my saved code');
  });

  it('leaves saved code null when the saved-code fetch fails', async () => {
    mockLoggedIn = true;
    mockGetSaved.mockRejectedValue(new Error('nope'));
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.savedCode).toBeNull();
  });

  it('does not fetch saved code when logged out', async () => {
    const { result } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetSaved).not.toHaveBeenCalled();
    expect(result.current.savedCode).toBeNull();
  });

  it('flips back to loading synchronously when the lesson changes', async () => {
    const { result, rerender } = renderHook(({ slug }) => useLesson('python', slug), {
      initialProps: { slug: 'py-1' },
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    rerender({ slug: 'py-2' });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});

/**
 * Leaving a lesson mid-load must not write the old lesson's data into the new
 * one — every await is guarded by a cancellation check.
 */
describe('useLesson cancellation', () => {
  function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  const flush = () => act(async () => {});

  it('stops after the lesson resolves', async () => {
    const d = deferred<Awaited<ReturnType<typeof lessonService.fetchLesson>>>();
    mockFetchLesson.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));

    unmount();
    d.resolve({ title: 'Intro', content: '# Hello', slug: 'py-1' } as never);
    await flush();

    expect(mockFetchCode).not.toHaveBeenCalled();
    expect(result.current.title).toBe('');
  });

  it('stops after the lesson rejects', async () => {
    const d = deferred<never>();
    mockFetchLesson.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));

    unmount();
    d.reject(new Error('404'));
    await flush();

    expect(mockFetchCode).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('stops after the starter code resolves', async () => {
    const d = deferred<string>();
    mockFetchCode.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(mockFetchCode).toHaveBeenCalled());

    unmount();
    d.resolve('print(1)');
    await flush();

    expect(mockFetchSolution).not.toHaveBeenCalled();
    expect(result.current.starterCode).toBe('');
  });

  it('stops after the solution resolves', async () => {
    const d = deferred<string>();
    mockFetchSolution.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(mockFetchSolution).toHaveBeenCalled());

    unmount();
    d.resolve('print(42)');
    await flush();

    expect(result.current.solution).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('stops after the solution rejects', async () => {
    const d = deferred<string>();
    mockFetchSolution.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(mockFetchSolution).toHaveBeenCalled());

    unmount();
    d.reject(new Error('no solution'));
    await flush();

    expect(result.current.isLoading).toBe(true);
  });

  it('stops after the saved code resolves', async () => {
    mockLoggedIn = true;
    const d = deferred<{ code: string | null }>();
    mockGetSaved.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(mockGetSaved).toHaveBeenCalled());

    unmount();
    d.resolve({ code: 'my saved code' });
    await flush();

    expect(result.current.savedCode).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('stops after the saved code rejects', async () => {
    mockLoggedIn = true;
    const d = deferred<{ code: string | null }>();
    mockGetSaved.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() => useLesson('python', 'py-1'));
    await waitFor(() => expect(mockGetSaved).toHaveBeenCalled());

    unmount();
    d.reject(new Error('nope'));
    await flush();

    expect(result.current.isLoading).toBe(true);
  });
});
