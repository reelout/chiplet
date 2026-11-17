import { useObservable } from '#hook'
import { renderHookServer } from '#test'
import { from, Observable, type Observer } from 'rxjs'
import { assert, expect, test } from 'vitest'

test('useObservable - #1', async () => {
  const observable = from([1, 2, 3])

  const { result } = renderHookServer(() => useObservable(observable))

  expect(result.current).toBeUndefined()
})

test('useObservable - #2', async () => {
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
  })

  const { result } = renderHookServer(() => useObservable(observable))

  expect(result.current).toBeUndefined()

  assert(!observer)
})

test('useObservable - #3', async () => {
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
  })

  const { result } = renderHookServer(() => useObservable(observable, 0))

  expect(result.current).toBe(0)

  assert(!observer)
})

test('useObservable - #4', async () => {
  let observer: Observer<number> | undefined

  const observable = new Observable((subscriber) => {
    observer = subscriber
    observer.next(1)
  })

  const { result } = renderHookServer(() => useObservable(observable, 0))

  expect(result.current).toBe(0)

  assert(!observer)
})
