import { isNil } from '#util'
import { assertType, expect, test } from 'vitest'

test('isNil', () => {
  expect(isNil(null)).toBe(true)
  expect(isNil(undefined)).toBe(true)

  expect(isNil(0)).toBe(false)
  expect(isNil(1)).toBe(false)
  expect(isNil(0n)).toBe(false)
  expect(isNil(NaN)).toBe(false)
  expect(isNil('')).toBe(false)
  expect(isNil('str')).toBe(false)
  expect(isNil(false)).toBe(false)
  expect(isNil(true)).toBe(false)
  expect(isNil([])).toBe(false)
  expect(isNil({})).toBe(false)
  expect(isNil(Symbol('symbol'))).toBe(false)
  expect(isNil(new Date())).toBe(false)
  expect(isNil(() => {})).toBe(false)
})

test('isNil - TS', () => {
  const num1 = 0 as number | null | undefined
  const num2 = 2 as number | null
  const str1 = '' as string | undefined
  const str2 = '1' as string | void | undefined
  const func1 = (() => {}) as (() => void) | undefined
  const func2 = (() => {}) as (() => void) | null | undefined

  if (isNil(num1)) {
    assertType<null | undefined>(num1)
  } else {
    assertType<number>(num1)
  }

  if (isNil(num2)) {
    assertType<null>(num2)
  } else {
    assertType<number>(num2)
  }

  if (isNil(str1)) {
    assertType<undefined>(str1)
  } else {
    assertType<string>(str1)
  }

  if (isNil(str2)) {
    assertType<undefined>(str2)
  } else {
    assertType<string | void>(str2)
  }

  if (isNil(func1)) {
    assertType<undefined>(func1)
  } else {
    assertType<() => void>(func1)
  }

  if (isNil(func2)) {
    assertType<null | undefined>(func2)
  } else {
    assertType<() => void>(func2)
  }
})
