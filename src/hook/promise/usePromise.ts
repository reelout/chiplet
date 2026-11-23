import { useEffect, useState } from 'react'

export function usePromise<T>(
  promise: Promise<T>,
  initialValue: T,
  signal?: AbortSignal | undefined
): T

export function usePromise<T>(
  promise: Promise<T>,
  initialValue?: undefined,
  signal?: AbortSignal | undefined
): T | undefined

export function usePromise<T>(
  promise: Promise<T>,
  initialValue?: T | undefined,
  signal?: AbortSignal | undefined
) {
  // The compiler silently miscompiles swapped AbortSignals, which the lint
  // rule cannot see.
  // eslint-disable-next-line react-compiler/react-compiler
  'use no memo'
  const [value, setValue] = useState(() => initialValue)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    if (signal?.aborted) {
      return
    }

    let destroyed = false

    promise
      .then((value) => {
        if (!destroyed && !signal?.aborted) {
          setValue(() => value)
          setError(() => undefined)
        }
      })
      .catch((error) => {
        if (!destroyed && !signal?.aborted) {
          setError(() => error)
        }
      })

    return () => {
      destroyed = true
    }
    // Depend on the signal instance, not its 'aborted' state, so the effect
    // re-runs and the callbacks close over the latest signal when it is
    // swapped between renders.
  }, [promise, signal])

  useEffect(() => {
    if (error) {
      throw error
    }
  })

  return value
}
