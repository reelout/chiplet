export function* depthFirstSearch<T>(
  root: T | null | undefined,
  getChildren: (node: T) => Iterable<T> | null | undefined
) {
  const stack = [root]
  let node: T | null | undefined
  while ((node = stack.pop())) {
    yield node
    const children = getChildren(node)
    if (children) stack.push(...Array.from(children).reverse())
  }
}
