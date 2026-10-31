import { createSandbox } from '@cyberstars-framework/sandbox/sandbox';
import { sandboxSettings } from '../config/sandbox.js';
import { LANGUAGES } from '../runtimes/registry.js';
import { addGuestSandboxSource, makeRoomForGuest } from './guest-sandboxes.js';

// Every sandbox carries it, editor and terminal alike, so the server can find
// the ones it no longer tracks (removeStraySandboxes)
export const SANDBOX_LABEL = 'cyberstars.sandbox';

// The code sandbox (framework/sandbox): one container per owner, a signed-in
// user or a guest, on the language they last ran, shared by editor runs and
// Run Tests, and the cap on busy sandboxes, which terminal commands take a
// slot of too. A guest's containers are grouped by their network, which holds
// only so many sandboxes, terminal sessions included (guest-sandboxes.ts)
export const sandbox = createSandbox({
  ...sandboxSettings(),
  languages: LANGUAGES,
  label: SANDBOX_LABEL,
  beforeNew: (ip) => makeRoomForGuest(ip),
});

addGuestSandboxSource((ip) => sandbox.held(ip));

// Browsers with a tab open and nobody signed in, so the admin page can count
// the guests online
export function onlineGuests(): number {
  return sandbox.sessionOwners().filter((owner) => !owner.startsWith('user:')).length;
}
