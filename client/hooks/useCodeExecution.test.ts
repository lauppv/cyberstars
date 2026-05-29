import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

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

beforeEach(() => {
  wsInstances = [];
  vi.clearAllMocks();
});

describe('useCodeExecution', () => {
  it('starts with empty output and not running', () => {
    const { result } = renderHook(() => useCodeExecution());
    expect(result.current.output).toBe('');
    expect(result.current.isRunning).toBe(false);
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
    const chunk = 'a'.repeat(100_000) + '\n' + 'b'.repeat(200_000);
    act(() => {
      ws.simulateMessage({ type: 'stdout', data: chunk });
    });

    expect(result.current.output.startsWith('... (output truncated) ...')).toBe(true);
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
    vi.stubGlobal('WebSocket', MockWebSocket);
  });
});
