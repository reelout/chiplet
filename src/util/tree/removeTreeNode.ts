import { detachChild } from './detachChild'
import { iterateChildren } from './iterateChildren'
import type { TreeNode } from './node'

export function removeTreeNode<T extends TreeNode<unknown>>(
  root: T | null | undefined,
  { value }: NoInfer<T>
) {
  if (root == null) {
    return null
  }

  if (root.value === value) {
    return null
  }

  const queue = [root]
  let parent: T | null | undefined

  while ((parent = queue.shift())) {
    for (const child of iterateChildren(parent)) {
      queue.push(child)

      if (child.value === value) {
        detachChild(parent, child)
        return root
      }
    }
  }

  return root
}
