import { isObject } from '#util'
import type { RefObject } from 'react'

export type RefValue<T> = RefObject<T | null> | T | null

function isRefObject<T>(ref: RefValue<T>): ref is RefObject<T | null> {
  return isObject(ref) && Object.hasOwn(ref, 'current')
}

export function refValue<T>(ref: RefValue<T>) {
  return isRefObject(ref) ? ref.current : ref
}
