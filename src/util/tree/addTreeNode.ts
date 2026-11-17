import { attachChild } from './attachChild'
import { iterateChildren } from './iterateChildren'
import type { TreeNode } from './node'

export function addTreeNode<T extends TreeNode<unknown>>(
  root: T | null | undefined,
  node: NoInfer<T>,
  isContainedBy: (
    child: NoInfer<T>['value'],
    parent: NoInfer<T>['value']
  ) => boolean
) {
  if (root == null) {
    return node
  }

  if (isContainedBy(root.value, node.value)) {
    return attachChild(node, root)
  }

  let parent = root
  let found = isContainedBy(node.value, root.value)

  while (found) {
    found = false

    for (const child of iterateChildren(parent)) {
      if (isContainedBy(node.value, child.value)) {
        parent = child
        found = true
        break
      }
    }

    if (!found) {
      attachChild(parent, node)
    }
  }

  return root
}
