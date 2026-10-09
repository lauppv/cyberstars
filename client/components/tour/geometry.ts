export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PAD = 6;
const GAP = 12;
const EDGE = 16;
export const RADIUS = 8;

const CLIPS = /auto|scroll|hidden|clip/;

// The part of an element actually on screen, after every scrolling ancestor
// and the viewport have clipped it. Null when nothing of it shows.
function visibleRect(el: Element): Rect | null {
  const r = el.getBoundingClientRect();
  let left = r.left;
  let top = r.top;
  let right = r.right;
  let bottom = r.bottom;
  for (let p = el.parentElement; p; p = p.parentElement) {
    const style = getComputedStyle(p);
    if (!CLIPS.test(style.overflowX) && !CLIPS.test(style.overflowY)) continue;
    const pr = p.getBoundingClientRect();
    left = Math.max(left, pr.left);
    top = Math.max(top, pr.top);
    right = Math.min(right, pr.right);
    bottom = Math.min(bottom, pr.bottom);
  }
  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);
  if (right - left < 1 || bottom - top < 1) return null;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

export function holeFor(group: Element[]): Rect | null {
  const rects = group.map(visibleRect).filter((r): r is Rect => r !== null);
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.x)) - PAD;
  const top = Math.min(...rects.map((r) => r.y)) - PAD;
  const right = Math.max(...rects.map((r) => r.x + r.w)) + PAD;
  const bottom = Math.max(...rects.map((r) => r.y + r.h)) + PAD;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

// Where the card goes: beside the first hole if there is room, else in a
// free corner, else docked to the edge away from the first hole. It never
// covers a hole while a free spot exists.
export function placeCard(
  holes: Rect[],
  w: number,
  h: number,
  vw: number,
  vh: number,
): { x: number; y: number } {
  const clampX = (x: number) => Math.min(Math.max(x, EDGE), vw - w - EDGE);
  const clampY = (y: number) => Math.min(Math.max(y, EDGE), vh - h - EDGE);
  const main = holes[0];
  if (!main) return { x: clampX((vw - w) / 2), y: clampY((vh - h) / 2) };
  const fits = (x: number, y: number) =>
    x >= EDGE &&
    y >= EDGE &&
    x + w <= vw - EDGE &&
    y + h <= vh - EDGE &&
    holes.every((r) => x + w <= r.x || x >= r.x + r.w || y + h <= r.y || y >= r.y + r.h);
  const candidates: [number, number][] = [
    [main.x + main.w + GAP, clampY(main.y)],
    [main.x - GAP - w, clampY(main.y)],
    [clampX(main.x), main.y + main.h + GAP],
    [clampX(main.x), main.y - GAP - h],
    [EDGE, vh - h - EDGE],
    [vw - w - EDGE, vh - h - EDGE],
    [EDGE, EDGE],
    [vw - w - EDGE, EDGE],
  ];
  for (const [x, y] of candidates) if (fits(x, y)) return { x, y };
  const mainInTopHalf = main.y + main.h / 2 < vh / 2;
  return { x: clampX((vw - w) / 2), y: mainInTopHalf ? vh - h - EDGE : EDGE };
}

export function roundedRect({ x, y, w, h }: Rect): string {
  const r = Math.min(RADIUS, w / 2, h / 2);
  return (
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}` +
    `V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}
