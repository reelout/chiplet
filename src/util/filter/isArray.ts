export function isArray(arr: unknown): arr is readonly unknown[] {
  return Array.isArray(arr)
}
