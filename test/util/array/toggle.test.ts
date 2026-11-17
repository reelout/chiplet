import { toggle } from '#util'
import { expect, test } from 'vitest'

test('toggle', async () => {
  const arr1 = [1, 2, 3]
  const arr2 = ['a', 1, 'b', 2, 'c']

  expect(toggle(arr1, 2)).toEqual([1, 3])
  expect(toggle(arr1, 4)).toEqual([1, 2, 3, 4])

  expect(toggle(arr2, 'b')).toEqual(['a', 1, 2, 'c'])
  expect(toggle(arr2, 3)).toEqual(['a', 1, 'b', 2, 'c', 3])
})
