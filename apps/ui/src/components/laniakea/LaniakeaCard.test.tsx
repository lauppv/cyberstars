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
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'python',
        lessons: ['print', 'variables-str', 'variables-int', 'print-f'].map((slug) => ({ slug })),
      },
    ],
  }),
}));

import { LaniakeaCard } from './LaniakeaCard';

const done = (...slugs: string[]) => ({
  progressMap: { python: { lessons: slugs.map((slug) => ({ slug, completed: true })) } },
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
  it('says what opens the game and leads to the next Python lesson', () => {
    h.progress = done('print');
    renderCard();
    expect(
      screen.getByText(/Finish 3 Python lessons to open the explorer game/),
    ).toBeInTheDocument();
    expect(screen.getByText('1 of 3 done')).toBeInTheDocument();
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
    h.progress = done('print', 'variables-str', 'variables-int');
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
    h.progress = done('print', 'variables-str', 'variables-int');
    h.getLaniakea.mockRejectedValue(new Error('down'));
    renderCard();
    expect(await screen.findByRole('link', { name: 'Fly to Laniakea' })).toBeInTheDocument();
  });
});
