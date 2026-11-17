type Class = string | false | 0 | 0n | null | undefined | readonly Class[]

export function toClass(...arr: readonly Class[]) {
  arr = arr.flatMap(function flatten(str): Class[] {
    if (typeof str === 'string') {
      return str.split(/\s+/)
    }

    if (Array.isArray(str)) {
      return str.flatMap(flatten)
    }

    return []
  })

  arr = arr.filter((str, index, self) => !!str && self.indexOf(str) === index)

  return arr.join(' ') || undefined
}
