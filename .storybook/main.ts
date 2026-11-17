import { defineMain } from '@storybook/react-vite/node'
import remarkGfm from 'remark-gfm'

export default defineMain({
  stories: [{ directory: '../test' }],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
    },
  },
  typescript: {
    reactDocgen: false,
  },
})
