import { describe, it, expect, afterEach } from 'vitest';
import { attachControls, stickAxis } from './controls';

let detach: (() => void) | null = null;
afterEach(() => {
  detach?.();
  detach = null;
});

const key = (type: 'keydown' | 'keyup', code: string) =>
  document.dispatchEvent(new KeyboardEvent(type, { code }));

describe('stickAxis', () => {
  it('ignores a small pull and eases the rest up to full', () => {
    expect(stickAxis(0.1)).toBe(0);
    expect(stickAxis(-0.1)).toBe(0);
    expect(stickAxis(1)).toBe(1);
    expect(stickAxis(-1)).toBe(-1);
    expect(stickAxis(0.6)).toBeGreaterThan(0);
    expect(stickAxis(0.6)).toBeLessThan(0.6);
    expect(stickAxis(3)).toBe(1);
  });
});

describe('attachControls', () => {
  it('holds a key only while the ship is flying', () => {
    const controls = attachControls(null);
    detach = controls.dispose;
    key('keydown', 'KeyW');
    expect(controls.state.forward).toBe(false);

    controls.setActive(true);
    key('keydown', 'KeyW');
    key('keydown', 'ShiftLeft');
    key('keydown', 'KeyX');
    expect(controls.state).toMatchObject({ forward: true, boost: true });
    key('keyup', 'KeyW');
    expect(controls.state.forward).toBe(false);
  });

  it('lifts the nose with K and drops it with O, as a plane’s stick', () => {
    const controls = attachControls(null);
    detach = controls.dispose;
    controls.setActive(true);
    key('keydown', 'KeyK');
    expect(controls.state).toMatchObject({ up: true, down: false });
    key('keyup', 'KeyK');
    key('keydown', 'KeyO');
    expect(controls.state).toMatchObject({ up: false, down: true });
  });

  it('lets go of everything when the ship stops flying or the window loses focus', () => {
    const controls = attachControls(null);
    detach = controls.dispose;
    controls.setActive(true);
    key('keydown', 'KeyA');
    controls.setActive(false);
    expect(controls.state.left).toBe(false);

    controls.setActive(true);
    key('keydown', 'KeyD');
    window.dispatchEvent(new Event('blur'));
    expect(controls.state.right).toBe(false);
  });

  it('stops listening once disposed', () => {
    const controls = attachControls(null);
    controls.setActive(true);
    controls.dispose();
    key('keydown', 'KeyO');
    expect(controls.state.up).toBe(false);
  });

  it('flies with the throttle buttons and steers with the stick on a touch screen', () => {
    const parts = {
      stick: document.createElement('div'),
      knob: document.createElement('span'),
      throttleUp: document.createElement('button'),
      throttleDown: document.createElement('button'),
    };
    parts.stick.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    const controls = attachControls(parts);
    detach = controls.dispose;
    const pointer = (el: HTMLElement, type: string, x = 0, y = 0) =>
      el.dispatchEvent(
        Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
          pointerId: 1,
          clientX: x,
          clientY: y,
        }),
      );

    pointer(parts.throttleUp, 'pointerdown');
    expect(controls.state.forward).toBe(false); // not flying yet
    controls.setActive(true);
    pointer(parts.throttleUp, 'pointerdown');
    expect(controls.state.forward).toBe(true);
    expect(parts.throttleUp.classList.contains('active')).toBe(true);
    pointer(parts.throttleUp, 'pointerup');
    expect(controls.state.forward).toBe(false);

    pointer(parts.stick, 'pointerdown', 100, 50); // pulled hard right
    expect(controls.state.stickYaw).toBeLessThan(0);
    pointer(parts.stick, 'pointermove', 50, 0); // pulled hard up
    expect(controls.state.stickPitch).toBeGreaterThan(0);
    pointer(parts.stick, 'pointerup');
    expect(controls.state).toMatchObject({ stickYaw: 0, stickPitch: 0 });
    expect(parts.knob.style.transform).toBe('translate(-50%, -50%)');
  });
});
