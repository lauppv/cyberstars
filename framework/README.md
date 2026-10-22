# Framework packages

The reusable parts of CyberStars, one package per folder (`framework/<name>/`), which CyberStars consumes like any other app would. They are meant to go out on npm one day, so each package stands on its own:

- **Named under `@cyberstars-framework/`**, never the app's `@cyberstars/`.
- **Declares its entry points** in `exports`; nothing else can be imported from outside.
- **Imports only from its own folder**: never the app, `@cyberstars/shared` or `@cyberstars/content`, and no `../` out of the package.
- **Lists every library it imports** in its own `package.json`, even one the repo root already has.

CI enforces all four:

| Rule                                       | Check                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Scope and `exports`                        | `framework/packages.test.ts` (`npm test`)                                    |
| No app imports, nothing outside the folder | ESLint, `no-restricted-imports` and `framework/stay-inside` (`npm run lint`) |
| Every library listed                       | knip `--strict` on `framework/*` (`npm run dead-code`)                       |
