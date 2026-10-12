import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import { CtaBand } from './CtaBand';

function renderBand(tone: 'mid' | 'final') {
  render(
    <MemoryRouter>
      <CtaBand tone={tone} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CtaBand', () => {
  it('asks once mid-page, with Start learning only', () => {
    renderBand('mid');
    expect(screen.getByText('Your first program is one click away.')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  it('closes the page on a headline and both buttons', () => {
    renderBand('final');
    expect(
      screen.getByRole('heading', { name: 'Write your first line of code today' }),
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });
});
