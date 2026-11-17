import { useIsomorphicLayoutEffect } from '#hook'
import { useEffect } from 'react'
import { expect, test } from 'vitest'

test('useIsomorphicLayoutEffect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useEffect)
})
