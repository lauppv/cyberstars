import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useRoomBelow } from './useRoomBelow';

function Probe({ gap = 10, deps = [] as unknown[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const room = useRoomBelow(ref, gap, deps);
  return (
    <div data-testid="box" style={{ overflowY: 'auto' }}>
      <div ref={ref} data-testid="el" />
      <span data-testid="room">{room ?? 'none'}</span>
    </div>
  );
}

const rect = (top: number, bottom: number) => ({ top, bottom }) as DOMRect;

// Animation frames that run when the test says, as the browser's next frame
function nextFrames() {
  let queued: FrameRequestCallback[] = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    queued.push(cb);
    return queued.length;
  });
  return {
    run() {
      const now = queued;
      queued = [];
      now.forEach((cb) => cb(0));
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useRoomBelow', () => {
  it('measures from the element down to the bottom of the box around it, less the gap', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === 'box' ? rect(0, 700) : rect(300, 300);
    });
    render(<Probe />);
    expect(screen.getByTestId('room')).toHaveTextContent('390');
  });

  it('stops at the window when the box goes past it, and measures again on a scroll', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
    let top = 300;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === 'box' ? rect(0, 2000) : rect(top, top);
    });
    const frames = nextFrames();
    render(<Probe />);
    expect(screen.getByTestId('room')).toHaveTextContent('290');
    top = 100;
    act(() => {
      screen.getByTestId('box').dispatchEvent(new Event('scroll'));
      frames.run();
    });
    expect(screen.getByTestId('room')).toHaveTextContent('490');
  });

  it('measures again when its deps change', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
    let top = 300;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === 'box' ? rect(0, 600) : rect(top, top);
    });
    const frames = nextFrames();
    const { rerender } = render(<Probe deps={['a']} />);
    top = 200;
    rerender(<Probe deps={['ab']} />);
    act(() => frames.run());
    expect(screen.getByTestId('room')).toHaveTextContent('390');
  });
});
