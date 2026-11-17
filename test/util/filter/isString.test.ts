import { isString } from '#util'
import { assertType, expect, test } from 'vitest'

test('isString', () => {
  expect(isString('')).toBe(true)
  expect(isString('Hello, World!')).toBe(true)
  expect(isString(String('Hello, World!'))).toBe(true)

  expect(isString(123)).toBe(false)
  expect(isString(true)).toBe(false)
  expect(isString(null)).toBe(false)
  expect(isString(undefined)).toBe(false)
  expect(isString({})).toBe(false)
  expect(isString([])).toBe(false)
  expect(isString(Symbol('symbol'))).toBe(false)
})

test('isString - TS', () => {
  const str1 = '' as string | number
  const str2 = 'str' as 'str' | 1 | 2

  if (isString(str1)) {
    assertType<string>(str1)
  } else {
    assertType<number>(str1)
  }

  if (isString(str2)) {
    assertType<'str'>(str2)
  } else {
    assertType<1 | 2>(str2)
  }
})
