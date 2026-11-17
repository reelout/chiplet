/**
 * Merge sort
 * @see https://tbranyen.com/post/increasing-javascript-array-sorting-performance
 */
export function mergeSort<T>(
  array: readonly T[],
  compare: (a: T, b: T) => number
): T[] {
  if (array.length <= 1) return array.slice()
  const middle = Math.floor(array.length / 2)
  const left = array.slice(0, middle)
  const right = array.slice(middle)
  return merge(mergeSort(left, compare), mergeSort(right, compare), compare)
}

function merge<T>(
  left: readonly T[],
  right: readonly T[],
  compare: (a: T, b: T) => number
): T[] {
  const result: T[] = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    const a = left[i]!
    const b = right[j]!
    if (compare(a, b) <= 0) {
      result.push(a)
      i++
    } else {
      result.push(b)
      j++
    }
  }
  return result.concat(left.slice(i), right.slice(j))
}
