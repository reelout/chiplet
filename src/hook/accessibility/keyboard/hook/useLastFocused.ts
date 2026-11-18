import { isARIAChecked, isARIASelected } from '#util'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { NavigationType } from '../Keyboard'
import type { Tree } from '../tree'

export function useLastFocused(
  type: NavigationType,
  tree: Tree,
  active: Element | null
) {
  // The memoized context is deliberately mutable: when 'active' is removed
  // from the tree the memo yields null, and the '??=' fallback below
  // restores the last captured context from the ref. Mutating the memoized
  // value keeps the ref fallback out of the memo dependencies, which would
  // otherwise propagate ref reads into every downstream memo.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  let ctx = useMemo(
    () => (active ? tree.map.get(active)?.context : null),
    [active, tree.map]
  )

  const ref = useRef({ active, context: ctx })

  active ??= ref.current.active
  ctx ??= ref.current.context

  useLayoutEffect(() => {
    ref.current.active = active
    ref.current.context = ctx
  })

  return useMemo<Element | null>(() => {
    if (active && tree.map.has(active)) {
      return active
    }

    for (const [el, node] of tree.map) {
      if (ctx && ctx._id != null && ctx._id === node.context._id) {
        return el
      }

      if (active?.id && active.id === el.id) {
        return el
      }

      if (ctx && ctx.key != null && ctx.key === node.context.key) {
        return el
      }

      if (type === 'linear' && (isARIASelected(el) || isARIAChecked(el))) {
        return el
      }
    }

    let node = tree.root

    if (!node) {
      return null
    }

    if (type === 'grid') {
      while (node.firstChild) {
        node = node.firstChild
      }
    }

    return node.value
  }, [active, ctx, tree.map, tree.root, type])
}
