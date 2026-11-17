import { entries, type RecursiveEntry } from '#util'
import { expect, expectTypeOf, test } from 'vitest'

test('entries', () => {
  expect(entries(null)).toEqual([])
  expect(entries(undefined)).toEqual([])
  expect(entries({})).toEqual([])

  expect(entries({ a: 1, b: '2', 3: 3 })).toEqual([
    ['3', 3],
    ['a', 1],
    ['b', '2'],
  ])

  expect(entries({ a: undefined, b: { c: 3 }, 4: undefined })).toEqual([
    ['4', undefined],
    ['a', undefined],
    ['b', { c: 3 }],
  ])
})

test('entries - TS', () => {
  const obj1 = {} as Record<string, number> | null | undefined
  const obj2 = { a: 1 } as { readonly a: 1 } | null
  const obj3 = { b: '2' } as { b?: string } | null
  const obj4 = { 3: 3, '4': '4' as const }
  const obj5 = { a: 1 as number | string }
  const obj6 = { a: [1] as (number | string)[] }

  expectTypeOf(entries(null)).toEqualTypeOf<never[]>()
  expectTypeOf(entries(undefined)).toEqualTypeOf<never[]>()
  expectTypeOf(entries({})).toEqualTypeOf<never[]>()

  expectTypeOf(entries(obj1)).toEqualTypeOf<[string, number][]>()
  expectTypeOf(entries(obj2)).toEqualTypeOf<['a', 1][]>()
  expectTypeOf(entries(obj3)).toEqualTypeOf<['b', string | undefined][]>()
  expectTypeOf(entries(obj4)).toEqualTypeOf<([3, number] | ['4', '4'])[]>()
  expectTypeOf(entries(obj5)).toEqualTypeOf<['a', number | string][]>()
  expectTypeOf(entries(obj6)).toEqualTypeOf<['a', (number | string)[]][]>()

  expectTypeOf(entries({ a: 1, b: '2', 3: undefined })).toEqualTypeOf<
    (['a', number] | ['b', string] | [3, undefined])[]
  >()
  expectTypeOf(entries({ a: 1, b: '2', '3': 3 } as const)).toEqualTypeOf<
    (['a', 1] | ['b', '2'] | ['3', 3])[]
  >()

  expectTypeOf<RecursiveEntry<{}>>().toEqualTypeOf<never>()
  expectTypeOf<RecursiveEntry<{ a: 1; 2: 2 }>>().toEqualTypeOf<
    [['a'], 1] | [[2], 2]
  >()
  expectTypeOf<RecursiveEntry<{ a: { b: 1; c: { d: '5' } } }>>().toEqualTypeOf<
    [['a', 'b'], 1] | [['a', 'c', 'd'], '5']
  >()
  expectTypeOf<RecursiveEntry<{ a: number | string }>>().toEqualTypeOf<
    [['a'], string | number]
  >()
  expectTypeOf<RecursiveEntry<{ a: (string | boolean)[] }>>().toEqualTypeOf<
    [['a'], (string | boolean)[]]
  >()
  expectTypeOf<
    RecursiveEntry<{
      a: object | string | number | null | undefined
      b: { c: string | number | boolean | null | undefined }
    }>
  >().toEqualTypeOf<
    | [['a'], object | string | number | null | undefined]
    | [['b', 'c'], string | number | boolean | null | undefined]
  >()
})
