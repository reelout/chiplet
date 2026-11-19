import { useObservable } from '#hook'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { Observable, type Observer } from 'rxjs'
import { assert, expect, test } from 'vitest'

test('useObservable - reflects the emitted value after the initial value', async () => {
  let observer: Observer<number> | undefined

  const observable = new Observable<number>((subscriber) => {
    observer = subscriber
  })

  const { result } = renderHook(() => useObservable(observable, 0))

  assert(observer)

  expect(result.current).toBe(0)

  await act(() => observer!.next(1))

  expect(result.current).toBe(1)
})

test('useObservable - resets to the initial value when the observable is swapped', async () => {
  let observer1: Observer<number> | undefined
  let observer2: Observer<number> | undefined

  const observable1 = new Observable<number>((subscriber) => {
    observer1 = subscriber
  })

  const observable2 = new Observable<number>((subscriber) => {
    observer2 = subscriber
  })

  const { result, rerender } = renderHook(
    ({ observable }) => useObservable(observable, 0),
    { initialProps: { observable: observable1 } }
  )

  assert(observer1)

  await act(() => observer1!.next(1))

  expect(result.current).toBe(1)

  rerender({ observable: observable2 })

  assert(observer2)

  expect(result.current).toBe(0)

  await act(() => observer2!.next(2))

  expect(result.current).toBe(2)
})
