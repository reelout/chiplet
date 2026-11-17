import { isNumber } from '#util'
import { assertType, expect, test } from 'vitest'

test('isNumber', () => {
  expect(isNumber(0)).toBe(true)
  expect(isNumber(1)).toBe(true)
  expect(isNumber(-1)).toBe(true)
  expect(isNumber(3.14)).toBe(true)
  expect(isNumber(Number(3.14))).toBe(true)
  expect(isNumber(Number.NaN)).toBe(true)
  expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true)
  expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(true)
  expect(isNumber(Number.MAX_VALUE)).toBe(true)
  expect(isNumber(Number.MIN_VALUE)).toBe(true)
  expect(isNumber(Number.EPSILON)).toBe(true)
  expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true)
  expect(isNumber(Number('123'))).toBe(true)
  expect(isNumber(Number('abc'))).toBe(true)

  expect(isNumber('123')).toBe(false)
  expect(isNumber('abc')).toBe(false)
  expect(isNumber(true)).toBe(false)
  expect(isNumber(false)).toBe(false)
  expect(isNumber(null)).toBe(false)
  expect(isNumber(undefined)).toBe(false)
  expect(isNumber({})).toBe(false)
  expect(isNumber([])).toBe(false)
  expect(isNumber(Symbol('symbol'))).toBe(false)
})

test('isNumber - TS', () => {
  const num1 = 0 as number | string
  const num2 = 1 as 1 | 2 | 'str'

  if (isNumber(num1)) {
    assertType<number>(num1)
  } else {
    assertType<string>(num1)
  }

  if (isNumber(num2)) {
    assertType<1 | 2>(num2)
  } else {
    assertType<'str'>(num2)
  }
})
