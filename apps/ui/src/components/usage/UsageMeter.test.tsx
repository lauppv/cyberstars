import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageMeter } from './UsageMeter';
import type { UsageState } from '@cyberstars/shared/usage';

function state(over: Partial<UsageState> = {}): UsageState {
  return { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false, ...over };
}

describe('UsageMeter', () => {
  it('shows the share used and the label', () => {
    render(<UsageMeter state={state()} label="Solutions" />);
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('33% used')).toBeInTheDocument();
  });

  it('names the window after the label when given one', () => {
    render(<UsageMeter state={state({ used: 27, limit: 30 })} label="Tutor" period="5 hours" />);
    expect(screen.getByText('· 5 hours', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('90% used')).toBeInTheDocument();
  });

  it('renders Unlimited without a ratio for admins', () => {
    render(<UsageMeter state={state({ unlimited: true, remaining: Infinity })} label="Hints" />);
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(screen.queryByText('33% used')).not.toBeInTheDocument();
  });

  it('shows the refill time when one is set', () => {
    render(<UsageMeter state={state({ resetAt: '2026-01-02T09:30:00.000Z' })} label="Solutions" />);
    expect(screen.getByText(/Refills/)).toBeInTheDocument();
  });

  it('hides the reset line in compact mode', () => {
    render(
      <UsageMeter
        state={state({ resetAt: '2026-01-02T09:30:00.000Z' })}
        label="Solutions"
        compact
      />,
    );
    expect(screen.queryByText(/Refills/)).not.toBeInTheDocument();
  });
});
