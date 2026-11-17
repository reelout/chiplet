import { negate } from '#util'
import { expect, expectTypeOf, test } from 'vitest'

function isNumber<T extends number | string>(value: T) {
  return typeof value === 'number'
}

function isEven(value: number): boolean {
  return value % 2 === 0
}

test('negate - #1', () => {
  expect(negate(isEven)(1)).toBe(true)
  expect(negate(isEven)(2)).toBe(false)
})

test('negate - #2', () => {
  expect(negate(isNumber)('1')).toBe(true)
  expect(negate(isNumber)(1)).toBe(false)
  expect([1, '2', 3, '4'].filter(negate(isNumber))).toEqual(['2', '4'])
})

test('negate - TS - #1', () => {
  expectTypeOf(negate(isEven)(1)).toEqualTypeOf<boolean>()
  expectTypeOf(negate(isEven)(2)).toEqualTypeOf<boolean>()
})

test('negate - TS - #2', () => {
  const arr1 = [1, '2']
  const arr2 = [1, '2'] as const

  expectTypeOf(arr1.filter(isNumber)).toEqualTypeOf<number[]>()
  expectTypeOf(arr1.filter(negate(isNumber))).toEqualTypeOf<string[]>()

  expectTypeOf(arr2.filter(isNumber)).toEqualTypeOf<1[]>()
  expectTypeOf(arr2.filter(negate(isNumber))).toEqualTypeOf<'2'[]>()
})
