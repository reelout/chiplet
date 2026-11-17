export type RecursiveEntry<T extends object> =
  Entry<T> extends infer E
    ? E extends [infer K, unknown]
      ? E[1] extends Record<PropertyKey, unknown>
        ? RecursiveEntry<E[1]> extends infer E
          ? E extends [readonly unknown[], unknown]
            ? [[K, ...E[0]], E[1]]
            : never
          : never
        : [[K], E[1]]
      : never
    : never

export type Entry<T> = {
  [K in keyof T]-?: [(string | number) & K, T[K]]
}[keyof T]

export function entries<T extends object>(object: T | null | undefined) {
  if (object == null) {
    return []
  }

  return Object.entries(object) as (Entry<T> & {})[]
}
