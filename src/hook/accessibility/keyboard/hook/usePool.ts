import { useCallback, useState } from 'react'
import type { Tree } from '../tree'

export interface Pool extends ReadonlyMap<Element, Tree.NodeContext> {}

export interface PoolAdd {
  (key: Element, value: Tree.NodeContext): void
}

export interface PoolRemove {
  (key: Element): void
}

export function usePool() {
  const [pool, setPool] = useState<Pool>(() => new Map())

  const add = useCallback<PoolAdd>((key, value) => {
    setPool((prev) => {
      const next = new Map(prev)
      next.set(key, value)
      return next
    })
  }, [])

  const remove = useCallback<PoolRemove>((key) => {
    setPool((prev) => {
      const next = new Map(prev)
      next.delete(key)
      return next
    })
  }, [])

  return [pool, add, remove] as const
}
