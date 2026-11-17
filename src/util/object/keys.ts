export type KeyOf<T> = (string | number) & keyof T

export function keys<T extends object>(object: T | null | undefined) {
  if (object == null) {
    return []
  }

  return Object.keys(object) as KeyOf<T>[]
}
