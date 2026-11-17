import { useCallback, useLayoutEffect, useRef } from 'react'
import type { NavigationDirection, NavigationType } from '../Keyboard'
import { resolve, type Parse } from '../resolve'
import type { Tree } from '../tree'
import type { MoveFocus } from './useMoveFocus'

export type NavigateCallback = (
  ev: KeyboardEvent | React.KeyboardEvent,
  to: Tree.Node,
  from: Tree.Node | null
) => void

export type Navigate = ReturnType<typeof useNavigate>

export function useNavigate(
  type: NavigationType,
  direction: NavigationDirection,
  tree: Tree,
  active: Tree.Node | null,
  moveFocus: MoveFocus,
  parse: Parse,
  onNavigate?: NavigateCallback
) {
  const ref = useRef({
    tree,
    active,
    parse,
    onNavigate,
    event: null as KeyboardEvent | React.KeyboardEvent | null,
  })

  useLayoutEffect(() => {
    const handleBlur = (ev: FocusEvent) => {
      ref.current.event = null
    }

    document.addEventListener('focusout', handleBlur, true)

    return () => {
      document.removeEventListener('focusout', handleBlur, true)
    }
  }, [])

  const navigate = useCallback(
    (ev: KeyboardEvent | React.KeyboardEvent) => {
      const { tree, active, parse, onNavigate } = ref.current

      if (tree.root == null) {
        ref.current.event = ev
        return
      }

      const current = active?.value
      const target = parse(direction, current, ev)
      const node = resolve(type, direction, tree, current, target)

      if (!node) {
        return
      }

      const el = node.value

      if (el instanceof HTMLElement || el instanceof SVGElement) {
        if (el !== current) {
          onNavigate?.(ev, node, active)

          if (ev.defaultPrevented) {
            return
          }
        }

        moveFocus(ev, el)
      }
    },
    [direction, moveFocus, type]
  )

  useLayoutEffect(() => {
    ref.current.tree = tree
    ref.current.active = active
    ref.current.parse = parse
    ref.current.onNavigate = onNavigate

    if (tree.root != null && ref.current.event) {
      navigate(ref.current.event)
      ref.current.event = null
    }
  })

  return navigate
}
