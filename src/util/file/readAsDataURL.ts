import { AbortError } from '../document'

/**
 * https://w3c.github.io/FileAPI/#event-summary
 */
export function readAsDataURL(blob: Blob, signal?: AbortSignal | undefined) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    const onAbort = () => reader.abort()

    const cleanup = () => signal?.removeEventListener('abort', onAbort)

    reader.onabort = () => {
      cleanup()
      reject(AbortError())
    }

    reader.onerror = () => {
      cleanup()
      reject(reader.error)
    }

    reader.onload = () => {
      cleanup()
      resolve(reader.result as string)
    }

    signal?.addEventListener('abort', onAbort, { once: true })

    reader.readAsDataURL(blob)

    if (signal?.aborted) reader.abort()
  })
}
