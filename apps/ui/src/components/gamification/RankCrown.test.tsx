import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RankCrown } from './RankCrown';
import { TIERS } from './badgeMeta';

const mid = (rank: number) =>
  render(<RankCrown rank={rank} />)
    .container.querySelectorAll('stop')[1]
    .getAttribute('stop-color');

describe('RankCrown', () => {
  it("gives places 1, 2 and 3 the badges' gold, silver and bronze", () => {
    expect([mid(1), mid(2), mid(3)]).toEqual([TIERS[3].mid, TIERS[2].mid, TIERS[1].mid]);
  });

  it('points each crown at its own gradient', () => {
    const { container } = render(
      <>
        <RankCrown rank={1} />
        <RankCrown rank={2} />
      </>,
    );
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(new Set(ids).size).toBe(2);
  });
});
