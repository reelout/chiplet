export function isPromise<T, U>(
  promise: PromiseLike<T> | U
): promise is PromiseLike<T> {
  return (
    promise !== null &&
    typeof promise === 'object' &&
    typeof (promise as PromiseLike<T>).then === 'function'
  )
}
