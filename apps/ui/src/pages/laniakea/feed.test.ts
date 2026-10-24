import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createFeed, useFeed } from './feed';

describe('createFeed', () => {
  it('tells its listeners about a new value, and stays quiet for the same one', () => {
    const feed = createFeed(1);
    const listener = vi.fn();
    const stop = feed.subscribe(listener);
    feed.set(1);
    feed.set(2);
    expect(feed.get()).toBe(2);
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
    feed.set(3);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('takes its own idea of the same value', () => {
    const feed = createFeed({ n: 1 }, (a, b) => a.n === b.n);
    const listener = vi.fn();
    feed.subscribe(listener);
    feed.set({ n: 1 });
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('useFeed', () => {
  it('renders the latest value', () => {
    const feed = createFeed('a');
    const { result } = renderHook(() => useFeed(feed));
    expect(result.current).toBe('a');
    act(() => feed.set('b'));
    expect(result.current).toBe('b');
  });
});
