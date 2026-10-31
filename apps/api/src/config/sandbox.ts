import os from 'os';
import { settings } from '@cyberstars-framework/server-kit/settings';
import type { SandboxOptions } from '@cyberstars-framework/sandbox/sandbox';

type Source = Record<string, string | undefined>;

// The code sandbox's limits, each from the environment with its default. Not
// in env.ts, which needs the secrets: the judge's scripts load the sandbox
// without them (check:tests runs in CI with no .env). On the server the .env
// is in by the time this is read, since app.ts imports the config first.
export function sandboxSettings(
  source: Source = process.env,
): Omit<SandboxOptions, 'languages' | 'label' | 'beforeNew'> {
  const { optional, number } = settings(source);
  return {
    idleMs: number('CODE_CONTAINER_IDLE_MS', 15 * 60 * 1000),
    maxContainers: number('CODE_MAX_CONTAINERS', 50),
    memory: optional('CODE_RUN_MEMORY', '128m'),
    pids: optional('CODE_RUN_PIDS', '64'),
    cpus: optional('CODE_RUN_CPUS', '0.5'),
    // Our own uid, never the API's, since the API runs as root on the VPS.
    // Rootless Podman turns it off: there root inside is the developer on the
    // host
    uid: source.SANDBOX_RUN_AS_USER === 'false' ? false : optional('SANDBOX_UID', '10001'),
    // Four per core: most runs are over in a moment or sit waiting for input,
    // so the CPU is shared but not swamped
    maxBusy: number('SANDBOX_MAX_BUSY', os.availableParallelism() * 4),
    // Long enough that a run held with input gets stopped to make room before
    // the one waiting gives up, so a slot does free up in time
    queueTimeoutMs: number('SANDBOX_QUEUE_TIMEOUT_MS', 30_000),
    // An editor run's own limit, so only runs kept alive with input get there
    stopAfterMs: number('SANDBOX_STOP_AFTER_MS', 20_000),
  };
}
