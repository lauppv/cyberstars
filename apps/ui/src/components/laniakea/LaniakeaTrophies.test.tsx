import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { FOREVER_LEVEL, type LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { testPlanet } from '../../pages/laniakea/testPlanets';

const h = vi.hoisted(() => ({ getLaniakea: vi.fn() }));
vi.mock('../../services/laniakeaService', () => ({ getLaniakea: h.getLaniakea }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'python',
        lessons: [
          { slug: 'print', title: 'Print' },
          { slug: 'variables-str', title: 'Variables (Strings)' },
          { slug: 'variables-int', title: 'Variables (Integers)' },
          { slug: 'print-f', title: 'Print F-strings' },
          { slug: 'recap-variables', title: 'Recap: Player Card' },
          { slug: 'comment', title: 'Comments' },
          { slug: 'if-else', title: 'If / Else' },
          { slug: 'lists', title: 'Lists' },
          { slug: 'for', title: 'For Loops' },
        ],
      },
    ],
  }),
}));

import { LaniakeaTrophies } from './LaniakeaTrophies';

const state = (planets: LaniakeaPlanet[], unlocked = true) => ({
  courseKey: 'python',
  unlocked,
  serverNow: '2026-10-26T12:00:00.000Z',
  planets,
});

// Lets the game's reply come in
const settle = () => act(async () => {});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LaniakeaTrophies', () => {
  it('counts the planets conquered and kept for good, with an achievement for each kept', async () => {
    h.getLaniakea.mockResolvedValue(
      state([
        testPlanet({ level: FOREVER_LEVEL }),
        testPlanet({ slug: 'if-else', level: 3 }),
        testPlanet({ slug: 'lists', level: FOREVER_LEVEL }),
        testPlanet({ slug: 'for' }),
      ]),
    );
    render(<LaniakeaTrophies />);

    expect(await screen.findByText('Planets conquered')).toBeInTheDocument();
    expect(screen.getByText('Planets conquered').previousSibling).toHaveTextContent('3');
    expect(screen.getByText('Kept for good').previousSibling).toHaveTextContent('2');
    expect(screen.getByText('Beta')).toBeInTheDocument();
    // First steps by the planet's name, the others by their lesson's title
    const achievements = screen.getAllByRole('listitem');
    expect(achievements.map((a) => a.textContent)).toEqual([
      'Keeper of First steps',
      'Keeper of Lists',
    ]);
    expect(achievements[1]).toHaveAttribute('title', 'You passed every recap of Lists');
  });

  it('shows the counts alone while no planet is kept for good', async () => {
    h.getLaniakea.mockResolvedValue(
      state([testPlanet({ level: 1 }), testPlanet({ slug: 'lists' })]),
    );
    render(<LaniakeaTrophies />);

    expect(await screen.findByText('Kept for good')).toBeInTheDocument();
    expect(screen.getByText('Planets conquered').previousSibling).toHaveTextContent('1');
    expect(screen.getByText('Kept for good').previousSibling).toHaveTextContent('0');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('says nothing before the first planet is conquered', async () => {
    h.getLaniakea.mockResolvedValue(state([testPlanet(), testPlanet({ slug: 'lists' })]));
    const { container } = render(<LaniakeaTrophies />);

    await settle();
    expect(container).toBeEmptyDOMElement();
  });

  it('says nothing while the game is locked, even with a planet left from before', async () => {
    h.getLaniakea.mockResolvedValue(state([testPlanet({ level: FOREVER_LEVEL })], false));
    const { container } = render(<LaniakeaTrophies />);

    await settle();
    expect(container).toBeEmptyDOMElement();
  });

  it('says nothing when the game can’t be read', async () => {
    h.getLaniakea.mockRejectedValue(new Error('offline'));
    const { container } = render(<LaniakeaTrophies />);

    await settle();
    expect(container).toBeEmptyDOMElement();
  });
});
