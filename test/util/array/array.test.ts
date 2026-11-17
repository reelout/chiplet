import { expect, test } from 'vitest'

test('for...of - #1', async () => {
  const arr1 = [1, 2, 3]

  for (const val of arr1) {
    if (val === 3) {
      arr1.push(4)
    }

    if (val === 4) {
      arr1.push(5)
    }
  }

  expect(arr1).toEqual([1, 2, 3, 4, 5])
})

test('for...of - #2', async () => {
  const arr1 = [1, 2, 3]

  for (const val of arr1.values()) {
    if (val === 3) {
      arr1.push(4)
    }

    if (val === 4) {
      arr1.push(5)
    }
  }

  expect(arr1).toEqual([1, 2, 3, 4, 5])
})

test('for...of - #3', async () => {
  const arr1 = [1, 2, 3]

  for (const [_key, val] of arr1.entries()) {
    if (val === 3) {
      arr1.push(4)
    }

    if (val === 4) {
      arr1.push(5)
    }
  }

  expect(arr1).toEqual([1, 2, 3, 4, 5])
})

test('for...of - #4', async () => {
  const arr1 = [1, 2, 3]

  for (const val of arr1.slice()) {
    if (val === 3) {
      arr1.push(4)
    }

    if (val === 4) {
      arr1.push(5)
    }
  }

  expect(arr1).toEqual([1, 2, 3, 4])
})
