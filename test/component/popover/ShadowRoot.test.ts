import { ShadowRoot } from '#component'
import { renderServer } from '#test'
import { createElement, createRef } from 'react'
import { expect, test } from 'vitest'

test('ShadowRoot - server-side rendering', () => {
  const ref = createRef<HTMLDivElement>()

  const { result } = renderServer(
    createElement(ShadowRoot, { id: 'island', ref }, 'Test')
  )

  expect(result.current).toBe('<div id="island"></div>')
  expect(ref.current).toBeNull()
})
