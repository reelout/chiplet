import { isArray } from '#util'
import { assertType, expect, test } from 'vitest'

test('isArray', () => {
  expect(() => new Array(NaN)).toThrow('Invalid array length')
  expect(new Array(0)).toEqual([])
  expect(new Array(1)).toEqual([undefined])
  expect(new Array(2)).toEqual([undefined, undefined])
  expect(new Array(null)).toEqual([null])
  expect(new Array(undefined)).toEqual([undefined])

  expect(() => Array(NaN)).toThrow('Invalid array length')
  expect(Array(0)).toEqual([])
  expect(Array(1)).toEqual([undefined])
  expect(Array(2)).toEqual([undefined, undefined])
  expect(Array(null)).toEqual([null])
  expect(Array(undefined)).toEqual([undefined])

  expect(Array.from({ length: 2 })).toEqual([undefined, undefined])
  expect(isArray(Array.from({ length: 2 }))).toBe(true)

  expect(isArray([])).toBe(true)
  expect(isArray([1, 2, 3])).toBe(true)
  expect(isArray([1, '2', 3])).toBe(true)

  expect(isArray(Array(0))).toBe(true)
  expect(isArray(Array(1))).toBe(true)
  expect(isArray(Array(2))).toBe(true)
  expect(isArray(Array(null))).toBe(true)
  expect(isArray(Array(undefined))).toBe(true)

  expect(isArray(new Array(0))).toBe(true)
  expect(isArray(new Array(1))).toBe(true)
  expect(isArray(new Array(2))).toBe(true)
  expect(isArray(new Array(null))).toBe(true)
  expect(isArray(new Array(undefined))).toBe(true)
})

test('isArray - TS', () => {
  const arr1 = [1, 2, 3, 4, 5, 6] as number[] | number | string | undefined
  const arr2 = [1, 2, 3] as readonly number[] | number | boolean | null
  const arr3 = [1, 2, 3] as readonly boolean[] | number[] | number | string

  if (isArray(arr1)) {
    assertType<number[]>(arr1)
  } else {
    assertType<number | string | undefined>(arr1)
  }

  if (isArray(arr2)) {
    assertType<readonly number[]>(arr2)
  } else {
    assertType<number | boolean | null>(arr2)
  }

  if (isArray(arr3)) {
    assertType<number[] | readonly boolean[]>(arr3)
  } else {
    assertType<number | string>(arr3)
  }
})
