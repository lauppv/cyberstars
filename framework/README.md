# Framework packages

The reusable parts of CyberStars, one package per folder (`framework/<name>/`), which CyberStars consumes like any other app would. They are meant to go out on npm one day, so each package stands on its own:

- **Named under `@cyberstars-framework/`**, never the app's `@cyberstars/`.
- **Declares its entry points** in `exports`; nothing else can be imported from outside.
- **Imports only from its own folder**: never the app, `@cyberstars/shared` or `@cyberstars/content`, and no `../` out of the package.
- **Lists every library it imports** in its own `package.json`, even one the repo root already has.

Packages so far:

- **`server-kit`**: the server basics every later package builds on. A settings loader (`required`, `optional`, `number`), `AppError` and its Express handler, `validateBody` for zod schemas, and `makeLimiter` for rate limits with shared defaults.
- **`sandbox`**: runs untrusted code in Docker. `languages` ships Python, Java and C as presets (`LanguageRuntime`); `sandbox`'s `createSandbox` takes the app's languages, a Docker label and the limits, and gives one hardened container per owner on the language they last ran, a cap on busy sandboxes with a line past it (`acquireSlot`), and the live run that streams a program over a WebSocket (`run`). An owner may belong to a group the app limits (`beforeNew`, `held`). `docker` holds the Docker helpers and `slots` the line itself, for an app's own queues.

CI enforces all four rules:

| Rule                                       | Check                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Scope and `exports`                        | `framework/packages.test.ts` (`npm test`)                                    |
| No app imports, nothing outside the folder | ESLint, `no-restricted-imports` and `framework/stay-inside` (`npm run lint`) |
| Every library listed                       | knip `--strict` on `framework/*` (`npm run dead-code`)                       |
