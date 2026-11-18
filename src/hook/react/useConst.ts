import { useState } from 'react'

export function useConst<T>(initialize: () => T): T {
  const [value] = useState(initialize)
  return value
}
