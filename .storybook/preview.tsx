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
import {
  DarkColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
  theme,
  themeClass,
  tokenClass,
} from 'chiplet/theme'
import clsx from 'clsx'
import { useLayoutEffect, useMemo, type PropsWithChildren } from 'react'

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
        <div className={clsx(tokenClass, themeClass)}>
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
        const colorScheme = useMemo(() => {
          switch (props.theme) {
            case _lightTheme:
              return LightColorScheme
            case _darkTheme:
              return DarkColorScheme
            default:
              return undefined
          }
        }, [props.theme])

        useLayoutEffect(() => {
          document.body.classList.add(...GlobalContainerStyle.split(' '))
          if (colorScheme) document.body.classList.add(colorScheme)
          document.body.style.background = theme.background

          return () => {
            document.body.classList.remove(...GlobalContainerStyle.split(' '))
            if (colorScheme) document.body.classList.remove(colorScheme)
            document.body.style.background = ''
          }
        }, [colorScheme])

        return props.children
      },
    }),
  ],
})

export default preview
