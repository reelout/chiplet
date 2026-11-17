import { buildTree, TreeNode } from '#util'
import { expect, test } from 'vitest'

test('buildTree - #1', () => {
  expect(buildTree([], () => false)).toBe(null)

  expect(buildTree([], () => true)).toBe(null)

  expect(buildTree([TreeNode(1)], () => false)).toBe(null)

  expect(buildTree([TreeNode(1)], () => true)).toEqual({
    parent: null,
    value: 1,
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
  })
})

test('buildTree - #2', () => {
  const root = buildTree([1, 2, 3, 4].map(TreeNode), (child, parent) => {
    switch (child) {
      case 1:
        return parent === null
      case 2:
        return parent === 1
      case 3:
        return parent === 1
      default:
        return false
    }
  })

  expect(JSON.parse(JSON.stringify(root))).toEqual({
    value: 1,
    firstChild: {
      value: 2,
      firstChild: null,
      nextSibling: {
        value: 3,
        firstChild: null,
        nextSibling: null,
      },
    },
    nextSibling: null,
  })
})

test('buildTree - #3', () => {
  const root = buildTree([4, 3, 2, 1].map(TreeNode), (child, parent) => {
    switch (child) {
      case 1:
        return parent === null
      case 2:
        return parent === null || parent === 1
      case 3:
        return parent === 2
      default:
        return false
    }
  })

  expect(JSON.parse(JSON.stringify(root))).toEqual({
    value: 1,
    firstChild: {
      value: 2,
      firstChild: {
        value: 3,
        firstChild: null,
        nextSibling: null,
      },
      nextSibling: null,
    },
    nextSibling: null,
  })
})

test('buildTree - #4', () => {
  const root = buildTree(
    [1, 2, 3, 4, 5, 6, 7].map(TreeNode),
    (child, parent) => {
      switch (child) {
        case 1:
          return parent === null
        case 2:
          return parent === 3
        case 3:
          return parent === null
        case 4:
          return parent === 6
        case 5:
          return parent === 2
        case 6:
          return parent === 1
        case 7:
          return parent === 3
        default:
          return false
      }
    }
  )

  expect(root).toEqual({
    parent: null,
    value: 1,
    firstChild: {
      parent: expect.objectContaining({ value: 1 }),
      value: 6,
      firstChild: {
        parent: expect.objectContaining({ value: 6 }),
        value: 4,
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
      },
      lastChild: expect.objectContaining({ value: 4 }),
      previousSibling: null,
      nextSibling: null,
    },
    lastChild: expect.objectContaining({ value: 6 }),
    previousSibling: null,
    nextSibling: {
      parent: null,
      value: 3,
      firstChild: {
        parent: expect.objectContaining({ value: 3 }),
        value: 2,
        firstChild: {
          parent: expect.objectContaining({ value: 2 }),
          value: 5,
          firstChild: null,
          lastChild: null,
          previousSibling: null,
          nextSibling: null,
        },
        lastChild: expect.objectContaining({ value: 5 }),
        previousSibling: null,
        nextSibling: {
          parent: expect.objectContaining({ value: 3 }),
          value: 7,
          firstChild: null,
          lastChild: null,
          previousSibling: expect.objectContaining({ value: 2 }),
          nextSibling: null,
        },
      },
      lastChild: expect.objectContaining({ value: 7 }),
      previousSibling: expect.objectContaining({ value: 1 }),
      nextSibling: null,
    },
  })
})
