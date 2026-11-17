export function negate<T, U extends T>(
  predicate: (value: T) => value is U
): (value: T) => value is Exclude<T, U>

export function negate<T>(
  predicate: (value: T) => unknown
): (value: T) => boolean

export function negate<T>(predicate: (value: T) => unknown) {
  return (value: T) => !predicate(value)
}
