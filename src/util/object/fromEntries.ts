export function fromEntries<
  T extends Iterable<readonly [PropertyKey, unknown]> | null | undefined,
>(entries: T) {
  if (entries == null) {
    return {} as never
  }

  return Object.fromEntries(entries) as {
    [E in T extends Iterable<infer E> ? E : never as E[0]]: E[1]
  }
}
