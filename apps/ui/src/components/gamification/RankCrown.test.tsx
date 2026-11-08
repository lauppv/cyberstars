import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RankCrown } from './RankCrown';
import { CROWNS } from './crowns';

const svg = (rank: number) => render(<RankCrown rank={rank} />).container.querySelector('svg')!;

describe('RankCrown', () => {
  it('draws a different crown for each of the ten places', () => {
    expect(CROWNS.map((_, i) => svg(i + 1).dataset.crown)).toEqual(
      CROWNS.map((_, i) => String(i + 1)),
    );
    const drawings = CROWNS.map((_, i) => svg(i + 1).innerHTML.replace(/crown[a-zA-Z0-9]+/g, ''));
    expect(new Set(drawings).size).toBe(10);
  });

  it('only adds on the way up: every crown has what the one below it has', () => {
    for (let place = 1; place < CROWNS.length; place++) {
      const [above, below] = [CROWNS[place - 1], CROWNS[place]];
      if (below.violetBand) expect(above.violetBand).toBe(true);
      if (below.violetTips) expect(above.violetTips).toBe(true);
      if (below.regalia) expect(above.regalia).toBe(true);
      if (below.aura) expect(above.aura).toBeDefined();
      if (below.shape === 'spiky') expect(above.shape).toBe('spiky');
    }
  });

  it('grows a little with each place up', () => {
    const sizes = CROWNS.map((_, i) => Number(svg(i + 1).getAttribute('height')));
    expect(sizes[0]).toBe(34);
    expect(sizes[9]).toBe(28);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });

  it('sets the orb and the sceptre beside places 1 to 3 only, in a wider box', () => {
    const held = CROWNS.map((_, i) => svg(i + 1).querySelector('[data-regalia]') !== null);
    expect(held).toEqual([true, true, true, false, false, false, false, false, false, false]);
    const wide = svg(3);
    expect(Number(wide.getAttribute('width'))).toBeGreaterThan(Number(wide.getAttribute('height')));
    expect(svg(4).getAttribute('width')).toBe(svg(4).getAttribute('height'));
  });

  it('puts the brand star on the top crown only', () => {
    expect(svg(1).querySelector('polygon')).not.toBeNull();
    expect(svg(2).querySelector('polygon')).toBeNull();
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
