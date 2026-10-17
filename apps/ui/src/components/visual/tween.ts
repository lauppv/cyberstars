import { useEffect, useState } from 'react';

// How a drawing moves from one step to the next, shared by the drawings that redraw themselves
// frame by frame (boxes and arrows, trees)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

// The step on screen and the one it comes from, with how far along the move between them is. A
// move of one step plays over the speed picked; a jump (Start over) or reduced motion puts
// everything in place at once
export function useTween(step: number, ms: number) {
  const [tween, setTween] = useState({ from: step, to: step, t: 1 });
  if (tween.to !== step) {
    const plays =
      Math.abs(step - tween.to) === 1 &&
      typeof requestAnimationFrame === 'function' &&
      !prefersReducedMotion();
    setTween({ from: plays ? tween.to : step, to: step, t: plays ? 0 : 1 });
  }
  const { from, to } = tween;
  useEffect(() => {
    if (from === to) return;
    let id = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const t = Math.min(1, (now - start) / ms);
      setTween((tw) =>
        tw.from !== from || tw.to !== to ? tw : t < 1 ? { ...tw, t } : { from: to, to, t: 1 },
      );
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [from, to, ms]);
  return tween;
}

// A move plays in up to three beats, each only when there is something to it: what goes fades
// out, then what stays slides to its new place, then what comes fades in. Gives how far along each
// beat is at `t`, 1 for a beat left out
export function beats(needed: [out: boolean, move: boolean, come: boolean], t: number) {
  const count = needed.filter(Boolean).length;
  let start = 0;
  return needed.map((n) => {
    if (!n) return 1;
    const p = Math.min(1, Math.max(0, (t - start) * count));
    start += 1 / count;
    return p;
  });
}
