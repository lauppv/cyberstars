# AGENTS.md

Instructions for AI contributors (Claude, Copilot, Cursor, etc.) working on this codebase.

## Rules

1. **Surgical changes only** — touch only what the task requires. Don't refactor, rename, or "improve" adjacent code.
2. **Match existing style** — follow the patterns already in the codebase (naming, formatting, structure).
3. **Write tests for all new code** — every new feature, fix, or behavior change needs test coverage.
4. **Run the full check suite before submitting:**
   ```bash
   npm run format
   npm run lint
   npm run typecheck
   npm test
   ```
5. **No speculative features** — don't add abstractions, config options, or error handling beyond what's asked.
6. **Keep commits atomic** — one logical change per commit, with a clear message.

## Architecture at a glance

- `client/` — React 19 + Vite + Tailwind CSS
- `server/` — Express 5 + Prisma (PostgreSQL)
- `shared/` — DTO types and constants used by both sides
- `prisma/` — schema, migrations, seed
- `test/` — test setup (tests are co-located next to source files)

## Key conventions

- Functional components only (no class components)
- Feature-based file organization
- Zod for request validation on the server
- Three-layer server architecture: Routes → Controllers → Services → Repositories
- Coverage thresholds enforced in CI — don't let them drop
