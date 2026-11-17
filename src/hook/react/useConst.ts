import { useMemo } from 'react'

export function useConst<T>(initialize: () => T): T {
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  return useMemo(initialize, [])
}
