# Contributing to CyberStars

Thanks for your interest in contributing! CyberStars is an open-source coding education platform and we welcome contributions of all kinds.

## Getting started

### Prerequisites

- Node.js 24+
- PostgreSQL 14+
- Docker (required for code execution sandboxing)
- Linux or macOS

### Setup

If you just want to run CyberStars locally (try it out, follow the lessons), clone the main repo directly with the command below. If you plan to submit changes, fork the repo first and clone your fork instead; see [Code changes](#code-changes) for the full fork workflow.

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
docker pull gcc:latest
docker pull python:3.10-slim
docker pull eclipse-temurin:21-jdk-alpine
docker pull danysk/kotlin:latest   # Kotlin runtime (course is badged "Coming Soon")
```

**Linux only**: your user must be in the `docker` group:

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

`npm run dev` handles everything automatically: it generates Prisma client, runs migrations, seeds the database, and starts both the frontend (Vite on `:5173`) and backend (Express on `:5000`).

### Linux terminal sandbox

The Linux course uses a custom sandbox image. Build it with:

```bash
docker build -t cyberstars-linux-sandbox apps/api/src/runtimes/linux-sandbox
```

Without this image, everything else works; only the Linux terminal lessons will fail.

## Project structure

The repo is one npm workspace. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture. The short version:

- `apps/ui/`: React 19 + Vite + Tailwind frontend
- `apps/api/`: Express 5 + TypeScript API, with the database schema, migrations and seed in `apps/api/prisma/`
- `packages/shared/`: Types and constants used by both the UI and the API
- `packages/content/`: Lessons, algorithm challenges, the curriculum (`curriculum.ts`) and the solution variants

Run every npm script from the root; it forwards to the right workspace.

## How to contribute

### How we track work

Since October 11, 2026, CyberStars has moved to tickets in [Linear](https://linear.app/cyberstars)
(team `CYB`), as the project has grown several directions of development worth planning.
Each PR is tied to a ticket, which is why you'll see references like `CYB-23` in PR
titles and descriptions. The Linear workspace isn't public, so those links need an account.

GitHub issues, forks and PRs are always welcome. If you'd like to contribute regularly,
create a Linear account and open an issue here asking to join. A maintainer will
send you an invite to the workspace.

### Reporting bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Browser/OS if relevant

### Adding lessons

Lesson content lives in `packages/content/lessons/{python,c,java,kotlin,linux}/`. Python, C, Java, and Kotlin lessons need two files:

1. `<slug>.md`: the lesson content (Markdown with runnable code blocks)
2. `<slug>-code.md`: the starter code template shown in the editor

Then register the lesson in `packages/content/curriculum.ts` (the `lessons` array) with the correct `courseKey`, `slug`, `title`, and `sortOrder`. This file is the **single source of truth** for curriculum structure: you edit it in one place, and it both seeds the database and generates the static `curriculum.json` the client reads.

Lesson content and curriculum are served as **static files**, not API routes. `npm run dev` (and `npm run build`) run `packages/content/scripts/generate-static-content.ts`, which copies the lesson Markdown into `apps/ui/public/lessons/` and writes `apps/ui/public/curriculum.json`. Those outputs are generated, not committed. Never edit them by hand; edit `packages/content/lessons/` and `packages/content/curriculum.ts` instead.

Completion is **judge-driven**, not honor-system: to make a lesson completable, add an
optional `<slug>-tests.json` (judge test cases) and `<slug>-solution.md` (reference
solution) beside the lesson. Passing the judge (the "Run Tests" button) is the only way
to complete a lesson. The server verifies it, so there is no manual "Mark Complete"
button. Lessons without test files still work; they just aren't completable yet.

Algorithm challenges (`packages/content/algorithms/{python,java,c}/`) state their input limits in
the statement's Input list, in English and Romanian, written as `<=` with powers
(`1 <= N <= 200`, `-10^9 <= x <= 10^9`). Their tests mix a few hand-written cases with
hidden `"generated": true` ones, and every case has to stay within the stated limits.

Course lessons are graded the way an online judge grades: any correct program passes,
whatever its idea and naming. A test only requires an exact name where the judge injects
a value or the mission names the function or class to write, plus the construct the
lesson teaches (the `for` lesson needs a `for`, the class lesson a class of the
student's own). Next to the tests, a lesson keeps variants in
`packages/content/variants/<course>/<slug>/`: `accept-*` files are other correct solutions
that must pass, `reject-*` files are cheats or near misses that must fail (hardcoded
output, the wrong loop, the right output without the taught construct). Add a reject for
every construct a lesson requires.

Before opening a PR, run `npm run validate:tests` and
`npm run check:tests <course>/<slug>` (for example `python/string-reverse` or
`algo-c/binary-search-c`), which grades the reference solution and the variants through
the real Docker judge: the reference must pass every case, and every variant must come
out as its name says. CI runs the same check on the lessons your PR changes.

Important rules:

- C code blocks must be full programs (`#include`, `int main(void)`, `return 0`)
- Java code blocks must have `public class Main` with `main()` method
- Linux lessons use two files instead: `<slug>.md` (the lesson) and `<slug>-setup.json` (the sandbox filesystem), no `-code.md`
- Look at existing lessons for the format; consistency matters

### Translations (optional)

CyberStars has a bilingual UI (English + Romanian) with a language toggle. **English is the default and the source of truth**, so always author lessons, algorithm challenges, and almanac entries in English first.

Translations are **optional and can be added later**; you never have to translate content in the same change that adds it. Until a translation exists, the app falls back to English automatically, so an English-only lesson renders correctly in both languages and nothing breaks when a reader switches to Romanian.

To translate content, add the localized file alongside the English source in a per-language subfolder (currently `ro`), reusing the **same slug** (slugs are language-independent):

- Lessons: `packages/content/lessons/<course>/ro/<slug>.md` (and `<slug>-code.md` if the course has one)
- Almanac: `apps/ui/public/almanac/ro/articles/<slug>.json`, plus `ro/index.json` and `ro/extras.json`
- UI strings: add the matching keys to `apps/ui/src/i18n/locales/ro.json` (keep its structure in sync with `en.json`)

Lesson and course titles come from `curriculum.ts` and are not translated per-language.

### Code changes

CyberStars uses the **fork-and-pull** model: you push branches to your own fork, then open a pull request against this repo. Direct push access to this repo is only granted to collaborators, so external contributors always work from a fork.

1. Fork the repo on GitHub, then clone your fork and add this repo as `upstream`:
   ```bash
   git clone https://github.com/<your-username>/cyberstars.git
   cd cyberstars
   git remote add upstream https://github.com/lauppv/cyberstars.git
   ```
2. Create a feature branch from `main`: `git switch -c my-feature main`
3. Keep your branch up to date with upstream: `git fetch upstream && git rebase upstream/main`
4. Make your changes
5. Run `npm run format:check && npm run lint && npm run typecheck && npm test && npm run dead-code`. All five must pass (these mirror the CI gates)
6. Push to your fork (`git push origin my-feature`) and open a pull request against `lauppv/cyberstars` with a clear description of what and why

### Commits

Keep each commit to one concern: a piece of shared infrastructure, one behaviour change,
the tests that belong to it, docs, or an unrelated cleanup. A PR usually holds several
commits, not one.

Why: any single piece can be reverted on its own without losing the rest, reviewers can
read the PR one step at a time, and `git bisect` lands on a small change instead of a
whole session's work.

Stage per path (or with `git add -p`) rather than `git add -A`. The one limit on
splitting: every commit must leave the tree green, so never split so finely that an
intermediate commit fails typecheck or tests.

### Formatting

This project uses [Prettier](https://prettier.io/) to enforce consistent code style (single quotes, semicolons, 2-space indent, 100-char lines). CI will reject unformatted code.

Before committing, run:

```bash
npm run format        # auto-fix all formatting issues
npm run format:check  # verify everything is clean (same check CI runs)
```

If `format:check` fails, just run `format`, it fixes everything automatically.

### Style guide

- TypeScript everywhere, strict mode
- Zod for all request validation
- CSS custom properties for theming (accent: `#6C5CE7`)
- No comments unless the "why" is non-obvious
- Flat, opaque panels (`.panel`), lucide-react icons, no decorative emoji or animated backgrounds

## Code of conduct

Be respectful. We're all here to learn and build something cool.
