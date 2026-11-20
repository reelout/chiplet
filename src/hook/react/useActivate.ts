'use client'
import { isEnterKey, isSpaceKey } from '#util'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type Activate = (
  ev: KeyboardEvent | React.KeyboardEvent,
  el?: Element | null | undefined
) => void

interface Reset {
  (): void
}

export type ActivateCallback = (
  ev: KeyboardEvent | React.KeyboardEvent,
  target: HTMLElement | SVGElement
) => void

export function useActivate(onActivate?: ActivateCallback) {
  const [isActivated, setIsActivated] = useState(false)

  const ref = useRef({ isActivated, onActivate })

  // Keep the ref in sync so 'activate' always invokes the latest
  // 'onActivate', not the one captured when 'activate' was memoized.
  useLayoutEffect(() => {
    ref.current.onActivate = onActivate
  })

  useLayoutEffect(() => {
    const handleBlur = (ev: FocusEvent) => {
      setIsActivated((ref.current.isActivated = false))
    }

    // The 'keyup' may not fire on this element, so watch for it on the
    // document.
    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ref.current.isActivated && isSpaceKey(ev)) {
        setIsActivated((ref.current.isActivated = false))
      }
    }

    document.addEventListener('focusout', handleBlur, true)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('focusout', handleBlur, true)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const activate = useCallback<Activate>((ev, el) => {
    function perform() {
      const target = el === undefined ? ev.currentTarget : el

      if (target instanceof HTMLElement) {
        ref.current.onActivate?.(ev, target)

        if (!ev.defaultPrevented) {
          target.click()
          ev.preventDefault()
        }
      }

      if (target instanceof SVGElement) {
        ref.current.onActivate?.(ev, target)

        if (!ev.defaultPrevented) {
          /* istanbul ignore next */
          const init: MouseEventInit = ev instanceof Event ? ev : ev.nativeEvent
          target.dispatchEvent(new MouseEvent('click', init))
          ev.preventDefault()
        }
      }
    }

    switch (ev.type) {
      case 'keydown': {
        if (isSpaceKey(ev)) {
          setIsActivated((ref.current.isActivated = true))
          ev.preventDefault()
        }

        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets#dont_rely_on_consistent_behavior_for_key_repeat_at_this_point
        if (isEnterKey(ev)) {
          perform()
        }

        break
      }

      case 'keyup': {
        if (ref.current.isActivated && isSpaceKey(ev)) {
          setIsActivated((ref.current.isActivated = false))
          perform()
        }

        break
      }
    }
  }, [])

  const reset = useCallback<Reset>(() => {
    setIsActivated((ref.current.isActivated = false))
  }, [])

  return [isActivated, activate, reset] as const
}
