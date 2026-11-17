import { waitFor } from '#util'
import { expect, test, vi } from 'vitest'

test('waitFor - #1', async () => {
  const spy = vi.fn(() => 1)
  const promise = waitFor(spy)

  await expect(promise).resolves.toBe(1)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('waitFor - #2', async () => {
  const spy = vi.fn(() => 1)
  const promise = waitFor(spy, AbortSignal.abort())

  await expect(promise).rejects.toThrow('This operation was aborted')
  expect(spy).toHaveBeenCalledTimes(0)
})

test('waitFor - #3', async () => {
  const spy = vi.fn(() => 1).mockRejectedValueOnce(new Error('Test error'))
  const promise = waitFor(spy)

  await expect(promise).resolves.toBe(1)
  expect(spy).toHaveBeenCalledTimes(2)
})
