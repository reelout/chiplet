import { isObject } from '#util'
import { assertType, expect, test } from 'vitest'

test('isObject', () => {
  expect(isObject({})).toBe(true)
  expect(isObject([])).toBe(true)
  expect(isObject(/\b/)).toBe(true)
  expect(isObject(new Object())).toBe(true)
  expect(isObject(new Array(0))).toBe(true)
  expect(isObject(new Number(0))).toBe(true)
  expect(isObject(new String(''))).toBe(true)
  expect(isObject(new RegExp(''))).toBe(true)
  expect(isObject(new Boolean())).toBe(true)
  expect(isObject(new Date())).toBe(true)
  expect(isObject(new Map())).toBe(true)
  expect(isObject(new Set())).toBe(true)
  expect(isObject(new WeakMap())).toBe(true)
  expect(isObject(new WeakSet())).toBe(true)

  expect(isObject(0)).toBe(false)
  expect(isObject(1)).toBe(false)
  expect(isObject(Number.NaN)).toBe(false)
  expect(isObject(BigInt(0))).toBe(false)
  expect(isObject('')).toBe(false)
  expect(isObject('Hello, World!')).toBe(false)
  expect(isObject(true)).toBe(false)
  expect(isObject(false)).toBe(false)
  expect(isObject(null)).toBe(false)
  expect(isObject(undefined)).toBe(false)
  expect(isObject(() => {})).toBe(false)
  expect(isObject(new Function())).toBe(false)
  expect(isObject(Symbol())).toBe(false)
})

test('isObject - TS', () => {
  const obj1 = { a: 1 } as object | string | number
  const obj2 = { b: 'str' } as { readonly b: 'str' } | { a: 1 } | 1 | 2

  if (isObject(obj1)) {
    assertType<object>(obj1)
  } else {
    assertType<string | number>(obj1)
  }

  if (isObject(obj2)) {
    assertType<{ readonly b: 'str' } | { a: 1 }>(obj2)
  } else {
    assertType<1 | 2>(obj2)
  }
})
