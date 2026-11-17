import { TreeNode } from '#util'
import { attachChild } from '#util/tree/attachChild'
import { expect, test } from 'vitest'

test('attachChild - #1', () => {
  const parent = TreeNode(1)

  expect(attachChild(parent, TreeNode(2))).toBe(parent)

  expect(parent.firstChild).toBe(parent.lastChild)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 2,
      nextSibling: null,
      firstChild: null,
    },
  })
})

test('attachChild - #2', () => {
  const parent = TreeNode(1)

  expect(attachChild(parent, TreeNode(2))).toBe(parent)
  expect(attachChild(parent, TreeNode(3))).toBe(parent)

  expect(parent.firstChild?.value).toBe(2)
  expect(parent.lastChild?.value).toBe(3)

  expect(parent.firstChild?.nextSibling?.value).toBe(3)
  expect(parent.lastChild?.previousSibling?.value).toBe(2)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 2,
      nextSibling: {
        value: 3,
        nextSibling: null,
        firstChild: null,
      },
      firstChild: null,
    },
  })
})

test('attachChild - #3', () => {
  const parent = TreeNode(1)

  expect(attachChild(parent, TreeNode(2))).toBe(parent)
  expect(attachChild(parent, TreeNode(3))).toBe(parent)
  expect(attachChild(parent, TreeNode(4))).toBe(parent)

  expect(parent.firstChild?.value).toBe(2)
  expect(parent.lastChild?.value).toBe(4)

  expect(parent.firstChild?.nextSibling?.value).toBe(3)
  expect(parent.firstChild?.nextSibling?.nextSibling?.value).toBe(4)
  expect(parent.lastChild?.previousSibling?.value).toBe(3)
  expect(parent.lastChild?.previousSibling?.previousSibling?.value).toBe(2)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 2,
      nextSibling: {
        value: 3,
        nextSibling: {
          value: 4,
          nextSibling: null,
          firstChild: null,
        },
        firstChild: null,
      },
      firstChild: null,
    },
  })
})
