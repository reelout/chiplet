import { buildTree, TreeNode } from '#util'
import { detachChild } from '#util/tree/detachChild'
import { assert, expect, test } from 'vitest'

function isContainedBy(child: number, parent: number | null): boolean {
  switch (child) {
    case 1:
      return parent === null
    case 2:
    case 3:
    case 4:
      return parent === 1
    case 5:
      return parent === 2
    case 6:
    case 7:
      return parent === 3
    default:
      return false
  }
}

test('detachChild - removes the only child', () => {
  const parent = buildTree([2, 1].map(TreeNode), isContainedBy)

  assert(parent)
  assert(parent.firstChild)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 2,
      nextSibling: null,
      firstChild: null,
    },
  })

  expect(detachChild(parent, parent.firstChild)).toBe(parent)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: null,
  })
})

test('detachChild - removes the first of two children', () => {
  const parent = buildTree([3, 2, 1].map(TreeNode), isContainedBy)

  assert(parent)
  assert(parent.firstChild)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 3,
      nextSibling: {
        value: 2,
        nextSibling: null,
        firstChild: null,
      },
      firstChild: null,
    },
  })

  expect(detachChild(parent, parent.firstChild)).toBe(parent)

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

test('detachChild - relinks siblings when removing middle children', () => {
  const parent = buildTree([6, 5, 4, 3, 2, 1].map(TreeNode), isContainedBy)

  assert(parent)
  assert(parent.firstChild?.nextSibling)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 4,
      nextSibling: {
        value: 3,
        nextSibling: {
          value: 2,
          nextSibling: null,
          firstChild: {
            value: 5,
            nextSibling: null,
            firstChild: null,
          },
        },
        firstChild: {
          value: 6,
          nextSibling: null,
          firstChild: null,
        },
      },
      firstChild: null,
    },
  })

  expect(detachChild(parent, parent.firstChild.nextSibling)).toBe(parent)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 4,
      nextSibling: {
        value: 2,
        nextSibling: null,
        firstChild: {
          value: 5,
          nextSibling: null,
          firstChild: null,
        },
      },
      firstChild: null,
    },
  })

  expect(detachChild(parent, parent.firstChild.nextSibling)).toBe(parent)

  expect(JSON.parse(JSON.stringify(parent))).toEqual({
    value: 1,
    nextSibling: null,
    firstChild: {
      value: 4,
      nextSibling: null,
      firstChild: null,
    },
  })
})

test('detachChild - clears the detached child links', () => {
  const parent = buildTree([3, 2, 1].map(TreeNode), isContainedBy)

  assert(parent)

  const child = parent.firstChild?.nextSibling

  assert(child)

  expect(detachChild(parent, child)).toBe(parent)

  expect(parent.firstChild?.value).toBe(3)
  expect(parent.lastChild).toBe(parent.firstChild)
  expect(child.parent).toBe(null)
  expect(child.previousSibling).toBe(null)
  expect(child.nextSibling).toBe(null)
})
