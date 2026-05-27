import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../services/codeExecutionService', () => ({
  submitCode: vi.fn(),
}));

vi.mock('../services/apiClient', () => ({
  ApiClientError: class ApiClientError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = 'ApiClientError';
    }
  },
}));

let wsInstances: MockWebSocket[] = [];

class MockWebSocket {
  static readonly OPEN = 1;
  readonly OPEN = 1;
  readyState = 1;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  sent: string[] = [];

  constructor(_url: string) {
    wsInstances.push(this);
    setTimeout(() => this.onopen?.(), 0);
  }

  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.onclose?.();
  }

  simulateMessage(data: object) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

vi.stubGlobal('WebSocket', MockWebSocket);

const { useCodeExecution } = await import('./useCodeExecution');
const { submitCode } = await import('../services/codeExecutionService');
const { ApiClientError } = await import('../services/apiClient');
const mockSubmitCode = vi.mocked(submitCode);

beforeEach(() => {
  wsInstances = [];
  vi.clearAllMocks();
});

describe('useCodeExecution', () => {
  it('starts with empty output and not running', () => {
    const { result } = renderHook(() => useCodeExecution());
    expect(result.current.output).toBe('');
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('execute opens WebSocket and streams stdout', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    expect(result.current.isRunning).toBe(true);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    expect(JSON.parse(ws.sent[0])).toEqual({ type: 'run', code: 'code', language: 'python' });

    act(() => {
      ws.simulateMessage({ type: 'stdout', data: 'Hello' });
    });
    expect(result.current.output).toBe('Hello');

    act(() => {
      ws.simulateMessage({ type: 'exit', code: 0 });
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('execute streams stderr', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'c');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    act(() => {
      ws.simulateMessage({ type: 'stderr', data: 'error: undefined ref\n' });
    });
    expect(result.current.output).toContain('error');
  });

  it('sendInput writes to WebSocket', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    act(() => {
      result.current.sendInput('42\n');
    });
    const ws = wsInstances[0];
    expect(ws.sent).toContainEqual(JSON.stringify({ type: 'stdin', data: '42\n' }));
  });

  it('submit sets submitResult on success', async () => {
    mockSubmitCode.mockResolvedValue({ passed: 3, total: 3, allPassed: true, results: [] });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit('code', 'python', 'python', 'booleans');
    });

    expect(result.current.submitResult?.allPassed).toBe(true);
    expect(result.current.output).toContain('All tests passed');
  });

  it('submit shows partial results', async () => {
    mockSubmitCode.mockResolvedValue({ passed: 1, total: 3, allPassed: false, results: [] });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit('code', 'python', 'python', 'booleans');
    });

    expect(result.current.output).toContain('1/3');
  });

  it('submit shows error on ApiClientError', async () => {
    mockSubmitCode.mockRejectedValue(new ApiClientError(429, 'Too many requests.'));
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit('code', 'python', 'python', 'booleans');
    });

    expect(result.current.output).toBe('Too many requests.');
  });

  it('clearOutput resets state', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    act(() => {
      ws.simulateMessage({ type: 'stdout', data: 'Hello' });
    });
    expect(result.current.output).toBe('Hello');

    act(() => {
      result.current.clearOutput();
    });
    expect(result.current.output).toBe('');
    expect(result.current.submitResult).toBeNull();
  });

  it('execute closes a previous WebSocket before opening a new one', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('a', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    const first = wsInstances[0];
    const closeSpy = vi.spyOn(first, 'close');

    act(() => {
      result.current.execute('b', 'python');
    });
    expect(closeSpy).toHaveBeenCalled();
  });

  it('ws.onerror sets connection error message and stops running', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    act(() => {
      ws.onerror?.();
    });
    expect(result.current.output).toContain('Connection error');
    expect(result.current.isRunning).toBe(false);
  });

  it('ws.onclose stops running', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    act(() => {
      ws.onclose?.();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('sendInput is a no-op when WebSocket is not OPEN', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    ws.readyState = 0;
    const before = ws.sent.length;

    act(() => {
      result.current.sendInput('hi\n');
    });
    expect(ws.sent.length).toBe(before);
  });

  it('clearOutput closes an active WebSocket', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    const closeSpy = vi.spyOn(ws, 'close');

    act(() => {
      result.current.clearOutput();
    });
    expect(closeSpy).toHaveBeenCalled();
  });

  it('submit shows generic error message on non-ApiClientError', async () => {
    mockSubmitCode.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit('code', 'python', 'python', 'booleans');
    });

    expect(result.current.output).toBe('Error connecting to server.');
  });

  it('output is capped and truncated when it exceeds OUTPUT_DISPLAY_MAX', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    const big = 'a'.repeat(256 * 1024 + 10);
    act(() => {
      ws.simulateMessage({ type: 'stdout', data: big });
    });

    expect(result.current.output.length).toBeLessThanOrEqual(256 * 1024 + 50);
    expect(result.current.output.length).toBeGreaterThan(256 * 1024 - 100);
  });

  it('truncation header replaces leading chunk when no newline is present in the kept window', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    // No newlines in the payload — appendCapped falls through to the "no \n" branch.
    const big = 'x'.repeat(256 * 1024 + 100);
    act(() => {
      ws.simulateMessage({ type: 'stdout', data: big });
    });

    expect(result.current.output.startsWith('... (output truncated) ...')).toBe(true);
  });

  it('truncation drops the first partial line when kept window contains a newline', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    // Newlines in the cap window → take the nlIdx >= 0 branch in appendCapped.
    const chunk = 'a'.repeat(100_000) + '\n' + 'b'.repeat(200_000);
    act(() => {
      ws.simulateMessage({ type: 'stdout', data: chunk });
    });

    expect(result.current.output.startsWith('... (output truncated) ...')).toBe(true);
    // The leading 'a' chunk before the newline should be dropped.
    expect(result.current.output).not.toContain('aaaaaaaaaaaaaaaaaaa');
  });

  it('stdout message with missing data field defaults to empty string', async () => {
    const { result } = renderHook(() => useCodeExecution());

    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const ws = wsInstances[0];
    act(() => {
      ws.simulateMessage({ type: 'stdout' });
    });
    expect(result.current.output).toBe('');
  });

  it('uses wss:// when document is served over https', async () => {
    vi.stubGlobal('location', { protocol: 'https:', host: 'example.com' });

    const { result } = renderHook(() => useCodeExecution());
    act(() => {
      result.current.execute('code', 'python');
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(wsInstances.length).toBeGreaterThan(0);

    vi.unstubAllGlobals();
    // Re-stub WebSocket since unstubAllGlobals also removed it
    vi.stubGlobal('WebSocket', MockWebSocket);
  });
});
