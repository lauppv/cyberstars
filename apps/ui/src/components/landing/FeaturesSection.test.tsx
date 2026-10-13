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
    ]);
    for (const b of tiles) expect(within(b).getAllByRole('img')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
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
    expect(screen.getByText('With a free account')).toBeDefined();
    const picture = screen.getByRole('img', { name: /Maria21/ });
    expect(picture).toHaveTextContent('Maria21How do I print my name 3 times?');
    expect(picture).toHaveTextContent('Marco Hoeger');
    expect(picture).toHaveTextContent('print("Maria")');
  });

  it('presents none of the preview features', () => {
    renderSection();
    expect(screen.queryByText(/messag|connection|leaderboard/i)).toBeNull();
  });
});
