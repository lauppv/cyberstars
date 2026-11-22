import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RankCrown } from './RankCrown';
import { CROWNS, type CrownShape } from './crowns';

const svg = (rank: number) => render(<RankCrown rank={rank} />).container.querySelector('svg')!;

// The drawing without the per-render gradient ids, so two crowns compare by their shapes only:
// url(#crown<id>m) -> url(#m), and the matching id="crown<id>m" attributes are blanked
const drawing = (rank: number) =>
  svg(rank)
    .innerHTML.replace(/url\(#crown[a-zA-Z0-9]*([mvh])\)/g, 'url(#$1)')
    .replace(/id="crown[a-zA-Z0-9]+"/g, 'id=""');

// Outlines only grow on the way up: more points, then a taller middle spire, then sharp spikes
const SHAPE_ORDER: CrownShape[] = ['circlet', 'arc', 'spire', 'royal'];

// Whether one crown paints anything with the gradient whose id ends in `suffix` (m/v/h)
const gradientFills = (rank: number, suffix: string) =>
  [...svg(rank).querySelectorAll('[fill]')].some((el) => {
    const fill = el.getAttribute('fill') ?? '';
    return fill.startsWith('url(#') && fill.endsWith(`${suffix})`);
  });

describe('RankCrown', () => {
  it('draws a different crown for each of the ten places', () => {
    expect(CROWNS.map((_, i) => svg(i + 1).dataset.crown)).toEqual(
      CROWNS.map((_, i) => String(i + 1)),
    );
    expect(new Set(CROWNS.map((_, i) => drawing(i + 1))).size).toBe(10);
  });

  it('climbs by exactly one change per place and never takes a feature away', () => {
    for (let place = 1; place < CROWNS.length; place++) {
      const [above, below] = [CROWNS[place - 1], CROWNS[place]];
      const keys = new Set([...Object.keys(above), ...Object.keys(below)]);
      const changed = [...keys].filter(
        (k) => above[k as keyof typeof above] !== below[k as keyof typeof below],
      );
      expect(changed, `place ${place} over place ${place + 1}`).toHaveLength(1);
      // the outline only grows, and so does the metal (checked by group below)
      expect(SHAPE_ORDER.indexOf(above.shape)).toBeGreaterThanOrEqual(
        SHAPE_ORDER.indexOf(below.shape),
      );
      for (const flag of ['violetBand', 'violetTips', 'regalia', 'coronation'] as const) {
        if (below[flag]) expect(above[flag]).toBe(true);
      }
    }
  });

  it('wears bronze at places 10-8, silver at 7-5 and gold at 4-1', () => {
    const metals = CROWNS.map((c) => c.metal); // index 0 is place 1
    const gold = metals[0];
    const silver = metals[4];
    const bronze = metals[9];
    expect(metals.slice(0, 4).every((m) => m === gold)).toBe(true);
    expect(metals.slice(4, 7).every((m) => m === silver)).toBe(true);
    expect(metals.slice(7).every((m) => m === bronze)).toBe(true);
    expect(new Set([gold, silver, bronze]).size).toBe(3);
  });

  it('keeps the crowns of one metal distinct at their real size (28-34 px)', () => {
    for (const group of [
      [1, 2, 3, 4],
      [5, 6, 7],
      [8, 9, 10],
    ]) {
      expect(new Set(group.map(drawing)).size).toBe(group.length);
    }
  });

  it('grows a little with each place up', () => {
    const sizes = CROWNS.map((_, i) => Number(svg(i + 1).getAttribute('height')));
    expect(sizes[0]).toBe(34);
    expect(sizes[9]).toBe(28);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });

  it('sets the orb and the sceptre beside places 1 and 2 only, in a wider box', () => {
    const held = CROWNS.map((_, i) => svg(i + 1).querySelector('[data-regalia]') !== null);
    expect(held).toEqual([true, true, false, false, false, false, false, false, false, false]);
    const wide = svg(2);
    expect(Number(wide.getAttribute('width'))).toBeGreaterThan(Number(wide.getAttribute('height')));
    expect(svg(3).getAttribute('width')).toBe(svg(3).getAttribute('height'));
  });

  it('crowns only place 1 with the brand star and the halo', () => {
    expect(svg(1).querySelector('polygon')).not.toBeNull();
    for (let place = 1; place <= CROWNS.length; place++) {
      expect(svg(place).querySelector('polygon') !== null).toBe(place === 1);
      expect(gradientFills(place, 'h')).toBe(place === 1);
    }
  });

  it('sets stones and details in the brand violet from place 8 up', () => {
    for (let place = 1; place <= CROWNS.length; place++) {
      expect(gradientFills(place, 'v'), `place ${place}`).toBe(place <= 8);
    }
  });

  it('points each crown at its own gradients', () => {
    const { container } = render(
      <>
        <RankCrown rank={1} />
        <RankCrown rank={2} />
      </>,
    );
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
