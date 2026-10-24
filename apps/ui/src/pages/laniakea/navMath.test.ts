import { describe, it, expect } from 'vitest';
import { bearingTo, headingOf, mapPoint, type ShipPose } from './navMath';

// A turn of `deg` degrees to the left about the up axis, as a quaternion
function yawLeft(deg: number): ShipPose['quaternion'] {
  const half = (deg * Math.PI) / 360;
  return [0, Math.sin(half), 0, Math.cos(half)];
}
const atStart = (quaternion = yawLeft(0)): ShipPose => ({ position: [0, 0, 0], quaternion });

describe('bearingTo', () => {
  it('finds a point dead ahead with no turn or climb', () => {
    const b = bearingTo(atStart(), [0, 0, -500]);
    expect(b.distance).toBeCloseTo(500);
    expect(b.turn).toBeCloseTo(0);
    expect(b.climb).toBeCloseTo(0);
  });

  it('tells right from left and up from down', () => {
    expect(bearingTo(atStart(), [100, 0, -100]).turn).toBeCloseTo(45);
    expect(bearingTo(atStart(), [-100, 0, -100]).turn).toBeCloseTo(-45);
    expect(bearingTo(atStart(), [0, 100, -100]).climb).toBeCloseTo(45);
    expect(bearingTo(atStart(), [0, 0, 100]).turn).toBeCloseTo(180);
  });

  it('follows the way the ship faces', () => {
    // turned 90 degrees left, the nose points down -x
    const b = bearingTo(atStart(yawLeft(90)), [-300, 0, 0]);
    expect(b.turn).toBeCloseTo(0);
    expect(b.distance).toBeCloseTo(300);
  });
});

describe('headingOf', () => {
  it('reads the heading from above, turning right as positive', () => {
    expect(headingOf(atStart())).toBeCloseTo(0);
    expect(headingOf(atStart(yawLeft(90)))).toBeCloseTo(-Math.PI / 2);
  });
});

describe('mapPoint', () => {
  it('puts the ship in the middle and what is ahead above it', () => {
    expect(mapPoint(atStart(), 0, [0, 0, 0], 1000, 100)).toEqual({ x: 50, y: 50, outside: false });
    const ahead = mapPoint(atStart(), 0, [0, 0, -500], 1000, 100);
    expect(ahead.x).toBeCloseTo(50);
    expect(ahead.y).toBeCloseTo(25);
    const right = mapPoint(atStart(), 0, [500, 0, 0], 1000, 100);
    expect(right.x).toBeCloseTo(75);
  });

  it('turns with the ship', () => {
    const pose = atStart(yawLeft(90));
    const p = mapPoint(pose, headingOf(pose), [-500, 0, 0], 1000, 100);
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(25);
  });

  it('holds a far point on the rim', () => {
    const p = mapPoint(atStart(), 0, [0, 0, -5000], 1000, 100);
    expect(p.outside).toBe(true);
    expect(p.y).toBeCloseTo(0);
  });
});
