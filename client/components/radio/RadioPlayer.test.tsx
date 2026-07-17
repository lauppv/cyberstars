import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  radio: {
    enabled: true,
    station: { id: 'lofi', titleKey: 'radio.station.lofi', playlistId: 'PL1', mood: 'focus' },
    stationId: 'lofi',
    volume: 40,
    playing: false,
    expanded: false,
    started: false,
    setStation: vi.fn(),
    setVolume: vi.fn(),
    togglePlay: vi.fn(),
    setExpanded: vi.fn(),
  },
  player: {
    ready: false,
    state: 'idle' as string,
    load: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    setVolume: vi.fn(),
  },
}));

vi.mock('../../context/RadioContext', () => ({ useRadio: () => h.radio }));
vi.mock('../../hooks/useYouTubePlayer', () => ({ useYouTubePlayer: () => h.player }));

import { RadioPlayer } from './RadioPlayer';

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(h.radio, {
    enabled: true,
    stationId: 'lofi',
    volume: 40,
    playing: false,
    expanded: false,
    started: false,
  });
  Object.assign(h.player, { ready: false, state: 'idle' });
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

  it('closes the locked hint when clicking outside', () => {
    h.radio.enabled = false;
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('RadioPlayer controls', () => {
  it('shows a play button and toggles playback on click', () => {
    render(<RadioPlayer />);
    const play = screen.getByRole('button', { name: 'Play' });
    fireEvent.click(play);
    expect(h.radio.togglePlay).toHaveBeenCalled();
  });

  it('reflects the playing state in the toggle label', () => {
    h.radio.playing = true;
    render(<RadioPlayer />);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('toggles the expanded panel', () => {
    render(<RadioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(h.radio.setExpanded).toHaveBeenCalledWith(true);
  });

  it('lists stations and volume when expanded', () => {
    h.radio.expanded = true;
    render(<RadioPlayer />);
    fireEvent.click(screen.getByText('Synthwave Drift'));
    expect(h.radio.setStation).toHaveBeenCalledWith('synthwave');
    const slider = screen.getByRole('slider', { name: 'Volume' });
    fireEvent.change(slider, { target: { value: '75' } });
    expect(h.radio.setVolume).toHaveBeenCalledWith(75);
  });

  it('starts playback via the player when started and playing', () => {
    h.radio.started = true;
    h.radio.playing = true;
    render(<RadioPlayer />);
    expect(h.player.load).toHaveBeenCalledWith('PL1', 40);
  });

  it('resumes without reloading when toggling play on the same station', () => {
    h.radio.started = true;
    h.radio.playing = true;
    const { rerender } = render(<RadioPlayer />);
    expect(h.player.load).toHaveBeenCalledTimes(1);
    h.radio.playing = false;
    rerender(<RadioPlayer />);
    expect(h.player.pause).toHaveBeenCalled();
    h.radio.playing = true;
    rerender(<RadioPlayer />);
    expect(h.player.play).toHaveBeenCalled();
    expect(h.player.load).toHaveBeenCalledTimes(1);
  });

  it('shows an offline note when the stream errors', () => {
    h.radio.started = true;
    h.player.state = 'error';
    render(<RadioPlayer />);
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
