# Contributing to CyberStars

Thanks for your interest in contributing! CyberStars is an open-source coding education platform and we welcome contributions of all kinds.

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or just Docker)
- Docker (required for code execution sandboxing)

### Option A: Local setup

```bash
git clone https://github.com/lauppv/cyberstars.git
cd cyberstars
cp .env.example .env
npm install
npm run db:prepare           # Generate Prisma client, run migrations, seed data
npm run dev                  # Starts client (:5173) + server (:5000)
```

Before running, edit `.env`:
- Set `DB_USER`, `DB_PASSWORD`, `DB_NAME` to match your local PostgreSQL (the user and database must already exist)
- Set `DATABASE_URL` to match: `postgresql://<user>:<password>@localhost:5432/<dbname>`
- Set `JWT_SECRET` to any random string (e.g. `openssl rand -base64 32`)

If you don't have a PostgreSQL user/database yet:
```bash
sudo -u postgres createuser --createdb cyberstars
sudo -u postgres createdb -O cyberstars cyberstars
```

### Option B: Docker setup (recommended)

```bash
git clone https://github.com/lauppv/cyberstars.git
cd cyberstars
cp .env.example .env         # Only JWT_SECRET needs changing, DB values work as-is
docker compose up --build
```

The app will be available at `http://localhost:8080`.

### Code execution sandbox

All user code runs inside isolated Docker containers (no network, memory-limited, read-only). Python, C, and Java use public images that Docker pulls automatically on first run. The Linux course uses a custom sandbox image that you need to build manually:

```bash
docker build -t cyberstars-linux-sandbox server/runtimes/linux-sandbox
```

Without this image, everything else works — only the Linux terminal lessons will fail.

## Project structure

See [README.md](README.md) for the full architecture. The short version:

- `client/` — React 19 + Vite + Tailwind frontend
- `server/` — Express 5 + TypeScript API
- `prisma/` — Database schema, migrations, seed
- `shared/` — Types and constants used by both client and server
- `server/lessons/` — Lesson content as Markdown files

## How to contribute

### Reporting bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS if relevant

### Adding lessons

Lesson content lives in `server/lessons/{python,c,java,linux}/`. Each lesson is a Markdown file with runnable code blocks. See existing lessons for the format. Important rules:

- C code blocks must be full programs (`#include`, `int main(void)`, `return 0`)
- Java code blocks must have `public class Main` with `main()` method
- Linux lessons need three files: `<slug>.md`, `<slug>-setup.json`, `<slug>-tests.json`

### Code changes

1. Fork the repo and create a feature branch from `main`
2. Make your changes
3. Run `npm run typecheck && npm test && npm run lint` — all three must pass
4. Open a pull request with a clear description of what and why

### Style guide

- TypeScript everywhere, strict mode
- Zod for all request validation
- CSS custom properties for theming (accent: `#6C5CE7`)
- No comments unless the "why" is non-obvious

## Code of conduct

Be respectful. We're all here to learn and build something cool.
