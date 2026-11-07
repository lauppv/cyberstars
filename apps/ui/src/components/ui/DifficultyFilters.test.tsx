import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DifficultyFilters } from './DifficultyFilters';

describe('DifficultyFilters', () => {
  it('offers All and each difficulty, the picked one lit', () => {
    const onChange = vi.fn();
    render(<DifficultyFilters value="medium" onChange={onChange} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'All',
      'Easy',
      'Medium',
      'Hard',
    ]);
    expect(screen.getByRole('button', { name: 'Medium' }).style.boxShadow).not.toBe('');
    expect(screen.getByRole('button', { name: 'Hard' }).style.boxShadow).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }));
    expect(onChange).toHaveBeenCalledWith('hard');
  });

  it('lights All when no difficulty is picked', () => {
    render(<DifficultyFilters value="all" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'All' }).style.color).toBe('var(--text)');
  });
});
