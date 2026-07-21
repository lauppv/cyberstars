import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: mockLang } }),
}));

vi.mock('../services/terminalService', () => ({
  createTerminalSession: vi.fn(),
  execTerminalCommand: vi.fn(),
  destroyTerminalSession: vi.fn(),
}));

let mockLang = 'en';

const terminalService = await import('../services/terminalService');
const mockCreate = vi.mocked(terminalService.createTerminalSession);
const mockExec = vi.mocked(terminalService.execTerminalCommand);
const mockDestroy = vi.mocked(terminalService.destroyTerminalSession);

const { useTerminalSession } = await import('./useTerminalSession');

beforeEach(() => {
  vi.clearAllMocks();
  mockLang = 'en';
  mockCreate.mockResolvedValue({ sessionId: 's1', cwd: '/home/student', intro: 'Welcome' });
  mockExec.mockResolvedValue({ output: 'hello', cwd: '/home/student' });
  mockDestroy.mockResolvedValue(
    undefined as unknown as Awaited<ReturnType<typeof terminalService.destroyTerminalSession>>,
  );
});

describe('useTerminalSession', () => {
  it('does not initialise without course/lesson', () => {
    renderHook(() => useTerminalSession('', ''));
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('creates a session and renders the intro line', async () => {
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(mockCreate).toHaveBeenCalledWith('linux', 'ls-basics', 'en');
    expect(result.current.sessionId).toBe('s1');
    expect(result.current.lines).toEqual([{ type: 'system', text: 'Welcome' }]);
  });

  it('passes ro when the UI language is Romanian', async () => {
    mockLang = 'ro';
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(mockCreate).toHaveBeenCalledWith('linux', 'ls-basics', 'ro');
  });

  it('omits the intro line when the session has none', async () => {
    mockCreate.mockResolvedValue({ sessionId: 's2', cwd: '/home/student' });
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.lines).toEqual([]);
  });

  it('shows a failure line when session creation fails', async () => {
    mockCreate.mockRejectedValue(new Error('docker down'));
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() =>
      expect(result.current.lines).toEqual([
        { type: 'system', text: 'Failed to start session: docker down' },
      ]),
    );
  });

  it('shows a generic failure message for a non-Error rejection', async () => {
    mockCreate.mockRejectedValue('boom');
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() =>
      expect(result.current.lines).toEqual([
        { type: 'system', text: 'Failed to start session: unknown error' },
      ]),
    );
  });

  it('executes a command and appends input + output lines', async () => {
    const onRun = vi.fn();
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics', onRun));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('ls');
    });
    expect(mockExec).toHaveBeenCalledWith('s1', 'ls');
    expect(result.current.lines).toContainEqual({
      type: 'input',
      text: 'ls',
      prompt: 'student@sandbox:~$',
    });
    expect(result.current.lines).toContainEqual({ type: 'output', text: 'hello' });
    expect(onRun).toHaveBeenCalled();
  });

  it('skips the output line when the command produced none', async () => {
    mockExec.mockResolvedValue({ output: '', cwd: '/tmp' });
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('cd /tmp');
    });
    expect(result.current.lines.some((l) => l.type === 'output')).toBe(false);
    expect(result.current.cwd).toBe('/tmp');
  });

  it('renders an error line when execution throws', async () => {
    mockExec.mockRejectedValue(new Error('command failed'));
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('bad');
    });
    expect(result.current.lines).toContainEqual({ type: 'output', text: 'command failed' });
  });

  it('renders a generic error line for a non-Error execution rejection', async () => {
    mockExec.mockRejectedValue('nope');
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    await act(async () => {
      await result.current.execute('bad');
    });
    expect(result.current.lines).toContainEqual({ type: 'output', text: 'Error' });
  });

  it('ignores execute while another command is running', async () => {
    let resolveExec: (v: { output: string; cwd: string }) => void = () => {};
    mockExec.mockImplementation(() => new Promise((res) => (resolveExec = res)));
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    act(() => {
      result.current.execute('slow');
    });
    await waitFor(() => expect(result.current.isExecuting).toBe(true));
    await act(async () => {
      await result.current.execute('second');
    });
    expect(mockExec).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveExec({ output: 'done', cwd: '/home/student' });
    });
  });

  it('reset destroys the old session and reinitialises', async () => {
    const { result } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    mockCreate.mockClear();
    await act(async () => {
      await result.current.reset();
    });
    expect(mockDestroy).toHaveBeenCalledWith('s1');
    expect(mockCreate).toHaveBeenCalled();
  });

  it('destroys the session on unmount', async () => {
    const { result, unmount } = renderHook(() => useTerminalSession('linux', 'ls-basics'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    unmount();
    expect(mockDestroy).toHaveBeenCalledWith('s1');
  });
});
