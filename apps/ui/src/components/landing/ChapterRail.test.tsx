import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CHAPTERS, currentChapter } from './chapters';
import { ChapterRail } from './ChapterRail';

// Every chapter on the page, each 1000px below the one before
function chapters(scrolled: number) {
  document.body.innerHTML = '';
  CHAPTERS.forEach(([id], i) => {
    const el = document.createElement('div');
    el.id = id;
    el.getBoundingClientRect = () => ({ top: i * 1000 - scrolled }) as DOMRect;
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);
  });
}

function scrollTo(y: number, pageHeight = CHAPTERS.length * 1000 + 2000) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: pageHeight,
    configurable: true,
  });
  chapters(y);
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
});
afterEach(() => vi.unstubAllGlobals());

describe('currentChapter', () => {
  const ids = CHAPTERS.map(([id]) => id);

  it('has none above the first chapter', () => {
    scrollTo(-500);
    expect(currentChapter(ids, 1000)).toBeNull();
  });

  it('takes the last chapter whose start passed 40% of the window', () => {
    scrollTo(1700);
    expect(currentChapter(ids, 1000)).toBe(ids[2]);
  });

  it('takes the last chapter at the very bottom, which never reaches that line', () => {
    const height = CHAPTERS.length * 1000 + 2000;
    scrollTo(height - 1000, height);
    expect(currentChapter(ids, 1000)).toBe(ids[ids.length - 1]);
  });
});

describe('ChapterRail', () => {
  it('names every chapter and marks the one being read as the page scrolls', () => {
    scrollTo(0);
    const { container } = render(<ChapterRail />);
    expect(screen.getAllByRole('button')).toHaveLength(CHAPTERS.length);
    expect(screen.getByRole('button', { name: 'How it works' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    scrollTo(1500);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('[aria-current]')).toHaveTextContent(
      'Watch an algorithm, step by step',
    );
  });

  it('goes to a chapter on a click', () => {
    scrollTo(0);
    render(<ChapterRail />);
    fireEvent.click(screen.getByRole('button', { name: 'The forum' }));
    expect(document.getElementById('feature-forum')!.scrollIntoView).toHaveBeenCalled();
  });
});
