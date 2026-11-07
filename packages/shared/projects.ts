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
    slug: 'grade-book',
    language: 'python',
    title: 'Grade Book',
    difficulty: 'easy',
    summary:
      "A teacher's grade book: grades per subject, averages, a ranking, corrections and who passes at the end of term.",
    steps: [
      { id: 'class', title: 'The class list' },
      { id: 'grade', title: 'Record a grade' },
      { id: 'average', title: "A student's average" },
      { id: 'subject', title: 'One subject' },
      { id: 'top', title: 'The ranking' },
      { id: 'fix', title: 'Fix a mistake' },
      { id: 'report', title: 'End of term' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'parking-garage',
    language: 'python',
    title: 'Parking Garage',
    difficulty: 'easy',
    summary:
      "The attendant's program for a town garage: cars in and out, free spaces, fees by the hour, monthly passes and the takings at closing time.",
    steps: [
      { id: 'open', title: 'Open the garage' },
      { id: 'in', title: 'A car comes in' },
      { id: 'out', title: 'A car leaves' },
      { id: 'fees', title: 'Fees' },
      { id: 'passes', title: 'Monthly passes' },
      { id: 'status', title: "What's inside" },
      { id: 'report', title: 'Closing time' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'budget-tracker',
    language: 'python',
    title: 'Budget Tracker',
    difficulty: 'easy',
    summary:
      "A monthly budget to type every purchase into: what's left, limits per category with warnings, undo and where the money went.",
    steps: [
      { id: 'month', title: "The month's money" },
      { id: 'spend', title: 'Spend' },
      { id: 'limits', title: 'Limits' },
      { id: 'earn', title: 'Extra money' },
      { id: 'categories', title: 'Where it went' },
      { id: 'undo', title: 'Undo' },
      { id: 'summary', title: 'End of the month' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
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
    slug: 'clinic-queue',
    language: 'python',
    title: 'Clinic Queue',
    difficulty: 'medium',
    summary:
      "The front desk of a walk-in clinic: patients lined up by how urgent they are, sent to free doctors, and the day's waiting times.",
    steps: [
      { id: 'doctors', title: 'Doctors on duty' },
      { id: 'arrive', title: 'Arrivals' },
      { id: 'queue', title: 'The line' },
      { id: 'next', title: 'Call the next patient' },
      { id: 'done', title: 'The doctor is free' },
      { id: 'worse', title: 'Getting worse' },
      { id: 'leave', title: 'Leaving without being seen' },
      { id: 'report', title: 'End of the day' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'cinema-seats',
    language: 'python',
    title: 'Cinema Seats',
    difficulty: 'medium',
    summary:
      'The ticket window of a small cinema: a seat map, bookings and cancellations, the best seats for a group and how full the hall is.',
    steps: [
      { id: 'hall', title: 'Build the hall' },
      { id: 'map', title: 'The map' },
      { id: 'book', title: 'Book seats' },
      { id: 'cancel', title: 'Cancel' },
      { id: 'best', title: 'The best seats together' },
      { id: 'group', title: 'Book a group' },
      { id: 'stats', title: 'How full is it' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'league-table',
    language: 'python',
    title: 'League Table',
    difficulty: 'medium',
    summary:
      "A Sunday football league: results in, a table ranked by points and goals, each team's season, corrections and the records.",
    steps: [
      { id: 'teams', title: 'The teams' },
      { id: 'result', title: 'Record a result' },
      { id: 'table', title: 'The table' },
      { id: 'team', title: "A team's season" },
      { id: 'correct', title: 'Correct a score' },
      { id: 'left', title: "What's left to play" },
      { id: 'records', title: 'Records' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'expense-split',
    language: 'python',
    title: 'Expense Split',
    difficulty: 'medium',
    summary:
      "Shared expenses for a flat of friends: who paid for what, everyone's balance and the few transfers that make everyone even.",
    steps: [
      { id: 'flatmates', title: 'The flatmates' },
      { id: 'paid', title: 'Shared by everyone' },
      { id: 'balances', title: 'Balances' },
      { id: 'paidfor', title: 'Shared by some' },
      { id: 'gave', title: 'Paying back' },
      { id: 'settle', title: 'Getting even' },
      { id: 'history', title: 'Who was in on what' },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'hotel-bookings',
    language: 'python',
    title: 'Hotel Bookings',
    difficulty: 'hard',
    summary:
      'Bookings for a mountain guesthouse: free rooms by type and night, weekend and long-stay prices, cancellations, extensions and the day at reception.',
    steps: [
      { id: 'rooms', title: 'The rooms' },
      { id: 'book', title: 'Book a room' },
      { id: 'prices', title: 'Weekends and long stays' },
      { id: 'bill', title: 'The bill' },
      { id: 'cancel', title: 'Cancel' },
      { id: 'extend', title: 'Stay longer' },
      { id: 'day', title: 'The day at reception' },
      { id: 'free', title: "What's free" },
      { id: 'bad-input', title: 'Survive bad input' },
    ],
  },
  {
    slug: 'bike-share',
    language: 'python',
    title: 'Bike Share',
    difficulty: 'hard',
    summary:
      "A town's bike sharing trial: bikes in and out of docking stations, full stations, ride prices and memberships, and the day's report.",
    steps: [
      { id: 'stations', title: 'The stations' },
      { id: 'rent', title: 'Take a bike' },
      { id: 'return', title: 'Bring it back' },
      { id: 'price', title: 'The price of a ride' },
      { id: 'members', title: 'Members' },
      { id: 'status', title: 'The stations now' },
      { id: 'trips', title: "A rider's trips" },
      { id: 'report', title: 'The trial report' },
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
  {
    slug: 'config-migration',
    language: 'linux',
    title: 'Config Migration',
    difficulty: 'medium',
    summary:
      'Move three apps to a new database server by editing their config files with sed, safely: backup first, preview, then only the lines that must change.',
    steps: [
      { id: 'map', title: 'Map the config files' },
      { id: 'find', title: 'Find the old server' },
      { id: 'backup', title: 'Back up first' },
      { id: 'preview', title: 'Try the change without making it' },
      { id: 'host', title: 'Move to the new server' },
      { id: 'port', title: 'The new port' },
      { id: 'cache', title: 'Switch off the cache' },
      { id: 'check', title: 'Check the work' },
    ],
  },
  {
    slug: 'homework-inbox',
    language: 'linux',
    title: 'Homework Inbox',
    difficulty: 'medium',
    summary:
      "Go through a class's homework uploads: what came in, what's missing, which files are broken, who copied and who left work unfinished.",
    steps: [
      { id: 'count', title: 'What came in' },
      { id: 'empty', title: 'Broken uploads' },
      { id: 'missing', title: 'Who is missing homework 3' },
      { id: 'copied', title: 'Who copied' },
      { id: 'todo', title: 'Unfinished work' },
      { id: 'lines', title: 'Who wrote the most' },
      { id: 'folders', title: 'A folder per assignment' },
    ],
  },
  {
    slug: 'manuscript',
    language: 'linux',
    title: 'Manuscript',
    difficulty: 'medium',
    summary:
      'Prepare a short novel for print from the terminal: word counts, a table of contents, stray notes and spaces, an overused word and a renamed character.',
    steps: [
      { id: 'words', title: 'How long is it' },
      { id: 'contents', title: 'Table of contents' },
      { id: 'notes', title: 'Notes left behind' },
      { id: 'spaces', title: 'Double spaces' },
      { id: 'suddenly', title: 'Too sudden' },
      { id: 'rename', title: 'A new name' },
      { id: 'book', title: 'The book' },
    ],
  },
  {
    slug: 'contacts-merge',
    language: 'linux',
    title: 'Contacts Merge',
    difficulty: 'medium',
    summary:
      'Merge two phone contact exports into one list to import: numbers written one way, everyone once, and the gaps and conflicts found.',
    steps: [
      { id: 'look', title: 'Look at both exports' },
      { id: 'together', title: 'All in one file' },
      { id: 'numbers', title: 'One way of writing a number' },
      { id: 'once', title: 'Everyone once' },
      { id: 'conflict', title: 'Two numbers for one name' },
      { id: 'missing', title: 'Missing numbers' },
      { id: 'mobiles', title: 'Mobiles and landlines' },
      { id: 'import', title: 'Ready to import' },
    ],
  },
  {
    slug: 'incident-timeline',
    language: 'linux',
    title: 'Incident Timeline',
    difficulty: 'hard',
    summary:
      "Merge the logs of three services into one timeline to find what took a shop's checkout down for twenty minutes, and write the post-mortem.",
    steps: [
      { id: 'look', title: 'Look at the logs' },
      { id: 'errors', title: 'Errors per service' },
      { id: 'tag', title: 'Say where each line came from' },
      { id: 'timeline', title: 'One timeline' },
      { id: 'window', title: 'The half hour that matters' },
      { id: 'first', title: 'What broke first' },
      { id: 'spread', title: 'How far it spread' },
      { id: 'end', title: 'When it was over' },
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
