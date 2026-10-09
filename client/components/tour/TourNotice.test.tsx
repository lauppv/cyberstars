import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TourNotice } from './TourNotice';

afterEach(() => {
  vi.useRealTimers();
});

describe('TourNotice', () => {
  it('renders nothing while hidden', () => {
    render(<TourNotice visible={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says the tests come first and closes on its button', () => {
    const onClose = vi.fn();
    render(<TourNotice visible onClose={onClose} />);
    expect(screen.getByText('Finish this lesson first')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes by itself after a few seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<TourNotice visible onClose={onClose} />);
    act(() => vi.advanceTimersByTime(6000));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
