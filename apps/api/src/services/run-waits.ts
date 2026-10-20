// Run Tests and terminal commands answer only once they're done, so a page
// whose request is taking a while asks whether it's waiting in a line (the
// judge's or the sandbox one) rather than running. The page names the request
// with an id of its own, kept per owner so nobody can ask about another's.
const RUN_ID = /^[\w-]{1,64}$/;

const waiting = new Set<string>();

// The key a request waits under, or null when it sent no usable id
export function waitKey(ownerKey: string | null, runId: unknown): string | null {
  if (!ownerKey || typeof runId !== 'string' || !RUN_ID.test(runId)) return null;
  return `${ownerKey}|${runId}`;
}

// Takes a slot with `acquire`, counted as waiting under `key` from the moment
// it joins a line until it gets its slot or gives up
export async function inLine<T>(
  key: string | null,
  acquire: (onWait: () => void) => Promise<T>,
): Promise<T> {
  try {
    return await acquire(() => {
      if (key) waiting.add(key);
    });
  } finally {
    if (key) waiting.delete(key);
  }
}

export function isWaiting(key: string | null): boolean {
  return key !== null && waiting.has(key);
}
