export function toggle<T>(array: readonly T[], value: T): T[] {
  return array.includes(value)
    ? array.filter((item) => item !== value)
    : array.concat(value)
}
