import type { TreeNode } from './node'

export function* iterateTree<T extends TreeNode<unknown>>(
  root: T | null | undefined
) {
  const queue = [root]
  let current: T | null | undefined

  while ((current = queue.pop())) {
    yield current

    if (current.nextSibling) {
      queue.push(current.nextSibling)
    }

    if (current.firstChild) {
      queue.push(current.firstChild)
    }
  }
}
