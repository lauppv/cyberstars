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
      { key: 'trees-graphs', title: 'Trees and Graphs', description: '', lessons: lessons(12) },
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
      'An AI tutor',
      'Web Development',
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
    ]);
    expect(document.getElementById('feature-tutor')).toHaveTextContent('An AI tutor');
  });

  it('never says free: only the hero and the free band do', () => {
    renderSection();
    expect(document.body.textContent).not.toMatch(/free/i);
  });

  it('draws the courses from the curriculum, with their real lesson counts', () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /Each course with its number of lessons/ });
    expect(picture).toHaveTextContent('Python60 lessons');
    expect(picture).toHaveTextContent('Linux55 lessons');
    expect(picture).not.toHaveTextContent('C Algorithms');
  });

  it('lists Trees and Graphs among the courses, marked Beta', () => {
    renderSection();
    expect(parts().getByText(/then Trees and Graphs in all three languages/)).toBeDefined();
    const picture = parts().getByRole('img', { name: /Each course with its number of lessons/ });
    expect(picture).toHaveTextContent('Trees and GraphsBeta12 lessons');
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

  it("shows the tutor's chat before a conversation starts, its questions leading nowhere", () => {
    renderSection();
    const picture = parts().getByRole('img', { name: /before a conversation starts/ });
    expect(picture.querySelector('.tutor-orbit')).not.toBeNull();
    expect(within(picture).getByLabelText('How can I help?')).toBeDefined();
    expect(picture).toHaveTextContent('The tutor helps you get there on your own.');
    expect(picture).toHaveTextContent('Explain the task to me');
    expect(picture).toHaveTextContent("Why doesn't my code work?");
    expect(picture).toHaveTextContent('Give me a nudge');
    expect(within(picture).queryByRole('button')).toBeNull();
    expect(within(picture).queryByRole('heading')).toBeNull();
  });

  it('marks Web Development Coming soon, its picture a page and the site it draws', () => {
    renderSection();
    const row = parts().getByRole('heading', { name: 'Web Development' }).closest('li')!;
    expect(within(row).getByText('Coming soon')).toBeDefined();
    const picture = within(row).getByRole('img', { name: /A web lesson as the student has it/ });
    expect(picture).toHaveTextContent('index.htmlstyle.cssscript.js');
    expect(picture).toHaveTextContent('openDoors.addEventListener("click"');
    expect(picture).toHaveTextContent('Welcome aboard');
    expect(picture).toHaveTextContent('Doors openOpen the doors');
  });

  it('presents none of the preview features', () => {
    renderSection();
    expect(screen.queryByText(/messag|connection|leaderboard/i)).toBeNull();
  });

  it('names neither the forum nor Laniakea', () => {
    renderSection();
    expect(document.body.textContent).not.toMatch(/forum|laniakea|planet/i);
  });
});
