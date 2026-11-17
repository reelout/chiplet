export interface TreeNode<T> {
  value: T
  parent?: this | null
  previousSibling?: this | null
  nextSibling?: this | null
  firstChild?: this | null
  lastChild?: this | null
}

export function TreeNode<T>(value: T) {
  const node: TreeNode<T> = {
    value,
    parent: null,
    previousSibling: null,
    nextSibling: null,
    firstChild: null,
    lastChild: null,
  }

  Object.defineProperty(node, 'toJSON', {
    configurable: true,
    writable: true,
    value(): TreeNode<T> {
      return {
        value: this.value,
        nextSibling: this.nextSibling,
        firstChild: this.firstChild,
      }
    },
  })

  return node
}
