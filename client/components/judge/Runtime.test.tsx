import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Runtime } from './Runtime';
import type { TestCaseResult } from '../../../shared/tests';

const paired: TestCaseResult[] = [
  { index: 0, visible: true, passed: true, userMs: 12, solutionMs: 10 },
  { index: 1, visible: false, passed: true, userMs: 18, solutionMs: 9.5 },
];

describe('Runtime', () => {
  it('renders nothing without timings', () => {
    const { container } = render(<Runtime cases={[{ index: 0, visible: true, passed: true }]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('sums both programs and says how much slower the student is', () => {
    render(<Runtime cases={paired} runtimeMs={30} referenceMs={19.5} />);
    expect(screen.getByText('Your code')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('1.5× slower than the reference')).toBeInTheDocument();
    expect(screen.getByText('Summed over the 2 tests both programs ran')).toBeInTheDocument();
  });

  it('says faster, or about as fast, the other way round', () => {
    const { unmount } = render(<Runtime runtimeMs={5} referenceMs={10} />);
    expect(screen.getByText('2× faster than the reference')).toBeInTheDocument();
    expect(screen.queryByText(/Summed over/)).not.toBeInTheDocument();
    unmount();
    render(<Runtime runtimeMs={10.4} referenceMs={10} />);
    expect(screen.getByText('About as fast as the reference')).toBeInTheDocument();
  });

  it('skips the comparison when the reference took no measurable time', () => {
    render(<Runtime runtimeMs={3} referenceMs={0} />);
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.queryByText(/than the reference/)).not.toBeInTheDocument();
  });

  it('charts each test with both times and reads one out on hover', () => {
    render(<Runtime cases={paired} />);
    expect(screen.getAllByText('Time per test')).toHaveLength(2);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('9.5 ms')).toBeInTheDocument();

    const columns = document.querySelectorAll('figure button');
    expect(columns).toHaveLength(2);
    fireEvent.mouseEnter(columns[1]);
    expect(screen.getByText('Test 2: you 18 ms, reference 9.5 ms')).toBeInTheDocument();
    fireEvent.mouseLeave(columns[1]);
    expect(screen.queryByText(/Test 2: you/)).not.toBeInTheDocument();
    fireEvent.click(columns[0]);
    expect(screen.getByText('Test 1: you 12 ms, reference 10 ms')).toBeInTheDocument();
  });

  it('labels only some tests when there are many', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      index: i,
      visible: true,
      passed: true,
      userMs: i,
      solutionMs: 0,
    }));
    render(<Runtime cases={many} />);
    const labels = document.querySelectorAll('figure [aria-hidden="true"] > div.flex > span');
    const shown = Array.from(labels).filter((el) => el.textContent !== '');
    expect(shown.length).toBeLessThanOrEqual(12);
  });

  it('draws a scale even when every time is zero', () => {
    render(
      <Runtime cases={[{ index: 0, visible: true, passed: true, userMs: 0, solutionMs: 0 }]} />,
    );
    expect(screen.getAllByText('1 ms').length).toBeGreaterThan(0);
  });

  it('draws a quiet line of the student times on generated tests', () => {
    const generated = [4, 6, 5].map((userMs, i) => ({
      index: 10 + i,
      visible: false,
      passed: true,
      generated: true,
      userMs,
    }));
    render(<Runtime cases={generated} />);
    expect(screen.getByText('Your time on 3 generated tests')).toBeInTheDocument();
    expect(screen.getByText('4 to 6 ms')).toBeInTheDocument();
    expect(document.querySelector('polyline')).toBeInTheDocument();
    expect(screen.queryByText('Time per test')).not.toBeInTheDocument();
  });

  it('keeps a flat line flat when every generated test took the same time', () => {
    const flat = [3, 3].map((userMs, i) => ({ index: i, visible: false, passed: true, userMs }));
    render(<Runtime cases={flat} />);
    expect(document.querySelector('polyline')?.getAttribute('points')).toBe('0,92 1,92');
  });
});
