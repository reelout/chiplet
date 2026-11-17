import { isPromise } from '#util'
import { assertType, expect, test } from 'vitest'

test('isPromise', () => {
  expect(isPromise({ then: () => {} })).toBe(true)
  expect(isPromise({ then: async () => {} })).toBe(true)

  expect(isPromise(0)).toBe(false)
  expect(isPromise(1)).toBe(false)
  expect(isPromise(Number.NaN)).toBe(false)
  expect(isPromise(BigInt(0))).toBe(false)
  expect(isPromise('')).toBe(false)
  expect(isPromise('Hello, World!')).toBe(false)
  expect(isPromise(true)).toBe(false)
  expect(isPromise(false)).toBe(false)
  expect(isPromise(null)).toBe(false)
  expect(isPromise(undefined)).toBe(false)
  expect(isPromise(() => {})).toBe(false)
  expect(isPromise(new Function())).toBe(false)
  expect(isPromise(Symbol())).toBe(false)
  expect(isPromise({})).toBe(false)
  expect(isPromise([])).toBe(false)
  expect(isPromise(/\b/)).toBe(false)
  expect(isPromise(new Object())).toBe(false)
  expect(isPromise(new Array(0))).toBe(false)
  expect(isPromise(new Number(0))).toBe(false)
  expect(isPromise(new String(''))).toBe(false)
  expect(isPromise(new RegExp(''))).toBe(false)
  expect(isPromise(new Boolean())).toBe(false)
  expect(isPromise(new Date())).toBe(false)
  expect(isPromise(new Map())).toBe(false)
  expect(isPromise(new Set())).toBe(false)
  expect(isPromise(new WeakMap())).toBe(false)
  expect(isPromise(new WeakSet())).toBe(false)
})

test('isPromise - TS', () => {
  const val1 = 1 as string | number | PromiseLike<string>
  const val2 = Promise.resolve(2) as void | Promise<unknown>

  if (isPromise(val1)) {
    assertType<PromiseLike<string>>(val1)
  } else {
    assertType<string | number>(val1)
  }

  if (isPromise(val2)) {
    assertType<Promise<unknown>>(val2)
  } else {
    assertType<void>(val2)
  }
})
