import { execFile } from 'child_process';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs/promises';
import { getRuntime } from '../runtimes/registry.js';
import type { LanguageRuntime } from '../runtimes/types.js';

const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? '128m';
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? '64';
const RUN_DIR = process.env.CODE_RUN_DIR ?? path.join(os.tmpdir(), 'cyberstars-runs');

export async function execute(code: string, language: string, stdin = ''): Promise<string> {
  const runtime = getRuntime(language);
  if (!runtime) return 'Language not supported.';

  return executeDocker(runtime, code, stdin);
}

async function executeDocker(
  runtime: LanguageRuntime,
  code: string,
  stdin: string,
): Promise<string> {
  const runId = crypto.randomUUID();
  const hostDir = path.join(RUN_DIR, runId);
  const containerName = `run-${runId}`;
  await fs.mkdir(hostDir, { recursive: true });

  const outputPath = path.join(hostDir, 'output.txt');

  try {
    await Promise.all([
      fs.writeFile(path.join(hostDir, runtime.sourceFile), code, 'utf-8'),
      fs.writeFile(path.join(hostDir, 'stdin.txt'), stdin, 'utf-8'),
      fs.writeFile(outputPath, '', 'utf-8'),
    ]);

    const dockerArgs = [
      'run',
      '--rm',
      `--name=${containerName}`,
      '--network=none',
      `--memory=${RUN_MEMORY}`,
      `--pids-limit=${RUN_PIDS}`,
      '--stop-timeout=0',
      '-v',
      `${hostDir}:/work`,
      '-w',
      '/work',
      runtime.image,
      'sh',
      '-c',
      runtime.innerCmd,
    ];

    await runDocker(dockerArgs, containerName);

    const output = await fs.readFile(outputPath, 'utf-8');
    return output.trim() || 'No output.';
  } catch {
    return 'Error reading output file.';
  } finally {
    fs.rm(hostDir, { recursive: true, force: true }).catch(() => {});
  }
}

function runDocker(args: string[], containerName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile('docker', args, { maxBuffer: 1024 * 1024, timeout: 15_000 }, (err) => {
      if (err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error('Docker is not available'));
        return;
      }
      // On timeout execFile kills the docker CLI, but the container can outlive
      // it; kill it explicitly so it does not linger past the SIGTERM grace.
      if (err && (err as { killed?: boolean }).killed) {
        execFile('docker', ['kill', containerName], () => {});
      }
      resolve();
    });
  });
}
