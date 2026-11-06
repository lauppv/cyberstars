import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BadgeEmblem } from './BadgeEmblem';

const stops = (container: HTMLElement) =>
  [...container.querySelectorAll('stop')].map((s) => s.getAttribute('stop-color'));

describe('BadgeEmblem', () => {
  it('colours the frame by level and keeps the last frame past Legend', () => {
    const gold = render(<BadgeEmblem courseKey="python" level={3} />).container;
    const legend = render(<BadgeEmblem courseKey="python" level={6} />).container;
    const past = render(<BadgeEmblem courseKey="python" level={9} />).container;
    expect(stops(gold)).not.toEqual(stops(legend));
    expect(stops(past)).toEqual(stops(legend));
  });

  it("gives an algorithm course its language's symbol and the decision pip", () => {
    const plain = render(<BadgeEmblem courseKey="java" level={1} />).container;
    const algo = render(<BadgeEmblem courseKey="algo-java" level={1} />).container;
    expect(algo.querySelector('g')!.innerHTML).toBe(plain.querySelector('g')!.innerHTML);
    expect(plain.querySelectorAll('circle')).toHaveLength(0);
    expect(algo.querySelectorAll('circle')).toHaveLength(2);
  });

  it('falls back to a star for a course it has no symbol for', () => {
    const unknown = render(<BadgeEmblem courseKey="rust" level={0} />).container;
    const python = render(<BadgeEmblem courseKey="python" level={0} />).container;
    expect(unknown.querySelector('g')!.innerHTML).not.toBe(python.querySelector('g')!.innerHTML);
    expect(unknown.querySelector('g path')).not.toBeNull();
  });

  it('points each frame at its own gradient', () => {
    const { container } = render(
      <>
        <BadgeEmblem courseKey="c" level={1} />
        <BadgeEmblem courseKey="c" level={2} />
      </>,
    );
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(new Set(ids).size).toBe(2);
    const fills = [...container.querySelectorAll('polygon:first-of-type')].map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(ids.map((id) => `url(#${id})`));
  });
});
