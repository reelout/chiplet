import { isSymbol } from '#util'
import { assertType, expect, test } from 'vitest'

test('isSymbol', () => {
  expect(isSymbol(Symbol())).toBe(true)
  expect(isSymbol(Symbol('@@observable'))).toBe(true)
  expect(isSymbol(Symbol.iterator)).toBe(true)
  expect(isSymbol(Symbol.asyncIterator)).toBe(true)

  expect(isSymbol('@@iterator')).toBe(false)
  expect(isSymbol('@@observable')).toBe(false)
  expect(isSymbol(123)).toBe(false)
  expect(isSymbol(true)).toBe(false)
  expect(isSymbol(null)).toBe(false)
  expect(isSymbol(undefined)).toBe(false)
  expect(isSymbol({})).toBe(false)
  expect(isSymbol([])).toBe(false)
})

test('isSymbol - TS', () => {
  const sym1 = Symbol() as symbol | string
  const sym2: unique symbol = Symbol()

  if (isSymbol(sym1)) {
    assertType<symbol>(sym1)
  } else {
    assertType<string>(sym1)
  }

  if (isSymbol(sym2)) {
    assertType<symbol>(sym2)
  } else {
    assertType<never>(sym2)
  }
})
