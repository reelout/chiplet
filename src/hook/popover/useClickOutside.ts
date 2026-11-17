'use client'
import { useLayoutEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(
  el: T | null,
  callback: (ev: MouseEvent, el: T) => void
) {
  const ref = useRef(callback)

  useLayoutEffect(() => {
    ref.current = callback
  })

  useLayoutEffect(() => {
    if (!el) return

    const onClick = (ev: MouseEvent) => {
      if (!el.contains(ev.target as Node)) {
        ref.current(ev, el)
      }
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [el])
}
