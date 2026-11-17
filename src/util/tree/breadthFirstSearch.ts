export function* breadthFirstSearch<T>(
  root: T | null | undefined,
  getChildren: (node: T) => Iterable<T> | null | undefined
) {
  const queue = [root]
  let node: T | null | undefined
  while ((node = queue.shift())) {
    yield node
    const children = getChildren(node)
    if (children) queue.push(...children)
  }
}
