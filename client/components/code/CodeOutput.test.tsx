import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeOutput } from './CodeOutput';

describe('CodeOutput', () => {
  it('shows the placeholder when idle with no output', () => {
    render(<CodeOutput output="" />);
    expect(screen.getByText('Run your code to see the output...')).toBeInTheDocument();
  });

  it('does not show the running dot indicator when idle', () => {
    const { container } = render(<CodeOutput output="" isRunning={false} />);
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });

  it('shows the running dot indicator while running', () => {
    const { container } = render(<CodeOutput output="" isRunning={true} />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders output even when not running, without the placeholder', () => {
    render(<CodeOutput output="hello" />);
    expect(screen.queryByText('Run your code to see the output...')).toBeNull();
    expect(screen.getByTestId('code-output').textContent).toContain('hello');
  });

  it('splits multi-line output into a before-last-line and last-line span', () => {
    const { container } = render(<CodeOutput output={'line1\nline2'} />);
    const spans = container.querySelectorAll('span.text-\\[var\\(--success\\)\\]');
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe('line1\n');
    expect(spans[1].textContent).toBe('line2');
  });

  it('renders a single success span for single-line output (no trailing newline)', () => {
    const { container } = render(<CodeOutput output="oneline" />);
    const spans = container.querySelectorAll('span.text-\\[var\\(--success\\)\\]');
    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toBe('oneline');
  });

  it('uses flex-1 layout classes and only a fontFamily style when fillHeight is set', () => {
    const { container } = render(<CodeOutput output="" isRunning={true} fillHeight />);
    const outer = screen.getByTestId('code-output');
    expect(outer.className).toContain('flex-1 min-h-0 flex flex-col');
    const scrollArea = container.querySelector('.overflow-auto') as HTMLElement;
    expect(scrollArea.className).toContain('flex-1 min-h-0');
    expect(scrollArea.style.height).toBe('');
  });

  it('uses a fixed height style when fillHeight is not set', () => {
    const { container } = render(<CodeOutput output="" height="300px" />);
    const outer = screen.getByTestId('code-output');
    expect(outer.className).not.toContain('flex-1');
    const scrollArea = container.querySelector('.overflow-auto') as HTMLElement;
    expect(scrollArea.style.height).toBe('300px');
  });

  it('does not render the stdin span when not running', () => {
    render(<CodeOutput output="x" isRunning={false} onInput={() => {}} />);
    expect(screen.queryByTestId('stdin-input')).toBeNull();
  });

  it('does not render the stdin span when running but no onInput handler', () => {
    render(<CodeOutput output="x" isRunning={true} />);
    expect(screen.queryByTestId('stdin-input')).toBeNull();
  });

  it('renders the stdin span when running with an onInput handler', () => {
    render(<CodeOutput output="x" isRunning={true} onInput={() => {}} />);
    expect(screen.getByTestId('stdin-input')).toBeInTheDocument();
  });

  it('sends the typed line and clears the span on Enter', () => {
    const onInput = vi.fn();
    render(<CodeOutput output="" isRunning={true} onInput={onInput} />);
    const stdin = screen.getByTestId('stdin-input');
    stdin.textContent = 'abc';
    fireEvent.keyDown(stdin, { key: 'Enter' });
    expect(onInput).toHaveBeenCalledWith('abc\n');
    expect(stdin.textContent).toBe('');
  });

  it('ignores non-Enter keys', () => {
    const onInput = vi.fn();
    render(<CodeOutput output="" isRunning={true} onInput={onInput} />);
    const stdin = screen.getByTestId('stdin-input');
    fireEvent.keyDown(stdin, { key: 'a' });
    expect(onInput).not.toHaveBeenCalled();
  });

  it('focuses the stdin span when clicking the output area while running', () => {
    render(<CodeOutput output="" isRunning={true} onInput={() => {}} />);
    const stdin = screen.getByTestId('stdin-input');
    const focusSpy = vi.spyOn(stdin, 'focus');
    fireEvent.click(screen.getByTestId('code-output').querySelector('.overflow-auto')!);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('does not attempt to focus anything when clicking while idle', () => {
    render(<CodeOutput output="x" isRunning={false} />);
    expect(() =>
      fireEvent.click(screen.getByTestId('code-output').querySelector('.overflow-auto')!),
    ).not.toThrow();
  });

  it('places the caret at the end on focus without throwing', () => {
    render(<CodeOutput output="" isRunning={true} onInput={() => {}} />);
    const stdin = screen.getByTestId('stdin-input');
    stdin.textContent = 'abc';
    expect(() => fireEvent.focus(stdin)).not.toThrow();
  });
});
