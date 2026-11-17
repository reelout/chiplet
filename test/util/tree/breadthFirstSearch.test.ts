import { breadthFirstSearch, iterateChildren, type TreeNode } from '#util'
import { expect, test } from 'vitest'

test('breadthFirstSearch - #1', () => {
  expect(Array.from(breadthFirstSearch(null, () => null))).toEqual([])
  expect(Array.from(breadthFirstSearch(undefined, () => null))).toEqual([])
})

test('breadthFirstSearch - #2', () => {
  expect(
    Array.from(
      breadthFirstSearch(1, (val) => {
        if (val === 1) return [2, 3]
        if (val === 2) return [4]
        if (val === 3) return []
        return null
      })
    )
  ).toEqual([1, 2, 3, 4])
})

test('breadthFirstSearch - #3', () => {
  const root = {
    value: 1,
    firstChild: {
      value: 2,
      firstChild: {
        value: 3,
        nextSibling: {
          value: 4,
        },
      },
      nextSibling: {
        value: 5,
        firstChild: {
          value: 6,
          nextSibling: {
            value: 7,
          },
        },
      },
    },
  } as TreeNode<number>

  const result = Array.from(breadthFirstSearch(root, iterateChildren)).map(
    (node) => node.value
  )

  expect(result).toEqual([1, 2, 5, 3, 4, 6, 7])
})
