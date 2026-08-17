import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  effectiveGraphics,
  isPreviewPath,
  setPreviewAllowed,
  syncGraphicsForRoute,
  useGraphics,
  useGraphicsPreview,
} from './useGraphics';

function goTo(path: string) {
  window.location.hash = `#${path}`;
}

describe('useGraphics', () => {
  beforeEach(() => {
    localStorage.clear();
    goTo('/settings');
    setPreviewAllowed(false);
    syncGraphicsForRoute();
  });

  afterEach(() => {
    setPreviewAllowed(false);
  });

  it('defaults to min and only treats an explicit "max" as max', () => {
    expect(effectiveGraphics()).toBe('min');
    localStorage.setItem('cyberstars.graphics', 'max');
    expect(effectiveGraphics()).toBe('max');
    localStorage.setItem('cyberstars.graphics', 'nonsense');
    expect(effectiveGraphics()).toBe('min');
  });

  it('persists a choice and stamps the attribute', () => {
    const { result } = renderHook(() => useGraphics());
    act(() => result.current[1]('max'));

    expect(localStorage.getItem('cyberstars.graphics')).toBe('max');
    expect(document.documentElement.dataset.graphics).toBe('max');
    expect(result.current[0]).toBe('max');
  });

  it('knows which paths carry the guest preview', () => {
    expect(isPreviewPath('/')).toBe(true);
    expect(isPreviewPath('/getstarted')).toBe(true);
    expect(isPreviewPath('/courses')).toBe(false);
    expect(isPreviewPath('/settings')).toBe(false);
  });

  describe('guest preview', () => {
    beforeEach(() => {
      localStorage.setItem('cyberstars.graphics', 'max');
      setPreviewAllowed(true);
    });

    it('opens the public routes in min whatever is stored', () => {
      goTo('/');
      expect(effectiveGraphics()).toBe('min');
      goTo('/getstarted');
      expect(effectiveGraphics()).toBe('min');
    });

    it('leaves the stored choice alone everywhere else', () => {
      goTo('/courses');
      expect(effectiveGraphics()).toBe('max');
    });

    it('previews without writing to storage', () => {
      goTo('/');
      const { result } = renderHook(() => useGraphicsPreview());
      act(() => result.current[1]('max'));

      expect(result.current[0]).toBe('max');
      expect(document.documentElement.dataset.graphics).toBe('max');
      // The whole point: settings are untouched.
      expect(localStorage.getItem('cyberstars.graphics')).toBe('max');

      localStorage.setItem('cyberstars.graphics', 'min');
      act(() => result.current[1]('max'));
      expect(localStorage.getItem('cyberstars.graphics')).toBe('min');
    });

    it('drops the preview when the route changes', () => {
      goTo('/');
      const { result } = renderHook(() => useGraphicsPreview());
      act(() => result.current[1]('max'));
      expect(effectiveGraphics()).toBe('max');

      goTo('/getstarted');
      act(() => syncGraphicsForRoute());
      expect(effectiveGraphics()).toBe('min');
    });

    it('hands the public routes back to the stored choice once someone signs in', () => {
      goTo('/');
      expect(effectiveGraphics()).toBe('min');

      act(() => setPreviewAllowed(false));
      expect(effectiveGraphics()).toBe('max');
      expect(document.documentElement.dataset.graphics).toBe('max');
    });
  });
});
