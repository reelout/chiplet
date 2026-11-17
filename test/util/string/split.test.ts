import { split } from '#util'
import { expect, test } from 'vitest'

test('split', () => {
  expect(split('')).toEqual([])
  expect(split('    ')).toEqual([])
  expect(split('a bb  c1    dd2  ')).toEqual(['a', 'bb', 'c1', 'dd2'])

  expect(split('AB')).toEqual(['AB'])
  expect(split('Ab')).toEqual(['Ab'])
  expect(split('aB')).toEqual(['a', 'B'])
  expect(split('ab')).toEqual(['ab'])

  expect(split('A1B')).toEqual(['A1', 'B'])
  expect(split('A1b')).toEqual(['A1b'])
  expect(split('a1B')).toEqual(['a1', 'B'])
  expect(split('a1b')).toEqual(['a1b'])

  expect(split('ABC')).toEqual(['ABC'])
  expect(split('ABc')).toEqual(['A', 'Bc'])
  expect(split('AbC')).toEqual(['Ab', 'C'])
  expect(split('Abc')).toEqual(['Abc'])
  expect(split('aBC')).toEqual(['a', 'BC'])
  expect(split('aBc')).toEqual(['a', 'Bc'])
  expect(split('abC')).toEqual(['ab', 'C'])
  expect(split('abc')).toEqual(['abc'])

  expect(split('A1BC')).toEqual(['A1', 'BC'])
  expect(split('A1Bc')).toEqual(['A1', 'Bc'])
  expect(split('A1bC')).toEqual(['A1b', 'C'])
  expect(split('A1bc')).toEqual(['A1bc'])
  expect(split('a1BC')).toEqual(['a1', 'BC'])
  expect(split('a1Bc')).toEqual(['a1', 'Bc'])
  expect(split('a1bC')).toEqual(['a1b', 'C'])
  expect(split('a1bc')).toEqual(['a1bc'])
})
