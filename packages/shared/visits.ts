// What the app tells the API about each page it shows. referrer comes only with
// the first page of a visit: the referring site's domain, or "" when there was
// none (a typed address or a bookmark).
export interface PageViewReport {
  path: string;
  referrer?: string;
}

// How far back the admin page looks, in days.
export const VISIT_RANGES = [30, 90] as const;
export type VisitRange = (typeof VISIT_RANGES)[number];

export interface VisitCount {
  key: string;
  visitors: number;
  views: number;
}

export interface VisitDay {
  day: string; // YYYY-MM-DD, Romania's time
  visitors: number;
  views: number;
  newAccounts: number;
}

export interface AdminVisitsDTO {
  range: VisitRange;
  days: VisitDay[];
  // Most viewed first, the same page in English and Romanian counted together.
  pages: VisitCount[];
  // google, bing, reddit, hackernews, devto, github, direct, or the site's
  // domain for any other. views here is how many visits started there.
  sources: VisitCount[];
  auth: VisitCount[]; // guest, signedIn
  lang: VisitCount[]; // en, ro
}
