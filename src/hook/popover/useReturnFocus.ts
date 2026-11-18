'use client'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Overlay } from './useOverlay'

export function useReturnFocus(overlay: Overlay) {
  const ref = useRef({
    source: null as Element | null,
    positioned: overlay.positioned,
  })

  useLayoutEffect(() => {
    ref.current.positioned = overlay.positioned
  })

  useLayoutEffect(() => {
    if (overlay.open) {
      return
    }

    const onFocus = (ev: FocusEvent) => {
      ref.current.source = ev.target as Element | null
    }

    document.addEventListener('focusin', onFocus, true)

    return () => {
      document.removeEventListener('focusin', onFocus, true)
    }
  }, [overlay.open])

  // See the file "useReturnFocus.test.tsx" for more information,
  // the "useLayoutEffect" hook does not work here.
  useEffect(() => {
    const anchor = ref.current.source
    const { positioned } = ref.current

    if (!overlay.open || positioned == null) {
      return
    }

    let shouldReturnFocus = positioned.contains(document.activeElement)

    const onFocus = (ev: FocusEvent) => {
      shouldReturnFocus = true
    }

    const onBlur = (ev: FocusEvent) => {
      // Ignore blur event when active element is removed from DOM in chromium browser
      if (ev.relatedTarget !== null) {
        shouldReturnFocus = false
      }
    }

    positioned.addEventListener('focusin', onFocus, true)
    positioned.addEventListener('focusout', onBlur, true)

    return () => {
      positioned.removeEventListener('focusin', onFocus, true)
      positioned.removeEventListener('focusout', onBlur, true)

      if (
        shouldReturnFocus &&
        anchor !== document.body &&
        anchor !== document.activeElement &&
        (anchor instanceof HTMLElement || anchor instanceof SVGElement) &&
        anchor.isConnected
      ) {
        anchor.focus({ preventScroll: true })
      }
    }
  }, [overlay.open])

  // The focused element is tracked by the document-level 'focusin' listener
  // above rather than by React state, so the latest value can only be read
  // from the ref. Returning it during render is intentional: consumers use
  // it to know where focus will return.
  // eslint-disable-next-line react-hooks/refs
  return ref.current.source
}
