import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes, useNavigate } from 'react-router';
import type { ReactNode } from 'react';

const reportPageView = vi.fn();
vi.mock('../services/visitsService', () => ({ reportPageView }));

const { usePageViews, referrerDomain } = await import('./usePageViews');

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>;
}

function setReferrer(value: string) {
  Object.defineProperty(document, 'referrer', { value, configurable: true });
}

beforeEach(() => {
  reportPageView.mockReset().mockResolvedValue(undefined);
  setReferrer('');
});

describe('referrerDomain', () => {
  it('is empty when the browser sent no referrer, or one it cannot read', () => {
    expect(referrerDomain('', 'cyberstars.app')).toBe('');
    expect(referrerDomain('not a url', 'cyberstars.app')).toBe('');
  });

  it('keeps only the domain of another site', () => {
    expect(
      referrerDomain('https://www.reddit.com/r/learnpython/comments/x', 'cyberstars.app'),
    ).toBe('www.reddit.com');
  });

  it('is undefined for our own pages', () => {
    expect(referrerDomain('https://cyberstars.app/ro', 'cyberstars.app')).toBeUndefined();
  });
});

describe('usePageViews', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('reports the first page with where it came from, later pages without', () => {
    setReferrer('https://news.ycombinator.com/item?id=1');
    const { result } = renderHook(
      () => {
        usePageViews();
        return useNavigate();
      },
      { wrapper },
    );
    act(() => vi.runAllTimers());
    act(() => result.current('/courses'));
    act(() => vi.runAllTimers());

    expect(reportPageView).toHaveBeenCalledTimes(2);
    expect(reportPageView.mock.calls[0][0]).toEqual({
      path: window.location.pathname,
      referrer: 'news.ycombinator.com',
    });
    expect(reportPageView.mock.calls[1][0]).not.toHaveProperty('referrer');
  });

  it('counts only the page a gate redirects to, with where the visit came from', () => {
    setReferrer('https://www.google.com/');
    function Reporter() {
      usePageViews();
      return null;
    }
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Reporter />
        <Routes>
          <Route path="/profile" element={<Navigate to="/getstarted" replace />} />
          <Route path="/getstarted" element={null} />
        </Routes>
      </MemoryRouter>,
    );
    act(() => vi.runAllTimers());

    expect(reportPageView).toHaveBeenCalledTimes(1);
    expect(reportPageView.mock.calls[0][0].referrer).toBe('www.google.com');
  });

  it('sends no referrer when the first page came from our own site', () => {
    setReferrer(`${window.location.origin}/courses`);
    renderHook(() => usePageViews(), { wrapper });
    act(() => vi.runAllTimers());
    expect(reportPageView.mock.calls[0][0]).not.toHaveProperty('referrer');
  });

  it('drops a report that failed without a fuss', async () => {
    reportPageView.mockRejectedValue(new Error('offline'));
    renderHook(() => usePageViews(), { wrapper });
    await act(async () => vi.runAllTimers());
    expect(reportPageView).toHaveBeenCalledTimes(1);
  });
});
