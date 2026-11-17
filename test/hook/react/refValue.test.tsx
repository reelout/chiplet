import { refValue } from '#hook'
import { renderHook } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test } from 'vitest'

test('refValue - #1', () => {
  let count = 0

  const { result } = renderHook(() => {
    count += 1
    return refValue(1)
  })

  expect(result.current).toBe(1)

  expect(count).toBe(1)
})

test('refValue - #2', () => {
  let count = 0

  const { result } = renderHook(() => {
    count += 1
    return refValue(() => 2)
  })

  expect(result.current?.()).toBe(2)

  expect(count).toBe(1)
})

test('refValue - #3', () => {
  let count = 0

  const { result } = renderHook(() => {
    count += 1
    return refValue({ current: 3 })
  })

  expect(result.current).toBe(3)

  expect(count).toBe(1)
})

test('refValue - #4', () => {
  let count = 0

  const { result } = renderHook(() => {
    count += 1
    return refValue({ current: () => 4 })
  })

  expect(result.current?.()).toBe(4)

  expect(count).toBe(1)
})

test('refValue - #5', async () => {
  let count = 0
  const ref = createRef<number>()

  const { result, rerender } = renderHook(() => {
    count += 1
    return refValue(ref)
  })

  expect(result.current).toBe(null)

  await act(() => {
    ref.current = 5
  })

  expect(result.current).toBe(null)

  rerender()

  expect(result.current).toBe(5)

  expect(count).toBe(2)
})

test('refValue - #6', async () => {
  let count = 0
  const ref = createRef<() => number>()

  const { result, rerender } = renderHook(() => {
    count += 1
    return refValue(ref)
  })

  expect(result.current).toBe(null)

  await act(() => {
    ref.current = () => 6
  })

  expect(result.current).toBe(null)

  rerender()

  expect(result.current?.()).toBe(6)

  expect(count).toBe(2)
})
