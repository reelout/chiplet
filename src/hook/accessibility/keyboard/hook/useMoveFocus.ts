import {
  useCallback,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { preferVirtualFocus } from '../resolve'
import type { Tree } from '../tree'

export type MoveFocus = ReturnType<typeof useMoveFocus>[2]

export function useMoveFocus(tree: Tree) {
  const [active, setActive] = useState<Element | null>(null)
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  const handleFocus = useEffectEvent((ev: FocusEvent) => {
    const el = ev.target as Element
    const hasFocus = el != null && tree.map.has(el)

    setActive(hasFocus ? el : null)
  })

  const handleBlur = useEffectEvent((ev: FocusEvent) => {
    setActive(null)
    setIsFocusVisible(false)
  })

  useLayoutEffect(() => {
    document.addEventListener('focusin', handleFocus, true)
    document.addEventListener('focusout', handleBlur, true)

    return () => {
      document.removeEventListener('focusin', handleFocus, true)
      document.removeEventListener('focusout', handleBlur, true)
    }
  }, [])

  const moveFocus = useCallback(
    (ev: KeyboardEvent | React.KeyboardEvent, el: HTMLElement | SVGElement) => {
      if (preferVirtualFocus(ev)) {
        setActive(el)
        setIsFocusVisible(true) // We believe the focus indicator should be visible when using virtual focus.
        el.scrollIntoView({ block: 'center', inline: 'center' })
        ev.preventDefault()
        return
      }

      el.focus()
      ev.preventDefault()
    },
    []
  )

  const _active = useMemo(
    () => (active && tree.map.get(active)) ?? null,
    [active, tree.map]
  )

  const _isFocusVisible = useMemo(
    () => !!_active && isFocusVisible,
    [_active, isFocusVisible]
  )

  return [_active, _isFocusVisible, moveFocus] as const
}
