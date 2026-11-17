import type { TreeNode } from './node'

export function* iterateChildren<T extends TreeNode<unknown>>(
  parent: T | null | undefined
) {
  let child = parent?.firstChild

  while (child) {
    yield child
    child = child.nextSibling
  }
}
