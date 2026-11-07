// Projects: small real programs built step by step. Each step is one
// requirement the student ticks off themselves once their program does it; the
// ticks are kept per account. The steps' texts live in
// packages/content/projects/<language>/<slug>.md, one `## ` section per step
// in this order; the catalog here is what the server checks a tick against.

export const PROJECT_LANGUAGES = ['python', 'c', 'java', 'linux'] as const;
export type ProjectLanguage = (typeof PROJECT_LANGUAGES)[number];

type ProjectDifficulty = 'easy' | 'medium' | 'hard';

interface ProjectStep {
  // Kept in the database, so a step keeps its tick when steps are added or
  // reordered around it; never reused for another requirement
  id: string;
  title: string;
}

export interface Project {
  slug: string;
  language: ProjectLanguage;
  title: string;
  difficulty: ProjectDifficulty;
  // A sentence on what the program does
  summary: string;
  steps: ProjectStep[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'library-desk',
    language: 'python',
    title: 'Library Desk',
    difficulty: 'medium',
    summary:
      'The front desk program of a neighbourhood library: a catalog, loans, returns with late fees and an end-of-day report.',
    steps: [
      { id: 'catalog', title: 'Load the catalog' },
      { id: 'list', title: 'List the books' },
      { id: 'find', title: 'Search the catalog' },
      { id: 'borrow', title: 'Borrow a book' },
      { id: 'return', title: 'Return a book' },
      { id: 'fees', title: 'Late fees' },
      { id: 'member', title: 'Member card' },
      { id: 'report', title: 'End-of-day report' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'downloads-cleanup',
    language: 'linux',
    title: 'Downloads Cleanup',
    difficulty: 'easy',
    summary:
      'Sort a cluttered Downloads folder into shelves by file type, throw out the junk and the duplicate, and spot the files that take up the room.',
    steps: [
      { id: 'stock', title: 'Take stock' },
      { id: 'junk', title: 'Throw out the junk' },
      { id: 'shelves', title: 'Make the shelves' },
      { id: 'sort', title: 'Sort by type' },
      { id: 'copy', title: 'Remove the copy' },
      { id: 'big', title: 'Find the space hogs' },
      { id: 'after', title: 'Before and after' },
    ],
  },
  {
    slug: 'photo-archive',
    language: 'linux',
    title: 'Photo Archive',
    difficulty: 'easy',
    summary:
      "Turn a phone's photo dump into an archive: screenshots aside, a folder per year, a summer album, an index and folders nobody can change by mistake.",
    steps: [
      { id: 'look', title: 'Look at what came off the phone' },
      { id: 'screenshots', title: 'Set the screenshots aside' },
      { id: 'years', title: 'A folder per year' },
      { id: 'album', title: 'The summer album' },
      { id: 'index', title: 'The index' },
      { id: 'lock', title: 'Lock the archive' },
    ],
  },
  {
    slug: 'mailing-list',
    language: 'linux',
    title: 'Mailing List',
    difficulty: 'easy',
    summary:
      'Clean a year of newsletter sign-ups into a list to send to: no blanks, no capitals, no repeats, no broken addresses and no one who unsubscribed.',
    steps: [
      { id: 'look', title: 'Look at the sign-ups' },
      { id: 'blank', title: 'Drop the empty lines' },
      { id: 'lower', title: 'One way of writing' },
      { id: 'once', title: 'Everyone once' },
      { id: 'valid', title: 'Real addresses only' },
      { id: 'unsub', title: 'Respect the unsubscribes' },
      { id: 'domains', title: 'Who reads it' },
      { id: 'tidy', title: 'Tidy up' },
    ],
  },
  {
    slug: 'web-log-detective',
    language: 'linux',
    title: 'Web Log Detective',
    difficulty: 'medium',
    summary:
      "Read a pizzeria's web server log to find the missing pages, the busiest hours and the visitor trying passwords at three in the morning.",
    steps: [
      { id: 'meet', title: 'Meet the log' },
      { id: 'not-found', title: "Pages that weren't there" },
      { id: 'visitors', title: 'The most frequent visitors' },
      { id: 'broken', title: 'Broken links' },
      { id: 'hours', title: 'The busiest hours' },
      { id: 'intruder', title: 'The night visitor' },
      { id: 'bytes', title: 'How much was sent' },
      { id: 'report', title: 'The report' },
    ],
  },
  {
    slug: 'sales-report',
    language: 'linux',
    title: 'Sales Report',
    difficulty: 'medium',
    summary:
      'Turn a month of plant shop orders in a CSV file into a sales report with awk: revenue, best cities, best sellers and the biggest orders.',
    steps: [
      { id: 'look', title: 'Look at the export' },
      { id: 'data', title: 'Only the orders' },
      { id: 'typo', title: 'Fix the typo' },
      { id: 'revenue', title: 'What came in' },
      { id: 'biggest', title: 'The biggest orders' },
      { id: 'cities', title: 'Money per city' },
      { id: 'products', title: 'Plants that sell' },
      { id: 'halves', title: 'First half, second half' },
    ],
  },
];

export function findProject(language: string, slug: string): Project | undefined {
  return PROJECTS.find((p) => p.language === language && p.slug === slug);
}

// A ticked step, as the server sends it
export interface ProjectCheckDTO {
  language: ProjectLanguage;
  slug: string;
  stepId: string;
}

// A project's text: what comes before the first `## ` heading, then each
// step's section, its heading being the step's title. A `## ` line inside a
// fenced code block (a shell comment, say) is part of the code, not a heading.
export function splitProjectText(text: string): {
  intro: string;
  steps: { title: string; body: string }[];
} {
  const sections: string[][] = [[]];
  let fence: string | null = null;
  for (const line of text.split('\n')) {
    const marker = /^\s*(```+|~~~+)/.exec(line)?.[1];
    if (marker && (fence === null || (marker[0] === fence[0] && marker.length >= fence.length))) {
      fence = fence === null ? marker : null;
    }
    if (fence === null && line.startsWith('## ')) sections.push([line.slice(3)]);
    else sections[sections.length - 1].push(line);
  }
  const [intro, ...parts] = sections;
  return {
    intro: intro.join('\n').trim(),
    steps: parts.map(([title, ...body]) => ({ title: title.trim(), body: body.join('\n').trim() })),
  };
}
