import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityHeatmap } from './ActivityHeatmap';
import { localDateStr } from './heatmap-utils';

// The step a day's cell is painted with, from the first to the brightest
const STEPS = ['#3b2a6e', '#553aa3', '#7451d6', '#9d7cf4', '#cbb6ff'];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateStr(d);
}

function cell(count: number): HTMLElement {
  return screen.getByTitle(new RegExp(`: ${count} lessons? completed$`));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 21, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ActivityHeatmap', () => {
  it('gives the busiest day the brightest step, however few lessons it had', () => {
    render(
      <ActivityHeatmap activityCounts={{ [daysAgo(0)]: 6, [daysAgo(1)]: 3, [daysAgo(2)]: 1 }} />,
    );
    expect(cell(6)).toHaveStyle({ background: STEPS[4] });
    expect(cell(3)).toHaveStyle({ background: STEPS[2] });
    expect(cell(1)).toHaveStyle({ background: STEPS[0] });
  });

  it('scales the same way when the busiest day had a hundred', () => {
    render(
      <ActivityHeatmap activityCounts={{ [daysAgo(0)]: 100, [daysAgo(1)]: 6, [daysAgo(2)]: 61 }} />,
    );
    expect(cell(100)).toHaveStyle({ background: STEPS[4] });
    expect(cell(6)).toHaveStyle({ background: STEPS[0] });
    expect(cell(61)).toHaveStyle({ background: STEPS[3] });
  });

  it('counts the last three months and leaves older days out', () => {
    render(<ActivityHeatmap activityCounts={{ [daysAgo(10)]: 2, [daysAgo(100)]: 5 }} />);
    expect(screen.getByText(/active day in the last 3 months/)).toBeInTheDocument();
    expect(screen.queryByTitle(/: 5 lessons completed$/)).not.toBeInTheDocument();
    // A whole week per column, Monday to Sunday, from the week of 22 July
    const grid = screen.getByTitle(/: 2 lessons completed$/).parentElement!.parentElement!;
    expect(grid.children).toHaveLength(14);
  });

  it('shows six steps in the legend', () => {
    const { container } = render(<ActivityHeatmap activityCounts={{}} />);
    expect(container.querySelectorAll('.w-3.h-3')).toHaveLength(6);
    expect(screen.getByText(/active days in the last 3 months/)).toBeInTheDocument();
  });
});
