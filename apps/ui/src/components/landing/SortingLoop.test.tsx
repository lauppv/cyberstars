import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import i18n from 'i18next';
import { SortingLoop } from './SortingLoop';
import { bubbleSortVisual } from './bubbleSortVisual';
import { arrayFrames } from '../visual/arrayFrames';

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

describe('SortingLoop', () => {
  it('plays on its own and starts over at the end', () => {
    render(<SortingLoop />);
    expect(screen.getByText(/^We start at position 0/)).toBeInTheDocument();
    tick();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    const frames = arrayFrames(bubbleSortVisual([5, 3, 8, 1, 2], t)).length;
    for (let i = 1; i < frames - 1; i++) tick();
    expect(screen.getByText('No swaps in this pass, so the list is sorted')).toBeInTheDocument();
    tick();
    expect(screen.getByText(/^We start at position 0/)).toBeInTheDocument();
  });

  it('holds the first frame longest, then a question, then a swap its animation and a beat', () => {
    render(<SortingLoop />);
    act(() => vi.advanceTimersByTime(4499));
    expect(screen.queryByText('Is 5 > 3?')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2200));
    act(() => vi.advanceTimersByTime(2099));
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('Is 5 > 8?')).toBeInTheDocument();
  });

  it('pauses and plays again from its button', () => {
    render(<SortingLoop />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText(/^We start at position 0/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    tick();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
  });

  it('waits for Play under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<SortingLoop />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText(/^We start at position 0/)).toBeInTheDocument();
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
    const { unmount } = render(<SortingLoop />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText(/^We start at position 0/)).toBeInTheDocument();
    act(() => report([{ isIntersecting: true }]));
    tick();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    act(() => report([{ isIntersecting: false }]));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('describes the film for a screen reader in one line', () => {
    render(<SortingLoop />);
    expect(
      screen.getByRole('img', { name: /Bubble sort putting 5, 3, 8, 1, 2 in order/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Watch an algorithm, step by step' })).toBeVisible();
  });
});
