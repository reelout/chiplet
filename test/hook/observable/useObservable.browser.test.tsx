import { useObservable } from '#hook'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { from, Observable, type Observer } from 'rxjs'
import { assert, expect, test } from 'vitest'

test('useObservable - #1', async () => {
  let count = 0
  const observable = from([1, 2, 3])

  const { result } = renderHook(() => {
    count += 1
    return useObservable(observable)
  })

  expect(result.current).toBe(3)

  expect(count).toBe(2)
})

test('useObservable - #2', async () => {
  let count = 0
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
  })

  const { result } = renderHook(() => {
    count += 1
    return useObservable(observable)
  })

  expect(result.current).toBeUndefined()

  act(() => {
    assert(observer)
    observer.next(1)
  })

  expect(result.current).toBe(1)

  act(() => {
    assert(observer)
    observer.next(2)
    observer.next(3)
    observer.next(4)
    observer.complete()
  })

  expect(result.current).toBe(4)

  expect(count).toBe(3)
})

test('useObservable - #3', async () => {
  let count = 0
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
  })

  const { result } = renderHook(() => {
    count += 1
    return useObservable(observable, 0)
  })

  expect(result.current).toBe(0)

  act(() => {
    assert(observer)
    observer.next(1)
    observer.complete()
  })

  expect(result.current).toBe(1)

  expect(count).toBe(2)
})

test('useObservable - #4', async () => {
  let count = 0
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
    observer.next(1)
  })

  const { result } = renderHook(() => {
    count += 1
    return useObservable(observable, 0)
  })

  expect(result.current).toBe(1)

  act(() => {
    assert(observer)
    observer.next(2)
    observer.next(3)
    observer.next(4)
    observer.complete()
  })

  expect(result.current).toBe(4)

  expect(count).toBe(3)
})

test('useObservable - #5', async () => {
  let count = 0
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
    observer.next(0)
  })

  const { result } = renderHook(() => {
    count += 1
    return useObservable(observable, 0)
  })

  expect(result.current).toBe(0)

  act(() => {
    assert(observer)
    observer.next(1)
    observer.next(1)
  })

  expect(result.current).toBe(1)

  act(() => {
    assert(observer)
    observer.next(1)
    observer.next(1)
    observer.complete()
  })

  expect(result.current).toBe(1)

  expect(count).toBe(2)
})
