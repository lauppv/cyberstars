import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { testPlanet } from '../../pages/laniakea/testPlanets';

const h = vi.hoisted(() => ({
  getLaniakea: vi.fn(),
  progress: { progressMap: {} as Record<string, unknown>, isLoading: false },
}));
vi.mock('../../services/laniakeaService', () => ({ getLaniakea: h.getLaniakea }));
vi.mock('../../context/ProgressContext', () => ({ useAllProgress: () => h.progress }));

import { LaniakeaCard } from './LaniakeaCard';

// The six lessons of First steps, then the next ones
const FIRST_STEPS = [
  'print',
  'variables-str',
  'variables-int',
  'print-f',
  'recap-variables',
  'comment',
];
const PYTHON = [...FIRST_STEPS, 'if-else', 'if-elif-else'];

// Progress lists every lesson of the course in its order
const done = (...slugs: string[]) => ({
  progressMap: {
    python: { lessons: PYTHON.map((slug) => ({ slug, completed: slugs.includes(slug) })) },
  },
  isLoading: false,
});

function renderCard() {
  return render(
    <MemoryRouter>
      <LaniakeaCard />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.getLaniakea.mockResolvedValue(null);
});

describe('LaniakeaCard', () => {
  it('says what opens the game and leads to the first of its lessons left', () => {
    h.progress = done('print', 'variables-int', 'if-else', 'if-elif-else');
    renderCard();
    expect(
      screen.getByText(/Finish the first 6 Python lessons to open the explorer game/),
    ).toBeInTheDocument();
    expect(screen.getByText('2 of 6 done')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue with Python' })).toHaveAttribute(
      'href',
      '/lesson/python/variables-str',
    );
    expect(h.getLaniakea).not.toHaveBeenCalled();
  });

  it('waits for progress before saying anything', () => {
    h.progress = { progressMap: {}, isLoading: true };
    const { container } = renderCard();
    expect(container).toBeEmptyDOMElement();
  });

  it('once open, says how many planets are the student’s and what waits', async () => {
    h.progress = done(...FIRST_STEPS);
    h.getLaniakea.mockResolvedValue({
      serverNow: '2026-10-24T12:00:00.000Z',
      planets: [
        testPlanet({ level: 2, nextRecapAt: '2026-10-24T11:00:00.000Z' }),
        testPlanet({ slug: 'variables-str' }),
        testPlanet({ slug: 'variables-int', lessonDone: false }),
      ],
    });
    renderCard();
    expect(
      screen.getByText('Every Python lesson you finish is a planet to conquer.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Planets conquered: 1/3 · 1 recap open · 1 planet ready to conquer'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fly to Laniakea' })).toHaveAttribute(
      'href',
      '/laniakea',
    );
  });

  it('still leads to the game when its state cannot be read', async () => {
    h.progress = done(...FIRST_STEPS);
    h.getLaniakea.mockRejectedValue(new Error('down'));
    renderCard();
    expect(await screen.findByRole('link', { name: 'Fly to Laniakea' })).toBeInTheDocument();
  });
});
