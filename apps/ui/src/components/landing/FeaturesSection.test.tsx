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

// On a wide screen the pinned layout shows the parts, below 1024px the
// stacked list does; jsdom applies no media query, so both render. Read the list.
const parts = () => within(document.querySelector('ol')!);

function renderSection() {
  render(
    <MemoryRouter>
      <FeaturesSection />
    </MemoryRouter>,
  );
}

describe('FeaturesSection', () => {
  it('tells each part with its name, a sentence and a picture, and no links', () => {
    renderSection();
    const items = Array.from(document.querySelector('ol')!.children) as HTMLElement[];
    expect(items.map((r) => within(r).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Courses',
      'Algorithm challenges',
      'Linux terminal',
      'The forum',
      'Laniakea, a space game',
      'An AI tutor',
    ]);
    for (const r of items) {
      expect(within(r).getAllByRole('img')).toHaveLength(1);
      expect(r.querySelector('p')?.textContent).toMatch(/\w+/);
    }
    expect(screen.queryByRole('link')).toBeNull();
  });

  it("pins the first part's picture on a wide screen, each part's words where the chapters scroll to", () => {
    renderSection();
    const pinned = Array.from(document.querySelectorAll('[data-picture]'));
    expect(pinned.map((p) => p.getAttribute('aria-hidden'))).toEqual([
      'false',
      'true',
      'true',
      'true',
      'true',
      'true',
    ]);
    expect(document.getElementById('feature-forum')).toHaveTextContent('The forum');
  });

  it('marks Laniakea Beta and says in a line what it is and that it opens after the first Python lessons', () => {
    renderSection();
    const row = parts().getByRole('heading', { name: 'Laniakea, a space game' }).closest('li')!;
    expect(row).toHaveTextContent('After 3 Python lessons');
    expect(within(row).getByText('Beta')).toBeDefined();
    expect(
      within(row).getByText(
        'Every Python lesson you finish becomes a planet. Fly to it and pass a 10-question test on the lesson to conquer it.',
      ),
    ).toBeDefined();
    expect(within(row).getByRole('img', { name: /ringed in blue/ })).toHaveTextContent('5 + 3');
  });

  it('never says free: only the hero and the free band do', () => {
    renderSection();
    expect(document.body.textContent).not.toMatch(/free/i);
  });

  it('draws the courses from the curriculum, with their real lesson counts', () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /Python, Java, C and Linux/ });
    expect(picture).toHaveTextContent('Python60 lessons');
    expect(picture).toHaveTextContent('Linux55 lessons');
    expect(picture).not.toHaveTextContent('C Algorithms');
  });

  it('lists real challenges from easy to hard, the first ones solved', () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /Five Python challenges/ });
    expect(picture).toHaveTextContent('✓Reverse a Stringeasy');
    expect(picture).toHaveTextContent('5Group Anagramshard');
  });

  it('shows a Linux session in the lesson terminal prompt', () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /A Linux terminal/ });
    expect(picture).toHaveTextContent('student@sandbox:~$ pwd/home/student');
    expect(picture).toHaveTextContent('mission.txt reports tools');
  });

  it("answers Maria21's question in the forum", () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /Maria21/ });
    expect(picture).toHaveTextContent('Maria21How do I print my name 3 times?');
    expect(picture).toHaveTextContent('Marco Hoeger');
    expect(picture).toHaveTextContent('print("Maria")');
  });

  it('shows the tutor pointing at the idea without the fix', () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /tutor explains that range starts at 0/ });
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
