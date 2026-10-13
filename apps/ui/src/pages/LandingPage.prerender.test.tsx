import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import type { Course } from '@cyberstars/shared/lesson';

vi.mock('../services/lessonService', () => ({
  fetchCurriculum: vi.fn(() => new Promise(() => {})),
}));

import { CurriculumProvider } from '../context/CurriculumContext';
import { LandingPage } from './LandingPage';

const course = (key: string, n: number): Course => ({
  key,
  title: key,
  description: '',
  lessons: Array.from({ length: n }, (_, i) => ({
    slug: `l${i}`,
    title: `L${i}`,
    sortOrder: i + 1,
  })),
});

// What scripts/prerender.tsx writes into dist/index.html at build time
function prerender() {
  return renderToString(
    <MemoryRouter>
      <CurriculumProvider initialCourses={[course('python', 60), course('algo-c', 32)]}>
        <LandingPage />
      </CurriculumProvider>
    </MemoryRouter>,
  );
}

describe('the pre-rendered landing page', () => {
  it('carries the headline, every section and the links as plain HTML', () => {
    const html = prerender();
    expect(html).toContain('Learn to code for free');
    for (const heading of [
      'How it works',
      'What&#x27;s inside',
      'Free, and open source',
      'Write your first line of code today',
    ]) {
      expect(html).toContain(heading);
    }
    expect(html).toContain('href="/courses"');
  });

  it('draws the proof strip from the curriculum it was given', () => {
    const html = prerender();
    expect(html).toContain('60</span>');
    expect(html).toContain('32</span>');
  });

  it('leaves no block hidden, since no script will ever reveal it', () => {
    const html = prerender();
    expect(html).toContain('data-reveal="visible"');
    expect(html).not.toContain('data-reveal="hidden"');
    expect(html).not.toContain('opacity-0');
  });
});
