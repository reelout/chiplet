import { promiseReduce } from '#util'
import { expect, test, vi } from 'vitest'

test('promiseReduce - #1', async () => {
  using spy1 = vi.fn(async () => 1 as const)

  const promise = promiseReduce(spy1)

  await expect(promise).resolves.toBe(1)

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
})

test('promiseReduce - #2', async () => {
  using spy1 = vi.fn(async () => 1 as const)
  using spy2 = vi.fn(async () => 2 as const)
  using spy3 = vi.fn(async () => 3 as const)
  using spy4 = vi.fn(async () => 4 as const)
  using spy5 = vi.fn(async () => 5 as const)
  using spy6 = vi.fn(async () => 6 as const)

  const promise = promiseReduce(spy1, spy2, spy3, spy4, spy5, spy6)

  await expect(promise).resolves.toBe(6)

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledTimes(1)
  expect(spy5).toHaveBeenCalledTimes(1)
  expect(spy6).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledWith(1)
  expect(spy3).toHaveBeenCalledWith(2)
  expect(spy4).toHaveBeenCalledWith(3)
  expect(spy5).toHaveBeenCalledWith(4)
  expect(spy6).toHaveBeenCalledWith(5)
})

test('promiseReduce - #3', async () => {
  using spy1 = vi.fn(async () => 1 as const)
  using spy2 = vi.fn(async () => 2 as const)
  using spy3 = vi.fn(async () => 3 as const)
  using spy4 = vi.fn(async () => 4 as const)
  using spy5 = vi.fn(async () => 5 as const)
  using spy6 = vi.fn(async () => 6 as const)
  using spy7 = vi.fn(async () => 7 as const)
  using spy8 = vi.fn(async () => 8 as const)

  const promise = promiseReduce(spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8)

  await expect(promise).resolves.toBe(8)

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledTimes(1)
  expect(spy5).toHaveBeenCalledTimes(1)
  expect(spy6).toHaveBeenCalledTimes(1)
  expect(spy7).toHaveBeenCalledTimes(1)
  expect(spy8).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledWith(1)
  expect(spy3).toHaveBeenCalledWith(2)
  expect(spy4).toHaveBeenCalledWith(3)
  expect(spy5).toHaveBeenCalledWith(4)
  expect(spy6).toHaveBeenCalledWith(5)
  expect(spy7).toHaveBeenCalledWith(6)
  expect(spy8).toHaveBeenCalledWith(7)
})
