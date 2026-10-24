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
  it('gives each part a card with its name and a picture, and no links', () => {
    renderSection();
    const tiles = Array.from(screen.getAllByRole('list')[0].children) as HTMLElement[];
    expect(tiles.map((b) => within(b).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Courses',
      'Algorithm challenges',
      'Linux terminal',
      'The forum',
      'Laniakea, a space gameBeta',
      'An AI tutor',
    ]);
    for (const b of tiles) expect(within(b).getAllByRole('img')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('marks Laniakea Beta and says it opens after the first Python lessons', () => {
    renderSection();
    const card = screen.getByRole('heading', { name: /Laniakea, a space game/ }).parentElement!;
    expect(card).toHaveTextContent('After 3 Python lessons');
    expect(card).toHaveTextContent('Beta');
    expect(screen.getByText(/Every Python lesson you finish becomes a planet\./)).toHaveTextContent(
      /up to 64 days to keep it for good/,
    );
    expect(screen.getByRole('img', { name: /ringed in blue/ })).toHaveTextContent('5 + 3');
  });

  it('draws the courses from the curriculum, with their real lesson counts', () => {
    renderSection();
    const picture = screen.getByRole('img', { name: /Python, Java, C and Linux/ });
    expect(picture).toHaveTextContent('Python60 lessons');
    expect(picture).toHaveTextContent('Linux55 lessons');
    expect(picture).not.toHaveTextContent('C Algorithms');
  });

  it('lists real challenges from easy to hard, the first ones solved', () => {
    renderSection();
    const picture = screen.getByRole('img', { name: /Five Python challenges/ });
    expect(picture).toHaveTextContent('✓Reverse a Stringeasy');
    expect(picture).toHaveTextContent('5Group Anagramshard');
  });

  it('shows a Linux session in the lesson terminal prompt', () => {
    renderSection();
    const picture = screen.getByRole('img', { name: /A Linux terminal/ });
    expect(picture).toHaveTextContent('student@sandbox:~$ pwd/home/student');
    expect(picture).toHaveTextContent('mission.txt reports tools');
  });

  it("answers Maria21's question in the forum and says it needs an account", () => {
    renderSection();
    const forum = screen.getByRole('heading', { name: 'The forum' }).parentElement!;
    expect(within(forum).getByText('With a free account')).toBeDefined();
    const picture = screen.getByRole('img', { name: /Maria21/ });
    expect(picture).toHaveTextContent('Maria21How do I print my name 3 times?');
    expect(picture).toHaveTextContent('Marco Hoeger');
    expect(picture).toHaveTextContent('print("Maria")');
  });

  it('shows the tutor pointing at the idea without the fix, behind an account', () => {
    renderSection();
    const tutor = screen.getByRole('heading', { name: 'An AI tutor' }).parentElement!;
    expect(within(tutor).getByText('With a free account')).toBeDefined();
    const picture = screen.getByRole('img', { name: /tutor explains that range starts at 0/ });
    expect(picture).toHaveTextContent('Why does my loop print 0, 1, 2 and not 1, 2, 3?');
    expect(picture).toHaveTextContent('which one would give you 1, 2, 3?');
    expect(picture).toHaveTextContent('So range(1, 3)?');
    expect(picture).toHaveTextContent('What would the stop need to be for 3 to make it in?');
    expect(picture).not.toHaveTextContent('range(1, 4)');
  });

  it('presents none of the preview features', () => {
    renderSection();
    expect(screen.queryByText(/messag|connection|leaderboard/i)).toBeNull();
  });
});
