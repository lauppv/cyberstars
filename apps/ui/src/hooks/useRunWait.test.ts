import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ApiClientError } from '../services/apiClient';

const mockIsRunWaiting = vi.fn();
vi.mock('../services/runsService', () => ({
  isRunWaiting: (...a: unknown[]) => mockIsRunWaiting(...a),
}));

const { dismissBusy, isBusy, setRunWait, useRunWait, withRunWait } = await import('./useRunWait');

beforeEach(() => {
  mockIsRunWaiting.mockReset();
  for (const runner of ['a', 'b', 'tests']) setRunWait(runner, null);
});
afterEach(() => vi.useRealTimers());

describe('useRunWait', () => {
  it('shows a run still waiting before one that waited in vain', () => {
    const { result } = renderHook(() => useRunWait());
    expect(result.current).toBeNull();
    const retry = vi.fn();
    act(() => setRunWait('a', { kind: 'busy', retry }));
    expect(result.current).toEqual({ kind: 'busy', retry });
    act(() => setRunWait('b', { kind: 'waiting' }));
    expect(result.current).toEqual({ kind: 'waiting' });
    act(() => setRunWait('b', null));
    expect(result.current).toEqual({ kind: 'busy', retry });
  });

  it('lets go of the runs that waited in vain when the notice is closed', () => {
    const { result } = renderHook(() => useRunWait());
    act(() => {
      setRunWait('a', { kind: 'busy', retry: () => {} });
      setRunWait('b', { kind: 'waiting' });
    });
    act(() => dismissBusy());
    expect(result.current).toEqual({ kind: 'waiting' });
    act(() => setRunWait('b', null));
    expect(result.current).toBeNull();
  });
});

describe('isBusy', () => {
  it("takes the sandbox line's and the judge's 503s, and nothing else", () => {
    expect(
      isBusy(new ApiClientError(503, 'The server is busy right now, please try again in a moment')),
    ).toBe(true);
    expect(
      isBusy(new ApiClientError(503, 'The judge is busy right now, please try again in a moment')),
    ).toBe(true);
    expect(isBusy(new ApiClientError(503, 'Service Unavailable'))).toBe(false);
    expect(isBusy(new ApiClientError(429, 'The server is busy right now'))).toBe(false);
    expect(isBusy(new Error('The server is busy right now'))).toBe(false);
  });
});

describe('withRunWait', () => {
  it('asks after a second, shows the wait, and hides it once the run has its slot', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRunWait());
    let answer: (value: string) => void = () => {};
    const send = vi.fn((_runId: string) => new Promise<string>((resolve) => (answer = resolve)));
    mockIsRunWaiting.mockResolvedValueOnce({ waiting: true }).mockResolvedValue({ waiting: false });

    const run = withRunWait('tests', send, () => {});
    const runId = send.mock.calls[0][0];
    expect(runId).toMatch(/^[\w-]+$/);
    await act(() => vi.advanceTimersByTimeAsync(999));
    expect(mockIsRunWaiting).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(mockIsRunWaiting).toHaveBeenCalledWith(runId);
    expect(result.current).toEqual({ kind: 'waiting' });

    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(result.current).toBeNull();
    // Past the lines it stops asking
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(mockIsRunWaiting).toHaveBeenCalledTimes(2);

    answer('done');
    await expect(run).resolves.toBe('done');
  });

  it('never shows a run that is only slow, and stops asking when it answers', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRunWait());
    let answer: () => void = () => {};
    mockIsRunWaiting.mockResolvedValue({ waiting: false });
    const run = withRunWait(
      'tests',
      () => new Promise<void>((resolve) => (answer = resolve)),
      () => {},
    );
    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(result.current).toBeNull();
    answer();
    await run;
    const asked = mockIsRunWaiting.mock.calls.length;
    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(mockIsRunWaiting).toHaveBeenCalledTimes(asked);
  });

  it('keeps asking when an ask fails', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRunWait());
    mockIsRunWaiting
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ waiting: true });
    void withRunWait(
      'tests',
      () => new Promise(() => {}),
      () => {},
    );
    await act(() => vi.advanceTimersByTimeAsync(2000));
    expect(result.current).toEqual({ kind: 'waiting' });
  });

  it('leaves Try again on the notice when the server stayed busy', async () => {
    const { result } = renderHook(() => useRunWait());
    const retry = vi.fn();
    const busy = new ApiClientError(
      503,
      'The judge is busy right now, please try again in a moment',
    );
    await act(async () => {
      await expect(withRunWait('tests', () => Promise.reject(busy), retry)).rejects.toBe(busy);
    });
    expect(result.current).toEqual({ kind: 'busy', retry });
  });

  it('shows nothing for any other failure', async () => {
    const { result } = renderHook(() => useRunWait());
    await act(async () => {
      await expect(
        withRunWait(
          'tests',
          () => Promise.reject(new Error('nope')),
          () => {},
        ),
      ).rejects.toThrow('nope');
    });
    expect(result.current).toBeNull();
  });
});
