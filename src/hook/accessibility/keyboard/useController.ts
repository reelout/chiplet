'use client'
import {
  isArrowDownKey,
  isArrowLeftKey,
  isArrowRightKey,
  isArrowUpKey,
} from '#util'
import { getAlignment, getOppositePlacement, getSide } from '@floating-ui/utils'
import { useCallback, useLayoutEffect, useRef } from 'react'
import type { Overlay } from '../../popover/useOverlay'
import { positionMap, type Position } from '../../popover/style/positioning.css'
import type { Keyboard, NavigationDirection } from './Keyboard'

interface Props extends React.AriaAttributes {
  disabled?: boolean | undefined
  onKeyDown?: React.KeyboardEventHandler<Element> | undefined
  onKeyUp?: React.KeyboardEventHandler<Element> | undefined
}

export function useController<P extends Props>(
  props: P,
  position: Position,
  overlay: Overlay,
  keyboard: Keyboard | null
) {
  const ref = useRef({
    overlay,
    keyboard,
    event: null as KeyboardEvent | null,
  })

  useLayoutEffect(() => {
    ref.current.overlay = overlay
    ref.current.keyboard = keyboard

    if (keyboard && ref.current.event) {
      const ev = ref.current.event
      const key = transform(ev.key, keyboard.direction)

      if (key !== ev.key) {
        ref.current.event = createEvent(ev, key)
      }

      keyboard.navigate(ref.current.event)
      ref.current.event = null
    }
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

  const { disabled, onKeyDown, onKeyUp } = props

  props = {
    ...props,
    'aria-activedescendant': keyboard?.active?.value.id || undefined,
    onKeyDown: useCallback<NonNullable<typeof onKeyDown>>(
      (ev) => {
        onKeyDown?.(ev)

        if (ev.defaultPrevented || disabled) {
          return
        }

        const { overlay, keyboard } = ref.current

        if (keyboard?.active) {
          keyboard.navigate(ev)

          if (!ev.defaultPrevented) {
            keyboard.activate(ev)
          }
        } else {
          const placement = positionMap[position]
          let side = getSide(placement)
          let key: string | undefined

          if (side === 'top' || side === 'bottom') {
            if (isArrowUpKey(ev)) {
              key = 'ArrowUp'
            } else if (isArrowDownKey(ev)) {
              key = 'ArrowDown'
            }
          } else {
            const isRTL = getComputedStyle(ev.currentTarget).direction === 'rtl'
            side = isRTL ? getOppositePlacement(side) : side

            if (
              (side === 'left' && isArrowLeftKey(ev)) ||
              (side === 'right' && isArrowRightKey(ev))
            ) {
              const alignment = getAlignment(placement)
              key = alignment === 'end' ? 'ArrowLeft' : 'ArrowRight'
            }
          }

          if (!key) {
            return
          }

          if (!overlay.open) {
            overlay.toggle(ev)

            if (ev.defaultPrevented) {
              return
            }
          }

          if (keyboard) {
            key = transform(key, keyboard.direction)
          }

          ref.current.event = createEvent(ev, key)

          if (keyboard) {
            const { event } = ref.current
            ref.current.event = null

            keyboard.navigate(event)

            if (event.defaultPrevented) {
              ev.preventDefault()
            }
          } else {
            ev.preventDefault()
          }
        }
      },
      [disabled, onKeyDown, position]
    ),
    onKeyUp: useCallback<NonNullable<typeof onKeyUp>>(
      (ev) => {
        onKeyUp?.(ev)

        if (!ev.defaultPrevented && !disabled) {
          ref.current.keyboard?.activate(ev)
        }
      },
      [disabled, onKeyUp]
    ),
  }

  return props
}

function transform(key: string, direction: NavigationDirection) {
  switch (true) {
    case key === 'ArrowUp' && direction === 'inline':
      key = 'ArrowLeft'
      break
    case key === 'ArrowDown' && direction === 'inline':
      key = 'ArrowRight'
      break
    case key === 'ArrowLeft' && direction !== 'inline':
      key = 'ArrowUp'
      break
    case key === 'ArrowRight' && direction !== 'inline':
      key = 'ArrowDown'
      break
  }

  return key
}

function createEvent(ev: KeyboardEvent | React.KeyboardEvent, key: string) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: false,
    cancelable: true,
    composed: false,
    altKey: ev.altKey,
    ctrlKey: ev.ctrlKey,
    metaKey: ev.metaKey,
    shiftKey: ev.shiftKey,
  })

  Object.defineProperty(event, 'target', {
    configurable: true,
    value: ev.target,
  })

  Object.defineProperty(event, 'currentTarget', {
    configurable: true,
    value: ev.currentTarget,
  })

  return event
}
