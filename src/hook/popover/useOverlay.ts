'use client'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useDefault } from '../form/useDefault'
import type { GlobalAttributes } from '../react/element.d'

export interface OverlayAnchorProps
  extends GlobalAttributes, React.AriaAttributes, React.RefAttributes<Element> {
  disabled?: boolean | undefined
  onFocus?: React.FocusEventHandler<Element> | undefined
  onBlur?: React.FocusEventHandler<Element> | undefined
  onClick?: React.MouseEventHandler<Element> | undefined
  onKeyDown?: React.KeyboardEventHandler<Element> | undefined
  onPointerEnter?: React.PointerEventHandler<Element> | undefined
  onPointerLeave?: React.PointerEventHandler<Element> | undefined
}

export type ToggleCallback<E = Event | React.SyntheticEvent> = {
  bivarianceHack(ev: E, open: boolean): void
}['bivarianceHack']

interface OverlayOptions<T extends HTMLElement> {
  anchorRef: React.RefObject<Element | null>
  positionedRef: React.RefObject<T | null>
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
}

export interface Overlay<T extends HTMLElement = HTMLElement> {
  anchor: Element | null
  positioned: T | null
  open: boolean
  toggle: (
    ev: Event | React.SyntheticEvent,
    open?: boolean,
    hint?: string
  ) => boolean
}

export function useOverlay<T extends HTMLElement>(options: OverlayOptions<T>) {
  const { anchorRef, positionedRef } = options

  const [open, setOpen] = useDefault({
    defaultValue: options.defaultOpen ?? false,
    value: options.open,
    onChange: options.onToggle,
  })

  const ref = useRef(open)

  useLayoutEffect(() => {
    ref.current = open
  })

  const toggle = useCallback<Overlay<T>['toggle']>(
    (ev, open, hint) => {
      open ??= !ref.current

      if (ref.current === open) {
        return false
      }

      setOpen(ev, open, hint)

      // A vetoed change (`onToggle` preventing the event) never commits in
      // `useDefault`, so the uncommitted mirror in `ref` must not advance.
      if (ev.defaultPrevented) {
        return false
      }

      ref.current = open

      return true
    },
    [setOpen]
  )

  return useMemo<Overlay<T>>(
    () => ({
      get anchor() {
        return anchorRef.current
      },
      get positioned() {
        return positionedRef.current
      },
      open,
      toggle,
    }),
    [anchorRef, open, positionedRef, toggle]
  )
}
