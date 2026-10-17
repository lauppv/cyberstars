import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Course } from '@cyberstars/shared/lesson';

const fetchCurriculum = vi.fn(() => new Promise<Course[]>(() => {}));
vi.mock('../services/lessonService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/lessonService')>()),
  fetchCurriculum: () => fetchCurriculum(),
}));

import { CurriculumProvider, useCurriculum } from './CurriculumContext';

function Probe() {
  const { courses, isLoading } = useCurriculum();
  return <span data-testid="state">{`${isLoading ? 'loading' : 'ready'}:${courses.length}`}</span>;
}

describe('CurriculumProvider', () => {
  it('starts empty and loading until the curriculum arrives', () => {
    render(
      <CurriculumProvider>
        <Probe />
      </CurriculumProvider>,
    );
    expect(screen.getByTestId('state').textContent).toBe('loading:0');
  });

  it('starts ready with courses it is handed, as the pre-render does', () => {
    const python: Course = { key: 'python', title: 'Python', description: '', lessons: [] };
    render(
      <CurriculumProvider initialCourses={[python]}>
        <Probe />
      </CurriculumProvider>,
    );
    expect(screen.getByTestId('state').textContent).toBe('ready:1');
  });
});
