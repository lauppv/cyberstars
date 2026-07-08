import { execFile } from 'child_process';

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
