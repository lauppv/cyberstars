import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { CodeLanguage } from '@cyberstars/shared/constants';

let mockUser: { codeLanguage: CodeLanguage | null } | null = null;
const refreshUser = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, refreshUser }),
}));
vi.mock('../services/profileService', () => ({
  saveCodeLanguage: vi.fn(),
}));

const profileService = await import('../services/profileService');
const saveCodeLanguage = vi.mocked(profileService.saveCodeLanguage);
const { useCodeLanguage } = await import('./useCodeLanguage');

const KEY = 'cyberstars.codeLanguage';

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = null;
  localStorage.clear();
  saveCodeLanguage.mockResolvedValue(undefined);
});

describe('useCodeLanguage', () => {
  it('opens Python for a guest who never picked one', () => {
    const { result } = renderHook(() => useCodeLanguage());
    expect(result.current[0]).toBe('python');
  });

  it("keeps a guest's pick on the device, for the next page too", () => {
    const { result } = renderHook(() => useCodeLanguage());
    act(() => result.current[1]('c'));
    expect(result.current[0]).toBe('c');
    expect(localStorage.getItem(KEY)).toBe('c');
    expect(saveCodeLanguage).not.toHaveBeenCalled();

    const next = renderHook(() => useCodeLanguage());
    expect(next.result.current[0]).toBe('c');
  });

  it('ignores something on the device that is no language', () => {
    localStorage.setItem(KEY, 'ruby');
    expect(renderHook(() => useCodeLanguage()).result.current[0]).toBe('python');
  });

  it("opens the account's language, over what another device left here", () => {
    localStorage.setItem(KEY, 'java');
    mockUser = { codeLanguage: 'c' };
    expect(renderHook(() => useCodeLanguage()).result.current[0]).toBe('c');
  });

  it('goes by the device until the account has a language', () => {
    localStorage.setItem(KEY, 'java');
    mockUser = { codeLanguage: null };
    expect(renderHook(() => useCodeLanguage()).result.current[0]).toBe('java');
  });

  it("saves a signed-in student's pick on the account, then reads the account again", async () => {
    mockUser = { codeLanguage: 'python' };
    const { result } = renderHook(() => useCodeLanguage());
    act(() => result.current[1]('java'));
    expect(result.current[0]).toBe('java');
    expect(saveCodeLanguage).toHaveBeenCalledWith('java');
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
  });

  it('keeps the pick on the page when the account could not save it', async () => {
    mockUser = { codeLanguage: 'python' };
    saveCodeLanguage.mockRejectedValue(new Error('offline'));
    const { result } = renderHook(() => useCodeLanguage());
    act(() => result.current[1]('c'));
    await Promise.resolve();
    expect(result.current[0]).toBe('c');
    expect(refreshUser).not.toHaveBeenCalled();
  });

  it('still switches when storage is blocked', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useCodeLanguage());
    expect(result.current[0]).toBe('python');
    act(() => result.current[1]('java'));
    expect(result.current[0]).toBe('java');
    getItem.mockRestore();
    setItem.mockRestore();
  });
});
