import { execFile, spawn } from 'child_process';

// What a sandbox runs as its first process, while commands arrive via `docker
// exec`. Unlike `sleep infinity` the shell collects finished processes, so
// whatever a student leaves behind doesn't pile up against the pids limit
export const SANDBOX_KEEPALIVE = ['sh', '-c', 'while :; do sleep 3600; done'];

// Every sandbox carries it, so the server can find the ones it no longer tracks
export const SANDBOX_LABEL = '--label=cyberstars.sandbox';

// Shared wrapper around `docker` CLI calls used by the code-runner and terminal
// sandbox services: buffers stdout (1MB cap), rejects with stderr on failure,
// and optionally pipes `stdin` into the process.
export function dockerExec(args: string[], timeout = 10_000, stdin?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = execFile(
      'docker',
      args,
      { maxBuffer: 1024 * 1024, timeout },
      (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      },
    );
    if (stdin != null) {
      proc.stdin?.end(stdin);
    }
  });
}

// Stops everything left running in a sandbox once a run or a command is over,
// like a program's own `&` children, so they can't keep the CPU busy while
// the sandbox sits idle. `kill -9 -1` reaches every process but PID 1 and the
// shell sending it. Best effort: a sandbox already gone has nothing to stop
export function killLeftovers(containerId: string): Promise<void> {
  return dockerExec(['exec', containerId, 'sh', '-c', 'kill -9 -1'], 5_000).then(
    () => {},
    () => {},
  );
}

// Removes the sandboxes a previous run of the server left behind. A restart
// that kills the server before its shutdown is through (pm2 gives it a moment)
// leaves them running, and nothing tracks them any more: they hold memory and
// a guest's place forever. Runs once at start, before any sandbox of its own
export async function removeStraySandboxes(): Promise<number> {
  const ids = (await dockerExec(['ps', '-aq', '--filter', 'label=cyberstars.sandbox']))
    .split('\n')
    .filter(Boolean);
  if (ids.length) await dockerExec(['rm', '-f', ...ids], 30_000);
  return ids.length;
}

// A stdout line longer than this means the process is misbehaving (a judge
// runner's lines are capped program outputs), so it is killed.
const MAX_LINE = 4 * 1024 * 1024;

/**
 * Runs `docker <args>` as a line conversation: every stdout line goes to
 * `onLine`, and a string it returns is written back to the process's stdin as
 * one line (null writes nothing). Resolves when the process exits 0; rejects
 * on a non-zero exit, the timeout, an over-long line, or an `onLine` throw,
 * killing the process in the last three cases. Used with `docker exec -i`.
 */
export function dockerConverse(
  args: string[],
  timeout: number,
  onLine: (line: string) => string | null,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('docker', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let settled = false;
    let pending = '';
    let stderr = '';

    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      proc.kill('SIGKILL');
      reject(err);
    };
    const timer = setTimeout(() => fail(new Error('timed out')), timeout);

    // The process may exit while a reply is in flight (EPIPE); its exit code
    // decides the outcome, not the write.
    proc.stdin.on('error', () => {});
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (chunk: string) => {
      pending += chunk;
      let newline: number;
      while (!settled && (newline = pending.indexOf('\n')) !== -1) {
        const line = pending.slice(0, newline);
        pending = pending.slice(newline + 1);
        if (!line.trim()) continue;
        try {
          const reply = onLine(line);
          if (reply !== null) proc.stdin.write(`${reply}\n`);
        } catch (err) {
          fail(err instanceof Error ? err : new Error(String(err)));
        }
      }
      if (pending.length > MAX_LINE) fail(new Error('output line too long'));
    });
    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', (chunk: string) => {
      if (stderr.length < 64 * 1024) stderr += chunk;
    });
    proc.on('error', (err) => fail(err));
    proc.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `exited with code ${code}`));
    });
  });
}
