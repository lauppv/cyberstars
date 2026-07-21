import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  create: vi.fn(),
  exec: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }));
vi.mock('../services/terminalService', () => ({
  createTerminalSession: (...a: unknown[]) => h.create(...a),
  execTerminalCommand: (...a: unknown[]) => h.exec(...a),
  destroyTerminalSession: (...a: unknown[]) => h.destroy(...a),
}));

import { useTerminalSession } from './useTerminalSession';

beforeEach(() => {
  vi.clearAllMocks();
  h.create.mockResolvedValue({ sessionId: 's1', cwd: '/home/student', intro: 'welcome' });
  h.exec.mockResolvedValue({ output: 'hello', cwd: '/home/student' });
  h.destroy.mockResolvedValue(undefined);
});

describe('useTerminalSession', () => {
  it('fires onCommandRun after a successful command', async () => {
    const onCommandRun = vi.fn();
    const { result } = renderHook(() => useTerminalSession('linux', 'intro', onCommandRun));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('ls');
    });

    expect(h.exec).toHaveBeenCalledWith('s1', 'ls');
    expect(onCommandRun).toHaveBeenCalledTimes(1);
  });

  it('does not fire onCommandRun when the command throws', async () => {
    h.exec.mockRejectedValueOnce(new Error('boom'));
    const onCommandRun = vi.fn();
    const { result } = renderHook(() => useTerminalSession('linux', 'intro', onCommandRun));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('bad');
    });

    expect(onCommandRun).not.toHaveBeenCalled();
  });

  it('works without an onCommandRun callback', async () => {
    const { result } = renderHook(() => useTerminalSession('linux', 'intro'));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('ls');
    });

    expect(result.current.lines.some((l) => l.text === 'hello')).toBe(true);
  });
});
