import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmojiPicker } from './EmojiPicker';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('EmojiPicker', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens the palette and selects an emoji', () => {
    const onSelect = vi.fn();
    render(<EmojiPicker onSelect={onSelect} />);

    // Palette is closed initially.
    expect(screen.queryByText('🚀')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'profile.addEmoji' }));
    const rocket = screen.getByText('🚀');
    fireEvent.click(rocket);

    expect(onSelect).toHaveBeenCalledWith('🚀');
    // Selecting closes the palette.
    expect(screen.queryByText('🚀')).toBeNull();
  });

  it('closes on Escape and on an outside click', () => {
    render(<EmojiPicker onSelect={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'profile.addEmoji' });

    fireEvent.click(trigger);
    expect(screen.getByText('🔥')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('🔥')).toBeNull();

    fireEvent.click(trigger);
    expect(screen.getByText('🔥')).toBeDefined();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('🔥')).toBeNull();
  });

  it('does not open when disabled', () => {
    render(<EmojiPicker onSelect={vi.fn()} disabled />);
    fireEvent.click(screen.getByRole('button', { name: 'profile.addEmoji' }));
    expect(screen.queryByText('🚀')).toBeNull();
  });
});
