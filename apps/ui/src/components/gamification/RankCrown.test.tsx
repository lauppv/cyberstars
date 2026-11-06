import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RankCrown } from './RankCrown';
import { CROWNS } from './crowns';

const svg = (rank: number) => render(<RankCrown rank={rank} />).container.querySelector('svg')!;

describe('RankCrown', () => {
  it('gives each of the ten places a crown of its own shape', () => {
    const designs = CROWNS.map((_, i) => svg(i + 1).dataset.crown);
    expect(designs).toEqual([
      'stars',
      'fleur',
      'tiara',
      'petals',
      'imperial',
      'radiant',
      'balls',
      'mural',
      'laurel',
      'wood',
    ]);
    const drawings = CROWNS.map((_, i) => svg(i + 1).innerHTML.replace(/crown[a-zA-Z0-9]+/g, ''));
    expect(new Set(drawings).size).toBe(10);
  });

  it('grows a little with each place up', () => {
    const sizes = CROWNS.map((_, i) => Number(svg(i + 1).getAttribute('width')));
    expect(sizes[0]).toBe(30);
    expect(sizes[9]).toBe(24);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });

  it('puts the brand star on the top crown only', () => {
    expect(svg(1).querySelector('polygon')).not.toBeNull();
    expect(svg(2).querySelector('polygon')).toBeNull();
  });

  it('draws the laurels as leaves, not points', () => {
    expect(svg(9).querySelectorAll('ellipse').length).toBeGreaterThan(10);
    expect(svg(9).querySelector('rect')).toBeNull();
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
