# CyberStars

A free, open-source interactive coding education platform. Learn Python, C, Java, and Linux through structured lessons with a live code editor — read, write, and run code in the same view.

## Features

- **Split-screen lessons** — Markdown content on the left, live CodeMirror editor on the right
- **Runnable code examples** — click "Run" on any code block inside lesson text to execute it instantly
- **Test-driven completion** — lessons are marked complete when all test cases pass, not by clicking a button
- **Multi-language** — Python (49 lessons), Java (50 lessons), C (45 lessons), Linux terminal (55 lessons)
- **Algorithm challenges** — 45 challenges across 3 languages with Easy/Medium/Hard difficulty levels
- **Sandboxed execution** — user code runs in Docker containers, never in the browser
- **Progress tracking** — per-course progress bars, XP, levels, streak, and 8 unlockable badges
- **Code persistence** — saved per lesson, restored on revisit
- **Community forum** — threaded discussions with reactions and solution marking
- **Linux terminal** — interactive sandboxed shell for learning Linux commands

## Quick start

**Prerequisites:** Node.js 20+, PostgreSQL 14+, Docker

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

| Layer | Stack |
|-------|-------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, CodeMirror |
| Backend | Express 5, TypeScript, Prisma 6 (PostgreSQL), Zod |
| Execution | Docker containers (sandboxed, per-language) |
| Auth | JWT in httpOnly cookies, bcryptjs |
| Shared | `shared/` folder with DTO types and constants used by both sides |

## Project structure

```
cyberstars/
├── client/          # React frontend
├── server/          # Express API + lesson content
├── shared/          # Types and constants (client + server)
├── prisma/          # Database schema, migrations, seed
├── test/            # Test setup
├── docs/            # Technical documentation
└── .github/         # CI workflows
```

See [docs/architecture.md](docs/architecture.md) for the full architecture breakdown, API endpoints, and database schema.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start everything (DB setup + Vite + Express) |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run dead-code` | Find unused files, exports, and dependencies (knip) |
| `npm run build` | Production build |
| `npm run db:studio` | Open Prisma Studio (DB browser) |

## CI

Every push and pull request runs: **lint** → **typecheck** → **test** (with coverage) → **build** — all in parallel. PRs get an automatic coverage report comment.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setup instructions
- How to add new lessons
- Code style guide
- Pull request process

## License

[MIT](LICENSE)
