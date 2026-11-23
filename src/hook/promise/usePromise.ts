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
  const [value, setValue] = useState(() => initialValue)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    // Both the deps array and the compiler's memo key track the signal
    // instance, not its 'aborted' state: the deps re-run the effect with
    // fresh callbacks when the signal is swapped between renders, and
    // copying the signal to a local keeps the memo key identity-based —
    // reading 'signal?.aborted' directly would narrow the key to that
    // value, so a swapped-in, un-aborted signal would re-run the effect
    // with a stale callback closing over the old signal.
    const _signal = signal

    if (_signal?.aborted) {
      return
    }

    let destroyed = false

    promise
      .then((value) => {
        if (!destroyed && !_signal?.aborted) {
          setValue(() => value)
          setError(() => undefined)
        }
      })
      .catch((error) => {
        if (!destroyed && !_signal?.aborted) {
          setError(() => error)
        }
      })

    return () => {
      destroyed = true
    }
  }, [promise, signal])

  useEffect(() => {
    if (error) {
      throw error
    }
  })

  return value
}
