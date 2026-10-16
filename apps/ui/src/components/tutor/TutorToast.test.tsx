import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { TutorToast } from './TutorToast';

afterEach(() => vi.useRealTimers());

describe('TutorToast', () => {
  it('offers help as a button, and stays until it is used or closed', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<TutorToast text="Need a hand?" mood="idle" onOpen={onOpen} onClose={onClose} />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Need a hand?' }));
    expect(onOpen).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('lets a cheer go by itself after a few seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<TutorToast text="Well done!" mood="happy" onClose={onClose} />);
    expect(screen.getByRole('status')).toHaveTextContent('Well done!');
    act(() => vi.advanceTimersByTime(6000));
    expect(onClose).toHaveBeenCalled();
  });
});
