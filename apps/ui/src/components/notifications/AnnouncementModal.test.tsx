import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnnouncementModal } from './AnnouncementModal';

function open(onClose = vi.fn()) {
  render(
    <AnnouncementModal
      text={'First line\nSecond line'}
      createdAt="2026-10-28T10:00:00.000Z"
      onClose={onClose}
    />,
  );
  return onClose;
}

describe('AnnouncementModal', () => {
  it('shows the whole text with its line breaks and the day it was sent', () => {
    open();
    const dialog = screen.getByRole('dialog', { name: 'Official announcement' });
    expect(screen.getByText(/First line/)).toHaveClass('whitespace-pre-wrap');
    expect(screen.getByText(/First line/).textContent).toBe('First line\nSecond line');
    expect(dialog).toHaveTextContent('October 28, 2026');
  });

  it('sits on the page itself, over everything', () => {
    const { container } = render(
      <AnnouncementModal text="Hi" createdAt="2026-10-28T10:00:00.000Z" onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(document.body).toContainElement(screen.getByRole('dialog'));
  });

  it('closes on Escape', () => {
    const onClose = open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on a click beside it but not inside it', () => {
    const onClose = open();
    fireEvent.mouseDown(screen.getByText(/First line/));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes from its X', () => {
    const onClose = open();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
