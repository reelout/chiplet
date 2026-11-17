'use client'
import { isEscapeKey } from '#util'
import { useCallback, useLayoutEffect, useRef } from 'react'
import type { Overlay, OverlayAnchorProps } from './useOverlay'

interface Layer {
  positioned: HTMLElement
  defaultAnchor: Element | null
  anchor: Element | null
}

const stack: Layer[] = []

export function useLightDismiss<
  A extends OverlayAnchorProps,
  P extends React.HTMLAttributes<HTMLElement> &
    React.RefAttributes<HTMLElement>,
>(
  anchorProps: A,
  positionedProps: P,
  overlay: Overlay,
  source: Element | null
) {
  const ref = useRef({ overlay, source, captured: false })

  useLayoutEffect(() => {
    ref.current.overlay = overlay
    ref.current.source = source
  })

  {
    const { onClickCapture } = positionedProps

    positionedProps = {
      ...positionedProps,
      onClickCapture: useCallback<NonNullable<typeof onClickCapture>>(
        (ev) => {
          onClickCapture?.(ev)
          ref.current.captured = true
        },
        [onClickCapture]
      ),
    }
  }

  useLayoutEffect(() => {
    const { anchor, positioned } = ref.current.overlay

    if (!overlay.open || positioned == null) {
      return
    }

    const layer: Layer = {
      positioned,
      defaultAnchor: anchor,
      anchor: ref.current.source,
    }

    const onClickCapture = () => {
      ref.current.captured = false
    }

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null

      // Click outside of dialog
      if (positioned === target && !isInside(ev)) {
        ref.current.overlay.toggle(ev)
        return
      }

      if (
        !ref.current.captured &&
        !anchor?.contains(target) && // Let the anchor handle the event
        !isNested(ref.current.overlay, target) // The anchor is nested inside another overlay
      ) {
        ref.current.overlay.toggle(ev)
      }
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (
        !ev.defaultPrevented &&
        stack.at(-1) === layer && // Only the topmost overlay
        isEscapeKey(ev)
      ) {
        ref.current.overlay.toggle(ev, false, 'escape')
        ev.preventDefault()
      }
    }

    document.addEventListener('click', onClickCapture, true)
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)

    stack.push(layer)

    return () => {
      document.removeEventListener('click', onClickCapture, true)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)

      stack.splice(stack.indexOf(layer), 1)
    }
  }, [overlay.open])

  return [anchorProps, positionedProps] as const
}

function isNested(overlay: Overlay, target: Node | null): boolean {
  if (target == null) {
    return false
  }

  if (overlay.positioned?.contains(target)) {
    return true
  }

  for (const { positioned, defaultAnchor, anchor } of stack) {
    if (positioned.contains(target)) {
      return isNested(overlay, anchor) || isNested(overlay, defaultAnchor)
    }
  }

  return false
}

function isInside(ev: MouseEvent | React.MouseEvent) {
  // The event target is the dialog itself when clicking on the backdrop
  if (!(ev.target instanceof HTMLDialogElement)) return true

  // Programmatic event, such as `element.click()`
  if (!ev.isTrusted) return true

  const { left, right, top, bottom } = ev.target.getBoundingClientRect()

  const { clientX: x, clientY: y } = ev

  /* istanbul ignore next */
  return x >= left && x <= right && y >= top && y <= bottom
}
