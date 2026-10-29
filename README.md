<p align="center">
  <a href="https://cyberstars.app"><img src="apps/ui/public/og-image.png" alt="CyberStars: learn to code for free, no card, nothing to install" width="720"></a>
</p>

<p align="center">
  <a href="https://github.com/lauppv/cyberstars/actions/workflows/ci.yml"><img src="https://github.com/lauppv/cyberstars/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue" alt="License: BSD-3-Clause"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs welcome"></a>
  <a href="https://cyberstars.app"><img src="https://img.shields.io/badge/live-cyberstars.app-6C5CE7" alt="Live at cyberstars.app"></a>
</p>

# CyberStars

A free, open-source platform to learn Python, Java, C and Linux in your browser. Read a lesson, write code next to it, run it, and pass the lesson's tests to finish it.

Live at [cyberstars.app](https://cyberstars.app), in English and Romanian.

## Features

- **Five courses**: Python (60 lessons), Java (49), C (47), Linux in a real terminal (55) and Trees and Graphs (12, Beta, each lesson in all three languages)
- **88 algorithm challenges** from Easy to Hard, graded against hidden tests, with your runtime next to the reference solution
- **Split-screen lessons**: the lesson on the left, a live editor on the right, and every example in the text runnable
- **Graded, not honor-system**: a lesson counts as done only once the server's judge passes it
- **Step-by-step visuals** of arrays, linked lists, trees, graphs and stacks, some asking you to predict the next step
- **An AI tutor** that nudges you toward the answer without handing it over
- **Progress**: XP, levels, badges, a placement test, and Laniakea, a space game that quizzes you on what you've learned
- **Community**: a forum, messages and notifications
- **Sandboxed**: your code runs in locked-down Docker containers on the server, never in your browser

## Run it locally

You need Node.js 24+, PostgreSQL 14+ and Docker. The setup is one block of commands in [CONTRIBUTING.md](CONTRIBUTING.md#run-it-locally); after it, `npm run dev` serves the app on `:5173` and the API on `:5000`.

## Tech stack

| Layer     | Stack                                                    |
| --------- | -------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite 7, Tailwind CSS 4, CodeMirror |
| Backend   | Express 5, TypeScript, Prisma 6 (PostgreSQL), Zod        |
| Execution | Docker containers (sandboxed, per-language)              |
| Auth      | JWT in httpOnly cookies, bcryptjs                        |

One npm workspace: the app in `apps/ui`, the API in `apps/api`, shared types in `packages/shared` and the lessons in `packages/content`. [ARCHITECTURE.md](ARCHITECTURE.md) has the full breakdown, the API endpoints and the database schema.

Every pull request runs format, lint, typecheck, the tests with coverage, audit, dead code, integration, both Playwright suites and the build ([`ci.yml`](.github/workflows/ci.yml)), and grades the lessons it changed through the real judge ([`lesson-tests.yml`](.github/workflows/lesson-tests.yml)).

## Contributing

Contributions are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md). A mistake in a lesson? [Open an issue](https://github.com/lauppv/cyberstars/issues/new/choose). A question? Ask in [Discussions](https://github.com/lauppv/cyberstars/discussions). Please follow the [Code of Conduct](CODE_OF_CONDUCT.md), and report security issues privately as [SECURITY.md](SECURITY.md) says.

## License

Code under [BSD 3-Clause](LICENSE), lessons under [CC BY-SA 4.0](LICENSE-content.md).
