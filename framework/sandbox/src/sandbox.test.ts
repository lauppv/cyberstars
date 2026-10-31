import { describe, it, expect, vi, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import { pythonRuntime } from './languages/index.js';
import { createSandbox, type SandboxOptions } from './sandbox.js';

// How the pool, the line and the live run work is in their own tests; these
// check what createSandbox puts together
const OPTIONS: SandboxOptions = {
  languages: { python: pythonRuntime },
  label: 'test.sandbox',
  idleMs: 60_000,
  maxContainers: 10,
  memory: '128m',
  pids: '64',
  cpus: '0.5',
  uid: '10001',
  maxBusy: 1,
  queueTimeoutMs: 1000,
  stopAfterMs: 5000,
};

afterEach(() => {
  vi.useRealTimers();
});

describe('createSandbox', () => {
  it('lets maxBusy sandboxes in and counts them', async () => {
    const sandbox = createSandbox({ ...OPTIONS, maxBusy: 2 });
    expect(sandbox.slots()).toEqual({ busySlots: 0, maxBusySlots: 2 });
    const first = await sandbox.acquireSlot();
    const second = await sandbox.acquireSlot();
    expect(sandbox.slots()).toEqual({ busySlots: 2, maxBusySlots: 2 });
    first();
    second();
    expect(sandbox.slots().busySlots).toBe(0);
  });

  it('turns a run away with a 503 saying the server is busy after queueTimeoutMs', async () => {
    vi.useFakeTimers();
    const sandbox = createSandbox(OPTIONS);
    const held = await sandbox.acquireSlot();
    const waiting = sandbox.acquireSlot();
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toMatchObject({
      statusCode: 503,
      message: 'The server is busy right now, please try again in a moment',
    });
    held();
  });

  it('stops work that can be stopped after stopAfterMs, while someone waits', async () => {
    vi.useFakeTimers();
    const sandbox = createSandbox({ ...OPTIONS, queueTimeoutMs: 60_000 });
    let release: () => void = () => {};
    const stop = vi.fn(() => {
      release();
      return true;
    });
    release = await sandbox.acquireSlot({ stop });
    const waiting = sandbox.acquireSlot();
    vi.advanceTimersByTime(4999);
    expect(stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(stop).toHaveBeenCalledTimes(1);
    (await waiting)();
  });

  it("runs live on its own pool's languages", async () => {
    const sandbox = createSandbox(OPTIONS);
    const ws = Object.assign(new EventEmitter(), { OPEN: 1, readyState: 1, send: vi.fn() });
    await sandbox.run(ws, 'x', 'java', 'user:1');
    expect(ws.send.mock.calls.map(([data]) => JSON.parse(data as string))).toEqual([
      { type: 'stderr', data: 'Language not supported.\n' },
      { type: 'exit', code: 1 },
    ]);
  });
});
