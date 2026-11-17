let { requestIdleCallback } = globalThis
requestIdleCallback ??= (callback) => setTimeout(callback, 16.666)

export function waitFor<T>(
  callback: () => T,
  signal?: AbortSignal | null | undefined
) {
  const retry = async (): Promise<T> => {
    signal?.throwIfAborted()

    try {
      return await callback()
    } catch {}

    return new Promise((resolve, reject) => {
      requestIdleCallback(() => {
        retry().then(resolve, reject)
      })
    })
  }

  return retry()
}
