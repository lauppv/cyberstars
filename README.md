# CyberStars

A free, open-source interactive coding education platform. Learn Python, C, Java, and Linux through structured lessons with a live code editor — read, write, and run code in the same view.

## Features

- **Split-screen lessons** — Markdown content on the left, live CodeMirror editor on the right
- **Runnable code examples** — click "Run" on any code block inside lesson text to execute it instantly
- **Self-paced completion** — run your code, then click "Mark Complete" when you're ready; no automated grading
- **Multi-language** — Python (61 lessons), Java (61 lessons), C (45 lessons), Linux terminal (55 lessons)
- **Bilingual UI (EN/RO)** — English (default) and Romanian with a language toggle; untranslated lessons or articles fall back to English automatically
- **Algorithm challenges** — 60 challenges across 3 languages with Easy/Medium/Hard difficulty levels
- **Sandboxed execution** — user code runs in Docker containers, never in the browser
- **Progress tracking** — per-course progress bars and unlockable badges (First Steps + Bronze/Silver/Gold tiers per course)
- **Code persistence** — saved per lesson, restored on revisit
- **Community forum** — threaded discussions with reactions and solution marking
- **Linux terminal** — interactive sandboxed shell for learning Linux commands

## Quick start

**Prerequisites:** Node.js 24+, PostgreSQL 14+, Docker

```bash
git clone https://github.com/lauppv/cyberstars.git
cd cyberstars
cp .env.example .env   # then edit with your DB credentials and a JWT_SECRET
npm ci
npm run dev
```

`npm run dev` handles everything — generates Prisma client, runs migrations, seeds the database, starts both frontend (`:5173`) and backend (`:5000`).

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions (PostgreSQL, Docker images, Linux sandbox).

## Tech stack

| Layer     | Stack                                                            |
| --------- | ---------------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite 7, Tailwind CSS 4, CodeMirror         |
| Backend   | Express 5, TypeScript, Prisma 6 (PostgreSQL), Zod                |
| Execution | Docker containers (sandboxed, per-language)                      |
| Auth      | JWT in httpOnly cookies, bcryptjs                                |
| Shared    | `shared/` folder with DTO types and constants used by both sides |

## Project structure

```
cyberstars/
├── client/          # React frontend
├── server/          # Express API + lesson content
├── shared/          # Types and constants (client + server)
├── prisma/          # Database schema, migrations, seed, curriculum data
├── test/            # Test setup
└── .github/         # CI workflows
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture breakdown, API endpoints, and database schema.

## Scripts

| Script                      | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm run dev`               | Start everything (DB setup + Vite + Express)             |
| `npm test`                  | Run unit suite (Vitest, jsdom)                           |
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

Every push and pull request runs ten parallel jobs after a shared `setup`: **format-check**, **lint**, **typecheck**, **test** (with coverage + PR comment), **audit** (`npm audit --audit-level=high`), **dead-code** (knip), **test-integration** (against a Postgres 16 service), **test-e2e-browser** and **test-e2e-docker** (Playwright with sandbox + runtime Docker images), and **build**.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setup instructions
- How to add new lessons
- Code style guide
- Pull request process

## License

[BSD 3-Clause](LICENSE)
