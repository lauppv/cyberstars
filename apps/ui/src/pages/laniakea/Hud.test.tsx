import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { createFeed } from './feed';
import { testPlanet } from './testPlanets';
import { ShipBoard } from './ShipBoard';
import { AimCard } from './AimCard';
import { TargetReadout } from './TargetReadout';
import { StarMap } from './StarMap';
import { ShipStats, SpeedPanel } from './ShipStats';
import { withCode } from './codeText';
import type { ShipPose } from './navMath';
import type { Aim } from './scene/explorer';

const NOW = Date.parse('2026-10-24T12:00:00Z');
const later = (ms: number) => new Date(NOW + ms).toISOString();
const TITLES = new Map([
  ['print', 'Print'],
  ['variables-str', 'Variables (Strings)'],
  ['if-else', 'If/Else'],
  ['lists', 'Lists'],
]);
const START: ShipPose = { position: [0, 0, 0], quaternion: [0, 0, 0, 1] };

beforeEach(() => localStorage.clear());

describe('ShipBoard', () => {
  const planets = [
    testPlanet({ slug: 'print', level: 2, nextRecapAt: later(3600_000) }),
    testPlanet({ slug: 'variables-str' }),
    testPlanet({ slug: 'if-else', level: 1, nextRecapAt: later(-1) }),
    testPlanet({ slug: 'lists', lessonDone: false }),
  ];
  const board = (over = {}) => {
    const props = {
      planets,
      titles: TITLES,
      now: NOW,
      target: null as string | null,
      onTarget: vi.fn(),
      onClose: vi.fn(),
      ...over,
    };
    render(<ShipBoard {...props} />);
    return props;
  };
  const rows = () =>
    screen.getAllByRole('listitem').map((li) => within(li).getByRole('button').textContent);

  it('lists the reachable planets, what is open now first, with their countdowns', () => {
    board();
    expect(rows()).toEqual([
      'If/ElseRecap open',
      'Variables (Strings)Ready to conquer',
      'PrintNext recap in 1h 0m',
    ]);
    expect(screen.getByText('1 more planet waits for its lesson')).toBeInTheDocument();
  });

  it('sorts by lesson order or by how far planets moved, and remembers the choice', () => {
    board();
    fireEvent.change(screen.getByLabelText('Sort the planets'), { target: { value: 'order' } });
    expect(rows()[0]).toMatch(/^Print/);
    fireEvent.change(screen.getByLabelText('Sort the planets'), { target: { value: 'level' } });
    expect(rows()[0]).toMatch(/^Print/);
    expect(localStorage.getItem('cyberstars.laniakea.sort')).toBe('level');
  });

  it('opens on the sort chosen last time', () => {
    localStorage.setItem('cyberstars.laniakea.sort', 'order');
    board();
    expect(screen.getByLabelText('Sort the planets')).toHaveValue('order');
  });

  it('makes a planet the target, and a second click lets it go', () => {
    const props = board({ target: 'print' });
    fireEvent.click(screen.getByRole('button', { name: /Variables/ }));
    expect(props.onTarget).toHaveBeenCalledWith('variables-str');
    fireEvent.click(screen.getByRole('button', { name: /^Print/ }));
    expect(props.onTarget).toHaveBeenCalledWith(null);
    expect(screen.getByRole('button', { name: /^Print/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('closes', () => {
    const props = board();
    fireEvent.click(screen.getByRole('button', { name: 'Close the board' }));
    expect(props.onClose).toHaveBeenCalled();
  });

  it('says how to fill an empty board', () => {
    board({ planets: [testPlanet({ lessonDone: false })] });
    expect(screen.getByText(/Finish a Python lesson/)).toBeInTheDocument();
  });
});

describe('AimCard', () => {
  const planets = new Map([
    ['print', testPlanet()],
    ['lists', testPlanet({ slug: 'lists', lessonDone: false })],
  ]);
  const card = (aim: Aim | null, isTouch = false) => {
    const feed = createFeed<Aim | null>(aim);
    const onLand = vi.fn();
    render(
      <AimCard
        aim={feed}
        planets={planets}
        titles={TITLES}
        now={NOW}
        isTouch={isTouch}
        onLand={onLand}
      />,
    );
    return { feed, onLand };
  };

  it('shows nothing while no planet is ahead', () => {
    const { container } = render(
      <AimCard
        aim={createFeed<Aim | null>(null)}
        planets={planets}
        titles={TITLES}
        now={NOW}
        isTouch={false}
        onLand={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('asks to fly closer, then offers to land', () => {
    const { feed, onLand } = card({ slug: 'print', distance: 1434, inReach: false });
    expect(screen.getByText(/Fly closer to land/)).toBeInTheDocument();
    act(() => feed.set({ slug: 'print', distance: 300, inReach: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Land' }));
    expect(onLand).toHaveBeenCalledWith('print');
    expect(screen.getByText('E to land')).toBeInTheDocument();
  });

  it('leaves the key out on a touch screen', () => {
    card({ slug: 'print', distance: 300, inReach: true }, true);
    expect(screen.queryByText('E to land')).toBeNull();
  });

  it('offers no landing on a planet out of reach', () => {
    card({ slug: 'lists', distance: 100, inReach: true });
    expect(screen.getByText('Finish its lesson to reach it')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Land' })).toBeNull();
  });
});

describe('TargetReadout', () => {
  const spot = {
    slug: 'print',
    position: [0, 0, -1600] as [number, number, number],
    radius: 100,
    look: 0,
  };

  it('asks for a target while there is none', () => {
    render(<TargetReadout pose={createFeed<ShipPose | null>(START)} spot={null} title={null} />);
    expect(screen.getByText(/Pick a planet on the board/)).toBeInTheDocument();
  });

  it('says how far the target is and that it is straight ahead', () => {
    render(<TargetReadout pose={createFeed<ShipPose | null>(START)} spot={spot} title="Print" />);
    expect(screen.getByText('Straight ahead')).toBeInTheDocument();
    expect(screen.getByText(`${(15000).toLocaleString()} km`)).toBeInTheDocument();
  });

  it('says which way to turn and climb', () => {
    const off = { ...spot, position: [-1000, -400, -1000] as [number, number, number] };
    render(<TargetReadout pose={createFeed<ShipPose | null>(START)} spot={off} title="Print" />);
    expect(screen.getByText('45° left')).toBeInTheDocument();
    expect(screen.getByText(/° down$/)).toBeInTheDocument();
    const right = { ...spot, position: [1000, 400, -1000] as [number, number, number] };
    render(<TargetReadout pose={createFeed<ShipPose | null>(START)} spot={right} title="Print" />);
    expect(screen.getByText('45° right')).toBeInTheDocument();
    expect(screen.getByText(/° up$/)).toBeInTheDocument();
  });

  it('says when the ship has arrived', () => {
    const near = { ...spot, position: [0, 0, -500] as [number, number, number] };
    render(<TargetReadout pose={createFeed<ShipPose | null>(START)} spot={near} title="Print" />);
    expect(screen.getByText("You're there")).toBeInTheDocument();
  });
});

describe('StarMap', () => {
  it('draws the map as a picture with a name', () => {
    const pose = createFeed<ShipPose | null>(null);
    render(
      <StarMap
        pose={pose}
        spots={[{ slug: 'print', position: [0, 0, -1600], radius: 100, look: 0 }]}
        marks={{ print: 'owned' }}
        target="print"
      />,
    );
    act(() => pose.set(START));
    expect(screen.getByRole('img', { name: 'Star map' })).toBeInTheDocument();
  });

  it('draws planets, the target and the ship when the canvas can', () => {
    const ctx = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
    };
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    render(
      <StarMap
        pose={createFeed<ShipPose | null>(START)}
        spots={[
          { slug: 'print', position: [0, 0, -1600], radius: 100, look: 0 },
          { slug: 'lists', position: [0, 0, -90000], radius: 100, look: 0 },
        ]}
        marks={{ print: 'owned' }}
        target="print"
      />,
    );
    // two planets, the target's ring and the two rings of the map itself
    expect(ctx.arc).toHaveBeenCalledTimes(5);
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
    getContext.mockRestore();
  });
});

describe('ShipStats', () => {
  it('counts the planets that are the student’s, those for good and the open recaps', () => {
    render(
      <ShipStats
        now={NOW}
        planets={[
          testPlanet({ level: 8 }),
          testPlanet({ slug: 'a', level: 2, nextRecapAt: later(-1) }),
          testPlanet({ slug: 'b' }),
        ]}
      />,
    );
    expect(screen.getByText('Planets').nextSibling).toHaveTextContent('2/3');
    expect(screen.getByText('For good').nextSibling).toHaveTextContent('1');
    expect(screen.getByText('Recaps open').nextSibling).toHaveTextContent('1');
  });

  it('shows the speed', () => {
    const speed = createFeed(0);
    render(<SpeedPanel speed={speed} />);
    act(() => speed.set(2));
    expect(screen.getByText('Velocity').nextSibling).toHaveTextContent('1,200');
  });
});

describe('withCode', () => {
  it('shows the words between backticks as code', () => {
    render(<p>{withCode('Which line uses `print()` here?')}</p>);
    expect(screen.getByText('print()').tagName).toBe('CODE');
  });
});
