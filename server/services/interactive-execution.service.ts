import { spawn, execFile } from 'child_process';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import { getRuntime } from '../runtimes/registry.js';
import type { WebSocket } from 'ws';

const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? '128m';
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? '64';
const RUN_DIR = process.env.CODE_RUN_DIR ?? path.join(process.cwd(), '.runs');

const TIMEOUT_MS = 20_000;
const OUTPUT_FLUSH_MS = 50;
const OUTPUT_BUFFER_MAX = 16 * 1024;
const OUTPUT_TOTAL_MAX = 1024 * 1024;

// Per-run host dirs are cleaned on ws.close/process exit, but a crash mid-run
// orphans them. Sweep the whole RUN_DIR at startup to reclaim that disk.
export async function sweepRunDir(): Promise<void> {
  await fs.rm(RUN_DIR, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(RUN_DIR, { recursive: true }).catch(() => {});
}

// Container hardening shared by the compile and run invocations. We run as the
// host-dir owner (this process's uid) instead of root: /work is a bind-mount of
// a host dir owned by that uid, so once CAP_DAC_OVERRIDE is dropped only the
// owner can write the compiler's build output there. /tmp is a small tmpfs so
// gcc/javac still have scratch space under --read-only.
function hardeningArgs(): string[] {
  const args = [
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    '--read-only',
    '--tmpfs=/tmp:size=64m',
  ];
  const uid = process.getuid?.();
  const gid = process.getgid?.();
  const sandboxUser = process.env.SANDBOX_RUN_AS_USER ?? 'true';
  if (uid !== undefined && gid !== undefined && sandboxUser !== 'false') {
    args.push(`--user=${uid}:${gid}`);
  }
  return args;
}

export async function handleInteractiveRun(ws: WebSocket, code: string, language: string) {
  const runtime = getRuntime(language);
  if (!runtime) {
    ws.send(JSON.stringify({ type: 'stderr', data: 'Language not supported.\n' }));
    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
    return;
  }

  const runId = crypto.randomUUID();
  const hostDir = path.join(RUN_DIR, runId);
  await fs.mkdir(hostDir, { recursive: true });
  await fs.writeFile(path.join(hostDir, runtime.sourceFile), code, 'utf-8');

  const cleanup = () => fs.rm(hostDir, { recursive: true, force: true }).catch(() => {});

  if (runtime.compileCmd) {
    const compileErr = await compile(hostDir, runtime.image, runtime.compileCmd);
    if (compileErr) {
      ws.send(JSON.stringify({ type: 'stderr', data: compileErr }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      cleanup();
      return;
    }
  }

  const containerName = `run-${runId}`;

  const dockerArgs = [
    'run',
    '--rm',
    '-i',
    `--name=${containerName}`,
    '--network=none',
    `--memory=${RUN_MEMORY}`,
    `--pids-limit=${RUN_PIDS}`,
    '--stop-timeout=0',
    ...hardeningArgs(),
    '-v',
    `${hostDir}:/work`,
    '-w',
    '/work',
    runtime.image,
    'sh',
    '-c',
    runtime.runCmd,
  ];

  const proc = spawn('docker', dockerArgs);

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

  const killContainer = () => {
    execFile('docker', ['kill', containerName], () => {});
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

  const killAll = () => {
    proc.kill('SIGKILL');
    killContainer();
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
    cleanup();
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
    killContainer();
    cleanup();
  });
}

function compile(hostDir: string, image: string, compileCmd: string): Promise<string | null> {
  return new Promise((resolve) => {
    const args = [
      'run',
      '--rm',
      '--network=none',
      ...hardeningArgs(),
      '-v',
      `${hostDir}:/work`,
      '-w',
      '/work',
      image,
      'sh',
      '-c',
      compileCmd,
    ];
    execFile(
      'docker',
      args,
      { maxBuffer: 1024 * 1024, timeout: 15_000 },
      (err, _stdout, stderr) => {
        if (err) {
          resolve(stderr || err.message);
        } else {
          resolve(null);
        }
      },
    );
  });
}
