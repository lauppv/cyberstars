import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getState, getSummary, consume, _resetAll } from './usage.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { USAGE_LIMITS, USAGE_WINDOW_MS } from '../../shared/usage.js';

beforeEach(() => _resetAll());
afterEach(() => vi.useRealTimers());

describe('usage.service — non-admin', () => {
  it('starts with a full budget and no window', () => {
    const state = getState(1, 'showSolution', false);
    expect(state).toMatchObject({
      used: 0,
      limit: USAGE_LIMITS.showSolution,
      remaining: USAGE_LIMITS.showSolution,
      resetAt: null,
      unlimited: false,
    });
  });

  it('consume increments and exposes a resetAt', () => {
    const summary = consume(1, 'showSolution', false);
    expect(summary.showSolution.used).toBe(1);
    expect(summary.showSolution.remaining).toBe(USAGE_LIMITS.showSolution - 1);
    expect(summary.showSolution.resetAt).not.toBeNull();
  });

  it('throws 429 once the limit is reached', () => {
    for (let i = 0; i < USAGE_LIMITS.getHint; i++) consume(2, 'getHint', false);
    expect(() => consume(2, 'getHint', false)).toThrow(AppError);
    try {
      consume(2, 'getHint', false);
    } catch (err) {
      expect((err as AppError).statusCode).toBe(429);
    }
  });

  it('keeps actions independent', () => {
    consume(3, 'getHint', false);
    expect(getState(3, 'showSolution', false).used).toBe(0);
    expect(getState(3, 'getHint', false).used).toBe(1);
  });

  it('resets after the rolling window elapses', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    consume(4, 'showSolution', false);
    expect(getState(4, 'showSolution', false).used).toBe(1);
    vi.setSystemTime(new Date(Date.now() + USAGE_WINDOW_MS + 1000));
    expect(getState(4, 'showSolution', false).used).toBe(0);
    // A fresh consume opens a new window rather than reusing the elapsed one.
    expect(consume(4, 'showSolution', false).showSolution.used).toBe(1);
  });
});

describe('usage.service — admin', () => {
  it('is always unlimited and never consumes', () => {
    const summary = consume(9, 'getHint', true);
    expect(summary.getHint).toMatchObject({ unlimited: true, remaining: Infinity, resetAt: null });
    // Even at "limit", admin never throws.
    for (let i = 0; i < USAGE_LIMITS.getHint + 5; i++) {
      expect(() => consume(9, 'getHint', true)).not.toThrow();
    }
  });
});

describe('getSummary', () => {
  it('reports both actions', () => {
    consume(7, 'getHint', false);
    const summary = getSummary(7, false);
    expect(summary.getHint.used).toBe(1);
    expect(summary.showSolution.used).toBe(0);
  });
});
