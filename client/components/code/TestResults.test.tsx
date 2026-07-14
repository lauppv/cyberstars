import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestResults } from './TestResults';
import type { RunTestsResponse } from '../../../shared/tests';

const passedResults: RunTestsResponse = {
  status: 'passed',
  structureFailures: [],
  cases: [
    { index: 0, visible: true, passed: true },
    { index: 1, visible: false, passed: true },
  ],
};

describe('TestResults', () => {
  it('renders the passed banner and one row per case', () => {
    render(<TestResults results={passedResults} onClose={() => {}} />);
    expect(screen.getByText('All tests passed!')).toBeInTheDocument();
    expect(screen.getAllByText('Passed')).toHaveLength(2);
    expect(screen.getByText(/Test 2/)).toBeInTheDocument();
  });

  it('shows expected/actual for a failed visible case', () => {
    const results: RunTestsResponse = {
      status: 'failed',
      structureFailures: [],
      cases: [{ index: 0, visible: true, passed: false, expected: '400\n350', actual: '400\n300' }],
    };
    render(<TestResults results={results} onClose={() => {}} />);
    expect(screen.getByText('Some tests failed')).toBeInTheDocument();
    expect(screen.getByText(/400\s*350/)).toBeInTheDocument();
    expect(screen.getByText(/400\s*300/)).toBeInTheDocument();
  });

  it('shows input values but no expected output for hidden cases', () => {
    const results: RunTestsResponse = {
      status: 'failed',
      structureFailures: [],
      cases: [
        {
          index: 1,
          visible: false,
          passed: false,
          inject: { tank_a: 15, pilot: ['Rex', 'Kai'] },
          actual: '45',
        },
      ],
    };
    render(<TestResults results={results} onClose={() => {}} />);
    expect(screen.getByText(/tank_a = 15/)).toBeInTheDocument();
    expect(screen.getByText(/pilot = "Rex" → "Kai"/)).toBeInTheDocument();
    expect(screen.queryByText('Expected output:')).not.toBeInTheDocument();
    expect(screen.getByText(/hidden/)).toBeInTheDocument();
  });

  it('renders structure failures, syntax errors, and timeouts', () => {
    const results: RunTestsResponse = {
      status: 'failed',
      syntaxError: 'line 1: invalid syntax',
      structureFailures: [{ type: 'require', rule: { kind: 'variable', name: 'total' } }],
      cases: [{ index: 0, visible: true, passed: false, error: 'timeout' }],
    };
    render(<TestResults results={results} onClose={() => {}} />);
    expect(screen.getByText(/must define the variable total/)).toBeInTheDocument();
    expect(screen.getByText(/invalid syntax/)).toBeInTheDocument();
    expect(screen.getByText(/took too long/)).toBeInTheDocument();
  });

  it('formats boolean, $list, and $dict inject values as Python literals', () => {
    const results: RunTestsResponse = {
      status: 'failed',
      structureFailures: [],
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
          actual: '1',
        },
      ],
    };
    render(<TestResults results={results} onClose={() => {}} />);
    expect(screen.getByText(/active = True/)).toBeInTheDocument();
    expect(screen.getByText(/done = False/)).toBeInTheDocument();
    expect(screen.getByText(/nums = \[1, 2\]/)).toBeInTheDocument();
    expect(screen.getByText(/cfg = \{"a": 1\}/)).toBeInTheDocument();
  });

  it('renders stdin (including the empty placeholder) and runtime errors', () => {
    const results: RunTestsResponse = {
      status: 'failed',
      structureFailures: [],
      cases: [
        { index: 0, visible: true, passed: false, stdin: '5 3\n', expected: '8', actual: '' },
        { index: 1, visible: true, passed: false, stdin: '', error: 'NameError: x' },
      ],
    };
    render(<TestResults results={results} onClose={() => {}} />);
    expect(screen.getByText(/5 3/)).toBeInTheDocument();
    expect(screen.getAllByText('∅').length).toBeGreaterThan(0);
    expect(screen.getByText(/NameError: x/)).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<TestResults results={passedResults} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
