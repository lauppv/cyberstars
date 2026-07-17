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
  // jsdom doesn't implement media playback — stub it.
  HTMLMediaElement.prototype.play = playSpy as unknown as HTMLMediaElement['play'];
  HTMLMediaElement.prototype.pause = pauseSpy as unknown as HTMLMediaElement['pause'];
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

  it('renders no audio element when the feature gate is off', () => {
    h.canAccess.mockReturnValue(false);
    const { container } = renderProbe();
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
    expect(container.querySelector('audio')).toBeNull();
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

  it('resyncs the position when drift exceeds the threshold while playing', () => {
    vi.useFakeTimers();
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
