import { addTreeNode, TreeNode } from '#util'
import { attachChild } from '#util/tree/attachChild'
import { expect, test, vi } from 'vitest'

test('addTreeNode - #1', () => {
  const spy1 = vi.fn(() => true)
  const spy2 = vi.fn(() => false)

  const root1 = addTreeNode(null, TreeNode(1), spy1)
  const root2 = addTreeNode(null, TreeNode(2), spy2)

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(0)

  expect(JSON.parse(JSON.stringify(root1))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: null,
  })
  expect(JSON.parse(JSON.stringify(root2))).toEqual({
    value: 2,
    nextSibling: null,
    firstChild: null,
  })
})

test('addTreeNode - #2', () => {
  const spy1 = vi.fn(() => true)
  const spy2 = vi.fn(() => false)

  const root1 = addTreeNode(TreeNode(0), TreeNode(1), spy1)
  const root2 = addTreeNode(TreeNode(0), TreeNode(2), spy2)

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(2)

  expect(JSON.parse(JSON.stringify(root1))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 0,
      nextSibling: null,
      firstChild: null,
    },
  })
  expect(JSON.parse(JSON.stringify(root2))).toEqual({
    value: 0,
    nextSibling: null,
    firstChild: null,
  })
})

test('addTreeNode - #3', () => {
  function isContainedBy(child: number, parent: number): boolean {
    return child > parent
  }

  let root = TreeNode(0)
  root = addTreeNode(root, TreeNode(1), isContainedBy)
  root = addTreeNode(root, TreeNode(2), isContainedBy)

  expect(JSON.parse(JSON.stringify(root))).toEqual({
    value: 0,
    nextSibling: null,
    firstChild: {
      value: 1,
      nextSibling: null,
      firstChild: {
        value: 2,
        nextSibling: null,
        firstChild: null,
      },
    },
  })
})

test('addTreeNode - #4', () => {
  function isContainedBy(child: number, parent: number): boolean {
    return child > parent
  }

  let root = TreeNode(0)
  attachChild(root, TreeNode(3))
  attachChild(root, TreeNode(1))
  root = addTreeNode(root, TreeNode(2), isContainedBy)

  expect(JSON.parse(JSON.stringify(root))).toEqual({
    value: 0,
    nextSibling: null,
    firstChild: {
      value: 3,
      nextSibling: {
        value: 1,
        nextSibling: null,
        firstChild: {
          value: 2,
          nextSibling: null,
          firstChild: null,
        },
      },
      firstChild: null,
    },
  })
})
