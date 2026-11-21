import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import svgr from '@svgr/rollup'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    // The compiler treats values captured from outside a component as
    // immutable across renders. Test harnesses rely on mutating outer-scope
    // `let` bindings between renders, so compiling them produces stale props.
    // Scope compilation to the library sources, which is what we ship and
    // what the tests are meant to exercise.
    react({ compiler: { sources: ['/src/'] } }),
    vanillaExtractPlugin(),
    svgr({ dimensions: false }),
  ],
  test: {
    globals: true,
    pool: 'threads',
    coverage: {
      provider: 'istanbul',
      skipFull: true,
    },
    browser: {
      provider: playwright(),
      enabled: false,
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'typescript',
          typecheck: {
            enabled: true,
            only: true,
            include: !process.env.VITEST_VSCODE
              ? ['**/*.{test,spec}.{ts,tsx}']
              : [],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          include: ['**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['**/*.browser.{test,spec}.tsx'],
          browser: {
            enabled: true,
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'server-side-rendering',
          include: ['**/!(*.browser).{test,spec}.tsx'],
          environment: 'jsdom',
          testTimeout: 15_000,
          setupFiles: [
            fileURLToPath(
              import.meta.resolve('@testing-library/jest-dom/vitest')
            ),
          ],
        },
      },
      {
        extends: true,
        plugins: [storybookTest()],
        test: {
          name: 'storybook',
          testTimeout: 30_000,
          browser: {
            enabled: true,
          },
        },
      },
    ],
  },
  optimizeDeps: {
    include: ['@vanilla-extract/recipes/createRuntimeFn', 'clsx', 'colorjs.io'],
    rolldownOptions: {
      experimental: {
        chunkOptimization: false,
      },
    },
  },
})
