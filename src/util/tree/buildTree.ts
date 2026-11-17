import { attachChild } from './attachChild'
import type { TreeNode } from './node'

export function buildTree<T extends TreeNode<unknown>>(
  iterable: Iterable<T>,
  isContainedBy: (
    child: NoInfer<T>['value'],
    parent: NoInfer<T>['value'] | null
  ) => boolean
) {
  const root = {
    value: null,
    firstChild: null,
    lastChild: null,
  } as T

  const pool = new Set(iterable)

  const containerMap = new Map<T | null | undefined, Set<T>>()

  for (const parent of [root, ...iterable]) {
    const ancestor = parent.parent
    const children = new Set<T>()

    for (const coll of [pool, containerMap.get(ancestor) ?? new Set()]) {
      for (const child of Array.from(coll)) {
        if (child !== parent && isContainedBy(child.value, parent.value)) {
          child.parent = parent
          children.add(child)
          coll.delete(child)
        }
      }
    }

    if (children.size > 0) {
      containerMap.set(parent, children)
    }
  }

  const queue = [root]

  let parent: T | undefined

  while ((parent = queue.shift())) {
    const children = containerMap.get(parent) ?? new Set()

    for (const child of children) {
      queue.push(child)

      attachChild(parent, child)

      if (parent === root) {
        child.parent = null
      }
    }
  }

  return root.firstChild
}
