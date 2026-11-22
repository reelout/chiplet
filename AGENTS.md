# AGENTS.md

## Project overview

Chiplet is an ESM-only library of React components, hooks, and utilities. It uses React 19, the React Compiler, strict TypeScript, Vanilla Extract, Tailwind CSS v4, Vite/Rollup, and Storybook 10.

- `src/` contains the library, organized into `component/`, `hook/`, `infra/`, `theme/`, and `util/`. `src/index.ts` re-exports the public API.
- `test/` mirrors `src/` and contains tests, Storybook stories, and MDX documentation.
- `docs/` holds agent documentation under `docs/agents/`.
- `.agents/skills/` contains the repository's engineering workflow skills.

## Development commands

Use Corepack to run the pnpm version pinned in `package.json`.

| Task                                       | Command                                     |
| ------------------------------------------ | ------------------------------------------- |
| Install dependencies                       | `pnpm install`                              |
| Start Storybook                            | `pnpm dev`                                  |
| Lint with Stylelint, ESLint, and Prettier  | `pnpm lint`                                 |
| Apply lint fixes and formatting            | `pnpm format`                               |
| Run all tests once / in watch mode         | `pnpm test run` / `pnpm test`               |
| Run one test file                          | `pnpm test run test/util/lock/lock.test.ts` |
| Type-check tests and their imported source | `pnpm test run --project=typescript`        |
| Build the library and Storybook            | `pnpm build`                                |
| Run the full validation sequence           | `pnpm validate`                             |

For code changes, run the narrowest tests that cover the affected files or behavior. The GitHub Actions `Test` workflow runs `pnpm validate` on pull requests targeting `main` and pushes to `main`. Run the full validation locally when requested or when targeted checks are not sufficient. `pnpm validate` installs dependencies, cleans generated output, runs lint and build, then runs tests with coverage. The `pretest` hook installs Playwright browsers and their system dependencies.

## Test projects

Vitest selects projects by file pattern:

| File pattern                                          | Project                 | Environment                                      |
| ----------------------------------------------------- | ----------------------- | ------------------------------------------------ |
| `*.test.ts`, `*.spec.ts`                              | `node`                  | Node                                             |
| `*.test.tsx`, `*.spec.tsx`, except `.browser.*` files | `server-side-rendering` | jsdom                                            |
| `*.browser.test.tsx`, `*.browser.spec.tsx`            | `browser`               | Chromium, Firefox, and WebKit through Playwright |
| `*.stories.tsx` under `test/`                         | `storybook`             | Browser                                          |
| `**/*.{test,spec}.{ts,tsx}`                           | `typescript`            | Type-check only                                  |

Select a project with `--project=`, for example `pnpm test run --project=browser`. The `typescript` project checks test files and their imported source. Import shared helpers from `#test`, including `renderServer`, `renderHookServer`, `ErrorBoundary`, `create*Event`, and `browser()`.

## Conventions

- Preserve the ESM-only package format (`"type": "module"`) and strict TypeScript settings. Use `import type` with `verbatimModuleSyntax`; account for `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, and `isolatedModules`.
- Use Node.js `>=24.15`. Define shared dependency versions in the `pnpm-workspace.yaml` catalog and reference them as `catalog:` in package manifests.
- Use `#component`, `#hook`, `#infra`, `#theme`, and `#util` for public module barrels; use `#*` for source files, `#test` for shared test helpers, and `#.mock/*` for test mocks. These aliases are defined in `package.json`.
- Import within a module family by direct relative path (`'../react/useConst'`); use a family's public barrel or `#`-alias only from other families. Own-family imports through `'.'`, `'..'`, or `'#hook/...'` inside `src/hook` create the circular dependencies Rollup reports. Vanilla-extract-compiled `*.css.ts` files cannot resolve `#*` subpath aliases (exact aliases such as `#util` still resolve); import modules the exact aliases do not export from them by relative path.
- The React Compiler runs over `src/` in every pipeline: Rollup compiles through babel before esbuild; Vite and Vitest compile through the Rust compiler in `@vitejs/plugin-react`. Only `src/` compiles — tests, stories, and the test harness stay uncompiled. Opt a function out with a `'use no memo'` directive, and pair the directive with a file-scoped override in `eslint.config.js`, because the lint rule reports opt-outs it cannot prove necessary.
- Keep Husky checks enabled. lint-staged runs before commits, and commitlint checks commit messages.
- Use Conventional Commit messages with a module scope. In the description, single-quote module, hook, or component names.
- Protect secrets, preserve repository hooks, and avoid force-pushing or bypassing lint and tests.

## References

- For GitHub issues, use `gh` and follow [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).
- For domain terminology or design decisions, consult `GLOSSARY.md` and relevant ADRs under `docs/adr/` when present; follow [docs/agents/domain.md](docs/agents/domain.md).
- Update this guide when changing a documented command or convention.
