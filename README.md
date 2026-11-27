<!-- prettier-ignore -->
<div align="center">

# Chiplet

**Accessible building blocks for consistent React interfaces.**

[![npm version](https://img.shields.io/npm/v/chiplet?style=flat-square)](https://www.npmjs.com/package/chiplet)
[![Codecov](https://img.shields.io/codecov/c/github/reelout/chiplet?token=CYUeWqoWI5&style=flat-square)](https://app.codecov.io/github/reelout/chiplet)
![Node.js](https://img.shields.io/badge/Node.js-24.15%2B-3c873a?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Theming](#theming) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

Chiplet is an ESM library of React components, hooks, utilities, and theming tools. Use its accessible interaction patterns and shared design tokens to build consistent interfaces.

> [!NOTE]
> Chiplet is under active development (`v0.x`). Its public API may change between releases.

## Features

- **Accessible components** with interaction support such as keyboard navigation, focus handling, and dismissal where appropriate.
- **Theme tokens** exposed as CSS custom properties, customizable through a partial `theme` object, with light and dark color-scheme support.
- **TypeScript declarations** included in the package.

## Installation

Chiplet requires **Node.js 24.15 or later** and **React 19**. It declares `react`, `react-dom`, and `@vanilla-extract/css` as peer dependencies.

```sh
pnpm add chiplet
# or
npm install chiplet
# or
yarn add chiplet
```

## Usage

Import from the `chiplet/component` and `chiplet/theme` entry points:

```jsx
import { Button } from 'chiplet/component'
import { ColorScheme, GlobalContainerStyle } from 'chiplet/theme'

function App() {
  return (
    <>
      <ColorScheme mode='light dark' />
      <main className={GlobalContainerStyle}>
        <Button color='primary'>Get started</Button>
      </main>
    </>
  )
}
```

`GlobalContainerStyle` applies Chiplet's design tokens and base styles to the element; its CSS custom properties are inherited by descendants. `ColorScheme` tells the browser that both light and dark color schemes are supported, allowing it to choose the appropriate native colors. You can also import these exports from `chiplet`.

## Theming

Wrap your app in `ThemeProvider` and pass a partial `theme` object to restyle any token. The reserved keys `palette`, `size`, `space`, `motion`, and `typography` override the raw primitives and re-derive every dependent role; all other keys target semantic roles directly:

```jsx
import { Button, Spinner } from 'chiplet/component'
import { ThemeProvider } from 'chiplet/theme'

function App() {
  return (
    <ThemeProvider
      colorScheme='auto'
      theme={{
        // A role remap: links, buttons, checkboxes, and spinners follow.
        accent: { blue: 'oklch(0.62 0.19 255)' },
        // A primitive override: every transition re-derives.
        motion: { duration: { default: '80ms' } },
      }}
    >
      <Button color='primary' variant='primary'>
        Get started
      </Button>
      <Spinner aria-label='Loading' />
    </ThemeProvider>
  )
}
```

`ThemeProvider` renders a host element that carries the preset styles, the color scheme, and your compiled customization. Nested providers, portaled overlays, server-side rendering, and the advanced `compileCustomTheme` path are covered in the [customization guide](https://chiplet.overview.vercel.app/?path=/docs/theme-customization--docs).

## Documentation

Visit the <https://chiplet.overview.vercel.app/> for interactive Storybook stories of the components, hooks, and utilities.

## Contributing

To set up the repository and contribute, see [CONTRIBUTING.md](CONTRIBUTING.md). For development commands and engineering conventions, see [AGENTS.md](AGENTS.md).
