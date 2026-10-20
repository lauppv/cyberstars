import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { RunWaitNotice } from './RunWaitNotice';
import { TutorToast } from '../tutor/TutorToast';
import { setRunWait } from '../../hooks/useRunWait';

afterEach(() => {
  act(() => setRunWait('editor', null));
  vi.useRealTimers();
});

describe('RunWaitNotice', () => {
  it('shows nothing while no run waits', () => {
    render(<RunWaitNotice />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('says the server is busy and not to refresh, with a light line that changes', () => {
    vi.useFakeTimers();
    render(<RunWaitNotice />);
    act(() => setRunWait('editor', { kind: 'waiting' }));
    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent('a lot of traffic');
    expect(notice).toHaveTextContent('No need to refresh');
    const line = () => notice.querySelector('p:last-child')!.textContent;
    const first = line();
    expect(first).toMatch(/^Meanwhile: /);
    act(() => vi.advanceTimersByTime(5000));
    expect(line()).toMatch(/^Meanwhile: /);
    expect(line()).not.toBe(first);
  });

  it('offers Try again once the run waited in vain, and goes when closed', () => {
    const retry = vi.fn();
    render(<RunWaitNotice />);
    act(() => setRunWait('editor', { kind: 'busy', retry }));
    expect(screen.getByRole('status')).toHaveTextContent('Still busy');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it("stacks above the tutor's toast in the same corner", () => {
    render(
      <>
        <TutorToast text="Need a hand?" mood="idle" onOpen={() => {}} onClose={() => {}} />
        <RunWaitNotice />
      </>,
    );
    act(() => setRunWait('editor', { kind: 'waiting' }));
    const [toast, notice] = [
      screen.getByRole('button', { name: 'Need a hand?' }),
      screen.getByText(/a lot of traffic/),
    ];
    const corner = document.getElementById('corner')!;
    expect(corner).toContainElement(toast);
    expect(corner).toContainElement(notice);
    expect(notice.closest('#corner > div')).toHaveClass('order-first');
  });
});
