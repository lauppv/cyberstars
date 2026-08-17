import { useCallback, useEffect, useState } from 'react';

// Site-wide graphics mode.
//
//   min — flat surfaces, neutral borders, no starfield, no decorative emoji.
//   max — the cosmos starfield, glass panels, purple borders and emoji.
//
// Almost all of the difference is carried by CSS custom properties, keyed off a
// `data-graphics` attribute stamped on <html> (see index.css). Components only
// need this hook for the handful of genuine either/or swaps — an avatar
// fallback, a medal vs. a rank number — where one look is not the other's
// decoration removed but a different element entirely.

export type GraphicsMode = 'min' | 'max';

const STORAGE_KEY = 'cyberstars.graphics';
const CHANGE_EVENT = 'cyberstars:graphicschange';
const DEFAULT_GRAPHICS: GraphicsMode = 'min';

export function readGraphics(): GraphicsMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'max' ? 'max' : DEFAULT_GRAPHICS;
  } catch {
    return DEFAULT_GRAPHICS;
  }
}

// Stamp the attribute the stylesheet keys off. Called once at boot (before
// React mounts, so the first paint is already in the right mode) and again on
// every change.
export function applyGraphics(mode: GraphicsMode) {
  document.documentElement.dataset.graphics = mode;
}

export function useGraphics(): [GraphicsMode, (next: GraphicsMode) => void] {
  const [mode, setMode] = useState<GraphicsMode>(readGraphics);

  useEffect(() => {
    const sync = () => setMode(readGraphics());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((next: GraphicsMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be blocked; still fan out the in-memory change
    }
    applyGraphics(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [mode, update];
}
