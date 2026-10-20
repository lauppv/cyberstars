import { useSyncExternalStore } from 'react';
import { ApiClientError } from '../services/apiClient';
import { isRunWaiting } from '../services/runsService';

// A run waiting for a free sandbox, or one that waited in vain and can be tried
// again: what the notice bottom right shows. Every runner on the page (an
// editor, Run Tests, the terminal) keeps its own entry, so one finishing
// doesn't hide another still waiting.
export type RunWait = { kind: 'waiting' } | { kind: 'busy'; retry: () => void };

const waits = new Map<string, RunWait>();
const listeners = new Set<() => void>();
let shown: RunWait | null = null;

function changed(): void {
  const all = [...waits.values()];
  shown = all.find((wait) => wait.kind === 'waiting') ?? all.at(-1) ?? null;
  for (const listener of listeners) listener();
}

export function setRunWait(runner: string, wait: RunWait | null): void {
  if (wait) waits.set(runner, wait);
  else if (!waits.delete(runner)) return;
  changed();
}

// The notice's close: the runs that waited in vain are let go
export function dismissBusy(): void {
  for (const [runner, wait] of waits) if (wait.kind === 'busy') waits.delete(runner);
  changed();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRunWait(): RunWait | null {
  return useSyncExternalStore(
    subscribe,
    () => shown,
    () => null,
  );
}

// The server's 503s for a line that ran out: the sandbox one and the judge's
export function isBusy(err: unknown): boolean {
  return (
    err instanceof ApiClientError &&
    err.status === 503 &&
    /^The (server|judge) is busy/.test(err.serverMessage)
  );
}

const ASK_EVERY_MS = 1000;

// Run Tests and terminal commands answer only once they're done, so while one
// hasn't, the page asks the server every second whether it's waiting in a line,
// until it has had its slot. A run turned away by a busy server leaves `retry`
// on the notice.
export async function withRunWait<T>(
  runner: string,
  send: (runId: string) => Promise<T>,
  retry: () => void,
): Promise<T> {
  const runId = crypto.randomUUID();
  let done = false;
  let waited = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const ask = async () => {
    try {
      const { waiting } = await isRunWaiting(runId);
      if (done) return;
      setRunWait(runner, waiting ? { kind: 'waiting' } : null);
      // Past the lines it doesn't wait again
      if (waited && !waiting) return;
      waited ||= waiting;
    } catch {
      // The next ask may get through
    }
    if (!done) timer = setTimeout(ask, ASK_EVERY_MS);
  };
  setRunWait(runner, null);
  timer = setTimeout(ask, ASK_EVERY_MS);
  try {
    const result = await send(runId);
    setRunWait(runner, null);
    return result;
  } catch (err) {
    setRunWait(runner, isBusy(err) ? { kind: 'busy', retry } : null);
    throw err;
  } finally {
    done = true;
    clearTimeout(timer);
  }
}
