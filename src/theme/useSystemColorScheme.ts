import { useConst } from '#hook'
import { useRef, useSyncExternalStore } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

export function useSystemColorScheme() {
  // Reuse one lazily created MediaQueryList per hook instance for both
  // subscribing and snapshot reads; 'getSnapshot' runs on every render, so
  // it must not allocate a fresh query each time.
  const queryRef = useRef<MediaQueryList | null>(null)

  const subscribe = useConst(() => (onStoreChange: () => void) => {
    const query = (queryRef.current ??= window.matchMedia(QUERY))

    query.addEventListener('change', onStoreChange)

    return () => {
      query.removeEventListener('change', onStoreChange)
    }
  })

  return useSyncExternalStore(
    subscribe,
    () => (queryRef.current ??= window.matchMedia(QUERY)).matches,
    // Server rendering assumes the default 'light' preference so hydration
    // matches; the client re-renders with the actual value after hydration.
    () => false
  )
    ? 'dark'
    : 'light'
}
