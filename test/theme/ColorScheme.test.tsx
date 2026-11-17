import { ColorScheme } from '#theme'
import { getByTestId, render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('ColorScheme', () => {
  expect(getComputedStyle(document.documentElement).colorScheme).toBe('normal')

  const { rerender } = render(<ColorScheme data-testid='color-scheme' />)

  const el = getByTestId(document.head, 'color-scheme')

  expect(el).toBeInstanceOf(HTMLMetaElement)
  expect(el).toHaveAttribute('name', 'color-scheme')
  expect(el).toHaveAttribute('content', 'light dark')
  expect(getComputedStyle(document.documentElement).colorScheme).toBe(
    'light dark'
  )

  rerender(<ColorScheme mode='light' data-testid='color-scheme' />)

  expect(el).toHaveAttribute('content', 'light')
  expect(getComputedStyle(document.documentElement).colorScheme).toBe('light')

  rerender(<ColorScheme mode='dark' data-testid='color-scheme' />)

  expect(el).toHaveAttribute('content', 'dark')
  expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark')
})
