import { generateUniqueId } from '#util'
import { expect, expectTypeOf, test } from 'vitest'

test('generateUniqueId', () => {
  expect(generateUniqueId()).toMatch(/^[a-z0-9]{8}$/)

  expect(generateUniqueId('')).toMatch(/^[a-z0-9]{8}$/)

  expect(generateUniqueId('', '')).toMatch(/^[a-z0-9]{8}$/)

  expect(generateUniqueId('tooltip-')).toMatch(/^tooltip-[a-z0-9]{8}$/)

  expect(generateUniqueId('tooltip-')).not.toBe(generateUniqueId('tooltip-'))

  expect(generateUniqueId('<<<', '>>>')).toMatch(/^<<<[a-z0-9]{8}>>>$/)

  expect(generateUniqueId('start-', undefined)).toMatch(/^start-[a-z0-9]{8}$/)

  expect(generateUniqueId(undefined, '-end')).toMatch(/^[a-z0-9]{8}-end$/)
})

test('generateUniqueId - TS', () => {
  expectTypeOf(generateUniqueId()).toEqualTypeOf<string>()

  expectTypeOf(generateUniqueId('')).toEqualTypeOf<string>()

  expectTypeOf(generateUniqueId('', '')).toEqualTypeOf<string>()

  expectTypeOf(
    generateUniqueId('tooltip-')
  ).toEqualTypeOf<`tooltip-${string}`>()

  expectTypeOf(
    generateUniqueId('<<<', '>>>')
  ).toEqualTypeOf<`<<<${string}>>>`>()

  expectTypeOf(
    generateUniqueId('start-', undefined)
  ).toEqualTypeOf<`start-${string}`>()

  expectTypeOf(
    generateUniqueId(undefined, '-end')
  ).toEqualTypeOf<`${string}-end`>()
})
