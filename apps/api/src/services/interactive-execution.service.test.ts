import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import type { WebSocket } from 'ws';

const {
  spawnMock,
  execFileMock,
  acquireMock,
  releaseMock,
  destroyMock,
  acquireSlotMock,
  releaseSlotMock,
  isRunningMock,
} = vi.hoisted(() => ({
  spawnMock: vi.fn(),
  execFileMock: vi.fn(),
  acquireMock: vi.fn(),
  releaseMock: vi.fn(),
  destroyMock: vi.fn(),
  acquireSlotMock: vi.fn(),
  releaseSlotMock: vi.fn(),
  isRunningMock: vi.fn(),
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
  isRunning: (...a: unknown[]) => isRunningMock(...a),
}));

vi.mock('./sandbox-slots.js', () => ({
  acquireSandboxSlot: (...a: unknown[]) => acquireSlotMock(...a),
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
  acquireSlotMock.mockResolvedValue(releaseSlotMock);
  isRunningMock.mockReturnValue(false);
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

    await vi.waitFor(() => expect(releaseMock).toHaveBeenCalledWith('user:3'));
    expect(releaseSlotMock).toHaveBeenCalled();
    expect(destroyMock).not.toHaveBeenCalled();
    expect(sent(ws).some((m) => m.type === 'exit' && m.code === 0)).toBe(true);
  });

  it('stops what the program left running before the exit and the reuse', async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();
    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:bg');

    let finishKill: (() => void) | undefined;
    execFileMock.mockImplementationOnce((_cmd: string, args: string[], _opts, cb) => {
      expect(args).toEqual(['exec', 'test-container', 'sh', '-c', 'kill -9 -1']);
      finishKill = () => (cb as (e: Error | null, o: string, s: string) => void)(null, '', '');
      return { stdin: { end: vi.fn() } };
    });
    proc.emit('close', 0);
    await vi.waitFor(() => expect(finishKill).toBeDefined());
    expect(sent(ws).some((m) => m.type === 'exit')).toBe(false);
    expect(releaseMock).not.toHaveBeenCalled();

    finishKill!();
    await vi.waitFor(() => expect(releaseMock).toHaveBeenCalledWith('user:bg'));
    expect(sent(ws).some((m) => m.type === 'exit' && m.code === 0)).toBe(true);
  });

  it('delivers every byte of a fast output burst, in order', async () => {
    vi.useFakeTimers();
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print', 'python', 'user:burst');
    // ~49KB of output arriving within a single 50ms flush window.
    const lines = Array.from({ length: 10_000 }, (_, i) => `${i + 1}\n`);
    for (let i = 0; i < lines.length; i += 500) {
      proc.stdout.emit('data', Buffer.from(lines.slice(i, i + 500).join('')));
    }
    proc.emit('close', 0);

    const stdout = sent(ws)
      .filter((m) => m.type === 'stdout')
      .map((m) => m.data)
      .join('');
    expect(stdout).toBe(lines.join(''));
  });

  it('destroys the container when the page is closed mid-run', async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'input()', 'python', 'user:4');
    ws.emit('close');

    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
    expect(destroyMock).toHaveBeenCalledWith('user:4');
    expect(releaseSlotMock).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('drops the container and starts nothing when the page closes during the compile', async () => {
    let finishCompile: (() => void) | undefined;
    let call = 0;
    execFileMock.mockImplementation((...args: unknown[]) => {
      const cb = args[args.length - 1] as (e: Error | null, o: string, s: string) => void;
      call += 1;
      if (call === 2)
        finishCompile = () => cb(null, '', ''); // compile still running
      else cb(null, '', ''); // write source
      return { stdin: { end: vi.fn() } };
    });
    const ws = new FakeWs();

    const run = handleInteractiveRun(ws as unknown as WebSocket, 'class Main {}', 'java', 'user:8');
    await vi.waitFor(() => expect(finishCompile).toBeDefined());
    ws.readyState = 3;
    ws.emit('close');
    // The owner is freed at once, not when the compile or a 20s timeout ends.
    expect(destroyMock).toHaveBeenCalledWith('user:8');

    finishCompile!();
    await run;
    expect(spawnMock).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(ws.send).not.toHaveBeenCalled();
  });

  it('drops the container when the page closes while it is still starting', async () => {
    let resolveAcquire: ((id: string) => void) | undefined;
    acquireMock.mockReturnValueOnce(new Promise((r) => (resolveAcquire = r)));
    const ws = new FakeWs();

    const run = handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:9');
    await vi.waitFor(() => expect(acquireMock).toHaveBeenCalled());
    ws.readyState = 3;
    ws.emit('close');
    expect(destroyMock).toHaveBeenCalledWith('user:9');

    resolveAcquire!('test-container');
    await run;
    expect(execFileMock).not.toHaveBeenCalled();
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it("leaves another run's container alone when its own acquire was refused", async () => {
    acquireMock.mockRejectedValueOnce(new Error('A run is already in progress'));
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:10');
    ws.emit('close');

    expect(destroyMock).not.toHaveBeenCalled();
  });

  it('reports an error and drops the container when the spawn fails', async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:err');
    proc.emit('error', new Error('spawn docker ENOENT'));

    expect(sent(ws).some((m) => m.type === 'stderr' && /Could not start/.test(m.data))).toBe(true);
    expect(sent(ws).some((m) => m.type === 'exit' && m.code === 1)).toBe(true);
    expect(destroyMock).toHaveBeenCalledWith('user:err');
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('tells the student the server is busy when no sandbox slot frees in time', async () => {
    acquireSlotMock.mockRejectedValueOnce(new Error('busy'));
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:busy');

    expect(acquireMock).not.toHaveBeenCalled();
    expect(sent(ws)).toEqual([
      { type: 'stderr', data: 'The server is busy right now, please try again in a moment.\n' },
      { type: 'exit', code: 1 },
    ]);
  });

  it("leaves the line, and the owner's container alone, when the page closes while waiting", async () => {
    let signal: AbortSignal | undefined;
    acquireSlotMock.mockImplementationOnce(
      (s: AbortSignal) =>
        new Promise((_resolve, reject) => {
          signal = s;
          s.addEventListener('abort', () => reject(s.reason));
        }),
    );
    const ws = new FakeWs();

    const run = handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:w');
    await vi.waitFor(() => expect(signal).toBeDefined());
    ws.readyState = 3;
    ws.emit('close');
    await run;

    expect(signal!.aborted).toBe(true);
    // Another run of theirs may be using the container right now
    expect(destroyMock).not.toHaveBeenCalled();
    expect(acquireMock).not.toHaveBeenCalled();
    expect(ws.send).not.toHaveBeenCalled();
  });

  it('refuses a second run of the owner at once, without joining the line', async () => {
    isRunningMock.mockReturnValueOnce(true);
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:two');

    expect(isRunningMock).toHaveBeenCalledWith('user:two');
    expect(acquireSlotMock).not.toHaveBeenCalled();
    expect(sent(ws)).toEqual([
      { type: 'stderr', data: 'A run is already in progress.\n' },
      { type: 'exit', code: 1 },
    ]);
    ws.emit('close');
    expect(destroyMock).not.toHaveBeenCalled();
  });

  it('tells a guest their network holds as many sandboxes as it may', async () => {
    const { AppError } = await import('../middleware/errorHandler.js');
    acquireMock.mockRejectedValueOnce(
      new AppError(
        429,
        'Too many guest runs from your network right now. Try again in a minute, or sign in.',
      ),
    );
    const ws = new FakeWs();

    await handleInteractiveRun(
      ws as unknown as WebSocket,
      'print(1)',
      'python',
      'guest:g',
      '1.2.3.4',
    );

    expect(acquireMock).toHaveBeenCalledWith('guest:g', 'python', '1.2.3.4');
    expect(sent(ws)).toEqual([
      {
        type: 'stderr',
        data: 'Too many guest runs from your network right now. Try again in a minute, or sign in.\n',
      },
      { type: 'exit', code: 1 },
    ]);
  });

  it('frees the slot when the container could not be had', async () => {
    acquireMock.mockRejectedValueOnce(new Error('docker daemon down'));
    const ws = new FakeWs();

    await handleInteractiveRun(ws as unknown as WebSocket, 'print(1)', 'python', 'user:nod');

    expect(releaseSlotMock).toHaveBeenCalled();
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
