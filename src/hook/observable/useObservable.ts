'use client'
import 'symbol-observable'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import type { ObservableInput } from 'rxjs'
import { from } from 'rxjs'

export function useObservable<T>(
  observable: ObservableInput<T>,
  initialValue: T
): T

export function useObservable<T>(
  observable: ObservableInput<T>,
  initialValue?: undefined
): T | undefined

export function useObservable<T>(
  observable: ObservableInput<T>,
  initialValue?: T | undefined
) {
  const valueRef = useRef(initialValue)

  return useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        // A new 'observable' must not keep reporting the previous source's
        // last emission; fall back to 'initialValue' until it emits.
        valueRef.current = initialValue

        const subscription = from(observable).subscribe((value) => {
          valueRef.current = value
          onStoreChange()
        })

        return () => subscription.unsubscribe()
      },
      [initialValue, observable]
    ),
    () => valueRef.current,
    () => valueRef.current
  )
}
