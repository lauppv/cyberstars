import { spawn, execFile } from 'child_process';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { killLeftovers } from './docker.js';
import type { Pool } from './pool.js';
import type { SlotOptions } from './slots.js';

// What a live run needs of a WebSocket; the `ws` package's fits
export interface RunSocket {
  readonly OPEN: number;
  readonly readyState: number;
  send(data: string): void;
  on(event: 'close', listener: () => void): unknown;
  on(event: 'message', listener: (data: Buffer | string) => void): unknown;
}

interface LiveRunOptions {
  pool: Pick<
    Pool,
    'runtimeOf' | 'acquireForRun' | 'releaseAfterRun' | 'destroyOwner' | 'isRunning'
  >;
  // Takes one of the slots of busy sandboxes (slots.ts)
  acquireSlot: (options: SlotOptions) => Promise<() => void>;
}

const TIMEOUT_MS = 20_000;
const OUTPUT_FLUSH_MS = 50;
const OUTPUT_BUFFER_MAX = 16 * 1024;
const OUTPUT_TOTAL_MAX = 1024 * 1024;

// Write the user's source into the run container, wiping any leftover files from
// the owner's previous run first so a stale binary/output can't resurface.
function writeSource(containerId: string, sourceFile: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = `rm -rf /work/* 2>/dev/null; cat > /work/${sourceFile}`;
    const proc = execFile(
      'docker',
      ['exec', '-i', containerId, 'sh', '-c', script],
      { timeout: 10_000 },
      (err, _stdout, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve()),
    );
    proc.stdin?.end(code);
  });
}

function compile(containerId: string, compileCmd: string): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      'docker',
      ['exec', containerId, 'sh', '-c', compileCmd],
      { maxBuffer: 1024 * 1024, timeout: 15_000 },
      (err, _stdout, stderr) => resolve(err ? stderr || err.message : null),
    );
  });
}

// A program run live over a WebSocket: the code goes into the owner's
// container, its output streams back as it comes and the socket's `stdin`
// messages go to it. The page hears `waiting` and `slot` while the run waits
// for a sandbox, then `stdout`/`stderr` and one `exit`.
export function liveRun(options: LiveRunOptions) {
  return (ws: RunSocket, code: string, language: string, ownerKey: string, group?: string) =>
    run(options, ws, code, language, ownerKey, group);
}

async function run(
  { pool, acquireSlot }: LiveRunOptions,
  ws: RunSocket,
  code: string,
  language: string,
  ownerKey: string,
  // The group the owner is in (a guest's network, say), which a new container
  // counts against
  group?: string,
) {
  const runtime = pool.runtimeOf(language);
  if (!runtime) {
    ws.send(JSON.stringify({ type: 'stderr', data: 'Language not supported.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }

  // Once the acquire starts we hold the owner's container reserved. Every exit
  // path below must settle it exactly once: keep it (release for reuse) or drop
  // it (destroy). Settling also frees the run's sandbox slot (slots.ts).
  let releaseSlot = () => {};
  let settled = false;
  const keepContainer = () => {
    if (settled) return;
    settled = true;
    pool.releaseAfterRun(ownerKey);
    releaseSlot();
  };
  const dropContainer = () => {
    if (settled) return;
    settled = true;
    void pool.destroyOwner(ownerKey);
    releaseSlot();
  };

  // The client can leave at any moment (Run pressed again, page left), also
  // while the container is still starting or the code is still compiling. A run
  // abandoned before its program starts drops the container at once; otherwise
  // the program would start with nobody watching and hold the owner's container
  // until the timeout, refusing their next run as "already in progress".
  if (pool.isRunning(ownerKey)) {
    ws.send(JSON.stringify({ type: 'stderr', data: 'A run is already in progress.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }

  let abandoned = false;
  let waitingForSlot = true;
  let acquireFailed = false;
  let stopProgram: (() => void) | null = null;
  // Set once the program runs: stops it when the server is full and this run
  // has held its slot too long (slots.ts). Before that it can't be.
  let stopForRoom: (() => boolean) | null = null;
  // Leaving while in line takes the run out of the line
  const leaving = new AbortController();
  ws.on('close', () => {
    abandoned = true;
    leaving.abort();
    // While it waits for a slot the run holds no container yet: the owner's
    // container may be serving another of their runs, so it's left alone.
    if (stopProgram) stopProgram();
    else if (!waitingForSlot && !acquireFailed) dropContainer();
  });

  // The page hears when the run waits in line, and again once it has its slot
  let waited = false;
  try {
    releaseSlot = await acquireSlot({
      signal: leaving.signal,
      stop: () => stopForRoom?.() ?? false,
      onWait: () => {
        waited = true;
        ws.send(JSON.stringify({ type: 'waiting' }));
      },
    });
  } catch {
    // No slot freed up in time, or the page left the line
    if (abandoned) return;
    ws.send(
      JSON.stringify({
        type: 'stderr',
        data: 'The server is busy right now, please try again in a moment.\n',
      }),
    );
    ws.send(JSON.stringify({ type: 'busy' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }
  waitingForSlot = false;
  if (waited && !abandoned) ws.send(JSON.stringify({ type: 'slot' }));
  if (abandoned) {
    releaseSlot();
    return;
  }

  let containerId: string;
  try {
    containerId = await pool.acquireForRun(ownerKey, language, group);
  } catch (err) {
    acquireFailed = true;
    releaseSlot();
    if (abandoned) return;
    const data =
      err instanceof AppError
        ? `${err.message}\n`
        : err instanceof Error && err.message === 'A run is already in progress'
          ? 'A run is already in progress.\n'
          : 'Could not start the runner. Please try again.\n';
    ws.send(JSON.stringify({ type: 'stderr', data }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }
  if (abandoned) return;

  try {
    await writeSource(containerId, runtime.sourceFile, code);
    if (abandoned) return;
  } catch {
    if (abandoned) return;
    ws.send(JSON.stringify({ type: 'stderr', data: 'Could not prepare the run.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    dropContainer();
    return;
  }

  if (runtime.compileCmd) {
    const compileErr = await compile(containerId, runtime.compileCmd);
    if (abandoned) return;
    if (compileErr) {
      ws.send(JSON.stringify({ type: 'stderr', data: compileErr }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      keepContainer(); // a compile error is normal, keep the container for the retry
      return;
    }
  }

  const proc = spawn('docker', ['exec', '-i', containerId, 'sh', '-c', runtime.runCmd]);

  let exited = false;
  let stdoutBuf = '';
  let stderrBuf = '';
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let outputTotal = 0;
  let outputCapped = false;

  const flushOutput = () => {
    flushTimer = null;
    if (exited || ws.readyState !== ws.OPEN) {
      stdoutBuf = '';
      stderrBuf = '';
      return;
    }
    if (stdoutBuf) {
      ws.send(JSON.stringify({ type: 'stdout', data: stdoutBuf }));
      stdoutBuf = '';
    }
    if (stderrBuf) {
      ws.send(JSON.stringify({ type: 'stderr', data: stderrBuf }));
      stderrBuf = '';
    }
  };

  const scheduleFlush = () => {
    if (flushTimer) return;
    flushTimer = setTimeout(flushOutput, OUTPUT_FLUSH_MS);
  };

  const sendExit = (code: number) => {
    if (exited) return;
    exited = true;
    clearTimeout(timer);
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'exit', code }));
    }
  };

  // On timeout / output cap / abandonment we kill the exec client and destroy the
  // whole container: that reliably stops the program and any children inside it
  // (killing the `docker exec` client alone would leave them running).
  const killAll = () => {
    proc.kill('SIGKILL');
    dropContainer();
  };

  let timer: ReturnType<typeof setTimeout>;
  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (exited) return;
      killAll();
      stderrBuf += '\nTime limit exceeded (20s), program stopped.\n';
      flushOutput();
      sendExit(124);
    }, TIMEOUT_MS);
  };
  resetTimer();

  const appendOutput = (target: 'stdout' | 'stderr', chunk: Buffer) => {
    if (exited || outputCapped) return;
    const remaining = OUTPUT_TOTAL_MAX - outputTotal;
    if (remaining <= 0) return;
    const slice = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk;
    const text = slice.toString();
    outputTotal += slice.length;
    if (target === 'stdout') stdoutBuf += text;
    else stderrBuf += text;
    if (outputTotal >= OUTPUT_TOTAL_MAX) {
      outputCapped = true;
      killAll();
      stderrBuf += '\nOutput limit exceeded, program stopped.\n';
      flushOutput();
      sendExit(124);
      return;
    }
    // The timer only batches small writes. A fast burst is sent as soon as the
    // buffers fill, so no output is ever dropped between two flushes.
    if (stdoutBuf.length + stderrBuf.length >= OUTPUT_BUFFER_MAX) {
      if (flushTimer) clearTimeout(flushTimer);
      flushOutput();
      return;
    }
    scheduleFlush();
  };

  proc.stdout.on('data', (chunk: Buffer) => appendOutput('stdout', chunk));
  proc.stderr.on('data', (chunk: Buffer) => appendOutput('stderr', chunk));

  proc.on('close', (exitCode) => {
    if (exited) return;
    // Finished: its slot frees up in a moment anyway
    stopForRoom = null;
    clearTimeout(timer);
    flushOutput();
    // The program finished normally, so the container is kept for reuse, but
    // only once nothing it started is still running in there
    void killLeftovers(containerId).then(() => {
      sendExit(exitCode ?? 0);
      keepContainer();
    });
  });

  // spawn itself can fail (ENOENT if docker is missing, EMFILE under load). Without
  // this listener the 'error' event would throw and crash the whole process.
  proc.on('error', () => {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({ type: 'stderr', data: 'Could not start the runner. Please try again.\n' }),
      );
    }
    sendExit(1);
    dropContainer();
  });

  const onMessage = (raw: Buffer | string) => {
    const msg = typeof raw === 'string' ? raw : raw.toString();
    try {
      const parsed = JSON.parse(msg) as { type: string; data?: string };
      if (parsed.type === 'stdin' && parsed.data != null && !proc.killed) {
        proc.stdin.write(parsed.data);
        resetTimer();
      }
    } catch {
      /* ignore non-JSON */
    }
  };

  ws.on('message', onMessage);

  stopForRoom = () => {
    if (exited) return false;
    killAll();
    stderrBuf +=
      '\nProgram stopped to make room for others: the server is full right now. Run it again in a moment.\n';
    flushOutput();
    sendExit(124);
    return true;
  };

  stopProgram = () => {
    clearTimeout(timer);
    if (flushTimer) clearTimeout(flushTimer);
    if (!exited) {
      // The page was closed mid-run, so kill the program and drop the container.
      proc.kill('SIGKILL');
      dropContainer();
    }
  };
}
