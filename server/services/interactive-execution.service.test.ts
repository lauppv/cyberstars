import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import type { WebSocket } from 'ws';

const { spawnMock, execFileMock, acquireMock, releaseMock, destroyMock } = vi.hoisted(() => ({
  spawnMock: vi.fn(),
  execFileMock: vi.fn(),
  acquireMock: vi.fn(),
  releaseMock: vi.fn(),
  destroyMock: vi.fn(),
}));

vi.mock('child_process', () => {
  const spawn = (...a: unknown[]) => spawnMock(...a);
  const execFile = (...a: unknown[]) => execFileMock(...a);
  return { spawn, execFile, default: { spawn, execFile } };
});

vi.mock('./code-container.service.js', () => ({
  acquireForRun: (...a: unknown[]) => acquireMock(...a),
  releaseAfterRun: (...a: unknown[]) => releaseMock(...a),
  destroyOwner: (...a: unknown[]) => destroyMock(...a),
}));

const { handleInteractiveRun } = await import('./interactive-execution.service.js');

// Minimal child_process stand-ins: only the surface the service touches.
class FakeProc extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();
  stdin = { write: vi.fn() };
  kill = vi.fn();
  killed = false;
}

class FakeWs extends EventEmitter {
  OPEN = 1;
  readyState = 1;
  send = vi.fn();
  close = vi.fn();
}

function sent(ws: FakeWs) {
  return ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
}

beforeEach(() => {
  vi.clearAllMocks();
  acquireMock.mockResolvedValue('test-container');
  // Default: every docker exec (write source / compile / rm) succeeds.
  execFileMock.mockImplementation((...args: unknown[]) => {
    const cb = args[args.length - 1];
    if (typeof cb === 'function') {
      (cb as (e: Error | null, o: string, s: string) => void)(null, '', '');
    }
    return { stdin: { end: vi.fn() } };
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('handleInteractiveRun', () => {
  it('kills the run after exactly 20s, reports exit 124, and drops the container', async () => {
    vi.useFakeTimers();
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:1');

    vi.advanceTimersByTime(19_999);
    expect(proc.kill).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
    expect(destroyMock).toHaveBeenCalledWith('user:1');

    const messages = sent(ws);
    expect(messages.some((m) => m.type === 'stderr' && m.data.includes('20s'))).toBe(true);
    expect(messages.some((m) => m.type === 'exit' && m.code === 124)).toBe(true);
  });

  it('resets the 20s timer each time stdin is received', async () => {
    vi.useFakeTimers();
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'input()', 'python', 'user:2');

    vi.advanceTimersByTime(19_000);
    ws.emit('message', JSON.stringify({ type: 'stdin', data: 'hi\n' }));
    expect(proc.stdin.write).toHaveBeenCalledWith('hi\n');

    vi.advanceTimersByTime(19_000);
    expect(proc.kill).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1_000);
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });

  it('releases the container for reuse on a normal exit', async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:3');
    proc.emit('close', 0);

    expect(releaseMock).toHaveBeenCalledWith('user:3');
    expect(destroyMock).not.toHaveBeenCalled();
    expect(sent(ws).some((m) => m.type === 'exit' && m.code === 0)).toBe(true);
  });

  it('destroys the container when the page is closed mid-run', async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'input()', 'python', 'user:4');
    ws.emit('close');

    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
    expect(destroyMock).toHaveBeenCalledWith('user:4');
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('reports a busy message and runs nothing when a run is already in progress', async () => {
    acquireMock.mockRejectedValueOnce(new Error('A run is already in progress'));
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:5');

    expect(spawnMock).not.toHaveBeenCalled();
    expect(sent(ws).some((m) => m.type === 'stderr' && /already in progress/.test(m.data))).toBe(
      true,
    );
    expect(sent(ws).some((m) => m.type === 'exit' && m.code === 1)).toBe(true);
    expect(destroyMock).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('reports a compile error and keeps the container', async () => {
    let call = 0;
    execFileMock.mockImplementation((...args: unknown[]) => {
      const cb = args[args.length - 1] as (e: Error | null, o: string, s: string) => void;
      call += 1;
      if (call === 2)
        cb(new Error('compile failed'), '', 'Main.java:1: error: bad'); // compile
      else cb(null, '', ''); // write source
      return { stdin: { end: vi.fn() } };
    });
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'class Main {}', 'java', 'user:6');

    expect(spawnMock).not.toHaveBeenCalled();
    expect(sent(ws).some((m) => m.type === 'stderr' && /error/.test(m.data))).toBe(true);
    expect(releaseMock).toHaveBeenCalledWith('user:6');
    expect(destroyMock).not.toHaveBeenCalled();
  });

  it('drops the container if writing the source fails', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const cb = args[args.length - 1] as (e: Error | null, o: string, s: string) => void;
      cb(new Error('write failed'), '', 'no space left'); // writeSource fails
      return { stdin: { end: vi.fn() } };
    });
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:7');

    expect(spawnMock).not.toHaveBeenCalled();
    expect(destroyMock).toHaveBeenCalledWith('user:7');
  });
});
