import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { SCROLL_DEPTHS } from '@cyberstars/shared/visits';
import type { VisitStep } from '@cyberstars/shared/visits';
import { useAuth } from '../context/AuthContext';
import { reportSteps } from '../services/visitsService';
import { isCounted } from '../services/visitCounting';

// A guest's steps wait here for the next page report, which takes them along so
// they land before the page they led to. On a page the guest stays on they go
// by themselves after a while, once there are many, or when the tab is hidden.
// active waits the same way: the guest did something on this page.
const BATCH = 30;
const WAIT_MS = 10_000;
let queue: VisitStep[] = [];
let active = false;
let timer: ReturnType<typeof setTimeout> | undefined;

export function takePending(): { steps: VisitStep[]; active: boolean } {
  clearTimeout(timer);
  timer = undefined;
  const pending = { steps: queue, active };
  queue = [];
  active = false;
  return pending;
}

function sendSteps() {
  const { steps, active: wasActive } = takePending();
  if (steps.length === 0 && !wasActive) return;
  reportSteps(wasActive ? { steps, active: true } : { steps }).catch(() => {});
}

function addStep(step: VisitStep) {
  queue.push(step);
  if (queue.length >= BATCH) sendSteps();
  else timer ??= setTimeout(sendSteps, WAIT_MS);
}

function markActive() {
  active = true;
  timer ??= setTimeout(sendSteps, WAIT_MS);
}

// What only a person does: press, type, scroll with the wheel or touch the
// screen. A scraper that loads pages in a real browser does none of it, and a
// script's own events aren't trusted. Scrolling itself isn't one, since a script
// can scroll the page; a lesson also scrolls in its panel, not the window.
const INPUTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

// The deepest of SCROLL_DEPTHS the window has reached, or 0. A page that fits
// on the screen has nothing to scroll, so it never reaches any.
function reachedDepth(): number {
  const { scrollHeight } = document.documentElement;
  if (scrollHeight <= window.innerHeight) return 0;
  // A point short of the bottom still counts, for screens that scroll by fractions.
  const seen = ((window.scrollY + window.innerHeight) / scrollHeight) * 100 + 1;
  return SCROLL_DEPTHS.filter((depth) => seen >= depth).at(-1) ?? 0;
}

// While a guest is here, every click on something the code names with
// data-track, and how far down each page they scroll, a step only when they
// get deeper; and, once a page, that they did something there. Nothing they
// type or read is taken.
export function useGuestSteps(): void {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();
  const guest = !isLoading && !user && isCounted();

  useEffect(() => {
    if (!guest) return;
    const onClick = (e: MouseEvent) => {
      const name = (e.target as Element).closest?.('[data-track]')?.getAttribute('data-track');
      if (name) addStep({ kind: 'click', target: name });
    };
    const onHidden = () => {
      if (document.visibilityState === 'hidden') sendSteps();
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', sendSteps);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', sendSteps);
    };
  }, [guest]);

  useEffect(() => {
    if (!guest) return;
    let marked = false;
    const onInput = (e: Event) => {
      if (marked || !e.isTrusted) return;
      marked = true;
      markActive();
    };
    for (const type of INPUTS) {
      document.addEventListener(type, onInput, { capture: true, passive: true });
    }
    return () => {
      for (const type of INPUTS) document.removeEventListener(type, onInput, { capture: true });
    };
  }, [guest, pathname]);

  useEffect(() => {
    if (!guest) return;
    let deepest = 0;
    const onScroll = () => {
      const depth = reachedDepth();
      if (depth <= deepest) return;
      deepest = depth;
      addStep({ kind: 'scroll', target: String(depth) });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [guest, pathname]);
}
