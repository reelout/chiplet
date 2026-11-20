import { renderServer } from '#test'
import {
  DarkColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
  ThemeProvider,
} from '#theme'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('ThemeProvider - renders a themed container', () => {
  const { getByTestId } = render(
    <ThemeProvider data-testid='theme-provider'>Content</ThemeProvider>
  )

  const provider = getByTestId('theme-provider')

  expect(provider).toBeInstanceOf(HTMLDivElement)
  expect(provider).toHaveClass(...GlobalContainerStyle.split(' '))
  expect(provider).toHaveTextContent('Content')
})

test('ThemeProvider - color scheme', () => {
  const { rerender, getByTestId } = render(
    <ThemeProvider colorScheme='dark' data-testid='theme-provider' />
  )

  const provider = getByTestId('theme-provider')

  expect(provider).toHaveClass(DarkColorScheme)
  expect(provider).not.toHaveClass(LightColorScheme)

  rerender(<ThemeProvider colorScheme='light' data-testid='theme-provider' />)

  expect(provider).toHaveClass(LightColorScheme)
  expect(provider).not.toHaveClass(DarkColorScheme)

  rerender(<ThemeProvider colorScheme='auto' data-testid='theme-provider' />)

  expect(provider).not.toHaveClass(LightColorScheme)
  expect(provider).not.toHaveClass(DarkColorScheme)
})

test('ThemeProvider - merges consumer className and style', () => {
  const { getByTestId } = render(
    <ThemeProvider
      className='custom'
      data-testid='theme-provider'
      style={{ padding: '1rem' }}
    />
  )

  const provider = getByTestId('theme-provider')

  expect(provider).toHaveClass(...GlobalContainerStyle.split(' '))
  expect(provider).toHaveClass('custom')
  expect(provider.style.padding).toBe('1rem')
})

test('ThemeProvider - server-side rendering', () => {
  const { result } = renderServer(
    <ThemeProvider data-testid='theme-provider'>Content</ThemeProvider>
  )

  expect(result.current).toContain(GlobalContainerStyle)
  expect(result.current).toContain('Content')
})
