'use client'
import { useCallback, useState, type Ref } from 'react'

export function useRefCallback<T>(ref: Ref<T> | undefined) {
  const [_ref, _setRef] = useState<T | null>(null)

  const setRef = useCallback(
    (current: T) => {
      _setRef(current)

      let destroy: (() => void) | void

      if (typeof ref === 'function') {
        destroy = ref(current)
      } else if (ref) {
        // eslint-disable-next-line react-hooks/immutability, react-compiler/react-compiler
        ref.current = current
      }

      return () => {
        _setRef(null)

        if (typeof destroy === 'function') {
          destroy()
        } else if (typeof ref === 'function') {
          ref(null)
        } else if (ref) {
          ref.current = null
        }
      }
    },
    [ref]
  )

  return [_ref, setRef] as const
}
