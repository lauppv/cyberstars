// Whether this browser's visits are counted. The founder's own browsing would
// blur what strangers do, so a browser stops counting itself once an admin has
// signed in on it, and stays that way after signing out. The admin page can
// turn it back on, and that choice sticks. A private window remembers neither.
const KEY = 'cyberstars.counted';

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(value: 'yes' | 'no') {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // storage may be blocked; the browser then counts like any other
  }
}

export function isCounted(): boolean {
  return read() !== 'no';
}

export function setCounted(counted: boolean): void {
  write(counted ? 'yes' : 'no');
}

// Run while an admin is signed in. A choice made on the admin page stays.
export function markAdminBrowser(): void {
  if (read() === null) write('no');
}
