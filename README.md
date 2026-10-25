# CyberStars

A free, open-source interactive coding education platform. Learn Python, C, Java, and Linux through structured lessons with a live code editor. Read, write, and run code in the same view.

Live at [cyberstars.app](https://cyberstars.app).

## Features

- **Split-screen lessons**: Markdown content on the left, live CodeMirror editor on the right
- **Runnable code examples**: click "Run" on any code block inside lesson text to execute it instantly
- **Judge-graded completion**: pass a lesson's built-in test suite (Run Tests) to complete it; completion is server-verified, with no manual honor-system button
- **LeetCode-style results**: after Run Tests, a Result tab shows the verdict, how many tests passed, the test the run stopped on, and every passed test with its input and output; algorithm challenges also show the runtime next to the reference solution, and signed-in students keep their last 20 attempts per lesson
- **Multi-language**: Python (60 lessons), Java (49 lessons), C (47 lessons), Linux terminal (55 lessons), and Trees and Graphs (12 lessons, Beta), where every lesson comes in Python, Java and C with a switch above the text
- **Bilingual UI (EN/RO)**: English (default) and Romanian with a language toggle; untranslated lessons or articles fall back to English automatically
- **Algorithm challenges**: 88 challenges in four sets (Python 20, Java 20, C 32, and Trees and Graphs 16 tree and graph challenges in all three languages, Beta) with Easy/Medium/Hard difficulty levels, graded against hidden tests within each statement's stated input limits
- **Step-by-step visuals**: lessons and challenges show an algorithm one step at a time (an array, boxes and arrows, a tree, a graph, a grid, a stack or a queue), and some steps ask the student to predict the next one from a few choices
- **Sandboxed execution**: user code runs in Docker containers, never in the browser
- **Progress tracking**: per-course progress bars, XP/levels, and unlockable badges (First Steps + Bronze/Silver/Gold tiers per course)
- **Code persistence**: saved per lesson, restored on revisit
- **Tutor chat**: an AI tutor (Google Gemini) in a panel beside the page for signed-in students, where each visit starts a new conversation and the earlier ones stay in a history beside it, also about a lesson or algorithm challenge from its ⋯ menu, where it sees the student's code and last results; it guides them toward the answer a nudge at a time without handing over the solution, recommends a course by what it teaches on CyberStars, says what it is looking up while it thinks, suggests first questions from where the student stands on the lesson, cheers when the tests pass, streams its replies, keeps the newest 50 conversations, and works in 5-hour sessions of 15 to 30 messages
- **Landing page**: what a visitor sees on `/`, with four wordless algorithm films (bubble sort, a linked list, a binary search tree, a breadth-first search) playing in a grid
- **Placement test**: 12 multiple-choice questions on Python, C, Java and Linux, taken from the landing page before signing up; the score sets a beginner, intermediate or advanced level the tutor fits its answers and first questions to
- **What you want to learn**: right after the first-lesson tour the tutor asks which of Python, C, Java, Linux and algorithms the student wants; its first questions then follow those picks and the student's progress (the lesson left unfinished, the next one, a quiz on a lesson from a week ago), it offers help after three failed test runs in a row, and it cheers a finished course or a return after a week away
- **Laniakea**: a space game that opens after 3 Python lessons; every lesson finished is a planet to fly to, conquered with a 10-question test on it and kept with recaps after 1, 2, 4 and up to 64 days, after which it is the student's for good
- **Community forum**: threaded discussions with reactions and solution marking
- **In-app notifications**: live bell for forum replies/solutions and support activity, pushed over a per-user WebSocket
- **Linux terminal**: interactive sandboxed shell for learning Linux commands
- **Admin dashboard**: admin-only `/admin` view with platform statistics (users, lesson progress, forum/support, live code-execution metrics) and visitor counts kept without cookies or IPs (visitors a day, top pages, where they come from, each guest's visit step by step, over up to 24 months, and how far guests get in the placement test); access is server-authoritative, the role is read from the DB, never trusted from the client

## Quick start

**Prerequisites:** Node.js 24+, PostgreSQL 14+, Docker.

```bash
git clone https://github.com/lauppv/cyberstars.git
cd cyberstars
cp .env.example .env   # then edit with your DB credentials and a JWT_SECRET
npm ci
npm run dev
```

`npm run dev` handles everything: it generates Prisma client, runs migrations, seeds the database, starts both frontend (`:5173`) and backend (`:5000`).

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions (PostgreSQL, Docker images, Linux sandbox).

## Tech stack

| Layer     | Stack                                                            |
| --------- | ---------------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite 7, Tailwind CSS 4, CodeMirror         |
| Backend   | Express 5, TypeScript, Prisma 6 (PostgreSQL), Zod                |
| Execution | Docker containers (sandboxed, per-language)                      |
| Auth      | JWT in httpOnly cookies, bcryptjs                                |
| Shared    | `packages/shared` with DTO types and constants used by both apps |

## Project structure

One npm workspace with two apps and two shared packages:

```
cyberstars/
├── apps/
│   ├── ui/          # React frontend
│   └── api/         # Express API, database schema, migrations, seed
├── packages/
│   ├── shared/      # Types and rules (UI + API)
│   └── content/     # Lessons, algorithm challenges, curriculum
├── e2e/             # Playwright tests
├── test/            # Test setup
└── .github/         # CI workflows
```

Run every script from the root; it forwards to the right workspace. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture breakdown, why it's one repo, API endpoints, and database schema.

## Scripts

| Script                      | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm run dev`               | Start everything (DB setup + Vite + Express)             |
| `npm test`                  | Run unit suite (Vitest: UI on jsdom, API on Node)        |
| `npm run test:coverage`     | Unit suite + v8 coverage; fails if below 90% on any axis |
| `npm run test:integration`  | Real-Postgres integration tests (needs `.env.test`)      |
| `npm run test:e2e:browser`  | Playwright UI flows (auth/forum/support/courses/profile) |
| `npm run test:e2e:docker`   | Playwright code-execution flows (Python/C/Java/terminal) |
| `npm run typecheck`         | TypeScript type checking                                 |
| `npm run lint`              | ESLint                                                   |
| `npm run format` / `:check` | Prettier write / check                                   |
| `npm run dead-code`         | Find unused files, exports, and dependencies (knip)      |
| `npm run build`             | Production build                                         |
| `npm run db:studio`         | Open Prisma Studio (DB browser)                          |

## CI

Every push and pull request runs eleven parallel jobs after a shared `setup`: **format-check**, **lint**, **typecheck**, **test** (with coverage + PR comment), **audit** (`npm audit --audit-level=high`), **dead-code** (knip), **validate-tests** (`npm run validate:tests`), **test-integration** (against a Postgres 16 service), **test-e2e-browser** and **test-e2e-docker** (Playwright with sandbox + runtime Docker images), and **build**. The **test** job also reads every lesson's visuals through the player's parser (`lessonVisuals.test.ts`) and checks that a Romanian lesson has the same steps as its English one.

A second workflow, **lesson-tests**, grades lessons again through the real Docker judge (`npm run check:tests`), but only the ones a pull request can have changed: a changed spec, reference solution or variant grades that lesson, a changed runner every lesson of its language, and a change to the judge shared by all languages every lesson. A pull request that touches none of them skips it; a manual run grades everything.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setup instructions
- How to add new lessons
- Code style guide
- Pull request process

Since October 11, 2026, work on CyberStars is planned as tickets in [Linear](https://linear.app/cyberstars).
That's where references like `CYB-23` in PRs point. The workspace isn't public, so opening them
needs an account. Issues, forks and PRs on GitHub are always welcome. To contribute regularly,
create a Linear account and open an issue asking to join the workspace.

## License

[BSD 3-Clause](LICENSE)
