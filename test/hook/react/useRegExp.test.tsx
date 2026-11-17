import { useRegExp } from '#hook'
import { renderHook } from '@testing-library/react'
import { expect, expectTypeOf, test } from 'vitest'

test('useRegExp', () => {
  for (const [
    pattern,
    flags,
    valid,
    [expect0, expect1, expect2, expect3, expect4],
  ] of [
    [undefined, undefined, false, [true, true, true, true, true]],
    [undefined, 'i', false, [true, true, true, true, true]],

    ['', undefined, true, [true, true, true, true, true]],
    ['', 'i', true, [true, true, true, true, true]],

    ['str', undefined, true, [false, true, false, true, false]],
    ['str', 'i', true, [false, true, true, true, true]],

    ['^str', undefined, true, [false, false, false, true, false]],
    ['^str', 'i', true, [false, false, false, true, true]],

    [/^str/, undefined, true, [false, true, false, false, false]],
    [/^str/, 'i', true, [false, true, true, false, false]],
  ] as const) {
    const { result } = renderHook(() => useRegExp(pattern, flags))
    const RE = result.current

    expect(RE !== undefined).toBe(valid)
    expect(!RE || RE.test('')).toBe(expect0)
    expect(!RE || RE.test('str')).toBe(expect1)
    expect(!RE || RE.test('STR')).toBe(expect2)
    expect(!RE || RE.test('^str')).toBe(expect3)
    expect(!RE || RE.test('^STR')).toBe(expect4)
  }
})

test('useRegExp - TS', () => {
  expectTypeOf(
    renderHook(() => useRegExp(undefined)).result.current
  ).toEqualTypeOf<RegExp | undefined>()
  expectTypeOf(
    renderHook(() => useRegExp('' as string | undefined)).result.current
  ).toEqualTypeOf<RegExp | undefined>()

  expectTypeOf(
    renderHook(() => useRegExp('')).result.current
  ).toEqualTypeOf<RegExp>()
  expectTypeOf(
    renderHook(() => useRegExp(/^/)).result.current
  ).toEqualTypeOf<RegExp>()
})
