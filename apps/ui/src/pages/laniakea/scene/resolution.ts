// How finely the scene draws, as a share of the screen's pixels: at most
// MAX_RATIO, so a HiDPI screen doesn't draw four times the pixels, and lower, a
// step at a time, while frames keep coming slower than SLOW_MS, down to
// MIN_RATIO. It never climbs back, so it can't swing up and down.
const MAX_RATIO = 1.5;
const MIN_RATIO = 0.5;
const STEP = 0.8;
// Under about 40 frames a second, judged over WINDOW frames
const SLOW_MS = 25;
const WINDOW = 60;
// A longer frame is the tab coming back or a shader compiling, not the scene
const GAP_MS = 250;

export function createResolution(devicePixelRatio: number): {
  ratio: number;
  frame: (ms: number) => number | null;
} {
  let ratio = Math.min(devicePixelRatio, MAX_RATIO);
  let sum = 0;
  let count = 0;
  return {
    ratio,
    // A frame took `ms`: the new ratio when the scene should draw coarser, else null
    frame(ms) {
      if (ms > GAP_MS) return null;
      sum += ms;
      if (++count < WINDOW) return null;
      const slow = sum / count > SLOW_MS;
      sum = 0;
      count = 0;
      if (!slow || ratio <= MIN_RATIO) return null;
      ratio = Math.max(MIN_RATIO, ratio * STEP);
      return ratio;
    },
  };
}
