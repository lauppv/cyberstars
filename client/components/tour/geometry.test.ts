import { describe, it, expect, afterEach } from 'vitest';
import { holeFor, mergeHoles, placeCard, roundedRect } from './geometry';

const VW = 1200;
const VH = 800;

function box(el: Element, left: number, top: number, width: number, height: number) {
  el.getBoundingClientRect = () =>
    ({ left, top, right: left + width, bottom: top + height, width, height }) as DOMRect;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('placeCard', () => {
  it('centres the card when nothing is lit', () => {
    expect(placeCard([], 300, 200, VW, VH)).toEqual({ x: 450, y: 300 });
  });

  it('sits beside the target when there is room on the right', () => {
    const hole = { x: 100, y: 100, w: 400, h: 200 };
    expect(placeCard([hole], 300, 200, VW, VH)).toEqual({ x: 512, y: 100 });
  });

  it('goes left of a target that fills the right side', () => {
    const hole = { x: 600, y: 60, w: 600, h: 740 };
    expect(placeCard([hole], 300, 200, VW, VH)).toEqual({ x: 288, y: 60 });
  });

  it('never covers a second target while a corner is free', () => {
    const workspace = { x: 600, y: 60, w: 600, h: 740 };
    const mission = { x: 250, y: 60, w: 340, h: 400 };
    const pos = placeCard([workspace, mission], 300, 200, VW, VH);
    expect(pos).toEqual({ x: 16, y: 584 });
  });

  it('docks at the bottom when the targets leave no room', () => {
    const hole = { x: 0, y: 100, w: VW, h: 700 };
    expect(placeCard([hole], 300, 200, VW, VH)).toEqual({ x: 450, y: 584 });
  });
});

describe('mergeHoles', () => {
  it('leaves apart holes alone', () => {
    const a = { x: 0, y: 0, w: 100, h: 100 };
    const b = { x: 200, y: 0, w: 100, h: 100 };
    expect(mergeHoles([a, b])).toEqual([a, b]);
  });

  it('joins overlapping holes, including one reached only after a join', () => {
    const tabs = { x: 0, y: 40, w: 390, h: 60 };
    const far = { x: 0, y: 160, w: 390, h: 40 };
    const workspace = { x: 0, y: 94, w: 390, h: 70 };
    expect(mergeHoles([tabs, far, workspace])).toEqual([{ x: 0, y: 40, w: 390, h: 160 }]);
  });
});

describe('holeFor', () => {
  it('pads the union of a group of elements', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    box(a, 100, 100, 200, 50);
    box(b, 100, 160, 300, 50);
    expect(holeFor([a, b])).toEqual({ x: 94, y: 94, w: 312, h: 122 });
  });

  it('clips an element to its scrolling parent', () => {
    const parent = document.createElement('div');
    parent.style.overflowY = 'auto';
    const child = document.createElement('div');
    parent.append(child);
    document.body.append(parent);
    box(parent, 0, 100, 500, 300);
    box(child, 50, 350, 200, 200);
    expect(holeFor([child])).toEqual({ x: 44, y: 344, w: 212, h: 62 });
  });

  it('has no hole for an element that is not on screen', () => {
    const el = document.createElement('div');
    document.body.append(el);
    box(el, 0, 0, 0, 0);
    expect(holeFor([el])).toBeNull();
  });
});

describe('roundedRect', () => {
  it('draws a closed path around the rectangle', () => {
    const d = roundedRect({ x: 10, y: 20, w: 100, h: 50 });
    expect(d.startsWith('M18 20H102')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
  });
});
