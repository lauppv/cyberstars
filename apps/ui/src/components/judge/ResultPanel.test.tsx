import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultPanel } from './ResultPanel';
import type { RunTestsResponse } from '@cyberstars/shared/tests';

const base: RunTestsResponse = {
  status: 'failed',
  comparator: 'trimmed',
  structureFailures: [],
  cases: [],
  total: 5,
  passedCount: 0,
};

// The output box under a field's label, and the runs marked in it.
function field(label: string): HTMLElement {
  return screen.getByText(label).nextElementSibling as HTMLElement;
}
function marks(label: string): string[] {
  return [...field(label).querySelectorAll('mark')].map((m) => m.textContent ?? '');
}

describe('ResultPanel', () => {
  it('heads an accepted run with the full count', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          status: 'passed',
          passedCount: 5,
          cases: [
            { index: 0, visible: true, passed: true },
            { index: 1, visible: false, passed: true },
          ],
        }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Accepted' })).toBeInTheDocument();
    expect(screen.getByText('5 / 5')).toBeInTheDocument();
    expect(screen.getByText('tests passed')).toBeInTheDocument();
    expect(screen.queryByText(/Stopped at/)).not.toBeInTheDocument();
  });

  it('shows the visible test it stopped on, with expected and actual output', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          passedCount: 2,
          cases: [
            { index: 0, visible: true, passed: true },
            { index: 1, visible: true, passed: true },
            { index: 2, visible: true, passed: false, expected: '400\n350', actual: '400\n300' },
          ],
        }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Wrong answer' })).toBeInTheDocument();
    expect(screen.getByText('Stopped at test 3')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test 3' })).toBeInTheDocument();
    expect(field('Expected output')).toHaveTextContent('400 350');
    expect(field('Your output')).toHaveTextContent('400 300');
    // Only the differing character is marked, on both sides.
    expect(marks('Expected output')).toEqual(['5']);
    expect(marks('Your output')).toEqual(['0']);
  });

  it('marks nothing on a lesson that ignores numbers or line order', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          comparator: 'unordered',
          cases: [{ index: 0, visible: true, passed: false, expected: 'a\nb', actual: 'b\nc' }],
        }}
      />,
    );
    expect(field('Expected output')).toHaveTextContent('a b');
    expect(document.querySelector('mark')).toBeNull();
  });

  it("marks a template lesson's fixed text, with the blanks filled from the student's output", () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          comparator: 'template',
          cases: [
            {
              index: 0,
              visible: true,
              passed: false,
              expected: 'My name is <name>\nI am <age> years old',
              actual: 'my name is Lau\nI am 23 years old',
            },
          ],
        }}
      />,
    );
    expect(field('Expected output')).toHaveTextContent('My name is Lau I am 23 years old');
    expect(marks('Expected output')).toEqual(['M']);
    expect(marks('Your output')).toEqual(['m']);
  });

  it('shows the input but never the expected output of a hidden test', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          cases: [
            {
              index: 1,
              visible: false,
              passed: false,
              inject: { tank_a: 15, pilot: ['Rex', 'Kai'] },
              expected: 'leaked',
              actual: '45',
            },
          ],
        }}
      />,
    );
    expect(screen.getByText('Stopped at test 2 (hidden)')).toBeInTheDocument();
    expect(screen.getByText(/tank_a = 15/)).toBeInTheDocument();
    expect(screen.getByText(/pilot = "Rex" → "Kai"/)).toBeInTheDocument();
    expect(screen.queryByText('Expected output')).not.toBeInTheDocument();
    expect(screen.queryByText('leaked')).not.toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(document.querySelector('mark')).toBeNull();
  });

  it('shows only the first failing test when an older judge sends several', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          cases: [
            { index: 0, visible: true, passed: false, actual: 'one' },
            { index: 1, visible: true, passed: false, actual: 'two' },
          ],
        }}
      />,
    );
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.queryByText('two')).not.toBeInTheDocument();
  });

  it('heads a syntax error with its message and no counter', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{ ...base, syntaxError: 'line 1: invalid syntax' }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Syntax error' })).toBeInTheDocument();
    expect(screen.getByText('line 1: invalid syntax')).toBeInTheDocument();
    expect(screen.queryByText('tests passed')).not.toBeInTheDocument();
  });

  it('lists failed code checks, and heads with them when every test passed', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          passedCount: 5,
          structureFailures: [
            { type: 'require', rule: { kind: 'variable', name: 'total' } },
            { type: 'forbid', rule: { kind: 'int_literal', values: [3, 4] } },
          ],
          cases: [{ index: 0, visible: true, passed: true }],
        }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Code checks failed' })).toBeInTheDocument();
    expect(screen.getByText('Code checks')).toBeInTheDocument();
    expect(screen.getByText(/must define the variable total/)).toBeInTheDocument();
    expect(screen.getByText(/found 3, 4 in your code/)).toBeInTheDocument();
  });

  it('names a timeout and a crash', () => {
    const { unmount } = render(
      <ResultPanel
        showRuntime={false}
        results={{ ...base, cases: [{ index: 0, visible: true, passed: false, error: 'timeout' }] }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Time limit exceeded' })).toBeInTheDocument();
    expect(screen.getByText(/took too long/)).toBeInTheDocument();
    unmount();

    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          cases: [{ index: 0, visible: true, passed: false, stdin: '', error: 'NameError: x' }],
        }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Runtime error' })).toBeInTheDocument();
    expect(screen.getByText('Your program crashed')).toBeInTheDocument();
    expect(screen.getByText('NameError: x')).toBeInTheDocument();
    expect(screen.getByText('∅')).toBeInTheDocument();
  });

  it('formats booleans, lists and dicts as Python literals, and stdin as typed', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          cases: [
            {
              index: 0,
              visible: true,
              passed: false,
              inject: {
                active: true,
                done: false,
                nums: { $list: [1, 2] },
                cfg: { $dict: { a: 1 } },
              },
              stdin: '5 3\n',
              expected: '8',
              actual: '',
            },
          ],
        }}
      />,
    );
    expect(screen.getByText(/active = True/)).toBeInTheDocument();
    expect(screen.getByText(/done = False/)).toBeInTheDocument();
    expect(screen.getByText(/nums = \[1, 2\]/)).toBeInTheDocument();
    expect(screen.getByText(/cfg = \{"a": 1\}/)).toBeInTheDocument();
    expect(screen.getByText('5 3')).toBeInTheDocument();
    expect(screen.getByText('∅')).toBeInTheDocument();
  });

  it('folds the passed tests into a list that opens on each one', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{
          ...base,
          passedCount: 2,
          cases: [
            { index: 0, visible: true, passed: true, stdin: '2 3\n', expected: '5', actual: '5' },
            {
              index: 1,
              visible: false,
              passed: true,
              inject: { pilot: ['Rex', 'Kai'] },
              expected: 'Rex Kai',
              actual: 'Rex Kai',
            },
            { index: 2, visible: true, passed: false, expected: '1', actual: '0' },
          ],
        }}
      />,
    );
    const list = screen.getByRole('button', { name: 'Passed tests (2)' });
    expect(list).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Test 1' })).not.toBeInTheDocument();

    fireEvent.click(list);
    expect(screen.getByRole('button', { name: 'Test 1' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Test 3' })).not.toBeInTheDocument();
    expect(screen.queryByText('Rex Kai')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Test 2 (hidden)' }));
    expect(screen.getByText(/pilot = "Rex" → "Kai"/)).toBeInTheDocument();
    expect(screen.getAllByText('Rex Kai')).toHaveLength(2);
  });

  it('names the load test and says its data is too large to show, passed or failed', () => {
    const { unmount } = render(
      <ResultPanel
        showRuntime
        results={{
          ...base,
          status: 'passed',
          passedCount: 2,
          total: 2,
          cases: [
            { index: 0, visible: true, passed: true, expected: '1', actual: '1' },
            { index: 1, visible: false, passed: true, load: true, userMs: 4, solutionMs: 2 },
          ],
          runtimeMs: 4,
          referenceMs: 2,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Passed tests (2)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Test 2 (load test)' }));
    expect(screen.getByText(/too large to show/)).toBeInTheDocument();
    expect(screen.getByText('2× slower than our solution')).toBeInTheDocument();
    unmount();

    render(
      <ResultPanel
        showRuntime
        results={{
          ...base,
          passedCount: 1,
          total: 2,
          cases: [
            { index: 0, visible: true, passed: true },
            { index: 1, visible: false, passed: false, load: true, error: 'timeout' },
          ],
        }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Test 2 (load test)' })).toBeInTheDocument();
    expect(screen.getByText(/too large to show/)).toBeInTheDocument();
    expect(screen.getByText(/took too long/)).toBeInTheDocument();
    expect(screen.queryByText('Runtime')).not.toBeInTheDocument();
  });

  it('leaves the list out when no test passed', () => {
    render(
      <ResultPanel
        showRuntime={false}
        results={{ ...base, cases: [{ index: 0, visible: true, passed: false, actual: '0' }] }}
      />,
    );
    expect(screen.queryByRole('button', { name: /Passed tests/ })).not.toBeInTheDocument();
  });

  it('shows the runtime only when asked to', () => {
    const results: RunTestsResponse = {
      ...base,
      status: 'passed',
      passedCount: 1,
      cases: [{ index: 0, visible: true, passed: true, userMs: 12, solutionMs: 10 }],
      runtimeMs: 12,
      referenceMs: 10,
    };
    const { unmount } = render(<ResultPanel showRuntime={false} results={results} />);
    expect(screen.queryByText('Runtime')).not.toBeInTheDocument();
    unmount();

    render(<ResultPanel showRuntime results={results} />);
    expect(screen.getByText('Runtime')).toBeInTheDocument();
  });

  it('falls back to a plain failed heading when nothing names the cause', () => {
    render(<ResultPanel showRuntime={false} results={{ ...base, total: 0 }} />);
    expect(screen.getByRole('heading', { name: 'Failed' })).toBeInTheDocument();
    expect(screen.getByText('0 / 0')).toBeInTheDocument();
  });
});
