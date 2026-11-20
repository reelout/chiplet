import { renderServer } from '#test'
import { GlobalContainerStyle, ThemeProvider } from '#theme'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('ThemeProvider - renders children without a wrapper element', () => {
  const { container, getByTestId } = render(
    <ThemeProvider>
      <div data-testid='child'>Content</div>
    </ThemeProvider>
  )

  expect(getByTestId('child').parentElement).toBe(container)
})

test('ThemeProvider - server-side rendering', () => {
  const { result } = renderServer(
    <ThemeProvider>
      <div>Content</div>
    </ThemeProvider>
  )

  expect(result.current).toContain('Content')
  expect(result.current).not.toContain(GlobalContainerStyle)
})
