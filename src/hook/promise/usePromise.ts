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
  // The compiler intentionally narrows an effect's memo key to the property
  // values it reads, so recreating equal-valued objects each render keeps
  // the cache stable. This hook needs identity semantics instead: when the
  // signal is swapped for another un-aborted signal, the effect callback
  // must be re-derived or the new 'abort()' stays unobserved. Opting out is
  // deliberate — the lint rule reports opt-outs it cannot prove necessary.
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
