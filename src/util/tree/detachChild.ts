import type { TreeNode } from './node'

export function detachChild<T extends TreeNode<unknown>>(parent: T, child: T) {
  if (parent.firstChild === child) {
    parent.firstChild = child.nextSibling ?? null
  }

  if (parent.lastChild === child) {
    parent.lastChild = child.previousSibling ?? null
  }

  if (child.previousSibling) {
    child.previousSibling.nextSibling = child.nextSibling ?? null
  }

  if (child.nextSibling) {
    child.nextSibling.previousSibling = child.previousSibling ?? null
  }

  return parent
}
