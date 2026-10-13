import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const lessons = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ slug: `l${i}`, title: `L${i}`, sortOrder: i + 1 }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      { key: 'python', title: 'Python', description: '', lessons: lessons(60) },
      { key: 'linux', title: 'Linux', description: '', lessons: lessons(55) },
      { key: 'algo-c', title: 'C Algorithms', description: '', lessons: lessons(32) },
    ],
    isLoading: false,
    refresh: vi.fn(),
  }),
}));

import { FeaturesSection } from './FeaturesSection';

function renderSection() {
  render(
    <MemoryRouter>
      <FeaturesSection />
    </MemoryRouter>,
  );
}

describe('FeaturesSection', () => {
  it('gives each place a visitor can go a tile, a picture and a link', () => {
    renderSection();
    const tiles = Array.from(screen.getAllByRole('list')[0].children) as HTMLElement[];
    const links = tiles.map((b) => within(b).getByRole('link'));
    expect(links.map((l) => l.textContent)).toEqual([
      'Courses',
      'Algorithm challenges',
      'The Almanac',
      'The forum',
    ]);
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/courses',
      '/algorithms',
      '/almanac',
      '/getstarted',
    ]);
    for (const b of tiles) expect(within(b).getAllByRole('img')).toHaveLength(1);
  });

  it('draws the courses from the curriculum, with their real lesson counts', () => {
    renderSection();
    const picture = screen.getByRole('img', { name: /Python, Java, C and Linux/ });
    expect(picture).toHaveTextContent('Python60 lessons');
    expect(picture).toHaveTextContent('Linux55 lessons');
    expect(picture).not.toHaveTextContent('C Algorithms');
  });

  it('says the forum needs an account before leading there', () => {
    renderSection();
    expect(screen.getByText('With a free account')).toBeDefined();
    expect(screen.getByRole('link', { name: 'The forum' })).toHaveAttribute('href', '/getstarted');
  });

  it('presents none of the preview features', () => {
    renderSection();
    expect(screen.queryByText(/messag|connection|leaderboard/i)).toBeNull();
  });
});
