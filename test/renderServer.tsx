import { createRef, type ReactNode } from 'react'
import { renderToString } from 'react-dom/server'

export function renderServer(element: ReactNode) {
  const result = createRef<string>()

  result.current = renderToString(element)

  return { result }
}
