'use client'
import { use, useCallback, useLayoutEffect, useRef } from 'react'
import { OverlayContext } from './context'

interface Props {
  disabled?: boolean | undefined
  onClick?: React.MouseEventHandler<Element> | undefined
}

export function useClose<P extends Props>(
  props: P,
  disabled?: boolean | undefined
) {
  const overlay = use(OverlayContext)

  const ref = useRef(overlay)

  useLayoutEffect(() => {
    ref.current = overlay
  })

  disabled ||= props.disabled

  const { onClick } = props

  props = {
    ...props,
    onClick: useCallback<NonNullable<typeof onClick>>(
      (ev) => {
        onClick?.(ev)

        if (!ev.defaultPrevented && !disabled) {
          ref.current?.toggle(ev, false, 'close')
        }
      },
      [disabled, onClick]
    ),
  }

  return props
}
