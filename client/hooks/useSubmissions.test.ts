import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useSubmissions } from './useSubmissions';
import * as testsService from '../services/testsService';
import type { SubmissionSummary } from '../../shared/tests';

vi.mock('../services/testsService', () => ({
  listSubmissions: vi.fn(),
}));

const listSubmissions = vi.mocked(testsService.listSubmissions);

const summary = (id: number): SubmissionSummary => ({
  id,
  status: 'failed',
  passedCount: 1,
  total: 5,
  runtimeMs: null,
  referenceMs: null,
  lang: 'en',
  createdAt: '2026-10-09T10:00:00.000Z',
});

beforeEach(() => {
  listSubmissions.mockReset();
});

describe('useSubmissions', () => {
  it('fetches on demand and puts a new run on top, capped at 20', async () => {
    listSubmissions.mockResolvedValue(Array.from({ length: 20 }, (_, i) => summary(20 - i)));
    const { result } = renderHook(() => useSubmissions('python', 'print'));
    expect(result.current.list).toBeNull();

    // A run before the list is fetched has nowhere to go; the fetch brings it.
    act(() => result.current.add(summary(99)));
    expect(result.current.list).toBeNull();

    act(() => result.current.load());
    await waitFor(() => expect(result.current.list).toHaveLength(20));
    expect(listSubmissions).toHaveBeenCalledWith('python', 'print');

    act(() => result.current.add(summary(21)));
    expect(result.current.list).toHaveLength(20);
    expect(result.current.list![0].id).toBe(21);
    expect(result.current.list!.at(-1)!.id).toBe(2);

    // The same attempt twice stays one row.
    act(() => result.current.add(summary(21)));
    expect(result.current.list!.filter((s) => s.id === 21)).toHaveLength(1);
  });

  it('reports a failed fetch and clears it on retry', async () => {
    listSubmissions.mockRejectedValue(new Error('404'));
    const { result } = renderHook(() => useSubmissions('python', 'print'));
    act(() => result.current.load());
    await waitFor(() => expect(result.current.failed).toBe(true));
    act(() => result.current.retry());
    expect(result.current.failed).toBe(false);
    expect(result.current.list).toBeNull();
  });

  it('forgets one lesson history when the lesson changes', async () => {
    listSubmissions.mockResolvedValue([summary(1)]);
    const { result, rerender } = renderHook(({ slug }) => useSubmissions('python', slug), {
      initialProps: { slug: 'print' },
    });
    act(() => result.current.load());
    await waitFor(() => expect(result.current.list).toHaveLength(1));
    rerender({ slug: 'variables' });
    expect(result.current.list).toBeNull();
    act(() => result.current.add(summary(2)));
    expect(result.current.list).toBeNull();
  });
});
