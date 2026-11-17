'use client'
import { escapeRegExp } from 'lodash-es'
import { useDeferredValue, useMemo } from 'react'

export function useRegExp(pattern: string | RegExp, flags?: string): RegExp

export function useRegExp(
  pattern: string | RegExp | undefined,
  flags?: string
): RegExp | undefined

export function useRegExp(
  _pattern: string | RegExp | undefined,
  flags?: string
) {
  const pattern = useDeferredValue(_pattern)

  return useMemo(() => {
    if (pattern == null) {
      return undefined
    }

    return new RegExp(
      typeof pattern === 'string' ? escapeRegExp(pattern) : pattern,
      flags
    )
  }, [flags, pattern])
}
