let { requestIdleCallback } = globalThis
requestIdleCallback ??= (callback) => setTimeout(callback, 16.666)

export function waitUntil<T>(
  callback: () => T,
  signal?: AbortSignal | null | undefined
) {
  const retry = async (): Promise<NonNullable<Awaited<T>>> => {
    signal?.throwIfAborted()

    const value = await callback()

    if (value != null) {
      return value
    }

    return new Promise((resolve, reject) => {
      requestIdleCallback(() => {
        retry().then(resolve, reject)
      })
    })
  }

  return retry()
}
