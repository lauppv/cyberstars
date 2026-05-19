# Contributing to CyberStars

Thanks for your interest in contributing! CyberStars is an open-source coding education platform and we welcome contributions of all kinds.

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Docker (required for code execution sandboxing)
- Linux or macOS

### Setup

```bash
git clone https://github.com/lauppv/cyberstars.git
cd cyberstars
cp .env.example .env
```

Edit `.env` before continuing:
- Set `DB_PASSWORD` to the password you'll create below
- Set `DATABASE_URL` to match: `postgresql://cyberstars:<your-password>@localhost:5432/cyberstars`
- Set `JWT_SECRET` to any random string (e.g. `openssl rand -hex 32`)

#### PostgreSQL setup

Make sure PostgreSQL is running, then create the user and database:

**Linux:**

```bash
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER cyberstars WITH PASSWORD 'your-password-here';"
sudo -u postgres psql -c "CREATE DATABASE cyberstars OWNER cyberstars;"
```

**macOS (Homebrew):**

```bash
brew services start postgresql
psql postgres -c "CREATE USER cyberstars WITH PASSWORD 'your-password-here';"
psql postgres -c "CREATE DATABASE cyberstars OWNER cyberstars;"
```

#### Docker setup

Pull the Docker images for code execution:

```bash
docker pull gcc:14
docker pull python:3.10-slim
docker pull eclipse-temurin:21-jdk-alpine
```

**Linux only** — your user must be in the `docker` group:

```bash
sudo usermod -aG docker $USER
# Log out and back in for the group change to take effect
```

On macOS, Docker Desktop handles permissions automatically.

#### Install and run

```bash
npm ci
npm run dev
```

`npm run dev` handles everything automatically — generates Prisma client, runs migrations, seeds the database, and starts both the frontend (Vite on `:5173`) and backend (Express on `:5000`).

### Linux terminal sandbox

The Linux course uses a custom sandbox image. Build it with:

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

Lesson content lives in `server/lessons/{python,c,java,linux}/`. Each lesson needs three files:

1. `<slug>.md` — the lesson content (Markdown with runnable code blocks)
2. `<slug>-code.md` — the starter code template shown in the editor
3. `<slug>-tests.json` — test cases that validate the student's solution

Then add the lesson to `prisma/seed.ts` in the `lessons` array with the correct `courseKey`, `slug`, `title`, and `sortOrder`. The next `npm run dev` will seed it automatically.

Important rules:
- C code blocks must be full programs (`#include`, `int main(void)`, `return 0`)
- Java code blocks must have `public class Main` with `main()` method
- Linux lessons need three files: `<slug>.md`, `<slug>-setup.json`, `<slug>-tests.json`
- Look at existing lessons for the format — consistency matters

### Code changes

1. Fork the repo and create a feature branch from `main`
2. Keep your branch up to date: `git fetch origin && git rebase origin/main`
3. Make your changes
4. Run `npm run typecheck && npm test && npm run lint` — all three must pass
5. Open a pull request with a clear description of what and why

### Style guide

- TypeScript everywhere, strict mode
- Zod for all request validation
- CSS custom properties for theming (accent: `#6C5CE7`)
- No comments unless the "why" is non-obvious
- Transparent backgrounds on all panels/cards so the cosmos starfield shows through

## Code of conduct

Be respectful. We're all here to learn and build something cool.
