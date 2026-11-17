import { buildLinkedList } from '#util/linked-list'
import { assert, expect, test } from 'vitest'

test('buildLinkedList - empty', () => {
  expect(buildLinkedList([])).toBeNull()
  expect(buildLinkedList(new Set())).toBeNull()
})

test('buildLinkedList - single element', () => {
  const head = buildLinkedList([1])

  assert(head)

  expect(head).toEqual({
    value: 1,
    previous: null,
    next: null,
  })

  expect(JSON.parse(JSON.stringify(head))).toEqual({
    value: 1,
    next: null,
  })
})

test('buildLinkedList - linked list', () => {
  const head = buildLinkedList([1, 2, 3])

  assert(head)

  expect(head).toEqual({
    value: 1,
    previous: null,
    next: {
      value: 2,
      previous: head,
      next: {
        value: 3,
        previous: head.next,
        next: null,
      },
    },
  })

  expect(JSON.parse(JSON.stringify(head))).toEqual({
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: null,
      },
    },
  })
})
