import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [
      '**/.vercel',
      '**/coverage',
      '**/dist',
      '**/storybook-static',
      '**/test-results',
    ],
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { globals: globals.commonjs },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    languageOptions: { globals: globals.browser },
  },

  js.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-useless-rename': 'error',
      'object-shorthand': ['error', 'always'],
    },
  },

  ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          pathGroups: [{ pattern: '{#*,#*/**,@/**}', group: 'internal' }],
        },
      ],
    },
  },

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    rules: {
      'react/jsx-boolean-value': ['error', 'always'],
    },
    settings: {
      'react': { version: '19' },
    },
  },

  reactHooks.configs.flat.recommended,
  {
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        { additionalHooks: 'useIsomorphicLayoutEffect' },
      ],
    },
  },

  reactCompiler.configs.recommended,
  {
    files: ['src/hook/promise/usePromise.ts'],
    rules: {
      // The compiler silently miscompiles swapped AbortSignals (the effect
      // memo key narrows to `signal?.aborted`), so the hook carries
      // `'use no memo'`. The lint rule cannot see the miscompilation and
      // flags the directive as unused.
      'react-compiler/react-compiler': 'off',
    },
  },

  reactRefresh.configs.vite({
    allowConstantExport: true,
    extraHOCs: ['observer'],
  }),

  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Switch', 'Checkbox', 'Radio'],
        },
      ],
    },
  },
])
