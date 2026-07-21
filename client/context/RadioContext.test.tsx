import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: { user: { role: 'USER' } as { role: string } | null },
  canAccess: vi.fn((..._a: unknown[]) => true),
}));

vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));

import { RadioProvider, useRadio } from './RadioContext';

function Probe() {
  const r = useRadio();
  return (
    <div>
      <span data-testid="enabled">{String(r.enabled)}</span>
      <span data-testid="volume">{r.volume}</span>
      <span data-testid="playing">{String(r.playing)}</span>
      <span data-testid="buffering">{String(r.buffering)}</span>
      <span data-testid="offline">{String(r.offline)}</span>
      <button onClick={() => r.togglePlay()}>toggle</button>
      <button onClick={() => r.setVolume(200)}>overvol</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <RadioProvider>
      <Probe />
    </RadioProvider>,
  );
}

let playSpy: ReturnType<typeof vi.fn>;
let pauseSpy: ReturnType<typeof vi.fn>;
let loadSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: { role: 'USER' } };
  h.canAccess.mockReturnValue(true);
  localStorage.clear();
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ now: Date.now() }) })),
  );
  playSpy = vi.fn(() => Promise.resolve());
  pauseSpy = vi.fn();
  loadSpy = vi.fn();
  // jsdom doesn't implement media playback — stub it.
  HTMLMediaElement.prototype.play = playSpy as unknown as HTMLMediaElement['play'];
  HTMLMediaElement.prototype.pause = pauseSpy as unknown as HTMLMediaElement['pause'];
  HTMLMediaElement.prototype.load = loadSpy as unknown as HTMLMediaElement['load'];
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('RadioContext', () => {
  it('uses the default volume with no stored prefs', () => {
    renderProbe();
    expect(screen.getByTestId('volume')).toHaveTextContent('40');
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('restores volume from localStorage', () => {
    localStorage.setItem('cyberstars.radio', JSON.stringify({ volume: 70 }));
    renderProbe();
    expect(screen.getByTestId('volume')).toHaveTextContent('70');
  });

  it('falls back to the default for a corrupt stored value', () => {
    localStorage.setItem('cyberstars.radio', '{not json');
    renderProbe();
    expect(screen.getByTestId('volume')).toHaveTextContent('40');
  });

  it('clamps volume and persists it', () => {
    renderProbe();
    fireEvent.click(screen.getByText('overvol'));
    expect(screen.getByTestId('volume')).toHaveTextContent('100');
    const stored = JSON.parse(localStorage.getItem('cyberstars.radio') as string);
    expect(stored.volume).toBe(100);
  });

  it('togglePlay starts the audio element', () => {
    const { container } = renderProbe();
    fireEvent.click(screen.getByText('toggle'));
    expect(playSpy).toHaveBeenCalled();
    // playing reflects the element's real state via the play event
    act(() => {
      container.querySelector('audio')?.dispatchEvent(new Event('play'));
    });
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
  });

  it('fetches the server clock on mount', () => {
    renderProbe();
    expect(fetch).toHaveBeenCalledWith('/api/time');
  });

  it('is disabled when the feature gate is off', () => {
    h.canAccess.mockReturnValue(false);
    renderProbe();
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
  });

  it('is disabled for guests (no signed-in user)', () => {
    h.auth = { user: null };
    renderProbe();
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
  });

  it('stops playback when the user signs out', () => {
    const { container, rerender } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    act(() => audio.dispatchEvent(new Event('play')));
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    h.auth = { user: null };
    rerender(
      <RadioProvider>
        <Probe />
      </RadioProvider>,
    );
    expect(pauseSpy).toHaveBeenCalled();
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
  });

  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/RadioProvider/);
    spy.mockRestore();
  });

  it('togglePlay pauses when already playing', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    act(() => audio.dispatchEvent(new Event('play')));
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('toggle'));
    expect(pauseSpy).toHaveBeenCalled();
    act(() => audio.dispatchEvent(new Event('pause')));
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('seeks to the live position when the duration is known on play', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
    let ct = 0;
    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      get: () => ct,
      set: (v: number) => {
        ct = v;
      },
    });
    fireEvent.click(screen.getByText('toggle'));
    expect(playSpy).toHaveBeenCalled();
    expect(ct).toBeGreaterThanOrEqual(0);
    expect(ct).toBeLessThan(180);
  });

  it('defers the seek until metadata loads when duration is unknown', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'duration', { configurable: true, value: NaN });
    let ct = -1;
    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      get: () => ct,
      set: (v: number) => {
        ct = v;
      },
    });
    fireEvent.click(screen.getByText('toggle'));
    // still unknown, no seek yet
    expect(ct).toBe(-1);
    // now metadata arrives with a real duration
    Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
    act(() => audio.dispatchEvent(new Event('loadedmetadata')));
    expect(ct).toBeGreaterThanOrEqual(0);
  });

  it('does not preload the stream (large file, most visitors never play)', () => {
    const { container } = renderProbe();
    expect(container.querySelector('audio')?.getAttribute('preload')).toBe('none');
  });

  it('buffers from pressing play until sound actually starts', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('buffering')).toHaveTextContent('true');
    act(() => audio.dispatchEvent(new Event('playing')));
    expect(screen.getByTestId('buffering')).toHaveTextContent('false');
  });

  it('flags buffering on a mid-stream stall and clears it on pause', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    act(() => audio.dispatchEvent(new Event('waiting')));
    expect(screen.getByTestId('buffering')).toHaveTextContent('true');
    act(() => audio.dispatchEvent(new Event('pause')));
    expect(screen.getByTestId('buffering')).toHaveTextContent('false');
  });

  it('clears buffering when play() is rejected (autoplay gesture)', async () => {
    playSpy.mockReturnValue(Promise.reject(new Error('gesture')));
    renderProbe();
    fireEvent.click(screen.getByText('toggle'));
    await act(async () => {});
    expect(screen.getByTestId('buffering')).toHaveTextContent('false');
  });

  it('goes offline on a load error and retries via play', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    act(() => audio.dispatchEvent(new Event('error')));
    expect(screen.getByTestId('offline')).toHaveTextContent('true');
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    // Pressing play again reloads the source and clears the offline flag.
    fireEvent.click(screen.getByText('toggle'));
    expect(loadSpy).toHaveBeenCalled();
    expect(screen.getByTestId('offline')).toHaveTextContent('false');
    expect(playSpy).toHaveBeenCalled();
  });

  it('ignores a server clock payload whose now is not a number', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ now: 'nope' }) })),
    );
    renderProbe();
    await act(async () => {});
    // No throw, radio still usable — the offset simply stays 0.
    expect(screen.getByTestId('enabled')).toHaveTextContent('true');
  });

  it('does nothing on loadedmetadata when no play is pending', () => {
    const { container } = renderProbe();
    const audio = container.querySelector('audio') as HTMLAudioElement;
    let ct = -1;
    Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      get: () => ct,
      set: (v: number) => {
        ct = v;
      },
    });
    act(() => audio.dispatchEvent(new Event('loadedmetadata')));
    expect(ct).toBe(-1);
  });

  it('skips the drift interval while the element is paused', () => {
    vi.useFakeTimers();
    vi.setSystemTime(90_000);
    try {
      const { container } = renderProbe();
      const audio = container.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
      Object.defineProperty(audio, 'paused', { configurable: true, value: true });
      let ct = 5;
      Object.defineProperty(audio, 'currentTime', {
        configurable: true,
        get: () => ct,
        set: (v: number) => {
          ct = v;
        },
      });
      act(() => audio.dispatchEvent(new Event('play')));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // paused guard returned early — no resync.
      expect(ct).toBe(5);
    } finally {
      vi.useRealTimers();
    }
  });

  it('leaves the position alone when drift is within the threshold', () => {
    vi.useFakeTimers();
    vi.setSystemTime(90_000);
    try {
      const { container } = renderProbe();
      const audio = container.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
      Object.defineProperty(audio, 'paused', { configurable: true, value: false });
      Object.defineProperty(audio, 'seeking', { configurable: true, value: false });
      // The interval fires at t=95s where livePosition is 95; sit at 94 so drift
      // (1s) stays under MAX_DRIFT_SEC and no resync happens.
      let ct = 94;
      Object.defineProperty(audio, 'currentTime', {
        configurable: true,
        get: () => ct,
        set: (v: number) => {
          ct = v;
        },
      });
      act(() => audio.dispatchEvent(new Event('play')));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(ct).toBe(94);
    } finally {
      vi.useRealTimers();
    }
  });

  it('resyncs the position when drift exceeds the threshold while playing', () => {
    vi.useFakeTimers();
    // Pin the clock: livePosition is (now/1000) % duration, so a real wall-clock
    // that happens to land within MAX_DRIFT_SEC of the loop boundary would make
    // the expected position ~0 and skip the resync. 90s in sits safely mid-loop.
    vi.setSystemTime(90_000);
    try {
      const { container } = renderProbe();
      const audio = container.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'duration', { configurable: true, value: 180 });
      Object.defineProperty(audio, 'paused', { configurable: true, value: false });
      Object.defineProperty(audio, 'seeking', { configurable: true, value: false });
      let ct = 0;
      Object.defineProperty(audio, 'currentTime', {
        configurable: true,
        get: () => ct,
        set: (v: number) => {
          ct = v;
        },
      });
      act(() => audio.dispatchEvent(new Event('play')));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // drifted from 0 to the live position (>2s), so it snapped forward
      expect(ct).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
