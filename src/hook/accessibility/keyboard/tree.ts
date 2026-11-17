import { buildTree, iterateTree, TreeNode } from '#util'
import type { Key } from 'react'
import type { Pool } from './hook/usePool'
import { sort } from './sort'

export namespace Tree {
  export interface Node extends TreeNode<Element> {
    context: NodeContext
  }

  export interface NodeContext {
    _id?: string | null | undefined
    key: Key | null | undefined
    value?: unknown
    disabled?: boolean | undefined
  }
}

export interface Tree {
  root: Tree.Node | null | undefined
  map: ReadonlyMap<Element, Tree.Node>
}

export function Tree(pool: Pool): Tree {
  const byId = new Map(
    Array.from(pool).map(([element]) => [element.id, element])
  )

  const sorted = sort(
    Array.from(pool).map(([element, context]) => {
      const node = TreeNode(element) as Tree.Node
      node.context = context
      return node
    })
  )

  const root = buildTree(sorted, (child, parent) => {
    if (parent == null) return true

    if (
      parent.compareDocumentPosition(child) &
      Node.DOCUMENT_POSITION_CONTAINED_BY
    ) {
      return true
    }

    return [
      parent.getAttribute('aria-controls'),
      parent.getAttribute('aria-owns'),
    ]
      .flatMap((id) => id?.split(' '))
      .some((id) => {
        if (!id) return false
        if (id === child.id) return true
        return byId.get(id)?.contains(child)
      })
  })

  const map = new Map(
    Array.from(iterateTree(root)).map((node) => [node.value, node])
  )

  return {
    root,
    map,
  }
}
