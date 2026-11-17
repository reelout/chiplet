import { useConst } from '#hook'
import { renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

test('useConst - #1', () => {
  let count = 0
  const spy = vi.fn(() => ++count)

  const { result, rerender } = renderHook(() => useConst(spy))

  expect(result.current).toBe(1)

  rerender()

  expect(result.current).toBe(1)

  expect(spy).toHaveBeenCalledTimes(1)
})
