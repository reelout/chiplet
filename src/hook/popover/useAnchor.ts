import { useCallback, useLayoutEffect, useRef } from 'react'
import type { Overlay, OverlayAnchorProps } from './useOverlay'

export function useAnchor<P extends OverlayAnchorProps>(
  props: P,
  overlay: Overlay
) {
  const ref = useRef(overlay)

  useLayoutEffect(() => {
    ref.current = overlay
  })

  const { disabled, onClick } = props

  props = {
    ...props,
    onClick: useCallback<NonNullable<typeof onClick>>(
      (ev) => {
        onClick?.(ev)

        if (!ev.defaultPrevented && !disabled) {
          ref.current.toggle(ev, undefined, 'anchor')
        }
      },
      [disabled, onClick]
    ),
  }

  return props
}
