import { kebabCase, type RecursiveEntry } from '#util'
import type { Join, KebabCase, Simplify } from 'type-fest'

export function defineTheme<T extends object>(source: T) {
  function traverse(source: object, prefix = '') {
    const theme: Record<string, unknown> = {}
    const declaration: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(source)) {
      const variable = kebabCase(`${prefix && `${prefix}-`}${key}`)

      if (typeof value === 'object' && value !== null) {
        const nested = traverse(value, variable)

        theme[key] = nested[0]
        Object.assign(declaration, nested[1])
      } else {
        theme[key] = `var(--${variable})`
        declaration[`--${variable}`] = value
      }
    }

    return [theme, declaration] as const
  }

  const [theme, declaration] = traverse(source)

  Object.defineProperty(theme, '$declaration', { get: () => declaration })

  return theme as Simplify<Theme<T> & { readonly $declaration: Declaration<T> }>
}

type Theme<T extends object, P extends string = ''> = {
  [K in keyof T]: `${P}-${Exclude<K, symbol>}` extends infer P extends string
    ? T[K] extends Record<PropertyKey, unknown>
      ? Theme<T[K], P>
      : `var(--${KebabCase<P>})`
    : never
} & {}

type Declaration<T extends object> = {
  [E in RecursiveEntry<T> as `--${KebabCase<Join<E[0], '-'>>}`]: E[1]
} & {}
