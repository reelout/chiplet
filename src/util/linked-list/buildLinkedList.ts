import { LinkedListNode } from './node'

export function buildLinkedList<T>(arr: Iterable<T>) {
  const head = LinkedListNode(null as T)

  let current = head

  for (const value of arr) {
    const node = LinkedListNode(value)

    current.next = node
    node.previous = current

    if (current === head) {
      node.previous = null
    }

    current = node
  }

  return head.next
}
