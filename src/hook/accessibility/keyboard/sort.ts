import type { TreeNode } from '#util'
import { mergeSort } from '#util'

export function sort<T extends TreeNode<Element>>(arr: readonly T[]) {
  return mergeSort(arr, ({ value: a }, { value: b }) => {
    /* istanbul ignore next */
    if (a === b) {
      return 0
    }

    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1
  })
}
