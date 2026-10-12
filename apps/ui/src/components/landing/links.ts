// The pages a visitor can open without an account, in the order the navbar and
// the footer list them. Anything else sends a visitor to sign-in (GuestGate),
// so it doesn't belong here.
export const VISITOR_LINKS = [
  { to: '/courses', label: 'nav.courses' },
  { to: '/algorithms', label: 'nav.algorithms' },
  { to: '/almanac', label: 'nav.almanac' },
] as const;

export const SOURCE_URL = 'https://github.com/lauppv/cyberstars';
export const LICENSE_URL = `${SOURCE_URL}/blob/main/LICENSE`;
export const CONTENT_LICENSE_URL = `${SOURCE_URL}/blob/main/LICENSE-content.md`;
