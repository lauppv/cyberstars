import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RankRegalia } from './RankRegalia';

const drawing = (rank: number) =>
  render(
    <RankRegalia rank={rank}>
      <i data-testid="crown" />
    </RankRegalia>,
  ).container;

describe('RankRegalia', () => {
  it('sets a different insignia behind the crown for each of places 1 to 5', () => {
    const svgs = [1, 2, 3, 4, 5].map((rank) => drawing(rank).querySelector('svg')!);
    expect(svgs.map((svg) => svg.dataset.regalia)).toEqual(['1', '2', '3', '4', '5']);
    const shapes = svgs.map((svg) => svg.innerHTML.replace(/regalia[a-zA-Z0-9]+/g, ''));
    expect(new Set(shapes).size).toBe(5);
  });

  it('keeps the crown in front of its insignia', () => {
    const box = drawing(1).firstElementChild!;
    expect(box.children[0].tagName.toLowerCase()).toBe('svg');
    expect(box.children[1].querySelector('[data-testid="crown"]')).not.toBeNull();
  });

  it('leaves any other place with the crown alone', () => {
    for (const rank of [0, 6, 10]) {
      const box = drawing(rank);
      expect(box.querySelector('svg')).toBeNull();
      expect(box.querySelector('[data-testid="crown"]')).not.toBeNull();
    }
  });
});
