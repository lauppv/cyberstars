import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'algo-python',
        title: 'Python Algorithms',
        lessons: [{ slug: 'reverse-string', title: 'Easy · Reverse a String', sortOrder: 1 }],
      },
    ],
    isLoading: false,
  }),
}));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => null }));

const { AlgorithmsPage } = await import('./AlgorithmsPage');

describe('AlgorithmsPage', () => {
  it('heads the page and opens a challenge set from its card', () => {
    render(
      <MemoryRouter>
        <AlgorithmsPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Algorithms' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Python/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/algorithms/python');
  });
});
