import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
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
      rolldownOptions: {
        experimental: {
          chunkOptimization: false,
        },
      },
    },
  })
)
