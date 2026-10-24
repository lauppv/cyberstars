import { useSyncExternalStore } from 'react';

// A value the 3D scene sends many times a second (the ship's pose, what it aims
// at). Only the overlays that show it subscribe, so the rest of the page never
// renders again for it.
export interface Feed<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createFeed<T>(initial: T, same: (a: T, b: T) => boolean = Object.is): Feed<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next) {
      if (same(value, next)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useFeed<T>(feed: Feed<T>): T {
  return useSyncExternalStore(feed.subscribe, feed.get, feed.get);
}
