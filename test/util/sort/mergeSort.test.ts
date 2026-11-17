import { mergeSort } from '#util'
import { expect, test } from 'vitest'

test('mergeSort', () => {
  expect(mergeSort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3])
  expect(mergeSort([2, 1, 3], (a, b) => b - a)).toEqual([3, 2, 1])

  const arr = [
    { value: 3, label: 'c' },
    { value: 1, label: 'c' },
    { value: 2, label: 'c' },
  ]
  expect(mergeSort(arr, (a, b) => a.label.localeCompare(b.label))).toEqual([
    { value: 3, label: 'c' },
    { value: 1, label: 'c' },
    { value: 2, label: 'c' },
  ])
})
