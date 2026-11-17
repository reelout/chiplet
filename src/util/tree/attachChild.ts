import type { TreeNode } from './node'

export function attachChild<T extends TreeNode<unknown>>(parent: T, child: T) {
  if (parent.firstChild == null) {
    parent.firstChild = child
  }

  if (parent.lastChild) {
    parent.lastChild.nextSibling = child
    child.previousSibling = parent.lastChild
  }

  parent.lastChild = child
  child.parent = parent

  return parent
}
