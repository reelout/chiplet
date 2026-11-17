import type { RefObject } from 'react'
import { useMemo, type Ref } from 'react'

export function useRefObject<T>(ref: Ref<T> | undefined) {
  return useMemo<RefObject<T | null>>(() => {
    let current: T | null = null
    let destroy: (() => void) | void

    return {
      get current() {
        return current
      },
      set current(value) {
        current = value

        if (current !== null) {
          if (typeof ref === 'function') {
            destroy = ref(current)
          } else if (ref) {
            ref.current = current
          }
        } else {
          if (typeof destroy === 'function') {
            destroy()
          } else if (typeof ref === 'function') {
            ref(null)
          } else if (ref) {
            ref.current = null
          }
        }
      },
    }
  }, [ref])
}
