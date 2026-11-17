import { expect, expectTypeOf, test } from 'vitest'
import { generatedIdentifiers } from './generateDeterministicId.css'

test('generateDeterministicId', async () => {
  expect(generatedIdentifiers[0]).toMatch(/^\w{9}$/)

  expect(generatedIdentifiers[1]).toMatch(/^prefix-\w{9}$/)

  expect(generatedIdentifiers[2]).toMatch(/^prefix-\w{9}$/)

  expect(generatedIdentifiers[1]).not.toBe(generatedIdentifiers[2])
})

test('generateDeterministicId - TS', async () => {
  expectTypeOf(generatedIdentifiers[0]).toEqualTypeOf<string>()

  expectTypeOf(generatedIdentifiers[1]).toEqualTypeOf<`prefix-${string}`>()

  expectTypeOf(generatedIdentifiers[2]).toEqualTypeOf<`prefix-${string}`>()
})
