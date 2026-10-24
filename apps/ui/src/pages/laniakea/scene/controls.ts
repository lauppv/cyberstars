// The ship's controls. On a keyboard: W/S fly forward and back, A/D turn, K
// lifts the nose and O drops it, as a plane's stick pulled back and pushed,
// Shift holds the boost. On a touch screen: a stick on the right steers
// and two buttons on the left hold the throttle. Everything else (landing,
// pausing, the board) belongs to the page.
export interface ControlState {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  boost: boolean;
  // The stick's pull, -1 to 1 for each axis, already eased.
  stickYaw: number;
  stickPitch: number;
}

export interface TouchParts {
  stick: HTMLElement;
  knob: HTMLElement;
  throttleUp: HTMLElement;
  throttleDown: HTMLElement;
}

const KEYS: Record<string, keyof ControlState> = {
  KeyW: 'forward',
  KeyS: 'back',
  KeyA: 'left',
  KeyD: 'right',
  KeyK: 'up',
  KeyO: 'down',
  ShiftLeft: 'boost',
  ShiftRight: 'boost',
};

// The stick travels little, so a dead zone and a steep curve keep fine control
// near the middle and full speed only at the rim.
const STICK_R = 46;
const STICK_DEAD = 0.22;
const STICK_EXP = 2.4;

export function stickAxis(n: number): number {
  const a = Math.abs(n);
  if (a < STICK_DEAD) return 0;
  return Math.sign(n) * Math.pow((Math.min(a, 1) - STICK_DEAD) / (1 - STICK_DEAD), STICK_EXP);
}

export function attachControls(touch: TouchParts | null): {
  state: ControlState;
  setActive: (active: boolean) => void;
  dispose: () => void;
} {
  const state: ControlState = {
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
    stickYaw: 0,
    stickPitch: 0,
  };
  let active = false;
  const release = () => {
    for (const key of Object.values(KEYS)) (state[key] as boolean) = false;
    state.stickYaw = 0;
    state.stickPitch = 0;
  };

  const onKey = (down: boolean) => (e: KeyboardEvent) => {
    const key = KEYS[e.code];
    if (!key) return;
    // a key let go always counts, so nothing stays held while the game waits
    if (down && !active) return;
    (state[key] as boolean) = down;
  };
  const keyDown = onKey(true);
  const keyUp = onKey(false);
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
  window.addEventListener('blur', release);

  const undo: (() => void)[] = [];
  if (touch) {
    let stickId = -1;
    const centre = () => {
      touch.knob.style.transform = 'translate(-50%, -50%)';
      state.stickYaw = 0;
      state.stickPitch = 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== stickId) return;
      const r = touch.stick.getBoundingClientRect();
      const offX = e.clientX - (r.left + r.width / 2);
      const offY = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(offX, offY);
      const k = len > STICK_R ? STICK_R / len : 1;
      touch.knob.style.transform = `translate(calc(-50% + ${offX * k}px), calc(-50% + ${offY * k}px))`;
      state.stickYaw = -stickAxis((offX * k) / STICK_R);
      state.stickPitch = -stickAxis((offY * k) / STICK_R);
      e.preventDefault();
    };
    const end = (e: PointerEvent) => {
      if (e.pointerId !== stickId) return;
      stickId = -1;
      centre();
    };
    const start = (e: PointerEvent) => {
      if (!active) return;
      stickId = e.pointerId;
      touch.stick.setPointerCapture?.(e.pointerId);
      move(e);
    };
    const hold = (btn: HTMLElement, key: 'forward' | 'back') => {
      const press = (e: PointerEvent) => {
        if (!active) return;
        state[key] = true;
        btn.classList.add('active');
        btn.setPointerCapture?.(e.pointerId);
        e.preventDefault();
      };
      const letGo = () => {
        state[key] = false;
        btn.classList.remove('active');
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', letGo);
      btn.addEventListener('pointercancel', letGo);
      btn.addEventListener('pointerleave', letGo);
      undo.push(() => {
        btn.removeEventListener('pointerdown', press);
        btn.removeEventListener('pointerup', letGo);
        btn.removeEventListener('pointercancel', letGo);
        btn.removeEventListener('pointerleave', letGo);
      });
    };
    touch.stick.addEventListener('pointerdown', start);
    touch.stick.addEventListener('pointermove', move);
    touch.stick.addEventListener('pointerup', end);
    touch.stick.addEventListener('pointercancel', end);
    undo.push(() => {
      touch.stick.removeEventListener('pointerdown', start);
      touch.stick.removeEventListener('pointermove', move);
      touch.stick.removeEventListener('pointerup', end);
      touch.stick.removeEventListener('pointercancel', end);
    });
    hold(touch.throttleUp, 'forward');
    hold(touch.throttleDown, 'back');
  }

  return {
    state,
    setActive(next) {
      active = next;
      if (!next) release();
    },
    dispose() {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', release);
      undo.forEach((u) => u());
    },
  };
}
