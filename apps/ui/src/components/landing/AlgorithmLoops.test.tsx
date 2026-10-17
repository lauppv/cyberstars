import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import i18n from 'i18next';
import { AlgorithmLoops } from './AlgorithmLoops';
import { bubbleSortVisual } from './bubbleSortVisual';
import { arrayFrames } from '../visual/arrayFrames';
import { treeFrames } from '../visual/treeFrames';
import { searchTreeVisual } from './loopVisuals';

const t = i18n.t.bind(i18n);
const tick = () => act(() => vi.runOnlyPendingTimers());

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  await i18n.changeLanguage('en');
});

describe('bubbleSortVisual', () => {
  it('sorts for real, a pass shorter each time, and stops on a pass without a swap', () => {
    const visual = bubbleSortVisual([5, 3, 8, 1, 2], t);
    expect(visual.steps.map((s) => s.ask ?? s.caption)).toEqual([
      'Is 5 > 3?',
      'Is 5 > 8?',
      'Is 8 > 1?',
      'Is 8 > 2?',
      '8 is in its place',
      'Is 3 > 5?',
      'Is 5 > 1?',
      'Is 5 > 2?',
      '5 is in its place',
      'Is 3 > 1?',
      'Is 3 > 2?',
      '3 is in its place',
      'Is 1 > 2?',
      'No swaps in this pass, so the list is sorted',
    ]);
    expect(visual.steps.filter((s) => s.title).map((s) => s.title)).toEqual([
      'Pass 1',
      'Pass 2',
      'Pass 3',
      'Pass 4',
    ]);
    expect(visual.steps[0]).toMatchObject({ swap: true, caption: 'Yes, so they swap' });
    expect(visual.steps[1]).toMatchObject({ swap: undefined, caption: 'No, so they stay' });
    expect(visual.pointers).toEqual(['j = {i}', 'j + 1']);
    const frames = arrayFrames(visual);
    expect(frames.at(-1)!.order.map((id) => visual.values[id])).toEqual([1, 2, 3, 5, 8]);
  });

  it('ends with the list sorted once only one box is left to place', () => {
    expect(bubbleSortVisual([2, 1], t).steps.at(-1)).toEqual({
      sorted: 0,
      caption: 'Done! The list is sorted',
    });
  });

  it('speaks Romanian on the Romanian page', async () => {
    await i18n.changeLanguage('ro');
    const visual = bubbleSortVisual([2, 1], t);
    expect(visual.steps[0]).toMatchObject({ title: 'Trecerea 1', ask: 'Este 2 > 1?' });
  });
});

describe('AlgorithmLoops', () => {
  // The pointers sit under the two boxes a frame compares, so they tell the film's step
  const pointer = () => screen.getByText(/^j = \d$/).textContent;
  const film = (name: RegExp) => screen.getByRole('img', { name });
  // A film sets its next timer once a frame is drawn, so the frames go by one at a time
  const play = (frames: number) => {
    for (let i = 0; i < frames; i++) act(() => vi.advanceTimersByTime(800));
  };

  it('plays the four films side by side, with no words under them', () => {
    render(<AlgorithmLoops />);
    for (const name of ['Sorting', 'Lists', 'Trees', 'Graphs']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(film(/^Bubble sort putting 5, 3, 8, 1, 2 in order/)).toBeInTheDocument();
    expect(film(/^A linked list growing from head/)).toBeInTheDocument();
    expect(film(/^A binary search tree built from/)).toBeInTheDocument();
    expect(film(/^Breadth-first search from vertex 0/)).toBeInTheDocument();
    expect(screen.queryByText(/^We start at position 0/)).toBeNull();
    expect(screen.queryByText('Is 5 > 3?')).toBeNull();
  });

  it('moves a frame every move and 200 ms, round and round', () => {
    render(<AlgorithmLoops />);
    act(() => vi.advanceTimersByTime(799));
    expect(screen.queryByText(/^j = \d$/)).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(pointer()).toBe('j = 0');
    play(2);
    expect(pointer()).toBe('j = 1');
    const frames = arrayFrames(bubbleSortVisual([5, 3, 8, 1, 2], t)).length;
    play(frames - 3);
    expect(screen.queryByText(/^j = \d$/)).toBeNull();
    play(1);
    expect(pointer()).toBe('j = 0');
  });

  it('plays each film at its own length', () => {
    render(<AlgorithmLoops />);
    const trees = film(/^A binary search tree built from/);
    expect(trees.textContent).toBe('');
    const frames = treeFrames(searchTreeVisual([8, 3, 10, 1, 6, 14], t)).length;
    play(frames - 1);
    expect(trees.textContent).toContain('8310');
    play(1);
    expect(trees.textContent).toBe('');
  });

  it('pauses and plays again from its button', () => {
    render(<AlgorithmLoops />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.queryByText(/^j = \d$/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    tick();
    expect(pointer()).toBe('j = 0');
  });

  it('waits for Play under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<AlgorithmLoops />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.queryByText(/^j = \d$/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('plays only while on screen', () => {
    let report: (entries: { isIntersecting: boolean }[]) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof report) {
          report = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const { unmount } = render(<AlgorithmLoops />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.queryByText(/^j = \d$/)).toBeNull();
    act(() => report([{ isIntersecting: true }]));
    act(() => vi.advanceTimersByTime(800));
    expect(pointer()).toBe('j = 0');
    act(() => report([{ isIntersecting: false }]));
    act(() => vi.advanceTimersByTime(60_000));
    expect(pointer()).toBe('j = 0');
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('speaks Romanian on the Romanian page', async () => {
    await i18n.changeLanguage('ro');
    render(<AlgorithmLoops />);
    expect(
      screen.getByRole('heading', { name: 'Urmărește un algoritm, pas cu pas' }),
    ).toBeVisible();
    for (const name of ['Sortare', 'Liste', 'Arbori', 'Grafuri']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
});
