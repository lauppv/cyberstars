import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

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
      <span data-testid="station">{r.stationId}</span>
      <span data-testid="volume">{r.volume}</span>
      <span data-testid="playing">{String(r.playing)}</span>
      <span data-testid="started">{String(r.started)}</span>
      <button onClick={() => r.togglePlay()}>toggle</button>
      <button onClick={() => r.setVolume(200)}>overvol</button>
      <button onClick={() => r.setStation('synthwave')}>pick</button>
      <button onClick={() => r.setStation('nope')}>bad</button>
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

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: { role: 'USER' } };
  h.canAccess.mockReturnValue(true);
  localStorage.clear();
});

describe('RadioContext', () => {
  it('uses defaults with no stored prefs', () => {
    renderProbe();
    expect(screen.getByTestId('station')).toHaveTextContent('lofi');
    expect(screen.getByTestId('volume')).toHaveTextContent('40');
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect(screen.getByTestId('started')).toHaveTextContent('false');
  });

  it('restores station and volume from localStorage', () => {
    localStorage.setItem('cyberstars.radio', JSON.stringify({ stationId: 'ambient', volume: 70 }));
    renderProbe();
    expect(screen.getByTestId('station')).toHaveTextContent('ambient');
    expect(screen.getByTestId('volume')).toHaveTextContent('70');
  });

  it('falls back to defaults for a corrupt stored value', () => {
    localStorage.setItem('cyberstars.radio', '{not json');
    renderProbe();
    expect(screen.getByTestId('station')).toHaveTextContent('lofi');
    expect(screen.getByTestId('volume')).toHaveTextContent('40');
  });

  it('falls back to defaults for stored prefs with invalid fields', () => {
    localStorage.setItem('cyberstars.radio', JSON.stringify({ stationId: 'bogus', volume: 'x' }));
    renderProbe();
    expect(screen.getByTestId('station')).toHaveTextContent('lofi');
    expect(screen.getByTestId('volume')).toHaveTextContent('40');
  });

  it('togglePlay marks started and flips playing', () => {
    renderProbe();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('started')).toHaveTextContent('true');
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('clamps volume and persists prefs', () => {
    renderProbe();
    fireEvent.click(screen.getByText('overvol'));
    expect(screen.getByTestId('volume')).toHaveTextContent('100');
    const stored = JSON.parse(localStorage.getItem('cyberstars.radio') as string);
    expect(stored.volume).toBe(100);
  });

  it('ignores an unknown station id but accepts a valid one', () => {
    renderProbe();
    fireEvent.click(screen.getByText('bad'));
    expect(screen.getByTestId('station')).toHaveTextContent('lofi');
    fireEvent.click(screen.getByText('pick'));
    expect(screen.getByTestId('station')).toHaveTextContent('synthwave');
  });

  it('reflects the feature gate in enabled', () => {
    h.canAccess.mockReturnValue(false);
    renderProbe();
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
  });

  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/RadioProvider/);
    spy.mockRestore();
  });
});
