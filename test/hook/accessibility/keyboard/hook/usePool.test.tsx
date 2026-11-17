import { usePool } from '#hook/accessibility/keyboard/hook/usePool'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { expect, test } from 'vitest'

test('usePool', async () => {
  const { result } = renderHook(() => usePool())

  expect(result.current).toEqual([
    expect.any(Map),
    expect.any(Function),
    expect.any(Function),
  ])

  const add = result.current[1]
  const remove = result.current[2]

  expect(Array.from(result.current[0])).toEqual([])

  const el = document.createElement('button')

  await act(() => add(el, { key: 'test' }))

  expect(Array.from(result.current[0])).toEqual([[el, { key: 'test' }]])

  await act(() => remove(el))

  expect(Array.from(result.current[0])).toEqual([])
})
