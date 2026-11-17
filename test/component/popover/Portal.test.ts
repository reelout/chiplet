import { Portal } from '#component'
import { renderServer } from '#test'
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
