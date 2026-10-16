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
  it('closes the page on a headline and one button to the placement test', () => {
    renderBand();
    expect(screen.getByRole('heading', { name: 'Not sure where to start?' })).toBeDefined();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Test me' }));
    expect(mockNavigate).toHaveBeenCalledWith('/placement');
  });
});
