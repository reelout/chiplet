/**
 * Quick sort
 * @see https://www.geeksforgeeks.org/stable-quicksort/
 */
export function quickSort<T>(
  array: readonly T[],
  compare: (a: T, b: T) => number
): T[] {
  if (array.length <= 1) return array.slice()

  const pivot = array[array.length - 1]!
  const left: T[] = []
  const right: T[] = []

  for (let i = 0; i < array.length - 1; i++) {
    const item = array[i]!
    if (compare(item, pivot) <= 0) {
      left.push(item)
    } else {
      right.push(item)
    }
  }

  return quickSort(left, compare).concat(pivot, quickSort(right, compare))
}
