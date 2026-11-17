import { useUniqueId } from '#hook'
import { renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'

test('useUniqueId', () => {
  let prefix = 'tooltip-'
  const { result, rerender } = renderHook(() => useUniqueId(prefix))
  expect(result.current).toMatch(/^tooltip-[a-z0-9]{8}$/)

  prefix = 'popover-'
  rerender()
  expect(result.current).toMatch(/^tooltip-[a-z0-9]{8}$/)
})
