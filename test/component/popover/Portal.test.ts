import { Portal } from '#component'
import { renderServer } from '#test'
import { GlobalContainerStyle, ThemeProvider } from '#theme'
import { createElement, createRef } from 'react'
import { expect, test } from 'vitest'

test('Portal - server-side rendering', () => {
  const ref = createRef<HTMLDivElement>()

  const { result } = renderServer(
    createElement(Portal, null, createElement('div', { ref }, 'Test'))
  )

  expect(result.current).toBe('')
  expect(ref.current).toBeNull()
})

test('Portal - server-side rendering within ThemeProvider', () => {
  const ref = createRef<HTMLDivElement>()

  const { result } = renderServer(
    createElement(
      ThemeProvider,
      null,
      createElement(Portal, null, createElement('div', { ref }, 'Test'))
    )
  )

  expect(result.current).toContain(GlobalContainerStyle)
  expect(ref.current).toBeNull()
})
