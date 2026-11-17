export function isNil(object: unknown): object is null | undefined {
  return object == null
}
