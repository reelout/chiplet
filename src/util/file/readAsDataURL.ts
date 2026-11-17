import { AbortError } from '../document'

/**
 * https://w3c.github.io/FileAPI/#event-summary
 */
export function readAsDataURL(blob: Blob, signal?: AbortSignal | undefined) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onabort = () => reject(AbortError())

    reader.onerror = () => reject(reader.error)

    reader.onload = () => resolve(reader.result as string)

    signal?.addEventListener('abort', () => reader.abort(), { once: true })

    reader.readAsDataURL(blob)

    if (signal?.aborted) reader.abort()
  })
}
