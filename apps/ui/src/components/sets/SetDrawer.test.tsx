import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetDrawer } from './SetDrawer';

function Page() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Python</button>
      <button>Behind</button>
      {open && (
        <SetDrawer
          setKey="python"
          title="Python"
          meta={[]}
          description="Learn Python"
          label="Lessons"
          onClose={() => setOpen(false)}
        >
          <a href="/python/print">Print</a>
        </SetDrawer>
      )}
    </>
  );
}

describe('SetDrawer', () => {
  it('keeps Tab inside the drawer, both ways', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Python' }));
    const close = screen.getByRole('button', { name: 'Close' });
    const last = screen.getByRole('link', { name: 'Print' });

    last.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();

    screen.getByRole('button', { name: 'Behind' }).focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(close).toHaveFocus();
  });

  it('gives the focus back to what opened it once it closes', () => {
    render(<Page />);
    const opener = screen.getByRole('button', { name: 'Python' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('dialog')).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  it('closes from its X', () => {
    const onClose = vi.fn();
    render(
      <SetDrawer setKey="python" title="Python" meta={[]} description="" label="" onClose={onClose}>
        {null}
      </SetDrawer>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });
});
