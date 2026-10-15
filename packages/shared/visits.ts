// One thing a guest did. page: a path they opened. click: the name the code
// gives a button or link they pressed (data-track), never its text. scroll: how
// far down a page they got, 25, 50, 75 or 100.
export interface VisitStep {
  kind: 'page' | 'click' | 'scroll';
  target: string;
}

// What the app tells the API about each page it shows. referrer comes only with
// the first page of a visit: the referring site's domain, or "" when there was
// none (a typed address or a bookmark). steps are a guest's clicks and scrolls
// since the last report, sent along so they land before the page they led to.
export interface PageViewReport {
  path: string;
  referrer?: string;
  steps?: VisitStep[];
}

// The clicks and scrolls a guest made on a page they're still on.
export interface StepsReport {
  steps: VisitStep[];
}

export const SCROLL_DEPTHS = [25, 50, 75, 100] as const;

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
  // The buttons guests pressed most: visitors is how many visits pressed it.
  clicks: VisitCount[];
}

// One guest's day, newest first on the admin page. source is null when the
// visit started on a page opened from inside the app.
export interface GuestVisitDTO {
  id: number;
  day: string; // YYYY-MM-DD, Romania's time
  // ISO time of the first page; null on visits from before it was kept
  startedAt: string | null;
  source: string | null;
  lang: string;
  steps: VisitStep[];
}

// A page of the list. next is the id to pass as before for the page after it,
// null on the last one.
export interface GuestVisitsDTO {
  visits: GuestVisitDTO[];
  next: number | null;
}
