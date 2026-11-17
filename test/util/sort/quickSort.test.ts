import { quickSort } from '#util'
import { expect, test } from 'vitest'

test('quickSort', () => {
  expect(quickSort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3])
  expect(quickSort([2, 1, 3], (a, b) => b - a)).toEqual([3, 2, 1])

  const arr = [
    { value: 4, label: '4a' },
    { value: 2, label: '2' },
    { value: 1, label: '1' },
    { value: 4, label: '4b' },
    { value: 3, label: '3' },
  ]
  expect(quickSort(arr, (a, b) => a.label.localeCompare(b.label))).toEqual([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4a' },
    { value: 4, label: '4b' },
  ])
})
