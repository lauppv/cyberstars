import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';
import { identiconUri } from './identicon';

const img = (container: HTMLElement) => container.querySelector('img')!;

describe('Avatar', () => {
  it("shows the person's picture when they have one", () => {
    const { container } = render(<Avatar url="/uploads/a.png" userId={7} />);
    expect(img(container).getAttribute('src')).toBe('/uploads/a.png');
  });

  it('shows the identicon of their id without a picture', () => {
    for (const url of [null, undefined, '']) {
      const { container, unmount } = render(<Avatar url={url} userId={7} />);
      expect(img(container).getAttribute('src')).toBe(identiconUri(7));
      unmount();
    }
  });

  it('draws the same id the same way every time', () => {
    expect(identiconUri(42)).toBe(identiconUri(42));
  });

  it('gives every id its own pattern', () => {
    const uris = new Set(Array.from({ length: 500 }, (_, i) => identiconUri(i + 1)));
    expect(uris.size).toBe(500);
  });

  it('never draws an empty pattern', () => {
    expect(decodeURIComponent(identiconUri(14026))).toContain('<rect');
  });

  it('falls back to the identicon when the picture fails to load', () => {
    const { container } = render(<Avatar url="/uploads/gone.png" userId={7} />);
    fireEvent.error(img(container));
    expect(img(container).getAttribute('src')).toBe(identiconUri(7));
  });

  it('tries a new picture again after an old one failed', () => {
    const { container, rerender } = render(<Avatar url="/uploads/gone.png" userId={7} />);
    fireEvent.error(img(container));
    rerender(<Avatar url="/uploads/new.png" userId={7} />);
    expect(img(container).getAttribute('src')).toBe('/uploads/new.png');
  });

  it('goes back to the identicon once the picture is removed', () => {
    const { container, rerender } = render(<Avatar url="/uploads/a.png" userId={7} />);
    rerender(<Avatar url={null} userId={7} />);
    expect(img(container).getAttribute('src')).toBe(identiconUri(7));
  });

  it('draws at the size it is given', () => {
    const { container } = render(<Avatar url={null} userId={7} size={64} />);
    expect(img(container).style.width).toBe('64px');
    expect(img(container).style.height).toBe('64px');
  });
});
