/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException#notfounderror
 */
export function NotFoundError(message?: string, options?: ErrorOptions) {
  const err = new DOMException(message, 'NotFoundError')
  err.cause = options?.cause
  return err
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException#notsupportederror
 */
export function NotSupportedError(message?: string, options?: ErrorOptions) {
  const err = new DOMException(message, 'NotSupportedError')
  err.cause = options?.cause
  return err
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException#networkerror
 */
export function NetworkError(message?: string, options?: ErrorOptions) {
  const err = new DOMException(message, 'NetworkError')
  err.cause = options?.cause
  return err
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException#aborterror
 */
export function AbortError(message = 'Aborted', options?: ErrorOptions) {
  const err = new DOMException(message, 'AbortError')
  err.cause = options?.cause
  return err
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException#timeouterror
 */
export function TimeoutError(message?: string, options?: ErrorOptions) {
  const err = new DOMException(message, 'TimeoutError')
  err.cause = options?.cause
  return err
}
