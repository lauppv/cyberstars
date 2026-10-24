import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { TerminalTestResult } from '@cyberstars/shared/terminal';
import { TerminalTestResults } from './TerminalTestResults';

const result = (status: 'passed' | 'failed'): TerminalTestResult => ({ status, checks: [] });

describe('TerminalTestResults', () => {
  it('leads on to the next lesson under a pass only', () => {
    const next = <button>Next lesson</button>;
    const { rerender } = render(
      <TerminalTestResults results={result('passed')} onClose={vi.fn()} next={next} />,
    );
    expect(screen.getByRole('button', { name: 'Next lesson' })).toBeInTheDocument();
    rerender(<TerminalTestResults results={result('failed')} onClose={vi.fn()} next={next} />);
    expect(screen.queryByRole('button', { name: 'Next lesson' })).toBeNull();
  });
});
