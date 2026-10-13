// @vitest-environment node
import { EventEmitter } from 'events';
import { PassThrough } from 'stream';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockSpawn, mockExecFile } = vi.hoisted(() => ({
  mockSpawn: vi.fn(),
  mockExecFile: vi.fn(),
}));
vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>();
  const patched = {
    ...actual,
    spawn: (...args: unknown[]) => mockSpawn(...args),
    execFile: (...args: unknown[]) => mockExecFile(...args),
  };
  return { ...patched, default: patched };
});

const { dockerExec, dockerConverse } = await import('./docker-exec.js');

type ExecCallback = (err: Error | null, stdout: string, stderr: string) => void;

describe('dockerExec', () => {
  it('resolves trimmed stdout and pipes stdin in', async () => {
    const stdin = new PassThrough();
    const written: string[] = [];
    stdin.on('data', (chunk: Buffer) => written.push(chunk.toString()));
    mockExecFile.mockImplementationOnce(
      (_cmd: string, _args: string[], _opts: unknown, cb: ExecCallback) => {
        setImmediate(() => cb(null, ' out \n', ''));
        return { stdin };
      },
    );
    await expect(dockerExec(['exec', 'cid', 'cat'], 1000, 'payload')).resolves.toBe('out');
    expect(written.join('')).toBe('payload');
  });

  it('rejects with stderr, or the error message when stderr is empty', async () => {
    mockExecFile.mockImplementationOnce(
      (_cmd: string, _args: string[], _opts: unknown, cb: ExecCallback) => {
        cb(new Error('exit 1'), '', 'no such container');
        return {};
      },
    );
    await expect(dockerExec(['x'])).rejects.toThrow('no such container');
    mockExecFile.mockImplementationOnce(
      (_cmd: string, _args: string[], _opts: unknown, cb: ExecCallback) => {
        cb(new Error('exit 1'), '', '');
        return {};
      },
    );
    await expect(dockerExec(['x'])).rejects.toThrow('exit 1');
  });
});

class FakeProcess extends EventEmitter {
  stdin = new PassThrough();
  stdout = new PassThrough();
  stderr = new PassThrough();
  written: string[] = [];
  kill = vi.fn((signal?: string) => {
    this.emit('close', null, signal);
    return true;
  });

  constructor() {
    super();
    this.stdin.on('data', (chunk: Buffer) => this.written.push(chunk.toString()));
  }

  exit(code: number) {
    this.emit('close', code);
  }
}

let proc: FakeProcess;
beforeEach(() => {
  proc = new FakeProcess();
  mockSpawn.mockReturnValue(proc);
});
afterEach(() => {
  vi.useRealTimers();
});

const tick = () => new Promise((resolve) => setImmediate(resolve));

describe('dockerConverse', () => {
  it('hands each stdout line to onLine and writes its replies back', async () => {
    const lines: string[] = [];
    const done = dockerConverse(['exec', '-i', 'cid', 'run'], 1000, (line) => {
      lines.push(line);
      return line === 'header' ? null : 'next';
    });
    expect(mockSpawn).toHaveBeenCalledWith('docker', ['exec', '-i', 'cid', 'run'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Lines may arrive split across chunks, several per chunk, with blanks.
    proc.stdout.write('head');
    proc.stdout.write('er\ncase-1\n\ncase');
    proc.stdout.write('-2\n');
    await tick();
    proc.exit(0);

    await expect(done).resolves.toBeUndefined();
    expect(lines).toEqual(['header', 'case-1', 'case-2']);
    expect(proc.written.join('')).toBe('next\nnext\n');
  });

  it('rejects with stderr on a non-zero exit', async () => {
    const done = dockerConverse(['x'], 1000, () => null);
    proc.stderr.write('boom');
    await tick();
    proc.exit(1);
    await expect(done).rejects.toThrow('boom');
  });

  it('rejects with the exit code when stderr is empty', async () => {
    const done = dockerConverse(['x'], 1000, () => null);
    proc.exit(137);
    await expect(done).rejects.toThrow('exited with code 137');
  });

  it('kills the process and rejects with what onLine throws', async () => {
    const done = dockerConverse(['x'], 1000, () => {
      throw new Error('bad line');
    });
    proc.stdout.write('{}\n');
    await expect(done).rejects.toThrow('bad line');
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });

  it('wraps a non-Error throw', async () => {
    const done = dockerConverse(['x'], 1000, () => {
      throw 'plain';
    });
    proc.stdout.write('{}\n');
    await expect(done).rejects.toThrow('plain');
  });

  it('kills the process when it outlives the timeout', async () => {
    vi.useFakeTimers();
    const done = dockerConverse(['x'], 50, () => null);
    vi.advanceTimersByTime(60);
    await expect(done).rejects.toThrow('timed out');
    expect(proc.kill).toHaveBeenCalledWith('SIGKILL');
  });

  it('kills the process on an over-long line', async () => {
    const done = dockerConverse(['x'], 1000, () => null);
    proc.stdout.write('x'.repeat(4 * 1024 * 1024 + 1));
    await expect(done).rejects.toThrow('output line too long');
  });

  it('rejects when docker cannot be spawned, and ignores a reply to a dead process', async () => {
    const done = dockerConverse(['x'], 1000, () => null);
    proc.stdin.emit('error', new Error('EPIPE'));
    proc.emit('error', new Error('spawn docker ENOENT'));
    await expect(done).rejects.toThrow('ENOENT');
  });
});
