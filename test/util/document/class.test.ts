import { toClass } from '#util/document/class'
import { expect, test } from 'vitest'

test('toClass', () => {
  expect(toClass()).toBe(undefined)
  expect(toClass(false)).toBe(undefined)
  expect(toClass(null)).toBe(undefined)
  expect(toClass(undefined)).toBe(undefined)

  expect(toClass('cls1')).toBe('cls1')
  expect(toClass('cls1', false)).toBe('cls1')
  expect(toClass('cls1', null)).toBe('cls1')
  expect(toClass('cls1', undefined)).toBe('cls1')

  expect(toClass('')).toBe(undefined)
  expect(toClass('', '')).toBe(undefined)
  expect(toClass('', '', false)).toBe(undefined)
  expect(toClass('', '', false, null)).toBe(undefined)
  expect(toClass('', '', false, null, undefined)).toBe(undefined)

  expect(toClass('cls1', 'cls2')).toBe('cls1 cls2')
  expect(toClass('cls1', 'cls2', 'cls3')).toBe('cls1 cls2 cls3')

  expect(toClass('cls1', 'cls1', 'cls1')).toBe('cls1')
  expect(toClass('cls1', 'cls2', 'cls2')).toBe('cls1 cls2')

  expect(toClass('cls1 \n ', '\n \n')).toBe('cls1')
  expect(toClass('cls1\n \n', ' \n cls2')).toBe('cls1 cls2')

  expect(toClass('cls1 \n cls1', 'cls1\n \ncls1')).toBe('cls1')
  expect(toClass('cls1\n \ncls2', 'cls2 \n cls1')).toBe('cls1 cls2')

  expect(toClass([])).toBe(undefined)
  expect(toClass(['', false, null, undefined])).toBe(undefined)
  expect(toClass([' ', ' \n ', '\n \n'])).toBe(undefined)

  expect(toClass('cls1', [])).toBe('cls1')
  expect(toClass('cls1', ['', false, null, undefined])).toBe('cls1')
  expect(toClass('cls1', [' ', ' \n ', '\n \n'])).toBe('cls1')
  expect(toClass('cls1', ['\n', 'cls2 \n ', '\n \ncls2'])).toBe('cls1 cls2')
})
