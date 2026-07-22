import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageMeter } from './UsageMeter';
import type { UsageState } from '../../../shared/usage';

function state(over: Partial<UsageState> = {}): UsageState {
  return { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false, ...over };
}

describe('UsageMeter', () => {
  it('shows the used/limit ratio and label', () => {
    render(<UsageMeter state={state()} label="Solutions" />);
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('renders Unlimited without a ratio for admins', () => {
    render(<UsageMeter state={state({ unlimited: true, remaining: Infinity })} label="Hints" />);
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(screen.queryByText('1/3')).not.toBeInTheDocument();
  });

  it('shows a reset time when one is set', () => {
    render(<UsageMeter state={state({ resetAt: '2026-01-02T09:30:00.000Z' })} label="Solutions" />);
    expect(screen.getByText(/Resets/)).toBeInTheDocument();
  });

  it('hides the reset line in compact mode', () => {
    render(
      <UsageMeter
        state={state({ resetAt: '2026-01-02T09:30:00.000Z' })}
        label="Solutions"
        compact
      />,
    );
    expect(screen.queryByText(/Resets/)).not.toBeInTheDocument();
  });
});
