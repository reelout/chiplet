import type { TreeNode } from './node'

export function attachChild<T extends TreeNode<unknown>>(parent: T, child: T) {
  // Reset the child's sibling links so a node previously attached elsewhere
  // cannot keep stale links into its former tree.
  child.previousSibling = parent.lastChild ?? null
  child.nextSibling = null

  if (parent.firstChild == null) {
    parent.firstChild = child
  }

  if (parent.lastChild) {
    parent.lastChild.nextSibling = child
  }

  parent.lastChild = child
  child.parent = parent

  return parent
}
