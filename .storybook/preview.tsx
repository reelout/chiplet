/* istanbul ignore file */
import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import {
  DocsContainer,
  type DocsContainerProps,
} from '@storybook/addon-docs/blocks'
import addonLinks from '@storybook/addon-links'
import addonThemes, { withThemeFromJSXProvider } from '@storybook/addon-themes'
import addonVitest from '@storybook/addon-vitest'
import { definePreview } from '@storybook/react-vite'
import type { PropsWithChildren } from 'react'

const _autoTheme = {}
const _lightTheme = {}
const _darkTheme = {}

const preview = definePreview({
  addons: [
    addonA11y(),
    addonDocs(),
    addonLinks(),
    addonThemes(),
    addonVitest(),
  ],
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /(date|time)$/i,
      },
    },
    docs: {
      codePanel: true,
      container: (props: PropsWithChildren<DocsContainerProps>) => (
        <div>
          <DocsContainer {...props} />
        </div>
      ),
    },
  },
  decorators: [
    withThemeFromJSXProvider({
      themes: { auto: _autoTheme, light: _lightTheme, dark: _darkTheme },
      defaultTheme: 'auto',
      Provider(props: PropsWithChildren<{ theme: object }>) {
        return props.children
      },
    }),
  ],
})

export default preview
