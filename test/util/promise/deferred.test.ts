import { Deferred } from '#util'
import { expect, test } from 'vitest'

test('Deferred', async () => {
  expect(new Deferred().promise).toBeInstanceOf(Promise)
  expect(new Deferred().resolve).toEqual(expect.any(Function))
  expect(new Deferred().reject).toEqual(expect.any(Function))

  await expect(Deferred.resolve(123).promise).resolves.toBe(123)
  await expect(Deferred.reject('err').promise).rejects.toThrow('err')

  await expect(Deferred.resolve(Promise.resolve(1)).promise).resolves.toBe(1)
  await expect(Deferred.resolve(Promise.reject('0')).promise).rejects.toBe('0')
})
