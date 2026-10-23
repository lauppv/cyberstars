import { AppError } from '@cyberstars-framework/server-kit/errors';

// Guests from one network share a limit on the sandboxes they hold, editor
// containers and terminal sessions together, busy or idle. A guest id is only
// a cookie a script can rotate, and an idle sandbox still holds its memory,
// so counting only the runs in progress let one visitor hold dozens.
const MAX_PER_IP = Number(process.env.GUEST_IP_MAX_SANDBOXES ?? 10);

interface GuestSandbox {
  lastActivity: number;
  busy: boolean;
  close: () => void;
}

// Each service that keeps sandboxes lists the ones a guest network holds. They
// register themselves: importing them here would be a cycle, as both call
// makeRoomForGuest.
type Source = (ip: string) => GuestSandbox[];
const sources: Source[] = [];

export function addGuestSandboxSource(source: Source): void {
  sources.push(source);
}

// Call before a guest from `ip` gets a new sandbox. At the limit it closes the
// network's least recently used idle sandbox, so a classroom of guests behind
// one router keeps working, and turns the guest away only when all are busy.
export function makeRoomForGuest(ip: string, max = MAX_PER_IP): void {
  const held = sources.flatMap((source) => source(ip));
  const idle = held.filter((s) => !s.busy).sort((a, b) => a.lastActivity - b.lastActivity);
  for (let count = held.length; count >= max; count--) {
    const oldest = idle.shift();
    if (!oldest) {
      throw new AppError(
        429,
        'Too many guest runs from your network right now. Try again in a minute, or sign in.',
      );
    }
    oldest.close();
  }
}
