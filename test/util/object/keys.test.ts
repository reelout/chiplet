import { keys } from '#util'
import { expect, expectTypeOf, test } from 'vitest'

test('keys', () => {
  expect(keys(null)).toEqual([])
  expect(keys(undefined)).toEqual([])
  expect(keys({})).toEqual([])

  expect(
    keys({
      a: 1,
      b: '2',
      3: 3,
    })
  ).toEqual(['3', 'a', 'b'])

  expect(
    keys({
      a: undefined,
      b: { c: 3 },
      d: null,
    })
  ).toEqual(['a', 'b', 'd'])
})

test('keys - TS', () => {
  const obj1 = {} as Record<string, number> | null | undefined
  const obj2 = { a: 1 } as { readonly a: 1 } | null
  const obj3 = { b: '2' } as { b?: string } | null
  const obj4 = { a: 1, b: '2', 3: 3 }

  expectTypeOf(keys(null)).toEqualTypeOf<never[]>()
  expectTypeOf(keys(undefined)).toEqualTypeOf<never[]>()
  expectTypeOf(keys({})).toEqualTypeOf<never[]>()

  expectTypeOf(keys(obj1)).toEqualTypeOf<string[]>()
  expectTypeOf(keys(obj2)).toEqualTypeOf<'a'[]>()
  expectTypeOf(keys(obj3)).toEqualTypeOf<'b'[]>()
  expectTypeOf(keys(obj4)).toEqualTypeOf<('a' | 'b' | 3)[]>()

  expectTypeOf(keys({ a: 1, b: '2' })).toEqualTypeOf<('a' | 'b')[]>()
  expectTypeOf(keys({ a: 1, b: '2' } as const)).toEqualTypeOf<('a' | 'b')[]>()
  expectTypeOf(keys({ a: 1, 2: 2 } as const)).toEqualTypeOf<('a' | 2)[]>()
})
