import { useCallback, useEffect, useReducer } from 'react';

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

// The two routes reachable without an account. For a signed-out visitor they
// always open in min whatever is left in storage, and carry their own toggle —
// they are where someone finds out the choice exists, so they show the quiet
// look first and let the person discover the loud one.
const PREVIEW_ROUTES = new Set(['/', '/getstarted']);

// Set while the visitor plays with the toggle on a preview route. Deliberately
// module state and never written to storage: it must not leak into what the
// person has chosen in settings, and it resets on navigation.
let preview: GraphicsMode | null = null;

// Whether the preview layer applies at all. Only true for a confirmed guest:
// someone with an account has made their choice in settings and it must hold on
// every page, including the home dashboard. Left false while auth is still
// loading, so a signed-in person never flashes the guest look on the way in.
let previewAllowed = false;

function currentPathname(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.split('?')[0] || '/';
}

/**
 * Whether this path is one of the guest preview routes. Route only — callers
 * that render UI should pair it with their own check that the viewer is a
 * guest, rather than depending on when `setPreviewAllowed` last ran.
 */
export function isPreviewPath(pathname: string): boolean {
  return PREVIEW_ROUTES.has(pathname);
}

/** Whether the preview is actually in force right now: route and audience. */
function previewApplies(): boolean {
  return previewAllowed && isPreviewPath(currentPathname());
}

/** The mode stored in settings — what the person actually chose. */
function readGraphics(): GraphicsMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'max' ? 'max' : DEFAULT_GRAPHICS;
  } catch {
    return DEFAULT_GRAPHICS;
  }
}

/** The mode to actually render in: the preview layer wins on public routes. */
export function effectiveGraphics(): GraphicsMode {
  if (previewApplies()) return preview ?? DEFAULT_GRAPHICS;
  return readGraphics();
}

// Stamp the attribute the stylesheet keys off. Called once at boot (before
// React mounts, so the first paint is already in the right mode) and again on
// every change.
export function applyGraphics(mode: GraphicsMode) {
  document.documentElement.dataset.graphics = mode;
}

function announce() {
  applyGraphics(effectiveGraphics());
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Called from the app root as auth resolves. */
export function setPreviewAllowed(allowed: boolean) {
  if (allowed === previewAllowed) return;
  previewAllowed = allowed;
  preview = null;
  announce();
}

/**
 * Drop the preview layer and re-sync — called when the route changes.
 *
 * The announce matters: subscribers render before this runs, so on a move
 * between routes they still see the outgoing preview. Without the event they
 * would keep it (a starfield left behind on a page that is meant to be min).
 */
export function syncGraphicsForRoute() {
  preview = null;
  announce();
}

function useGraphicsSubscription() {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    window.addEventListener(CHANGE_EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(CHANGE_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
}

/**
 * The mode to render in, plus the setter that persists a choice. Used by
 * settings and by the few components that genuinely swap elements between
 * modes. The value is read fresh on every render, so a route change into or out
 * of a preview route is picked up without its own subscription.
 */
export function useGraphics(): [GraphicsMode, (next: GraphicsMode) => void] {
  useGraphicsSubscription();

  const update = useCallback((next: GraphicsMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be blocked; still fan out the in-memory change
    }
    announce();
  }, []);

  return [effectiveGraphics(), update];
}

/**
 * The toggle shown on the public routes. Flipping it changes only what this
 * visit looks like — nothing is written to storage and settings are untouched.
 */
export function useGraphicsPreview(): [GraphicsMode, (next: GraphicsMode) => void] {
  useGraphicsSubscription();

  const update = useCallback((next: GraphicsMode) => {
    preview = next;
    announce();
  }, []);

  return [effectiveGraphics(), update];
}
