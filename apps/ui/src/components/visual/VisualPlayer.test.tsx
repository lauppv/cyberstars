import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { VisualPlayer } from './VisualPlayer';
import type { ArrayVisual } from './parseVisual';
import type { BoxesVisual } from './parseBoxes';
import type { TreeVisual } from './parseTree';
import type { GraphVisual } from './parseGraph';
import type { GridVisual } from './parseGrid';
import type { StackVisual } from './parseStack';
import { VisualSteps } from './VisualSteps';

const visual: ArrayVisual = {
  type: 'array',
  values: [5, 3, 8],
  caption: 'How it works',
  steps: [
    {
      title: 'Pass 1',
      compare: [0, 1],
      ask: 'Is 5 > 3?',
      swap: true,
      caption: 'Yes, so they swap',
    },
    { sorted: 2, caption: '8 is in place' },
  ],
};

const box = (root: HTMLElement | Document, id: number) =>
  root.querySelector<HTMLElement>(`[data-box="${id}"]`)!;

const player = () => screen.getByRole('group', { name: 'Step by step' });
const next = (root = player()) =>
  fireEvent.click(within(root).getByRole('button', { name: /next/i }));

describe('VisualPlayer', () => {
  it('opens on how the algorithm works, in a live region, with no position numbers', () => {
    render(<VisualPlayer visual={visual} />);
    expect(screen.getByText('How it works').parentElement).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(box(document, 0)).toHaveTextContent('5');
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(0 * (100% + var(--gap)))) translateY(0)',
    );
    expect(box(document, 0)).toHaveAttribute('data-state', 'idle');
    expect(screen.queryByText('0')).toBeNull();
  });

  it('shows the question with its answer first, then swaps on Next', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    expect(screen.getByText('Pass 1')).toBeInTheDocument();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(box(document, 0)).toHaveAttribute('data-state', 'compared');
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(0 * (100% + var(--gap)))) translateY(0)',
    );
    next();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(1 * (100% + var(--gap)))) translateY(0)',
    );
    expect(box(document, 1).style.transform).toBe(
      'translateX(calc(0 * (100% + var(--gap)))) translateY(0)',
    );
    next();
    expect(screen.getByText('8 is in place')).toBeInTheDocument();
    expect(box(document, 2)).toHaveAttribute('data-state', 'sorted');
    expect(box(document, 0)).toHaveAttribute('data-state', 'idle');
  });

  it('points at the two boxes compared, naming the position, and only then', () => {
    const { container } = render(
      <VisualPlayer visual={{ ...visual, pointers: ['j = {i}', 'j + 1'] }} />,
    );
    expect(container.querySelector('[data-pointer]')).toBeNull();
    next();
    const [left, right] = container.querySelectorAll<HTMLElement>('[data-pointer]');
    expect(left).toHaveTextContent('j = 0');
    expect(left.style.transform).toBe('translateX(calc(0 * (100% + var(--gap)))) translateY(0)');
    expect(right).toHaveTextContent('j + 1');
    expect(right.style.transform).toBe('translateX(calc(1 * (100% + var(--gap)))) translateY(0)');
    expect(left).toHaveClass('transition-transform', 'motion-reduce:transition-none');
    next();
    next();
    expect(container.querySelector('[data-pointer]')).toBeNull();
  });

  it('draws no pointer row for a visual without pointers', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    next();
    expect(container.querySelector('[data-pointer]')).toBeNull();
  });

  describe('markers', () => {
    const search: ArrayVisual = {
      type: 'array',
      values: [1, 3, 5, 7],
      caption: 'Find 5',
      markers: ['left = {i}', 'mid = {i}', 'right = {i}'],
      steps: [
        {
          at: [0, 1, 3],
          compare: [1],
          ask: 'Is 3 < 5?',
          move: [2, null, 3],
          range: [2, 3],
          caption: 'Yes',
        },
        { at: [2, 2, 3], compare: [2], ask: 'Is 5 == 5?', done: [2], caption: 'Found' },
      ],
    };
    const marker = (i: number) => document.querySelector<HTMLElement>(`[data-marker="${i}"]`);

    it('draws each marker on its own row, named with its position, its name on the roomier side', () => {
      render(<VisualPlayer visual={search} />);
      expect(marker(0)).toBeNull();
      next();
      expect(marker(0)).toHaveTextContent('left = 0');
      expect(marker(0)!.style.transform).toBe(
        'translateX(calc(0 * (100% + var(--gap)))) translateY(0)',
      );
      expect(marker(0)!.querySelector('.left-full')).toHaveTextContent('left = 0');
      expect(marker(2)).toHaveTextContent('right = 3');
      expect(marker(2)!.querySelector('.right-full')).toHaveTextContent('right = 3');
      // Each marker has a row of its own, empty while it is hidden
      const rows = marker(0)!.parentElement!.parentElement!.children;
      expect(rows).toHaveLength(3);
      expect(box(document, 1)).toHaveAttribute('data-state', 'compared');
      next();
      expect(marker(0)).toHaveTextContent('left = 2');
      expect(marker(1)).toBeNull();
      expect(rows).toHaveLength(3);
    });

    it('fades the boxes out of range and colours the done ones green', () => {
      render(<VisualPlayer visual={search} />);
      next();
      expect(box(document, 0)).not.toHaveAttribute('data-out');
      next();
      expect(box(document, 0)).toHaveAttribute('data-out', 'true');
      expect(box(document, 0)).toHaveClass('opacity-30');
      expect(box(document, 2)).not.toHaveAttribute('data-out');
      next();
      expect(box(document, 2)).toHaveAttribute('data-state', 'compared');
      next();
      expect(box(document, 2)).toHaveAttribute('data-state', 'sorted');
      expect(box(document, 3)).toHaveAttribute('data-state', 'idle');
    });

    it('keeps no room above the boxes for a swap when nothing swaps', () => {
      const { container, unmount } = render(<VisualPlayer visual={search} />);
      const drawing = () =>
        container.querySelector<HTMLElement>('[data-box]')!.parentElement!.parentElement!;
      expect(drawing().style.marginTop).toBe('0px');
      unmount();
      const swapping = render(<VisualPlayer visual={visual} />);
      expect(
        swapping.container.querySelector<HTMLElement>('[data-box]')!.parentElement!.parentElement!
          .style.marginTop,
      ).toBe('61px');
    });
  });

  it('stops at both ends, with the buttons marked disabled but still focusable', () => {
    render(<VisualPlayer visual={visual} />);
    const previous = screen.getByRole('button', { name: /previous/i });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toBeDisabled();
    fireEvent.click(previous);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    for (let i = 0; i < 5; i++) next();
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('goes back with Previous and to the start with Start over', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    next();
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByText('How it works')).toBeInTheDocument();
  });

  it('steps with the arrow keys while focused and leaves other keys alone', () => {
    render(<VisualPlayer visual={visual} />);
    expect(player()).toHaveAttribute('tabindex', '0');
    expect(fireEvent.keyDown(player(), { key: 'ArrowRight' })).toBe(false);
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.keyDown(player(), { key: 'ArrowLeft' });
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(fireEvent.keyDown(player(), { key: 'Enter' })).toBe(true);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  describe('the swap', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      // @ts-expect-error jsdom has no Web Animations; the test put one in
      delete HTMLElement.prototype.animate;
    });

    const animate = () => {
      const fn = vi.fn();
      HTMLElement.prototype.animate = fn;
      return fn;
    };

    it('lifts the bigger box over the smaller one, which slides along the row, at the speed picked', () => {
      const fn = animate();
      render(<VisualPlayer visual={visual} />);
      next();
      expect(fn).not.toHaveBeenCalled();
      next();
      expect(fn).toHaveBeenCalledTimes(2);
      // Box 1 (the 3) moves left along the row; box 0 (the 5) moves right, over it
      expect(fn.mock.contexts).toEqual([box(document, 1), box(document, 0)]);
      const [under, over] = fn.mock.calls;
      expect(under[0].map((f: Keyframe) => f.transform)).toEqual([
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
      ]);
      expect(over[0].map((f: Keyframe) => f.transform)).toEqual([
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(-110%)',
        'translateX(calc(1 * (100% + 8px))) translateY(-110%)',
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
      ]);
      expect(under[1]).toEqual({ duration: 1200, easing: 'ease-in-out' });

      fireEvent.click(screen.getByRole('button', { name: 'Slow' }));
      fireEvent.click(screen.getByRole('button', { name: /previous/i }));
      expect(fn.mock.calls[2][1].duration).toBe(2000);
      fireEvent.click(screen.getByRole('button', { name: 'Fast' }));
      next();
      expect(fn.mock.calls[4][1].duration).toBe(600);
    });

    it('puts several moved boxes in place at once', () => {
      const fn = animate();
      render(
        <VisualPlayer
          visual={{
            type: 'array',
            values: [3, 2, 1],
            caption: 'Start',
            steps: [
              { compare: [0, 1], swap: true, caption: 'Swap' },
              { compare: [1, 2], swap: true, caption: 'Swap again' },
            ],
          }}
        />,
      );
      next();
      next();
      expect(fn).toHaveBeenCalledTimes(4);
      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
      expect(fn).toHaveBeenCalledTimes(4);
    });

    it('jumps under reduced motion', () => {
      const fn = animate();
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
      render(<VisualPlayer visual={visual} />);
      next();
      next();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('enlarges into a dialog on the same step, which steps on its own and closes back', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    const enlarge = screen.getByRole('button', { name: 'Enlarge' });
    fireEvent.click(enlarge);
    const dialog = screen.getByRole('dialog', { name: 'Step by step' });
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText('Is 5 > 3?').parentElement).toHaveAttribute(
      'aria-live',
      'polite',
    );
    // Only the dialog speaks while it is open
    expect(within(player()).getByText('Is 5 > 3?').parentElement).not.toHaveAttribute('aria-live');

    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByText('Step 3 of 4')).toBeInTheDocument();
    next(dialog);
    expect(within(dialog).getByText('Step 4 of 4')).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'Enter' });

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(enlarge).toHaveFocus();
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
  });

  it('closes the dialog with its button or a click beside it, not one inside it', () => {
    render(<VisualPlayer visual={visual} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge' }));
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Enlarge' }));
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  describe('boxes and arrows', () => {
    const pointer: BoxesVisual = {
      type: 'boxes',
      caption: 'Boxes and arrows',
      null: 'NULL',
      boxes: [
        { id: 'p', name: 'p', shown: false, cells: [{ to: 'x' }] },
        { id: 'x', name: 'x', shown: false, cells: [{ value: 10 }] },
      ],
      steps: [
        { show: ['x'], caption: 'x is 10' },
        { show: ['p'], caption: 'p points at x' },
        { focus: ['p', 'x'], ask: 'Where does 42 go?', set: { x: 42 }, caption: 'Into x' },
      ],
    };

    const node = (id: string, value: number) => ({
      id,
      shown: false,
      cells: [
        { name: 'value', value },
        { name: 'next', to: null },
      ],
    });

    const list: BoxesVisual = {
      type: 'boxes',
      caption: 'A list',
      null: 'null',
      boxes: [
        { id: 'head', name: 'head', shown: true, cells: [{ to: null }] },
        node('a', 10),
        node('b', 20),
        node('c', 30),
      ],
      steps: [
        { show: ['a', 'b', 'c'], point: { head: 'a', 'a.next': 'b', 'b.next': 'c' }, caption: 'A' },
        { point: { 'a.next': 'c' }, caption: '10 skips 20' },
        { remove: ['b'], caption: '20 goes' },
      ],
    };

    const boxEl = (id: string) => document.querySelector<SVGGElement>(`[data-box="${id}"]`);
    const arrows = () =>
      [...document.querySelectorAll('[data-arrow]')].map(
        (a) => `${a.getAttribute('data-arrow')} -> ${a.getAttribute('data-to')}`,
      );

    // Each animation frame the drawing asks for, played at the time given
    let queued: FrameRequestCallback[] = [];
    const playAt = (ms: number) =>
      act(() => {
        const now = queued;
        queued = [];
        for (const tick of now) tick(ms);
      });

    afterEach(() => {
      vi.unstubAllGlobals();
      queued = [];
    });

    const reduceMotion = () =>
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));

    const animate = () => {
      vi.stubGlobal('matchMedia', () => ({ matches: false }));
      vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
      vi.stubGlobal('cancelAnimationFrame', () => {});
    };

    it('shows the boxes as they come, the arrow on its target, and the new value after the question', () => {
      reduceMotion();
      render(<VisualPlayer visual={pointer} />);
      expect(screen.getByText('Boxes and arrows')).toBeInTheDocument();
      expect(boxEl('x')).toBeNull();
      next();
      expect(boxEl('x')).toHaveTextContent('x10');
      expect(boxEl('p')).toBeNull();
      next();
      expect(arrows()).toEqual(['p -> x']);
      next();
      expect(screen.getByText('Where does 42 go?')).toBeInTheDocument();
      expect(boxEl('x')).toHaveTextContent('10');
      expect(boxEl('x')).toHaveAttribute('data-state', 'focused');
      expect(boxEl('p')).toHaveAttribute('data-state', 'focused');
      next();
      expect(boxEl('x')).toHaveTextContent('42');
      expect(boxEl('x')).not.toHaveTextContent('10');
    });

    it('names a node by its fields and writes the null word in a pointer that points nowhere', () => {
      reduceMotion();
      render(<VisualPlayer visual={list} />);
      expect(boxEl('head')).toHaveTextContent('head');
      expect(boxEl('head')).toHaveTextContent('null');
      next();
      expect(boxEl('a')).toHaveTextContent('valuenext10');
      expect(boxEl('c')).toHaveTextContent('null');
      expect(arrows()).toEqual(['head -> a', 'a.next -> b', 'b.next -> c']);
    });

    it('sends an arrow that skips a box under it, and straightens it once the box is gone', () => {
      reduceMotion();
      render(<VisualPlayer visual={list} />);
      next();
      next();
      expect(arrows()).toEqual(['head -> a', 'a.next -> c', 'b.next -> c']);
      const skip = () => document.querySelector('[data-arrow="a.next"] path')!.getAttribute('d')!;
      // Down in the gap after 10, along under 20 (the row's middle is at 76), up before 30
      expect(skip()).toContain('V 114 Q 113 122 121 122 H 177');
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(193 0)');
      next();
      expect(boxEl('b')).toBeNull();
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(129 0)');
      expect(arrows()).toEqual(['head -> a', 'a.next -> c']);
      expect(skip()).not.toContain('122');
    });

    it('draws an arrow that points back from below the box', () => {
      reduceMotion();
      render(
        <VisualPlayer
          visual={{
            ...pointer,
            boxes: [
              { id: 'x', name: 'x', shown: true, cells: [{ value: 10 }] },
              { id: 'p', name: 'p', shown: true, cells: [{ to: 'x' }] },
            ],
            steps: [{ caption: 'p points back at x' }],
          }}
        />,
      );
      expect(arrows()).toEqual(['p -> x']);
      expect(document.querySelector('[data-arrow="p"] path')!.getAttribute('d')).toMatch(
        /^M 85 56 C 85/,
      );
    });

    it('fades a removed box out first, then slides the rest into its place, at the speed picked', () => {
      animate();
      render(<VisualPlayer visual={list} />);
      next();
      playAt(0);
      playAt(5000);
      next();
      playAt(0);
      playAt(5000);
      next();
      playAt(0);
      playAt(300);
      expect(boxEl('b')).toHaveAttribute('opacity', '0.5');
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(193 0)');
      playAt(900);
      expect(boxEl('b')).toHaveAttribute('opacity', '0');
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(161 0)');
      playAt(1200);
      expect(boxEl('b')).toBeNull();
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(129 0)');

      fireEvent.click(screen.getByRole('button', { name: 'Slow' }));
      fireEvent.click(screen.getByRole('button', { name: /previous/i }));
      playAt(0);
      // Back: the place opens first, then 20 fades in
      playAt(1000);
      expect(boxEl('c')).toHaveAttribute('transform', 'translate(193 0)');
      expect(boxEl('b')).toHaveAttribute('opacity', '0');
      playAt(1500);
      expect(boxEl('b')).toHaveAttribute('opacity', '0.5');
    });

    it('fades the old arrow out before the new one draws in', () => {
      animate();
      render(<VisualPlayer visual={list} />);
      next();
      playAt(0);
      playAt(5000);
      next();
      playAt(0);
      playAt(300);
      expect(arrows()).toEqual(['head -> a', 'a.next -> b', 'b.next -> c']);
      expect(document.querySelector('[data-arrow="a.next"]')).toHaveAttribute('opacity', '0.5');
      playAt(900);
      expect(arrows()).toEqual(['head -> a', 'a.next -> c', 'b.next -> c']);
      expect(document.querySelector('[data-arrow="a.next"] polygon')).toHaveAttribute(
        'opacity',
        '0.5',
      );
    });

    it('puts everything in place at once on Start over', () => {
      animate();
      render(<VisualPlayer visual={list} />);
      next();
      playAt(0);
      playAt(5000);
      next();
      playAt(0);
      playAt(5000);
      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
      expect(queued).toHaveLength(0);
      expect(boxEl('a')).toBeNull();
    });
  });

  describe('a tree', () => {
    const tree: TreeVisual = {
      type: 'tree',
      caption: 'A tree',
      null: 'None',
      array: false,
      nodes: { 0: 8, 1: 3, 2: 10 },
      steps: [
        { add: { 4: 6 }, focus: [4], code: 'root.left.right = Node(6)', caption: '6 goes in' },
        { path: [0, 1, 4], tags: { 4: 'leaf', 0: 'root' }, nulls: [4], caption: 'The path' },
        { swap: [0, 4], caption: 'Swap 8 and 6' },
        { remove: [4], caption: '8 goes' },
      ],
    };

    const node = (place: number) => document.querySelector(`[data-node="${place}"]`);
    const value = (place: number) => document.querySelector(`[data-value="${place}"]`);

    let queued: FrameRequestCallback[] = [];
    const playAt = (ms: number) =>
      act(() => {
        const now = queued;
        queued = [];
        for (const tick of now) tick(ms);
      });

    afterEach(() => {
      vi.unstubAllGlobals();
      queued = [];
    });

    const reduceMotion = () =>
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));

    it('stands each node at its place, a level per depth, and shows the line of code', () => {
      reduceMotion();
      render(<VisualPlayer visual={tree} />);
      // Four levels (the empty children of 6 are on the fourth): the bottom row is 8 slots wide
      expect(node(0)).toHaveAttribute('cx', '160');
      expect(node(0)).toHaveAttribute('cy', '35');
      expect(node(2)).toHaveAttribute('cx', '240');
      expect(node(4)).toBeNull();
      expect(document.querySelector('[data-code]')).toBeNull();
      next();
      expect(node(4)).toHaveAttribute('cx', '120');
      expect(node(4)).toHaveAttribute('cy', '139');
      expect(node(4)).toHaveAttribute('data-state', 'focused');
      expect(value(4)).toHaveTextContent('6');
      expect(document.querySelector('[data-code]')).toHaveTextContent('root.left.right = Node(6)');
    });

    it("lights a path, puts tags beside nodes and shows a node's empty children", () => {
      reduceMotion();
      render(<VisualPlayer visual={tree} />);
      next();
      next();
      expect(document.querySelector('[data-code]')).toBeNull();
      const lit = [...document.querySelectorAll('[data-edge][data-lit]')].map((e) =>
        e.getAttribute('data-edge'),
      );
      expect(lit).toEqual(['1', '4']);
      expect(document.querySelector('[data-edge="2"]')).not.toHaveAttribute('data-lit');
      expect([...document.querySelectorAll('[data-null]')].map((n) => n.textContent)).toEqual([
        'None',
        'None',
      ]);
      // Above a node with children, or with its empty children shown
      const tag = (text: string) =>
        document.querySelector(`[data-tag="${text}"] rect`)!.getAttribute('y');
      expect(tag('root')).toBe('1');
      expect(tag('leaf')).toBe('105');
    });

    it('puts a tag below a node with nothing under it', () => {
      reduceMotion();
      render(
        <VisualPlayer visual={{ ...tree, steps: [{ tags: { 2: 'leaf' }, caption: 'A leaf' }] }} />,
      );
      next();
      // Two levels this time: 10 stands at 87, and the tag 11 below its edge
      expect(document.querySelector('[data-tag="leaf"] rect')).toHaveAttribute('y', '105');
    });

    it('carries a swapped value along to its new node, and fades a removed node out', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: false }));
      vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
      vi.stubGlobal('cancelAnimationFrame', () => {});
      render(<VisualPlayer visual={tree} />);
      next();
      playAt(0);
      playAt(300);
      // Only something comes, so the one beat takes the whole move
      expect(node(4)).toHaveAttribute('opacity', '0.25');
      playAt(5000);
      next();
      playAt(0);
      playAt(5000);
      next();
      playAt(0);
      playAt(600);
      const eight = [...document.querySelectorAll('text')].find((t) => t.textContent === '8')!;
      expect(eight).toHaveAttribute('x', '140');
      playAt(5000);
      expect(value(4)).toHaveTextContent('8');
      expect(value(0)).toHaveTextContent('6');
      next();
      playAt(0);
      playAt(600);
      expect(node(4)).toHaveAttribute('opacity', '0.5');
      playAt(5000);
      expect(node(4)).toBeNull();
    });

    it('opens on the step it was left on when it comes back with the same id', () => {
      reduceMotion();
      const steps = new Map<string, number>();
      const withId = { ...tree, id: 'grow' };
      const { unmount } = render(
        <VisualSteps.Provider value={steps}>
          <VisualPlayer visual={withId} />
        </VisualSteps.Provider>,
      );
      next();
      next();
      unmount();
      render(
        <VisualSteps.Provider value={steps}>
          <VisualPlayer visual={withId} />
        </VisualSteps.Provider>,
      );
      expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
      expect(screen.getByText('The path')).toBeInTheDocument();
    });

    it('marks nodes done in green and shows rows of values under the tree', () => {
      reduceMotion();
      render(
        <VisualPlayer
          visual={{
            ...tree,
            steps: [
              {
                focus: [1],
                done: [0],
                rows: [
                  { label: 'queue', values: [10] },
                  { label: 'printed', values: [] },
                ],
                caption: 'Take 3',
              },
            ],
          }}
        />,
      );
      expect(document.querySelector('[data-row]')).toBeNull();
      next();
      expect(node(0)).toHaveAttribute('data-state', 'done');
      expect(node(1)).toHaveAttribute('data-state', 'focused');
      expect(node(2)).toHaveAttribute('data-state', 'idle');
      expect(document.querySelector('[data-row="queue"]')).toHaveTextContent('queue10');
      expect(document.querySelector('[data-row="printed"]')).toHaveTextContent('printed[ ]');
    });

    it('lays a heap out as a list too, lit like its tree, and carries a moved value in both', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: false }));
      vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
      vi.stubGlobal('cancelAnimationFrame', () => {});
      render(
        <VisualPlayer
          visual={{
            ...tree,
            array: true,
            nodes: { 0: 1, 1: 3, 2: 2 },
            steps: [{ move: [2, 0], focus: [0], caption: '2 to the root' }],
          }}
        />,
      );
      const cell = (place: number) => document.querySelector(`[data-cell="${place}"]`);
      const listValue = (place: number) => document.querySelector(`[data-list-value="${place}"]`);
      // Two levels take 80 units; the list of 3 cells is wider (88), so it sets the width
      expect(cell(2)).toHaveTextContent('2');
      expect(listValue(2)).toHaveTextContent('2');
      expect(listValue(2)).toHaveAttribute('x', '74');
      expect(node(0)).toHaveAttribute('cx', '44');
      next();
      playAt(0);
      playAt(300);
      // 1 fades out first, then 2 travels to the root, in the tree and in the list at once
      expect(listValue(0)).toHaveTextContent('2');
      expect(listValue(0)).toHaveAttribute('x', '74');
      playAt(900);
      expect(listValue(0)).toHaveAttribute('x', '44');
      playAt(5000);
      expect(listValue(0)).toHaveAttribute('x', '14');
      expect(value(0)).toHaveTextContent('2');
      expect(cell(0)).toHaveAttribute('data-state', 'focused');
      expect(cell(2)).toBeNull();
    });
  });
});

describe('VisualPlayer, a graph', () => {
  const graph: GraphVisual = {
    type: 'graph',
    caption: 'A graph',
    directed: false,
    list: false,
    matrix: false,
    vertices: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    edges: [[0, 1]],
    steps: [
      {
        add: [[1, 2]],
        focus: [1],
        seen: [2],
        done: [0],
        used: [[2, 1]],
        tags: { 1: '1' },
        rows: [{ label: 'queue', values: [2] }],
        code: 'queue.append(2)',
        caption: 'Take 1',
      },
      { caption: 'Done' },
    ],
  };

  const vertex = (v: number) => document.querySelector(`[data-vertex="${v}"]`);
  const edge = (key: string) => document.querySelector<SVGGElement>(`[data-edge="${key}"]`);

  let queued: FrameRequestCallback[] = [];
  const playAt = (ms: number) =>
    act(() => {
      const now = queued;
      queued = [];
      for (const tick of now) tick(ms);
    });

  afterEach(() => {
    vi.unstubAllGlobals();
    queued = [];
  });

  const reduceMotion = () =>
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));

  it('stands each vertex where the visual puts it and lights what the step names', () => {
    reduceMotion();
    render(<VisualPlayer visual={graph} />);
    // A tag needs room beside the vertex, so the edges of the drawing are 29.2 units in
    expect(vertex(0)).toHaveAttribute('cx', '29.2');
    expect(vertex(0)).toHaveAttribute('cy', '27');
    expect(vertex(1)).toHaveAttribute('cx', '89.2');
    expect(vertex(2)).toHaveAttribute('cy', '87');
    expect(edge('1-2')).toBeNull();
    expect(document.querySelector('[data-tag]')).toBeNull();
    expect(document.querySelector('[data-code]')).toBeNull();
    next();
    expect(edge('1-2')).toHaveAttribute('data-lit', 'true');
    expect(edge('0-1')).not.toHaveAttribute('data-lit');
    expect(vertex(0)).toHaveAttribute('data-state', 'done');
    expect(vertex(1)).toHaveAttribute('data-state', 'focused');
    expect(vertex(2)).toHaveAttribute('data-state', 'seen');
    expect(document.querySelector('[data-tag="1"]')).toBeInTheDocument();
    expect(document.querySelector('[data-row="queue"]')).toHaveTextContent('queue2');
    expect(document.querySelector('[data-code]')).toHaveTextContent('queue.append(2)');
    expect(document.querySelector('[data-arrow]')).toBeNull();
    next();
    expect(vertex(1)).toHaveAttribute('data-state', 'idle');
    expect(document.querySelector('[data-code]')).toBeNull();
  });

  it("puts a tag in the corner furthest from the vertex's edges", () => {
    reduceMotion();
    render(
      <VisualPlayer
        visual={{ ...graph, steps: [{ add: [[1, 2]], tags: { 1: '1', 0: '0' }, caption: 'x' }] }}
      />,
    );
    next();
    const at = (text: string) => {
      const rect = document.querySelector(`[data-tag="${text}"] rect`)!;
      return [Number(rect.getAttribute('x')), Number(rect.getAttribute('y'))];
    };
    // 1 has edges to its left and down to the left: its tag goes above right
    expect(at('1')[0]).toBeGreaterThan(89.2);
    expect(at('1')[1]).toBeLessThan(27);
    // 0 has edges to its right and below: its tag goes above left
    expect(at('0')[0]).toBeLessThan(29.2);
    expect(at('0')[1]).toBeLessThan(27);
  });

  it('draws arrows on a directed graph and a weight on each edge', () => {
    reduceMotion();
    render(
      <VisualPlayer
        visual={{ ...graph, directed: true, edges: [[0, 1, 4]], steps: [{ caption: 'x' }] }}
      />,
    );
    expect(document.querySelectorAll('[data-arrow]')).toHaveLength(1);
    expect(document.querySelector('[data-weight="4"]')).toHaveTextContent('4');
  });

  it('builds the matrix and the list from the edges, lit only the way the step names', () => {
    reduceMotion();
    render(
      <VisualPlayer
        visual={{
          ...graph,
          list: true,
          matrix: true,
          steps: [{ add: [[1, 2]], used: [[1, 2]], caption: '1 2' }],
        }}
      />,
    );
    const cell = (key: string) => document.querySelector(`[data-matrix="${key}"]`);
    const row = (v: number) => document.querySelector(`[data-row="${v}:"]`);
    expect(cell('0-1')).toHaveTextContent('1');
    expect(cell('1-0')).toHaveTextContent('1');
    expect(cell('1-2')).toHaveTextContent('0');
    expect(row(1)).toHaveTextContent('1:0');
    expect(row(2)).toHaveTextContent('2:[ ]');
    next();
    expect(cell('1-2')).toHaveTextContent('1');
    expect(cell('1-2')).toHaveAttribute('data-lit', 'true');
    expect(cell('2-1')).not.toHaveAttribute('data-lit');
    expect(row(1)).toHaveTextContent('1:02');
    expect(row(1)!.querySelectorAll('[data-lit]')).toHaveLength(1);
    expect(row(2)!.querySelectorAll('[data-lit]')).toHaveLength(0);
    // The edge itself lights up either way
    expect(edge('1-2')).toHaveAttribute('data-lit', 'true');
  });

  it('writes a weighted list as pairs and the weight in the matrix', () => {
    reduceMotion();
    render(
      <VisualPlayer
        visual={{
          ...graph,
          list: true,
          matrix: true,
          directed: true,
          edges: [[0, 1, 4]],
          steps: [{ caption: 'x' }],
        }}
      />,
    );
    expect(document.querySelector('[data-row="0:"]')).toHaveTextContent('0:(1, 4)');
    expect(document.querySelector('[data-row="1:"]')).toHaveTextContent('1:[ ]');
    expect(document.querySelector('[data-matrix="0-1"]')).toHaveTextContent('4');
    expect(document.querySelector('[data-matrix="1-0"]')).toHaveTextContent('0');
  });

  it('fades a new edge in at the speed picked, and out again on Previous', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    render(<VisualPlayer visual={graph} />);
    next();
    playAt(0);
    playAt(600);
    expect(Number(edge('1-2')!.getAttribute('opacity'))).toBeCloseTo(0.5);
    expect(edge('0-1')).toHaveAttribute('opacity', '1');
    playAt(5000);
    expect(edge('1-2')).toHaveAttribute('opacity', '1');
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    playAt(0);
    playAt(300);
    expect(Number(edge('1-2')!.getAttribute('opacity'))).toBeCloseTo(0.75);
    playAt(5000);
    expect(edge('1-2')).toBeNull();
  });
});

describe('VisualPlayer, a grid', () => {
  const grid: GridVisual = {
    type: 'grid',
    caption: 'A maze',
    cells: ['..#', '...'],
    steps: [
      {
        set: [[0, 0, 0]],
        focus: [[0, 0]],
        seen: [[0, 1]],
        rows: [{ label: 'queue', values: ['(0, 1)'] }],
        code: 'dist[0][0] = 0',
        caption: 'The start',
      },
      { set: [[0, 1, 1]], done: [[0, 0]], caption: 'Ring 1' },
    ],
  };

  const cell = (key: string) => document.querySelector(`[data-cell="${key}"]`);

  it('draws walls and free cells, with the values written and the step lit', () => {
    render(<VisualPlayer visual={grid} />);
    expect(document.querySelector('[data-wall="0,2"]')).toBeInTheDocument();
    expect(cell('0,2')).toBeNull();
    expect(cell('0,0')).toHaveAttribute('data-state', 'idle');
    expect(cell('0,0')).toHaveTextContent('');
    next();
    expect(cell('0,0')).toHaveAttribute('data-state', 'focused');
    expect(cell('0,0')).toHaveTextContent('0');
    expect(cell('0,1')).toHaveAttribute('data-state', 'seen');
    expect(document.querySelector('[data-row="queue"]')).toHaveTextContent('queue(0, 1)');
    expect(document.querySelector('[data-code]')).toHaveTextContent('dist[0][0] = 0');
    next();
    expect(cell('0,0')).toHaveAttribute('data-state', 'done');
    expect(cell('0,0')).toHaveTextContent('0');
    expect(cell('0,1')).toHaveTextContent('1');
    expect(cell('1,1')).toHaveAttribute('data-state', 'idle');
  });
});

describe('VisualPlayer, a stack', () => {
  const calls: StackVisual = {
    type: 'stack',
    caption: 'Calls wait',
    queue: false,
    ends: false,
    cards: [{ id: 'main', text: 'main()' }],
    steps: [
      {
        push: [{ id: 'f2', text: 'f(2)', line: '2 * f(1)' }],
        focus: ['f2'],
        caption: 'f(2) waits',
      },
      {
        push: [{ id: 'f1', text: 'f(1)', line: 'return 1' }],
        done: ['f1'],
        tags: { f1: 'base case' },
        caption: 'The base case',
      },
      {
        ask: 'What does f(2) return?',
        pop: 1,
        set: { f2: '2 * 1 = 2' },
        done: ['f1', 'f2'],
        caption: '2',
      },
      { pop: 1, caption: 'Empty' },
    ],
  };

  const card = (id: string) => document.querySelector<HTMLElement>(`[data-card="${id}"]`);
  const lines = (id: string) =>
    [...document.querySelectorAll<HTMLElement>(`[data-line="${id}"]`)].map((line) => [
      line.textContent,
      Number(line.style.opacity),
    ]);

  let queued: FrameRequestCallback[] = [];
  const playAt = (ms: number) =>
    act(() => {
      const now = queued;
      queued = [];
      for (const tick of now) tick(ms);
    });

  afterEach(() => {
    vi.unstubAllGlobals();
    queued = [];
  });

  it('piles the cards up from the floor, newest on top, with their state and tag', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<VisualPlayer visual={calls} />);
    expect(card('main')).toHaveTextContent('main()');
    expect(lines('main')).toEqual([]);
    expect(card('f2')).toBeNull();
    next();
    expect(card('f2')).toHaveTextContent('f(2)2 * f(1)');
    expect(card('f2')).toHaveAttribute('data-state', 'focused');
    next();
    expect(Number.parseFloat(card('f1')!.style.bottom)).toBeGreaterThan(
      Number.parseFloat(card('f2')!.style.bottom),
    );
    expect(card('f1')).toHaveAttribute('data-state', 'done');
    expect(card('f2')).toHaveAttribute('data-state', 'idle');
    expect(card('f1')!.querySelector('[data-tag]')).toHaveTextContent('base case');
    next();
    expect(screen.getByText('What does f(2) return?')).toBeInTheDocument();
    expect(card('f1')).toBeInTheDocument();
    expect(lines('f2')).toEqual([['2 * f(1)', 1]]);
    next();
    expect(card('f1')).toBeNull();
    expect(lines('f2')).toEqual([['2 * 1 = 2', 1]]);
    expect(card('f2')).toHaveAttribute('data-state', 'done');
    next();
    expect(card('f2')).toBeNull();
    expect(card('main')).toBeInTheDocument();
  });

  it('drops a pushed card in, and lifts a popped one out while the new line fades in', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    render(<VisualPlayer visual={calls} />);
    next();
    playAt(0);
    expect(card('f2')!.style.opacity).toBe('0');
    expect(card('f2')!.style.transform).toMatch(/translateY\(-/);
    playAt(5000);
    expect(card('f2')!.style.opacity).toBe('1');
    expect(card('f2')!.style.transform).toBe('');
    next();
    playAt(0);
    playAt(5000);
    next();
    next();
    playAt(0);
    // Halfway through the first beat: f(1) is rising out and the old line fading
    playAt(300);
    expect(Number(card('f1')!.style.opacity)).toBeCloseTo(0.5);
    expect(lines('f2')).toEqual([
      ['2 * f(1)', 0.5],
      ['2 * 1 = 2', 0],
    ]);
    playAt(5000);
    expect(card('f1')).toBeNull();
    expect(lines('f2')).toEqual([['2 * 1 = 2', 1]]);
  });
});

describe('VisualPlayer, a queue and the ends', () => {
  const line: StackVisual = {
    type: 'stack',
    caption: 'A line',
    queue: true,
    ends: true,
    cards: [],
    steps: [
      { push: [{ id: 'a', text: 10 }], caption: '10 joins' },
      { push: [{ id: 'b', text: 20 }], caption: '20 joins' },
      { ask: 'What leaves?', pop: 1, focus: ['a'], caption: '10' },
    ],
  };

  const card = (id: string) => document.querySelector<HTMLElement>(`[data-card="${id}"]`);
  const end = (id: string) => document.querySelector(`[data-end="${id}"]`)?.textContent ?? null;

  let queued: FrameRequestCallback[] = [];
  const playAt = (ms: number) =>
    act(() => {
      const now = queued;
      queued = [];
      for (const tick of now) tick(ms);
    });

  afterEach(() => {
    vi.unstubAllGlobals();
    queued = [];
  });

  it('stands the cards in a row from the front, with the front and back named', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<VisualPlayer visual={line} />);
    next();
    expect(end('a')).toBe('front, back');
    next();
    expect(card('a')!.style.left).toBe('0%');
    expect(card('b')!.style.left).toBe('50%');
    expect(end('a')).toBe('front');
    expect(end('b')).toBe('back');
    next();
    expect(card('a')).toHaveAttribute('data-state', 'focused');
    next();
    expect(card('a')).toBeNull();
    expect(card('b')!.style.left).toBe('0%');
    expect(end('b')).toBe('front, back');
  });

  it('takes the front out to the left, then slides the rest forward', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', (tick: FrameRequestCallback) => queued.push(tick));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    render(<VisualPlayer visual={line} />);
    next();
    playAt(0);
    expect(card('a')!.style.transform).toBe('translateX(60%)');
    playAt(5000);
    next();
    playAt(0);
    playAt(5000);
    next();
    next();
    playAt(0);
    // Two beats, out and forward. A quarter of the way: halfway out, nothing has slid yet
    playAt(300);
    expect(card('a')!.style.transform).toBe('translateX(-30%)');
    expect(card('b')!.style.left).toBe('50%');
    // Three quarters of the way: out, and halfway forward
    playAt(900);
    expect(card('a')).toBeNull();
    expect(card('b')!.style.left).toBe('25%');
  });

  it("names a stack's top card, and only when the visual asks for it", () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    const pile: StackVisual = { ...line, queue: false };
    const { unmount } = render(<VisualPlayer visual={pile} />);
    next();
    next();
    expect(card('b')!.querySelector('[data-tag]')).toHaveTextContent('top');
    expect(card('a')!.querySelector('[data-tag]')).toBeNull();
    unmount();
    render(<VisualPlayer visual={{ ...pile, ends: false }} />);
    next();
    next();
    expect(card('b')!.querySelector('[data-tag]')).toBeNull();
  });
});

describe('VisualPlayer, a question with choices', () => {
  const quiz: ArrayVisual = {
    ...visual,
    steps: [
      { ...visual.steps[0], question: { choices: ['Yes', 'No'], answer: 0 } },
      visual.steps[1],
    ],
  };
  const choice = (name: string, root = player()) => within(root).getByRole('button', { name });
  const skip = (root = player()) => within(root).getByRole('button', { name: /skip/i });

  it('holds the answer back and shows the choices, with Skip in place of Next', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.queryByText('Yes, so they swap')).toBeNull();
    const group = screen.getByRole('group', { name: 'Is 5 > 3?' });
    expect(
      within(group)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Yes', 'No']);
    expect(within(player()).queryByRole('button', { name: /next/i })).toBeNull();
    expect(skip()).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('stays on the question until it is answered, by button or arrow key', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    fireEvent.keyDown(player(), { key: 'ArrowRight' });
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.keyDown(player(), { key: 'ArrowLeft' });
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('says a right pick is right, shows the answer, gives the focus to Next and swaps on it', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    fireEvent.click(choice('Yes'));
    expect(screen.getByText('Right!')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Is 5 > 3?' })).toBeNull();
    const nextButton = within(player()).getByRole('button', { name: /next/i });
    expect(nextButton).toHaveFocus();
    // The answer comes with the question still in place; the swap comes on Next
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(0 * (100% + var(--gap)))) translateY(0)',
    );
    next();
    expect(screen.getByText('Right!')).toBeInTheDocument();
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(1 * (100% + var(--gap)))) translateY(0)',
    );
  });

  it('gives the right choice after a wrong pick, in the live region', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    fireEvent.click(choice('No'));
    const wrong = screen.getByText('Not quite: the answer is Yes.');
    expect(wrong.parentElement).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
  });

  it('shows the answer on Skip, without saying right or wrong, and keeps the focus there', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    const button = skip();
    button.focus();
    fireEvent.click(button);
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(document.querySelector('[data-result]')).toBeNull();
    expect(within(player()).getByRole('button', { name: /next/i })).toHaveFocus();
  });

  it('keeps an answer when going back, and Start over forgets every answer', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    fireEvent.click(choice('No'));
    next();
    next();
    fireEvent.click(within(player()).getByRole('button', { name: /previous/i }));
    fireEvent.click(within(player()).getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Not quite: the answer is Yes.')).toBeInTheDocument();
    fireEvent.click(within(player()).getByRole('button', { name: /previous/i }));
    // Back on the first step, Start over still has answers to forget
    const restart = screen.getByRole('button', { name: 'Start over' });
    expect(restart).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(restart);
    expect(restart).toHaveAttribute('aria-disabled', 'true');
    next();
    expect(screen.getByRole('group', { name: 'Is 5 > 3?' })).toBeInTheDocument();
    expect(screen.queryByText('Not quite: the answer is Yes.')).toBeNull();
  });

  it('answers in the enlarged dialog too, giving the focus to its own Next', () => {
    render(<VisualPlayer visual={quiz} />);
    next();
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge' }));
    const dialog = screen.getByRole('dialog', { name: 'Step by step' });
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.click(choice('Yes', dialog));
    expect(within(dialog).getByText('Right!')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /next/i })).toHaveFocus();
    // The player under the dialog shows the same answer
    expect(within(player()).getByText('Right!')).toBeInTheDocument();
  });
});
