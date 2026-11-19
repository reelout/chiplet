import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(QUERY)

  query.addEventListener('change', onStoreChange)

  return () => {
    query.removeEventListener('change', onStoreChange)
  }
}

export function useSystemColorScheme() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    // Server rendering assumes the default 'light' preference so hydration
    // matches; the client re-renders with the actual value after hydration.
    () => false
  )
    ? 'dark'
    : 'light'
}
