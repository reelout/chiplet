import { useIsomorphicLayoutEffect } from '#hook'
import { useLayoutEffect } from 'react'
import { expect, test } from 'vitest'

test('useIsomorphicLayoutEffect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect)
})
