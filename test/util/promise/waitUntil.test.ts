import { waitUntil } from '#util'
import { expect, test, vi } from 'vitest'

test('waitUntil - #1', async () => {
  const spy = vi.fn(() => 1)
  const promise = waitUntil(spy)

  await expect(promise).resolves.toBe(1)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('waitUntil - #2', async () => {
  const spy = vi.fn(() => 1)
  const promise = waitUntil(spy, AbortSignal.abort())

  await expect(promise).rejects.toThrow('This operation was aborted')
  expect(spy).toHaveBeenCalledTimes(0)
})

test('waitUntil - #3', async () => {
  const spy = vi.fn((): number | null => 1).mockReturnValueOnce(null)
  const promise = waitUntil(spy)

  await expect(promise).resolves.toBe(1)
  expect(spy).toHaveBeenCalledTimes(2)
})
