'use client'
import 'symbol-observable'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
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
  const initialValueRef = useRef(initialValue)

  // Track the latest 'initialValue' in a ref so the subscribe callback below
  // depends only on 'observable'; a new initial value identity must not
  // resubscribe and reset the emitted value.
  useEffect(() => {
    initialValueRef.current = initialValue
  })

  return useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        // A new 'observable' must not keep reporting the previous source's
        // last emission; fall back to the latest 'initialValue' until it
        // emits.
        valueRef.current = initialValueRef.current

        const subscription = from(observable).subscribe((value) => {
          valueRef.current = value
          onStoreChange()
        })

        return () => subscription.unsubscribe()
      },
      [observable]
    ),
    () => valueRef.current,
    () => valueRef.current
  )
}
