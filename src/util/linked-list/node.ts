export interface LinkedListNode<T> {
  value: T
  previous?: this | null
  next?: this | null
}

export function LinkedListNode<T>(value: T) {
  const node: LinkedListNode<T> = {
    value,
    previous: null,
    next: null,
  }

  Object.defineProperty(node, 'toJSON', {
    configurable: true,
    writable: true,
    value(): LinkedListNode<T> {
      return {
        value: this.value,
        next: this.next,
      }
    },
  })

  return node
}
