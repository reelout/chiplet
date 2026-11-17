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
  }, [promise, signal?.aborted])

  useEffect(() => {
    if (error) {
      throw error
    }
  })

  return value
}
