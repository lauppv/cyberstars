import { spawn, execFile } from 'child_process';
import { getRuntime } from '../runtimes/registry.js';
import { acquireForRun, releaseAfterRun, destroyOwner } from './code-container.service.js';
import type { WebSocket } from 'ws';

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

export async function handleInteractiveRun(
  ws: WebSocket,
  code: string,
  language: string,
  ownerKey: string,
) {
  const runtime = getRuntime(language);
  if (!runtime) {
    ws.send(JSON.stringify({ type: 'stderr', data: 'Language not supported.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }

  let containerId: string;
  try {
    containerId = await acquireForRun(ownerKey, language);
  } catch (err) {
    const data =
      err instanceof Error && err.message === 'A run is already in progress'
        ? 'A run is already in progress.\n'
        : 'Could not start the runner. Please try again.\n';
    ws.send(JSON.stringify({ type: 'stderr', data }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }

  // We now hold the owner's container reserved. Every exit path below must settle
  // it exactly once: keep it (release for reuse) or drop it (destroy).
  let settled = false;
  const keepContainer = () => {
    if (settled) return;
    settled = true;
    releaseAfterRun(ownerKey);
  };
  const dropContainer = () => {
    if (settled) return;
    settled = true;
    void destroyOwner(ownerKey);
  };

  try {
    await writeSource(containerId, runtime.sourceFile, code);
  } catch {
    ws.send(JSON.stringify({ type: 'stderr', data: 'Could not prepare the run.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    dropContainer();
    return;
  }

  if (runtime.compileCmd) {
    const compileErr = await compile(containerId, runtime.compileCmd);
    if (compileErr) {
      ws.send(JSON.stringify({ type: 'stderr', data: compileErr }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      keepContainer(); // a compile error is normal — keep the container for the retry
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
      stderrBuf += '\nTime limit exceeded (20s) — program stopped.\n';
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
    if (target === 'stdout') {
      stdoutBuf += text;
      if (stdoutBuf.length > OUTPUT_BUFFER_MAX) {
        stdoutBuf = stdoutBuf.slice(-OUTPUT_BUFFER_MAX);
      }
    } else {
      stderrBuf += text;
      if (stderrBuf.length > OUTPUT_BUFFER_MAX) {
        stderrBuf = stderrBuf.slice(-OUTPUT_BUFFER_MAX);
      }
    }
    if (outputTotal >= OUTPUT_TOTAL_MAX) {
      outputCapped = true;
      killAll();
      stderrBuf += '\nOutput limit exceeded — program stopped.\n';
      flushOutput();
      sendExit(124);
      return;
    }
    scheduleFlush();
  };

  proc.stdout.on('data', (chunk: Buffer) => appendOutput('stdout', chunk));
  proc.stderr.on('data', (chunk: Buffer) => appendOutput('stderr', chunk));

  proc.on('close', (exitCode) => {
    flushOutput();
    sendExit(exitCode ?? 0);
    keepContainer(); // program finished normally — keep the container for reuse
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

  ws.on('close', () => {
    clearTimeout(timer);
    if (flushTimer) clearTimeout(flushTimer);
    if (!exited) {
      // The page was closed mid-run — kill the program and drop the container.
      proc.kill('SIGKILL');
      dropContainer();
    }
  });
}
