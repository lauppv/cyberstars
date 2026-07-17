import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  radio: {
    enabled: true,
    track: { src: '/radio/neon-skylines.mp3', titleKey: 'radio.track.neonSkylines' },
    volume: 40,
    playing: false,
    hidden: false,
    expanded: false,
    setVolume: vi.fn(),
    togglePlay: vi.fn(),
    setHidden: vi.fn(),
    setExpanded: vi.fn(),
  },
}));

vi.mock('../../context/RadioContext', () => ({ useRadio: () => h.radio }));

import { RadioPlayer } from './RadioPlayer';

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(h.radio, {
    enabled: true,
    volume: 40,
    playing: false,
    hidden: false,
    expanded: false,
  });
});

describe('RadioPlayer gate', () => {
  it('renders the locked chip with a coming-soon hint when disabled', () => {
    h.radio.enabled = false;
    render(<RadioPlayer />);
    const btn = screen.getByRole('button', { name: /Coming soon/ });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render the functional play control when disabled', () => {
    h.radio.enabled = false;
    render(<RadioPlayer />);
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
  });
});

describe('RadioPlayer controls', () => {
  it('shows a play button and toggles playback on click', () => {
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(h.radio.togglePlay).toHaveBeenCalled();
  });

  it('reflects the playing state in the toggle label and shows a LIVE badge', () => {
    h.radio.playing = true;
    render(<RadioPlayer />);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('toggles the expanded volume panel', () => {
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(h.radio.setExpanded).toHaveBeenCalledWith(true);
  });

  it('shows the volume slider when expanded', () => {
    h.radio.expanded = true;
    render(<RadioPlayer />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    fireEvent.change(slider, { target: { value: '75' } });
    expect(h.radio.setVolume).toHaveBeenCalledWith(75);
  });

  it('hides the player via the hide button', () => {
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(h.radio.setHidden).toHaveBeenCalledWith(true);
  });

  it('shows only a launcher chip when hidden and restores on click', () => {
    h.radio.hidden = true;
    render(<RadioPlayer />);
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show radio' }));
    expect(h.radio.setHidden).toHaveBeenCalledWith(false);
  });

  it('shows a pulse indicator on the launcher chip while playing and hidden', () => {
    h.radio.hidden = true;
    h.radio.playing = true;
    const { container } = render(<RadioPlayer />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });
});

describe('RadioPlayer locked chip dismissal', () => {
  it('closes the coming-soon dialog on an outside mousedown', () => {
    h.radio.enabled = false;
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
