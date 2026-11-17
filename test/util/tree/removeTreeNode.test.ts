import { removeTreeNode, TreeNode } from '#util'
import { attachChild } from '#util/tree/attachChild'
import { expect, test } from 'vitest'

test('removeTreeNode - #1', () => {
  const root1 = removeTreeNode(null, TreeNode(1))
  const root2 = removeTreeNode(TreeNode(2), TreeNode(2))
  const root3 = removeTreeNode(TreeNode(3), TreeNode(2))

  expect(root1).toBeNull()
  expect(root2).toBeNull()
  expect(root3).toMatchObject({ value: 3 })
})

test('removeTreeNode - #2', () => {
  const root = TreeNode(1)
  attachChild(root, TreeNode(2))
  attachChild(root, TreeNode(3))

  expect(removeTreeNode(root, TreeNode(3))).toBe(root)

  expect(JSON.parse(JSON.stringify(root))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 2,
      nextSibling: null,
      firstChild: null,
    },
  })
})
