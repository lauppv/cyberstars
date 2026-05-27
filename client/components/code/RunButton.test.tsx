import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RunButton } from './RunButton';

describe('RunButton', () => {
  it('renders Run label when idle', () => {
    render(<RunButton onClick={() => {}} isRunning={false} />);
    expect(screen.getByRole('button')).toHaveTextContent('Run');
  });

  it('renders Running... when executing', () => {
    render(<RunButton onClick={() => {}} isRunning={true} />);
    expect(screen.getByRole('button')).toHaveTextContent('Running...');
  });

  it('is disabled while running', () => {
    render(<RunButton onClick={() => {}} isRunning={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    render(<RunButton onClick={handler} isRunning={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', () => {
    const handler = vi.fn();
    render(<RunButton onClick={handler} isRunning={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });
});
