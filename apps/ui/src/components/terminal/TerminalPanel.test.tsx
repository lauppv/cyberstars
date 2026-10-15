import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerminalPanel } from './TerminalPanel';

beforeAll(() => {
  // jsdom has no layout, so focusing and scrolling the terminal is a no-op
  Element.prototype.scrollTo = vi.fn();
});

function renderPanel(onAskTutor?: () => void) {
  render(
    <TerminalPanel
      lines={[]}
      cwd="/home/student"
      isReady
      isExecuting={false}
      onExecute={vi.fn()}
      onReset={vi.fn()}
      onAskTutor={onAskTutor}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
}

describe('TerminalPanel menu', () => {
  it('opens the tutor from the menu and closes it', () => {
    const onAskTutor = vi.fn();
    renderPanel(onAskTutor);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Ask the tutor' }));

    expect(onAskTutor).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('leaves the tutor out when it cannot be opened', () => {
    renderPanel();

    expect(screen.queryByRole('menuitem', { name: 'Ask the tutor' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Reset' })).toBeInTheDocument();
  });
});
