import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultPanel } from './ResultPanel';
import type { RunTestsResponse } from '../../../shared/tests';

const base: RunTestsResponse = {
  status: 'failed',
  structureFailures: [],
  cases: [],
  total: 5,
  passedCount: 0,
};

describe('ResultPanel', () => {
  it('heads an accepted run with the full count', () => {
    render(
      <ResultPanel
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
    expect(screen.getByText('Expected output')).toBeInTheDocument();
    expect(screen.getByText(/400\s*350/)).toBeInTheDocument();
    expect(screen.getByText(/400\s*300/)).toBeInTheDocument();
  });

  it('shows the input but never the expected output of a hidden test', () => {
    render(
      <ResultPanel
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
  });

  it('shows only the first failing test when an older judge sends several', () => {
    render(
      <ResultPanel
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
    render(<ResultPanel results={{ ...base, syntaxError: 'line 1: invalid syntax' }} />);
    expect(screen.getByRole('heading', { name: 'Syntax error' })).toBeInTheDocument();
    expect(screen.getByText('line 1: invalid syntax')).toBeInTheDocument();
    expect(screen.queryByText('tests passed')).not.toBeInTheDocument();
  });

  it('lists failed code checks, and heads with them when every test passed', () => {
    render(
      <ResultPanel
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
        results={{ ...base, cases: [{ index: 0, visible: true, passed: false, error: 'timeout' }] }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Time limit exceeded' })).toBeInTheDocument();
    expect(screen.getByText(/took too long/)).toBeInTheDocument();
    unmount();

    render(
      <ResultPanel
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

  it('falls back to a plain failed heading when nothing names the cause', () => {
    render(<ResultPanel results={{ ...base, total: 0 }} />);
    expect(screen.getByRole('heading', { name: 'Failed' })).toBeInTheDocument();
    expect(screen.getByText('0 / 0')).toBeInTheDocument();
  });
});
