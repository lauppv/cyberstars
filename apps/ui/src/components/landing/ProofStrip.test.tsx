import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import type { Course } from '@cyberstars/shared/lesson';

const h = vi.hoisted(() => ({ courses: [] as Course[] }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({ courses: h.courses, isLoading: false, refresh: vi.fn() }),
}));

import { ProofStrip } from './ProofStrip';

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

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('ProofStrip', () => {
  it('shows the languages and the counts from the curriculum', () => {
    h.courses = [course('python', 60), course('java', 1), course('algo-c', 32)];
    render(<ProofStrip />);
    const strip = screen.getByRole('region', { name: 'What there is to learn' });
    expect(strip).toHaveTextContent('Python·Java');
    expect(strip).toHaveTextContent('2courses');
    expect(strip).toHaveTextContent('61lessons');
    expect(strip).toHaveTextContent('32algorithm challenges');
  });

  it('uses the Romanian plural forms, with "de" from 20 up', async () => {
    h.courses = [course('python', 1), course('algo-c', 32)];
    await i18n.changeLanguage('ro');
    render(<ProofStrip />);
    const strip = screen.getByRole('region', { name: 'Ce poți învăța' });
    expect(strip).toHaveTextContent('1curs');
    expect(strip).toHaveTextContent('1lecție');
    expect(strip).toHaveTextContent('32de provocări de algoritmi');
  });

  it('renders nothing until the curriculum has loaded', () => {
    h.courses = [];
    const { container } = render(<ProofStrip />);
    expect(container).toBeEmptyDOMElement();
  });
});
