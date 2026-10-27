import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { checkMaintenance, isMaintenance, setMaintenance, useMaintenance } from './useMaintenance';

const deploy = () => new Response('', { status: 503, headers: { 'X-Maintenance': '1' } });

afterEach(() => {
  vi.restoreAllMocks();
  act(() => setMaintenance(false));
});

describe('isMaintenance', () => {
  it("is nginx's marked 503 only", () => {
    expect(isMaintenance(deploy())).toBe(true);
    expect(isMaintenance(new Response('{"error":"The server is busy"}', { status: 503 }))).toBe(
      false,
    );
    expect(
      isMaintenance(new Response('', { status: 502, headers: { 'X-Maintenance': '1' } })),
    ).toBe(false);
  });
});

describe('checkMaintenance', () => {
  it('turns the screen on during a deploy and off once the backend answers', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(deploy());
    const { result } = renderHook(() => useMaintenance());
    expect(result.current).toBe(false);

    await act(() => checkMaintenance());
    expect(result.current).toBe(true);

    fetchSpy.mockResolvedValue(new Response('{}', { status: 200 }));
    await act(() => checkMaintenance());
    expect(result.current).toBe(false);
  });

  it('leaves it as it was when the server is out of reach', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    act(() => setMaintenance(true));
    const { result } = renderHook(() => useMaintenance());

    await act(() => checkMaintenance());
    expect(result.current).toBe(true);
  });
});
