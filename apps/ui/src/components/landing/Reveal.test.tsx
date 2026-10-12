import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Reveal } from './Reveal';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

// A stand-in IntersectionObserver that lets a test say when the block is seen
function stubObserver() {
  const seen = { callback: null as Callback | null, observed: 0, disconnected: 0 };
  class FakeObserver {
    constructor(cb: Callback) {
      seen.callback = cb;
    }
    observe() {
      seen.observed++;
    }
    disconnect() {
      seen.disconnected++;
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  return seen;
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce, media: q }));
}

function block() {
  return screen.getByText('content').parentElement!;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Reveal', () => {
  it('stays visible when the browser has no IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(block()).toHaveAttribute('data-reveal', 'visible');
    expect(block().className).not.toContain('opacity-0');
  });

  it('waits hidden until the block enters the screen, then fades it in', () => {
    const io = stubObserver();
    stubReducedMotion(false);
    render(
      <Reveal className="grid">
        <p>content</p>
      </Reveal>,
    );
    expect(block()).toHaveAttribute('data-reveal', 'hidden');
    expect(block().className).toContain('opacity-0');
    expect(block().className).toContain('grid');
    expect(io.observed).toBe(1);

    act(() => io.callback!([{ isIntersecting: false }]));
    expect(block()).toHaveAttribute('data-reveal', 'hidden');

    act(() => io.callback!([{ isIntersecting: true }]));
    expect(block()).toHaveAttribute('data-reveal', 'shown');
    expect(block().className).toContain('opacity-100');
    expect(block().className).toContain('duration-[600ms]');
  });

  it('plays once: it stops watching after the first appearance', () => {
    const io = stubObserver();
    stubReducedMotion(false);
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    act(() => io.callback!([{ isIntersecting: true }]));
    expect(io.disconnected).toBe(1);

    // Scrolling away and back must not hide or replay it
    act(() => io.callback!([{ isIntersecting: false }]));
    expect(block()).toHaveAttribute('data-reveal', 'shown');
  });

  it('never hides the block under reduced motion', () => {
    const io = stubObserver();
    stubReducedMotion(true);
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(block()).toHaveAttribute('data-reveal', 'visible');
    expect(io.observed).toBe(0);
  });
});
