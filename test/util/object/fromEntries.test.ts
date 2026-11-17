import { fromEntries } from '#util'
import { expect, expectTypeOf, test } from 'vitest'

test('fromEntries', () => {
  expect(fromEntries(null)).toEqual({})
  expect(fromEntries(undefined)).toEqual({})
  expect(fromEntries([])).toEqual({})

  expect(
    fromEntries([
      ['a', 1],
      ['b', '2'],
    ] as const)
  ).toEqual({ a: 1, b: '2' })

  expect(
    fromEntries([
      ['a', undefined],
      ['b', { c: 3 }],
    ] as const)
  ).toEqual({ a: undefined, b: { c: 3 } })
})

test('fromEntries - TS', () => {
  const arr1 = [] as [string, number][] | null | undefined
  const arr2 = [['a', 1]] as const
  const arr3 = [['b', undefined]] as ['b', string | undefined][] | null

  expectTypeOf(fromEntries(null)).toEqualTypeOf<{}>()
  expectTypeOf(fromEntries(undefined)).toEqualTypeOf<{}>()
  expectTypeOf(fromEntries([])).toEqualTypeOf<{}>()

  expectTypeOf(fromEntries(arr1)).toEqualTypeOf<Record<string, number>>()
  expectTypeOf(fromEntries(arr2)).toEqualTypeOf<{ a: 1 }>()
  expectTypeOf(fromEntries(arr3)).toEqualTypeOf<{ b: string | undefined }>()

  expectTypeOf(
    fromEntries([
      ['a', 1],
      ['b', '2'],
    ])
  ).toEqualTypeOf<Record<string, number | string>>()
  expectTypeOf(
    fromEntries([
      ['a', 1],
      ['b', '2'],
    ] as const)
  ).toEqualTypeOf<{ a: 1; b: '2' }>()
})
