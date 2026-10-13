import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import { CtaBand } from './CtaBand';

function renderBand() {
  render(
    <MemoryRouter>
      <CtaBand />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CtaBand', () => {
  it('closes the page on a headline and both buttons', () => {
    renderBand();
    expect(
      screen.getByRole('heading', { name: 'Write your first line of code today' }),
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });
});
