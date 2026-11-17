# Contributing

Use Corepack and the pnpm version pinned in the root `package.json`.

| Task                                   | Command                              |
| -------------------------------------- | ------------------------------------ |
| Install dependencies                   | `pnpm install`                       |
| Start Storybook                        | `pnpm dev`                           |
| Run all tests                          | `pnpm test run`                      |
| Run a test file                        | `pnpm test run <path>`               |
| Type-check                             | `pnpm test run --project=typescript` |
| Build the library and Storybook        | `pnpm build`                         |
| Format files                           | `pnpm format`                        |
| Lint files                             | `pnpm lint`                          |
| Run the full local validation sequence | `pnpm validate`                      |
