import { useEffect, useState } from 'react'

export function useSystemColorScheme() {
  const [query] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null
  )

  const [isDarkMode, setIsDarkMode] = useState(query?.matches)

  useEffect(() => {
    if (!query) {
      return
    }

    const onChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    query.addEventListener('change', onChange)

    return () => {
      query.removeEventListener('change', onChange)
    }
  }, [query])

  return isDarkMode ? 'dark' : 'light'
}
