import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import type { ReactNode } from 'react';

const reportSteps = vi.fn();
vi.mock('../services/visitsService', () => ({ reportSteps }));
const auth = { user: null as { role: string } | null, isLoading: false };
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));

const { useGuestSteps, takeSteps } = await import('./useGuestSteps');

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>;
}

function button(track?: string) {
  const el = document.createElement('button');
  if (track) el.dataset.track = track;
  el.innerHTML = '<span>Run</span>';
  document.body.appendChild(el);
  return el;
}

function scrollTo(scrollY: number, scrollHeight = 4000) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

const click = (target: string) => ({ kind: 'click', target });
const scroll = (target: string) => ({ kind: 'scroll', target });

beforeEach(() => {
  takeSteps();
  localStorage.clear();
  document.body.innerHTML = '';
  reportSteps.mockReset().mockResolvedValue(undefined);
  auth.user = null;
  auth.isLoading = false;
});

describe('useGuestSteps', () => {
  it("keeps a guest's clicks on named buttons, by name, and nothing else", () => {
    renderHook(() => useGuestSteps(), { wrapper });
    button('run').querySelector('span')!.click();
    button().click();
    expect(takeSteps()).toEqual([click('run')]);
  });

  it.each([
    ['a signed-in student', { user: { role: 'USER' }, isLoading: false }],
    ['someone the app is still checking', { user: null, isLoading: true }],
  ])('keeps nothing from %s', (_, state) => {
    Object.assign(auth, state);
    renderHook(() => useGuestSteps(), { wrapper });
    button('run').click();
    scrollTo(3000);
    expect(takeSteps()).toEqual([]);
  });

  it("keeps nothing in a browser that isn't counted", () => {
    localStorage.setItem('cyberstars.counted', 'no');
    renderHook(() => useGuestSteps(), { wrapper });
    button('run').click();
    expect(takeSteps()).toEqual([]);
  });

  it('notes how far down the page a guest got, only when deeper, and anew on each page', () => {
    const { result } = renderHook(
      () => {
        useGuestSteps();
        return useNavigate();
      },
      { wrapper },
    );
    scrollTo(0); // the first screen is a quarter of the page
    scrollTo(500);
    scrollTo(100);
    scrollTo(1100); // past half
    scrollTo(3000); // the bottom
    expect(takeSteps()).toEqual([scroll('25'), scroll('50'), scroll('100')]);

    act(() => result.current('/courses'));
    scrollTo(1000);
    expect(takeSteps()).toEqual([scroll('50')]);
  });

  it('notes no scroll on a page that fits on the screen', () => {
    renderHook(() => useGuestSteps(), { wrapper });
    scrollTo(0, 800);
    expect(takeSteps()).toEqual([]);
  });

  describe('sending', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('sends the steps by themselves after ten seconds on the same page', () => {
      renderHook(() => useGuestSteps(), { wrapper });
      button('run').click();
      button('run-tests').click();
      vi.advanceTimersByTime(9_999);
      expect(reportSteps).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(reportSteps).toHaveBeenCalledWith({ steps: [click('run'), click('run-tests')] });
      expect(takeSteps()).toEqual([]);
    });

    it('sends at once when 30 steps pile up', () => {
      renderHook(() => useGuestSteps(), { wrapper });
      const run = button('run');
      for (let i = 0; i < 30; i++) run.click();
      expect(reportSteps).toHaveBeenCalledTimes(1);
      expect(reportSteps.mock.calls[0][0].steps).toHaveLength(30);
    });

    it('sends what is left when the tab is hidden or closed, and nothing when empty', () => {
      renderHook(() => useGuestSteps(), { wrapper });
      button('run').click();
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      expect(reportSteps).toHaveBeenCalledTimes(1);

      button('hint').click();
      window.dispatchEvent(new Event('pagehide'));
      window.dispatchEvent(new Event('pagehide'));
      expect(reportSteps).toHaveBeenCalledTimes(2);
      expect(reportSteps.mock.calls[1][0]).toEqual({ steps: [click('hint')] });

      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
      button('run').click();
      document.dispatchEvent(new Event('visibilitychange'));
      expect(reportSteps).toHaveBeenCalledTimes(2);
    });

    it('drops a report that failed without a fuss', async () => {
      reportSteps.mockRejectedValue(new Error('offline'));
      renderHook(() => useGuestSteps(), { wrapper });
      button('run').click();
      await act(async () => vi.advanceTimersByTime(10_000));
      expect(reportSteps).toHaveBeenCalledTimes(1);
    });
  });
});
