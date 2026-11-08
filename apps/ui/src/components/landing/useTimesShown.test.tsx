import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useRef } from 'react';
import { useTimesShown } from './useTimesShown';

let report: (entries: { isIntersecting: boolean }[]) => void = () => {};

class FakeObserver {
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    report = cb;
  }
  observe() {}
  disconnect() {}
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', FakeObserver));
afterEach(() => vi.unstubAllGlobals());

function Picture() {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref}>{useTimesShown(ref)}</div>;
}

// A pinned story's picture: always where it is, hidden or shown by aria-hidden
function Pinned({ hidden }: { hidden: boolean }) {
  return (
    <div data-testid="frame" aria-hidden={hidden}>
      <Picture />
    </div>
  );
}

const screenSays = (on: boolean) => act(() => report([{ isIntersecting: on }]));

describe('useTimesShown', () => {
  it('counts each time the element comes on screen, not while it stays there', () => {
    render(<Picture />);
    expect(document.body).toHaveTextContent('0');
    screenSays(true);
    screenSays(true);
    expect(document.body).toHaveTextContent('1');
    screenSays(false);
    screenSays(true);
    expect(document.body).toHaveTextContent('2');
  });

  it('waits while the element is on screen but in a part the page hides', async () => {
    const { rerender } = render(<Pinned hidden />);
    screenSays(true);
    expect(screen.getByTestId('frame')).toHaveTextContent('0');
    rerender(<Pinned hidden={false} />);
    await act(async () => {}); // the MutationObserver reports in a microtask
    expect(screen.getByTestId('frame')).toHaveTextContent('1');
    rerender(<Pinned hidden />);
    await act(async () => {});
    rerender(<Pinned hidden={false} />);
    await act(async () => {});
    expect(screen.getByTestId('frame')).toHaveTextContent('2');
  });

  it('stays at 0 where the browser has no IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Picture />);
    expect(document.body).toHaveTextContent('0');
  });
});
