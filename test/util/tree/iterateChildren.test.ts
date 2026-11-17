import { iterateChildren, type TreeNode } from '#util'
import { expect, test } from 'vitest'

test('iterateChildren', () => {
  expect(Array.from(iterateChildren(null))).toEqual([])
  expect(Array.from(iterateChildren(undefined))).toEqual([])
  expect(Array.from(iterateChildren({} as TreeNode<unknown>))).toEqual([])

  expect(
    Array.from(
      iterateChildren({
        value: null,
        firstChild: null,
        nextSibling: null,
      } as TreeNode<null>)
    )
  ).toMatchObject([])

  expect(
    Array.from(
      iterateChildren({
        value: 0,
        firstChild: { value: 1, firstChild: { value: 2 } },
      } as TreeNode<number>)
    )
  ).toMatchObject([{ value: 1 }])

  expect(
    Array.from(
      iterateChildren({
        value: 0,
        firstChild: { value: 1, nextSibling: { value: 2 } },
        nextSibling: { value: 3, firstChild: { value: 4 } },
      } as TreeNode<number>)
    )
  ).toMatchObject([{ value: 1 }, { value: 2 }])
})
