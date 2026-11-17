import { iterateTree, type TreeNode } from '#util'
import { expect, test } from 'vitest'

test('iterateTree - empty', () => {
  expect(Array.from(iterateTree(null))).toEqual([])
  expect(Array.from(iterateTree(undefined))).toEqual([])
})

test('iterateTree - single', () => {
  const root1 = {} as TreeNode<unknown>

  expect(Array.from(iterateTree(root1))).toEqual([root1])

  const root2 = {
    value: null,
    firstChild: null,
    nextSibling: null,
  } as TreeNode<unknown>

  expect(Array.from(iterateTree(root2))).toEqual([root2])
})

test('iterateTree - tree', () => {
  const root = {
    value: 0,
    firstChild: { value: 1, firstChild: { value: 2 } },
  } as TreeNode<number>

  expect(Array.from(iterateTree(root))).toMatchObject([
    { value: 0 },
    { value: 1 },
    { value: 2 },
  ])
})

test('iterateTree - complex tree', () => {
  const root = {
    value: 0,
    firstChild: { value: 1, nextSibling: { value: 2 } },
    nextSibling: { value: 3, firstChild: { value: 4 } },
  } as TreeNode<number>

  expect(Array.from(iterateTree(root))).toMatchObject([
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
  ])
})
